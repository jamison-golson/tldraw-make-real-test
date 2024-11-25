import { Editor, createShapeId, getSvgAsImage, track } from 'tldraw'
import { getSelectionAsText } from './getSelectionAsText'
import { getHtmlFromModel } from './getHtmlFromModel'
import { blobToBase64 } from './blobToBase64'
import { addGridToSvg } from './addGridToSvg'
import { PreviewShape } from '../PreviewShape/PreviewShape'

// Function to automatically download the svg passed to the LLM (Grid lines included)
  function saveSvgToFile(svgElement: SVGSVGElement): void {
	const serializer = new XMLSerializer();
	const svgString = serializer.serializeToString(svgElement);
	const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
	const fileName = `tldraw_${timestamp}.svg`;
	
	try {
	  const blob = new Blob([svgString], { type: 'image/svg+xml' });
	  const url = URL.createObjectURL(blob);
	  const link = document.createElement('a');
	  link.href = url;
	  link.download = fileName;
	  link.click();
	  URL.revokeObjectURL(url);
	  console.log('SVG saved successfully');
	} catch (err) {
	  console.error('Error saving SVG to file:', err);
	}
  }

export async function makeReal(editor: Editor, apiKey: string) {
	// Get the selected shapes (we need at least one)
	const selectedShapes = editor.getSelectedShapes()

	if (selectedShapes.length === 0) throw Error('First select something to make real.')

	// Create the preview shape
	const { maxX, midY } = editor.getSelectionPageBounds()!
	const newShapeId = createShapeId()
	editor.createShape<PreviewShape>({
		id: newShapeId,
		type: 'response',
		x: maxX + 60, // to the right of the selection
		y: midY - (540 * 2) / 3 / 2, // half the height of the preview's initial shape
		props: { html: '' },
	})

	// Get an SVG based on the selected shapes
	const svg = await editor.getSvgElement(selectedShapes, {
		scale: 1,
		background: true,
	})

	if (!svg) {
		return
	}

	// Add the grid lines to the SVG
	const grid = { color: 'red', size: 100, labels: true }
	addGridToSvg(svg.svg, grid)

	// Save the SVG to local machine
	// saveSvgToFile(svg.svg);

	if (!svg) throw Error(`Could not get the SVG.`)

	// Turn the SVG into a DataUrl
	// const IS_SAFARI = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)

	
	function svgElementToString(svgElement: SVGSVGElement): string {
		const serializer = new XMLSerializer();
		return serializer.serializeToString(svgElement);
	}

	const svgString = svgElementToString(svg.svg);

	const blob = await getSvgAsImage(editor, svgString, {
		quality: 0.8,
		scale: 1,
		type: 'png',
		height: svg.height,
		width: svg.width,
	})
	const dataUrl = await blobToBase64(blob!)
	// downloadDataURLAsFile(dataUrl, 'tldraw.png')

	// Get any previous previews among the selected shapes
	const previousPreviews = selectedShapes.filter((shape) => {
		return shape.type === 'response'
	}) as PreviewShape[]

	// Send everything to VLLM and get some HTML back
	try {
		const json = await getHtmlFromModel({
			image: dataUrl,
			apiKey,
			text: getSelectionAsText(editor),
			previousPreviews,
			grid,
			theme: editor.user.getUserPreferences().isDarkMode ? 'dark' : 'light',
			provider: localStorage.getItem('makeitreal_provider') as 'OpenAI' | 'Anthropic' || 'OpenAI', // Default to 'OpenAI' if null
			model: localStorage.getItem('makeitreal_model') || undefined, // Use undefined if null
		})
		

		if (!json) {
			throw Error('Could not contact OpenAI.')
		}

		if (json?.error) {
			throw Error(`${json.error.message?.slice(0, 128)}...`)
		}

		// Extract the HTML from the response
		const message = localStorage.getItem('makeitreal_provider') == 'OpenAI' ? json.choices[0].message.content : json["content"]
		const start = message.indexOf('<!DOCTYPE html>')
		const end = message.indexOf('</html>')
		const html = message.slice(start, end + '</html>'.length)

		// No HTML? Something went wrong
		if (html.length < 100) {
			console.warn(message)
			throw Error('Could not generate a design from those wireframes.')
		}

		// Update the shape with the new props
		editor.updateShape<PreviewShape>({
			id: newShapeId,
			type: 'response',
			props: {
				html,
			},
		})

		console.log(`Response: ${message}`)
	} catch (e) {
		// If anything went wrong, delete the shape.
		editor.deleteShape(newShapeId)
		throw e
	}
}
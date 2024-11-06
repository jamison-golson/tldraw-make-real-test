import { useEditor, useToasts, TldrawUiButton, TldrawUiButtonLabel } from 'tldraw'
import { useCallback } from 'react'
import { makeReal } from '../lib/makeReal'

export function MakeRealButton() {
	const editor = useEditor()
	const { addToast } = useToasts()

	const handleClick = useCallback(async () => {
		try {
			// const input = document.getElementById('openai_key_risky_but_cool') as HTMLInputElement
			const apiKey = localStorage.getItem('makeitreal_key') ?? process.env.OPENAI_API_KEY ?? null
			if (!apiKey) throw Error('Make sure the input includes your API Key!')
			await makeReal(editor, apiKey)
		} catch (e) {
			console.error(e)
			addToast({
				icon: 'cross-2',
				title: 'Something went wrong',
				description: (e as Error).message.slice(0, 100),
			})
		}
	}, [editor, addToast])

	return (
		<TldrawUiButton type="normal" onClick={handleClick} style={{display:'flex'}}>
			<TldrawUiButtonLabel> Make Real</TldrawUiButtonLabel>
		</TldrawUiButton>
	)
}

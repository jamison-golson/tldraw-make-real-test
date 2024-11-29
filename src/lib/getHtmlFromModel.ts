import { PreviewShape } from '../PreviewShape/PreviewShape'
import {
	OPENAI_USER_PROMPT,
	OPENAI_USER_PROMPT_WITH_PREVIOUS_DESIGN,
	OPEN_AI_SYSTEM_PROMPT,
} from '../prompt'

// Unified function to send requests to either OpenAI, Anthropic, or Google
export async function getHtmlFromModel({
	image,
	apiKey,
	text,
	grid,
	theme = 'light',
	previousPreviews = [],
	provider = 'OpenAI',
	model = 'gpt-4o-mini' // Default to an OpenAI model; replace as needed for Anthropic
}: {
	image: string
	apiKey: string
	text: string
	theme?: string
	grid?: {
		color: string
		size: number
		labels: boolean
	}
	previousPreviews?: PreviewShape[]
	provider?: 'OpenAI' | 'Anthropic' | 'Gemini'
	model?: string
}) {
	if (!apiKey) throw Error('You need to provide an API key (sorry)')
	console.log('Hello')
	
	type MessageType =
	| { role: 'system' | 'user' | 'assistant'; content: MessageContent }
	| { role: 'model' | 'user'; parts: MessageContent }
	| { system_instruction: { parts: { text: string } } };
	
	// Prepare messages array
	const messages: MessageType[] =
		provider === 'OpenAI'
			? [
				{
					role: 'system',
					content: OPEN_AI_SYSTEM_PROMPT,
				},
				{
					role: 'user',
					content: previousPreviews?.length > 0 ? OPENAI_USER_PROMPT_WITH_PREVIOUS_DESIGN : OPENAI_USER_PROMPT,
				},
			]
			: provider === 'Anthropic'
				? [
					{
						role: 'user',
						content: previousPreviews?.length > 0 ? OPENAI_USER_PROMPT_WITH_PREVIOUS_DESIGN : OPENAI_USER_PROMPT,
					}
				]
				: [ // Gemini
					{
						system_instruction: {
							parts: {
								text: String(OPEN_AI_SYSTEM_PROMPT) // Convert to string explicitly
							}
						},
					},
					{
						role: 'user',
						content: previousPreviews?.length > 0 ? OPENAI_USER_PROMPT_WITH_PREVIOUS_DESIGN : OPENAI_USER_PROMPT,
					}
				];

	// Add structured content for LLMs
	const userContent: ContentItem[] = [];

	// Add prompt text
	if (provider === 'Gemini'){
		userContent.push({
			text: previousPreviews?.length > 0 ? OPENAI_USER_PROMPT_WITH_PREVIOUS_DESIGN : OPENAI_USER_PROMPT,
		})
	}else{
		userContent.push({
			type: 'text',
			text: previousPreviews?.length > 0 ? OPENAI_USER_PROMPT_WITH_PREVIOUS_DESIGN : OPENAI_USER_PROMPT,
		})
	}

	// Add the image as a URL
	// Add the image with correct format based on provider
	if (provider === 'OpenAI') {
		userContent.push({
			type: 'image_url',
			image_url: { url: image, detail: 'high' },
		});
	} else if (provider === 'Anthropic') {
		// For Anthropic
		userContent.push({
			type: 'image',
			source: {
				type: 'base64',
				media_type: 'image/png',
				data: image.split(',')[1], //Removes the data:image/png;base64, prefix
			},
		} as const);
	} else if (provider === 'Gemini') {
		// For Gemini
		const mimeType = image.split(';')[0].split(':')[1];
		userContent.push({
			fileData: {
				fileUri: image,
				mimeType: mimeType
			}
		} as const);
	}

	// Add additional structured text based on `text` input
	if (text) {
		if (provider === 'Gemini') {
			userContent.push({
				text: `Here's a list of text that we found in the design:\n${text}`,
			})
		} else {
			userContent.push({
				type: 'text',
				text: `Here's a list of text that we found in the design:\n${text}`,
			})
		}
	}

	// Add grid description if available
	if (grid) {
		if (provider === 'Gemini') {
			userContent.push({
				text: `The designs have a ${grid.color} grid overlaid on top. Each cell of the grid is ${grid.size}x${grid.size}px.`,
			})
		} else {
			userContent.push({
				type: 'text',
				text: `The designs have a ${grid.color} grid overlaid on top. Each cell of the grid is ${grid.size}x${grid.size}px.`,
			})
		}
	}

	// Add the previous previews as HTML
	for (let i = 0; i < previousPreviews.length; i++) {
		const preview = previousPreviews[i]
		if (provider === 'Gemini') {
			userContent.push(
				{ text: `The designs also included one of your previous results. Here's the image that you used as its source:` },
				{ text: `And here's the HTML you came up with for it: ${preview.props.html}` },
			)
		} else {
			userContent.push(
				{ type: 'text', text: `The designs also included one of your previous results. Here's the image that you used as its source:` },
				{ type: 'text', text: `And here's the HTML you came up with for it: ${preview.props.html}` },
			)
		}
	}

	// Add theme prompt
	if (provider === 'Gemini') {
		userContent.push({
			text: `Please make your result use the ${theme} theme.`,
		})
	} else {
		userContent.push({
			type: 'text',
			text: `Please make your result use the ${theme} theme.`,
		})
	}

	// Update the content of the user message
	// For OpenAI
if (provider === 'OpenAI') {
	messages[1] = {
	  role: 'user',
	  content: userContent as MessageContent,
	} as MessageType;
  } 
  // For Anthropic
  else if (provider === 'Anthropic') {
	messages[0] = {
	  role: 'user',
	  content: userContent as MessageContent,
	} as MessageType;
  } 
  // For Gemini
  else if (provider === 'Gemini') {
	messages[1] = {
	  role: 'user',
	  parts: userContent as MessageContent,
	} as MessageType;
  }


	// Define request body based on provider
	//Add a body for Gemini
	const body =
    provider === 'OpenAI'
        ? ({
            model,
            max_tokens: 4096,
            temperature: 0,
            messages,
            seed: 42,
            n: 1,
        } as OpenaAIVCompletionRequest)
        : provider === 'Anthropic'
            ? ({
                model,
                max_tokens: 4096,
                temperature: 0,
                messages,
                system: OPEN_AI_SYSTEM_PROMPT
            } as AnthropicCompletionRequest)
            : ({
                model,
                maxOutputTokens: 4096,
                temperature: 0,
                messages,
            } as GoogleCompletionRequest)

	// URL and headers based on provider
	const apiUrl =
		provider === 'OpenAI'
			? 'https://api.openai.com/v1/chat/completions'
			: 'https://api.anthropic.com/v1/messages'

	const headers = {
		'Content-Type': 'application/json',
		Authorization: `Bearer ${apiKey}`,
		...(provider === 'Anthropic' ? { 'anthropic-version': '2024-08-06' } : {}),
	}

	let json = null

	if (provider === 'Anthropic' || provider === 'Gemini') {
		try {
			const response = await fetch('http://localhost:3002/api/claude', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(body),
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			return await response.json();
		} catch (error: any) {
			throw new Error(`Could not contact Anthropic: ${error.message}`);
		}
	}

	if (provider === 'OpenAI') {
		try {
			const resp = await fetch(apiUrl, {
				method: 'POST',
				headers,
				body: JSON.stringify(body),
			})
			json = await resp.json()
		} catch (e: any) {
			throw Error(`Could not contact ${provider}: ${e.message}`)
		}

		return json
	}

}

type MessageContent = string | ContentItem | ContentItem[];

type ContentItem = {
	type: 'text';
	text: string;
} | {
	type: 'image_url';
	image_url: {
		url: string;
		detail: 'low' | 'high' | 'auto';
	};
} | {
	type: 'image';
	source: {
		type: 'base64';
		media_type: string;
		data: string;
	};
} | {
	fileData: {
		fileUri: string;
		mimeType: string;
	}

} | {
	text: string;
}


//Changed the model and instantly got better results. Definetly will implement functionality to use different models in the make real functionality
export type OpenaAIVCompletionRequest = {
	model: 'gpt-4o-mini' | string
	provider: string | undefined
	messages: {
		role: 'system' | 'user' | 'assistant' | 'function'
		content: MessageContent
		name?: string | undefined
	}[]
	functions?: any[] | undefined
	function_call?: any | undefined
	stream?: boolean | undefined
	temperature?: number | undefined
	top_p?: number | undefined
	max_tokens?: number | undefined
	n?: number | undefined
	best_of?: number | undefined
	frequency_penalty?: number | undefined
	presence_penalty?: number | undefined
	seed?: number | undefined
	logit_bias?:
	| {
		[x: string]: number
	}
	| undefined
	stop?: (string[] | string) | undefined
}

// Define the Anthropic completion request type
export type AnthropicCompletionRequest = {
	model: 'claude-3-5-sonnet-latest' | string
	provider: string | undefined
	messages: {
		role: 'user' | 'assistant'
		content: MessageContent
	}[]
	max_tokens: number
	temperature?: number | undefined
	system?: string | undefined
	stop_sequences?: (string[] | string) | undefined
	stream?: boolean | undefined
	top_p?: number | undefined
	top_k?: number | undefined
}

export type GoogleCompletionRequest = {
    model: 'gemini-1.5-flash-8b-latest' | string
    provider: string | undefined
    messages: {
        system_instruction?: {
            parts: {
                text: string
            }
        }
        parts: MessageContent
    }[]
    maxOutputTokens: number
    temperature?: number | undefined
    system?: string | undefined
    stopSequences?: (string[] | string) | undefined
    stream?: boolean | undefined
    top_p?: number | undefined
    top_k?: number | undefined
}
import {
	TldrawUiDropdownMenuRoot,
	TldrawUiDropdownMenuTrigger,
	TldrawUiDropdownMenuContent,
	TldrawUiDropdownMenuItem,
	TldrawUiButton,
	TldrawUiButtonLabel,
	TldrawUiButtonIcon,
} from 'tldraw';
import { ChangeEvent, useCallback, useState } from 'react'

// Define types for our providers and models
type Provider = 'Anthropic' | 'OpenAI' //| 'Cohere' | 'Mistral'
type ProviderModels = {
	[K in Provider]: string[]
}

function ApiKeyHandler({ onClose }: { onClose(): void }) {
	const [selectedProvider, setSelectedProvider] = useState<Provider>('Anthropic');
	const [selectedModel, setSelectedModel] = useState<string>('claude-3-5-sonnet');

	// Store the API key in localStorage when Enter is pressed
	const handleComplete = useCallback((value: string) => {
		localStorage.setItem('makeitreal_key', value);
	}, []);

	const handleProviderChange = useCallback((provider: Provider) => {
		setSelectedProvider(provider);
		setSelectedModel(providerModels[provider][0]); // Set first model of new provider
		localStorage.setItem('makeitreal_provider', provider);
		localStorage.setItem('makeitreal_model', providerModels[provider][0]);
	}, []);

	const handleModelChange = useCallback((model: string) => {
		setSelectedModel(model);
		localStorage.setItem('makeitreal_model', model);
	}, []);

	const providerModels = {
		'Anthropic': ['claude-3.5-sonnet', 'claude-3.5-haiku', 'claude-3-opus', 'gemini-1.5-flash-8b-latest'],
		'OpenAI': ['gpt-4-turbo', 'gpt-3.5-turbo', 'gpt-4o', 'gpt-4o-mini'],
		// 'Cohere': ['command-nightly', 'command-light'],
		// 'Mistral': ['mistral-large', 'mistral-medium'],
	};

	return (
		<>
			{/* Provider Dropdown */}
			<div>
				<label>Provider</label>
				<TldrawUiDropdownMenuRoot id="provider-selector">
					<TldrawUiDropdownMenuTrigger>
						<TldrawUiButton type='normal' style={{ width: '100%', justifyContent: 'space-between' }}>
							<TldrawUiButtonLabel>{selectedProvider}</TldrawUiButtonLabel>
							<TldrawUiButtonIcon icon="chevron-down" />
						</TldrawUiButton>
					</TldrawUiDropdownMenuTrigger>
					<TldrawUiDropdownMenuContent side="bottom" align="start" className="tlui-menu">
						{(Object.keys(providerModels) as Provider[]).map((provider) => (
							<TldrawUiDropdownMenuItem key={provider}>
								<TldrawUiButton 
									onClick={() => handleProviderChange(provider)}
									style={{ width: '100%' }}
									type='normal'
								>
									<TldrawUiButtonLabel>{provider}</TldrawUiButtonLabel>
								</TldrawUiButton>
							</TldrawUiDropdownMenuItem>
						))}
					</TldrawUiDropdownMenuContent>
				</TldrawUiDropdownMenuRoot>
			</div>

			{/* Model Dropdown */}
			<div>
				<label>Model</label>
				<TldrawUiDropdownMenuRoot id="model-selector">
					<TldrawUiDropdownMenuTrigger>
						<TldrawUiButton type='normal' style={{ width: '100%', justifyContent: 'space-between' }}>
							<TldrawUiButtonLabel>{selectedModel}</TldrawUiButtonLabel>
							<TldrawUiButtonIcon icon="chevron-down" />
						</TldrawUiButton>
					</TldrawUiDropdownMenuTrigger>
					<TldrawUiDropdownMenuContent side="bottom" align="start" className="tlui-menu">
						{providerModels[selectedProvider].map((model) => (
							<TldrawUiDropdownMenuItem key={model}>
								<TldrawUiButton 
									onClick={() => handleModelChange(model)}
									style={{ width: '100%' }}
									type='normal'
								>
									<TldrawUiButtonLabel>{model}</TldrawUiButtonLabel>
								</TldrawUiButton>
							</TldrawUiDropdownMenuItem>
						))}
					</TldrawUiDropdownMenuContent>
				</TldrawUiDropdownMenuRoot>
			</div>
		</>
	);
}

export default ApiKeyHandler;

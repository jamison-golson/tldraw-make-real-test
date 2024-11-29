import {
	TLComponents,
	Tldraw,
	TldrawUiButton,
	TldrawUiButtonLabel,
	TldrawUiDialogBody,
	TldrawUiDialogCloseButton,
	TldrawUiDialogFooter,
	TldrawUiDialogHeader,
	TldrawUiDialogTitle,
	TldrawUiButtonIcon,
	TldrawUiDropdownMenuRoot,
	TldrawUiDropdownMenuTrigger,
	TldrawUiDropdownMenuContent,
	TldrawUiDropdownMenuItem,
	TldrawUiDropdownMenuGroup,
	TldrawUiInput,
	useDialogs,
	useToasts,
} from 'tldraw'
import 'tldraw/tldraw.css'
import { ChangeEvent, useCallback, useState } from 'react'
import { useEditor } from 'tldraw';


// Define types for our providers and models
type Provider = 'Anthropic' | 'OpenAI' | 'Gemini'
type ProviderModels = {
	[K in Provider]: string[]
}

function MyDialog({ onClose }: { onClose(): void }) {
	const [selectedProvider, setSelectedProvider] = useState<Provider>('Anthropic');
	const [selectedModel, setSelectedModel] = useState<string>('claude-3-5-sonnet-20241022');

	// Store the OpenAI API key in localStorage
	const handleOpenAIKeyComplete = useCallback((value: string) => {
		localStorage.setItem('makeitreal_OPENAI_key', value);
	}, []);

	// Store the Anthropic API key in localStorage
	const handleAnthropicKeyComplete = useCallback((value: string) => {
		localStorage.setItem('makeitreal_ANTHROPIC_key', value);
	}, []);

	const handleProviderChange = useCallback((provider: Provider) => {
		setSelectedProvider(provider);
		setSelectedModel(providerModels[provider][0]); // Set first model of new provider
	}, []);

	const handleModelChange = useCallback((model: string) => {
		setSelectedModel(model);
	}, []);

	const editor = useEditor();

	//Used to export canvas data
	//Works for now but implement next tldraw.editor.getSnapshot()
	const handleExport = () => {
		const snapshot = editor.store.getSnapshot();
		const dataStr = JSON.stringify(snapshot);
		const blob = new Blob([dataStr], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'tldraw-data.json';
		a.click();
		URL.revokeObjectURL(url);
	};

	const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				const dataStr = e?.target?.result as string | null;
				if (dataStr) {
					const snapshot = JSON.parse(dataStr);
					editor.store.loadSnapshot(snapshot);
				}
			};
			reader.readAsText(file);
		}
	};

	const providerModels = {
		'Anthropic': ['claude-3-5-sonnet-latest', 'claude-3-haiku-20240307', 'claude-3-opus-latest'],
		'OpenAI': ['gpt-4-turbo', 'gpt-3.5-turbo'],
		'Gemini': ['gemini-pro',
			'gemini-1.5-pro-latest',
			'gemini-1.5-flash-latest',
			'gemini-1.5-pro-001',
			'gemini-1.5-flash-001',
			'gemini-1.5-pro-002',
			'gemini-1.5-flash-002',
			'gemini-1.5-flash-8b-latest',
			'gemini-1.5-flash-8b-001',
			'gemini-exp-1114',
			'gemini-exp-1121'
		]
		// 'Cohere': ['command-nightly', 'command-light'],
		// 'Mistral': ['mistral-large', 'mistral-medium'],
	};

	return (
		<>
			<TldrawUiDialogHeader>
				<TldrawUiDialogTitle>Settings</TldrawUiDialogTitle>
				<TldrawUiDialogCloseButton />
			</TldrawUiDialogHeader>
			<TldrawUiDialogBody style={{ maxWidth: 400 }}>
				<p style={{ marginBottom: 16 }}>
					To use Make Real, enter your API key for each model provider that you wish to use. Draw
					some shapes, then select the shapes and click Make Real.{' '}
					<a href="#" style={{ color: '#006ADC' }}>
						Read our guide.
					</a>
				</p>
				{/* OpenAI API Key Input */}
				<div>
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
							marginBottom: 8,
						}}
					>
						<label>OpenAI API key</label>
						<TldrawUiButton type="normal" style={{ padding: 4 }}>
							<TldrawUiButtonIcon icon="question-mark" />
						</TldrawUiButton>
					</div>
					<TldrawUiInput
						className="openai_key_risky_but_cool"
						placeholder="risky but cool"
						defaultValue={localStorage.getItem('makeitreal_OPENAI_key') ?? ''}
						onComplete={handleOpenAIKeyComplete}
					/>
				</div>

				{/* Anthropic API Key Input */}
				<div>
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
							marginBottom: 8,
						}}
					>
						<label>Anthropic API key</label>
						<TldrawUiButton type="normal" style={{ padding: 4 }}>
							<TldrawUiButtonIcon icon="question-mark" />
						</TldrawUiButton>
					</div>
					<TldrawUiInput
						className="anthropic_key_risky_but_cool"
						placeholder="risky but cool"
						defaultValue={localStorage.getItem('makeitreal_ANTHROPIC_key') ?? ''}
						onComplete={handleAnthropicKeyComplete}
					/>
				</div>

				{/* System Prompt Input */}
				<div>
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
							marginBottom: 8,
						}}
					>
						<label>System prompt</label>
						<TldrawUiButton type="normal">
							<TldrawUiButtonLabel>Reset</TldrawUiButtonLabel>
						</TldrawUiButton>
					</div>
					<TldrawUiInput defaultValue="You are an expert web developer who specializes in..." />
				</div>
			</TldrawUiDialogBody>
			<TldrawUiDialogFooter>
				<TldrawUiButton type="primary" onClick={onClose}>
					<TldrawUiButtonLabel>Save</TldrawUiButtonLabel>
				</TldrawUiButton>
				<TldrawUiButton type="primary" onClick={handleExport}>
					<TldrawUiButtonLabel>Export Data</TldrawUiButtonLabel>
				</TldrawUiButton>
				<input type="file" accept="application/json" onChange={handleImport} />;
			</TldrawUiDialogFooter>
		</>
	)
}

export default function RiskyButCoolAPIKeyInput() {
	const { addToast } = useToasts()
	const { addDialog } = useDialogs()
	const [isModalOpen, setModalOpen] = useState(false);

	return (
		<div style={{ padding: 16, gap: 16, display: 'flex', pointerEvents: 'all' }}>
			<button
				onClick={() => {
					const openAIKey = localStorage.getItem('makeitreal_OPENAI_key') ?? process.env.OPENAI_API_KEY;
					const anthropicKey = localStorage.getItem('makeitreal_ANTHROPIC_key');

					const description = `
					OpenAI Key: ${openAIKey ? '✅' : '❌'}\n
					Anthropic Key: ${anthropicKey ? '✅' : '❌'}
				`;

					addToast({
						title: 'API keys',
						severity: 'success',
						description,
					});
				}}
			>
				Show API keys and current AI model
			</button>
			<button
				onClick={() => {
					addDialog({
						component: MyDialog,
						onClose() {
							// You can do something after the dialog is closed
							void null
						},
					})
				}}
			>
				RiskyButCoolAPIKeyInput
			</button>
		</div>
	)
}

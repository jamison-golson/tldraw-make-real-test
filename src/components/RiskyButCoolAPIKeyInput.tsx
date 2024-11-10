// //Add back in Icon into first import statement
// import {  useBreakpoint, TldrawUiButton, TldrawUiButtonLabel, TldrawUiInput, TldrawUiDialogBody } from 'tldraw'
// import { ChangeEvent, useCallback } from 'react'

// export function RiskyButCoolAPIKeyInput() {
// 	const breakpoint = useBreakpoint()

// 	// Store the API key in localStorage when Enter is pressed
// 	const handleComplete = useCallback((value: string) => {
// 		localStorage.setItem('makeitreal_key', value);
// 	}, []);

// 	const handleQuestionMessage = useCallback(() => {
// 		window.alert(
// 			`If you have an OpenAI developer key, you can put it in this input and it will be used when posting to OpenAI.\n\nSee https://platform.openai.com/api-keys to get a key.\n\nPutting API keys into boxes is generally a bad idea! If you have any concerns, create an API key and then revoke it after using this site.`
// 		)
// 	}, [])

// 	return (
// 		<div style={{ display: 'flex'}}>
// 			<TldrawUiDialogBody>
// 				<div style={{display: 'flex'}}>
// 					<TldrawUiInput
// 						className="openai_key_risky_but_cool"
// 						// label="API-key"
// 						defaultValue={
// 							localStorage.getItem('makeitreal_key') ?? process.env.OPENAI_API_KEY ?? 'Please Enter an API KEY'
// 						}
// 						onComplete={handleComplete} // Store the value on Enter
// 						autoFocus= {true}
// 						disabled= {false}
// 					/>
// 				</div>
// 				<TldrawUiButton type="normal" onClick={handleQuestionMessage}>
// 					<TldrawUiButtonLabel>API-key</TldrawUiButtonLabel>
// 				</TldrawUiButton>
// 			</TldrawUiDialogBody>
// 		</div>
// 	);
// }



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
type Provider = 'Anthropic' | 'OpenAI' 
type ProviderModels = {
	[K in Provider]: string[]
}


// There's a guide at the bottom of this file

// [1]
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


	// // Define providers and their models with proper typing
	// const providerModels: ProviderModels = {
	// 	'Anthropic': [
	// 		'claude-3-5-sonnet-20241022',
	// 		'claude-2-1'
	// 	],
	// 	'OpenAI': [
	// 		'gpt-4-turbo',
	// 		'gpt-3.5-turbo'
	// 	],
	// 	'Cohere': [
	// 		'command-nightly',
	// 		'command-light'
	// 	],
	// 	'Mistral': [
	// 		'mistral-large',
	// 		'mistral-medium'
	// 	]
	// };

	const providerModels = {
		'Anthropic': ['claude-3-5-sonnet-latest', 'claude-3-haiku-20240307', 'claude-3-opus-latest'],
		'OpenAI': ['gpt-4-turbo', 'gpt-3.5-turbo'],
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

// function APIKeysModal({ onClose }: { onClose: () => void }) {
// 	const handleComplete = useCallback((value: string) => {
// 		localStorage.setItem('makeitreal_key', value);
// 	}, []);

// 	return (
// 		<>
// 			{/* OpenAI API Key Input */}
// 			<div style={{ marginBottom: 16 }}>
// 				<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
// 					<label>OpenAI API key</label>
// 					<TldrawUiButton type="normal" style={{ padding: 4 }}>
// 						<TldrawUiButtonIcon icon="question-mark" />
// 					</TldrawUiButton>
// 				</div>
// 				<TldrawUiInput
// 					className="openai_key_risky_but_cool"
// 					placeholder="risky but cool"
// 					defaultValue={localStorage.getItem('makeitreal_key') ?? ''}
// 					onComplete={handleComplete}
// 				/>
// 			</div>

// 			{/* Anthropic API Key Input */}
// 			<div>
// 				<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
// 					<label>Anthropic API key</label>
// 					<TldrawUiButton type="normal" style={{ padding: 4 }}>
// 						<TldrawUiButtonIcon icon="question-mark" />
// 					</TldrawUiButton>
// 				</div>
// 				<TldrawUiInput placeholder="risky but cool"
// 					defaultValue={localStorage.getItem('makeitreal_key') ?? ''}
// 					onComplete={handleComplete}/>
// 			</div>
// 		</>
// 	);
// }


// // [2]
// function MySimpleDialog({ onClose }: { onClose(): void }) {
// 	return (
// 		<div style={{ padding: 16 }}>
// 			<h2>Title</h2>
// 			<p>Description...</p>
// 			<button onClick={onClose}>Okay</button>
// 		</div>
// 	)
// }

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
			{/* <div>
				<button onClick={() => setModalOpen(true)}>API Keys</button>
				{isModalOpen && (
					<div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
						<div style={{ background: 'white', borderRadius: 8, padding: 16, width: 400 }}>
							<APIKeysModal onClose={() => setModalOpen(false)} />
						</div>
					</div>
				)}
			</div> */}
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
				Show simple dialog
			</button>
		</div>
	)
}

// const components: TLComponents = {
// 	SharePanel: CustomSharePanel,
// }

// export default function RiskyButCoolAPIKeyInput() {
// 	return (
// 		<div className="tldraw__editor">
// 			<Tldraw components={components} persistenceKey="example" />
// 		</div>
// 	)
// }

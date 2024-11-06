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
	TldrawUiInput,
	useDialogs,
	useToasts,
} from 'tldraw'
import 'tldraw/tldraw.css'
import { ChangeEvent, useCallback } from 'react'

// There's a guide at the bottom of this file

// [1]
function MyDialog({ onClose }: { onClose(): void }) {
	// Store the API key in localStorage when Enter is pressed
	const handleComplete = useCallback((value: string) => {
		localStorage.setItem('makeitreal_key', value);
	}, []);

	const handleQuestionMessage = useCallback(() => {
		window.alert(
			`If you have an OpenAI developer key, you can put it in this input and it will be used when posting to OpenAI.\n\nSee https://platform.openai.com/api-keys to get a key.\n\nPutting API keys into boxes is generally a bad idea! If you have any concerns, create an API key and then revoke it after using this site.`
		)
	}, [])
	return (
		<>
			<TldrawUiDialogHeader>
				<TldrawUiDialogTitle>Title</TldrawUiDialogTitle>
				<TldrawUiDialogCloseButton />
			</TldrawUiDialogHeader>
			<TldrawUiDialogBody style={{ maxWidth: 350 }}>Description...</TldrawUiDialogBody>
			<TldrawUiDialogFooter className="tlui-dialog__footer__actions">
				<TldrawUiInput
					className="openai_key_risky_but_cool"
					// label="API-key"
					defaultValue={
						localStorage.getItem('makeitreal_key') ?? process.env.OPENAI_API_KEY ?? 'Please Enter an API KEY'
					}
					onComplete={handleComplete} // Store the value on Enter
					autoFocus= {true}
					disabled= {false}
				/>
				<TldrawUiButton type="normal" onClick={onClose}>
					<TldrawUiButtonLabel>Cancel</TldrawUiButtonLabel>
				</TldrawUiButton>
				<TldrawUiButton type="primary" onClick={handleQuestionMessage} >
// 					<TldrawUiButtonIcon icon='question-mark' />
// 				</TldrawUiButton>
			</TldrawUiDialogFooter>
		</>
	)
}

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

	return (
		<div style={{ padding: 16, gap: 16, display: 'flex', pointerEvents: 'all' }}>
			<button
				onClick={() => {
					addToast({ title: 'Hello world!', severity: 'success', description: localStorage.getItem('makeitreal_key') ?? process.env.OPENAI_API_KEY ?? 'No API KEY available'})
				}}
			>
				Show toast
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
				Show dialog
			</button>
			{/* <button
				onClick={() => {
					addDialog({
						component: MySimpleDialog,
						onClose() {
							// You can do something after the dialog is closed
							void null
						},
					})
				}}
			>
				Show simple dialog
			</button> */}
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

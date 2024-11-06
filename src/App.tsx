import {TLComponents, Tldraw } from 'tldraw'
import 'tldraw/tldraw.css'

import { MakeRealButton } from './components/MakeRealButton'
import { TldrawLogo } from './components/TldrawLogo'
import RiskyButCoolAPIKeyInput from "./components/RiskyButCoolAPIKeyInput"
import { PreviewShapeUtil } from './PreviewShape/PreviewShape'

const CustomSharePanel = () => {
	return(
		<div>
			<MakeRealButton />
			{/* <RiskyButCoolAPIKeyInput /> */}
			{/* <TldrawLogo /> */}
		</div>
	)
}


const shapeUtils = [PreviewShapeUtil]

const components: TLComponents = {
	SharePanel: RiskyButCoolAPIKeyInput,
	TopPanel: CustomSharePanel,
}

export default function App() {
	return (
		<div className="editor" style={{ position: 'fixed', inset: 0 }}>
			<Tldraw persistenceKey="make-real" components={components} shapeUtils={shapeUtils}>
				{/* <TldrawLogo /> */}
				{/* <RiskyButCoolAPIKeyInput /> */}
			</Tldraw>
		</div>
	)
}

// import {
// 	TLComponents,
// 	Tldraw,
// 	TldrawUiInput,
// 	TldrawUiButton,
// 	TldrawUiButtonLabel,
// 	TldrawUiDialogBody,
// 	TldrawUiDialogCloseButton,
// 	TldrawUiDialogFooter,
// 	TldrawUiDialogHeader,
// 	TldrawUiDialogTitle,
// 	useDialogs,
// 	useToasts,
// } from 'tldraw'
// import 'tldraw/tldraw.css'
// import { ChangeEvent, useCallback } from 'react'

// // There's a guide at the bottom of this file

// // Store the API key locally, but ONLY in development mode
// const handleChange = useCallback((value: string) => {
// 	localStorage.setItem('makeitreal_key', value);
// }, []);

// // [1]
// function MyDialog({ onClose }: { onClose(): void }) {
// 	return (
// 		<>
// 			<TldrawUiDialogHeader>
// 				<TldrawUiDialogTitle>API Key</TldrawUiDialogTitle>
// 				<TldrawUiDialogCloseButton />
// 			</TldrawUiDialogHeader>
// 			<TldrawUiDialogBody style={{ maxWidth: 350 }}>Enter API key please</TldrawUiDialogBody>
// 			<TldrawUiDialogFooter className="tlui-dialog__footer__actions">
// 				<TldrawUiInput
// 					className="openai_key_risky_but_cool"
// 					label='API-key'
// 					defaultValue={
// 						localStorage.getItem('makeitreal_key') ?? process.env.OPENAI_API_KEY ?? 'Please Enter an API KEY'
// 					}
// 					onValueChange={handleChange}

// 					// icon='question-mark'
// 					// spellCheck={false}
// 					// autoCapitalize="off"	
// 				/>
// 				<TldrawUiButton type="primary" onClick={onClose}>
// 					<TldrawUiButtonLabel>Enter</TldrawUiButtonLabel>
// 				</TldrawUiButton>
// 			</TldrawUiDialogFooter>
// 		</>
// 	)
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

// const CustomSharePanel = () => {
// 	const { addToast } = useToasts()
// 	const { addDialog } = useDialogs()

// 	return (
// 		<div style={{ padding: 16, gap: 16, display: 'flex', pointerEvents: 'all' }}>
// 			<button
// 				onClick={() => {
// 					addToast({ title: 'Hello world!', severity: 'success' })
// 				}}
// 			>
// 				Show toast
// 			</button>
// 			<button
// 				onClick={() => {
// 					addDialog({
// 						component: MyDialog,
// 						onClose() {
// 							// You can do something after the dialog is closed
// 							void null
// 						},
// 					})
// 				}}
// 			>
// 				Show dialog
// 			</button>
// 			<button
// 				onClick={() => {
// 					addDialog({
// 						component: MySimpleDialog,
// 						onClose() {
// 							// You can do something after the dialog is closed
// 							void null
// 						},
// 					})
// 				}}
// 			>
// 				Show simple dialog
// 			</button>
// 		</div>
// 	)
// }
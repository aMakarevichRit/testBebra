import EditorViewport from './EditorViewport';
import { AreaSelectionProvider } from './components/AreaSelectionContext';
import Editor from './components/Editor';

function App() {
	return (
		<div style={{ display: 'flex', height: '100vh' }}>
			<Editor />
			{/* <EditorViewport /> */}
		</div>
	);
}

export default App;

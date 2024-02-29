import { AreaSelectionProvider } from './components/AreaSelectionContext';
import Editor from './components/Editor';

function App() {
	return (
		<div style={{ display: 'flex', height: '100vh' }}>
			<Editor />
		</div>
	);
}

export default App;

import { AreaSelectionProvider } from './components/AreaSelectionContext';
import Editor from './components/Editor';

function App() {
	return (
		<div style={{ display: 'flex', height: '100vh' }}>
			<AreaSelectionProvider>
				<Editor />
			</AreaSelectionProvider>
		</div>
	);
}

export default App;

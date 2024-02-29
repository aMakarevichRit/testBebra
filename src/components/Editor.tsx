// eslint-disable-next-line
// @ts-ignore
import { useCallback, useEffect, useRef, useState } from 'react';
import { Stage, Container, Sprite } from '@pixi/react';
import { Texture } from 'pixi.js';
import tableSmall from '../assets/table2.png';
import table3 from '../assets/table3.png';
import table4 from '../assets/table4.png';
import seat from '../assets/seat-v4.png';
import ErrorBoundary from './ErrorBoundary';
import DraggableBox from './DraggableBox';
import { useKeyboard } from '../hooks/useKeyboard';
import { useCopy } from '../hooks/useCopy';
import { useWheel } from '../hooks/useWheel';
import { useAreaSelection } from '../hooks/useAreaSelection';
import { useDragging } from '../hooks/useDragging';
import Grid from './Grid';
import TestStage from './TestStage';
import SelectionRectangle from './SelectionRectangle';
import { AreaSelectionProvider } from './AreaSelectionContext';

const idToTextureMap = {
	table: tableSmall,
	table3: table3,
	table4: table4,
	seat: seat,
};

const saveStateToJson = (objects) => {
	return JSON.stringify(objects, null, 2);
};

const loadStateFromJson = (jsonString) => {
	const state = JSON.parse(jsonString);
	return state;
};

const defaultObjects = [
	{
		id: '1',
		position: { x: 100, y: 100 },
		alpha: 1,
		rotation: 0,
		scale: { x: 0.2, y: 0.2 },
		textureSrc: table4,
		zIndex: 10,
	},
	{
		id: '2',
		position: { x: 200, y: 100 },
		alpha: 1,
		rotation: 0,
		scale: { x: 0.2, y: 0.2 },
		textureSrc: seat,
		zIndex: 10,
	},
];

const Editor = () => {
	const [objects, setObjects] = useState(defaultObjects);
	const [selectedItems, setSelectedItems] = useState([]);
	const [isEditMode, setIsEditMode] = useState(true);
	const [app, setApp] = useState();

	useEffect(() => {
		globalThis.__PIXI_APP__ = app;
	}, [app]);
	const { handleCopy, handlePaste } = useCopy(selectedItems, onPaste);

	const {
		handleMouseDown,
		handleMouseUp,
		selectedItems: areaItems,
		AreaSelectionComponent,
	} = useAreaSelection(app?.stage, setSelectedItems);
	useKeyboard(isEditMode, handleKeyDown);
	useWheel(isEditMode, handleResize);

	// useEffect(() => {
	// 	console.log(areaItems);
	// }, [areaItems]);

	// const [refObjects, setRefObjects] = useState([]);
	const [savedState, setSavedState] = useState('');

	function onPaste(parsedData) {
		setObjects((prevObjects) => {
			const targetObjects = prevObjects.filter((obj) => parsedData.includes(obj.id));
			const copies = targetObjects.map((obj) => ({
				...obj,
				id: obj.id + Math.random(),
				position: {
					x: obj.position.x + 40,
					y: obj.position.y + 40,
				},
			}));
			return [...prevObjects, ...copies];
		});
	}

	function handleKeyDown(event) {
		event.preventDefault();
		let updatedObjects = null;
		let shiftPosition = null;
		switch (event.key) {
			case 'Delete':
				updatedObjects = objects.filter((obj) => !selectedItems.includes(obj.id));
				setSelectedItems([]);
				break;
			case 'r' || 'R':
				updatedObjects = objects.map((obj) => {
					if (!selectedItems.includes(obj.id)) {
						return obj;
					}

					const prevRotation = obj.rotation ?? 0;
					const updatedRotation = prevRotation + Math.PI / 2;

					return { ...obj, rotation: updatedRotation };
				});

				break;
			case 'c':
				if (!event.ctrlKey) {
					return;
				}

				handleCopy();
				return;
			case 'v':
				if (!event.ctrlKey) {
					return;
				}

				handlePaste();
				return;
			case 'ArrowUp':
				shiftPosition = { x: 0, y: -10 };
				break;
			case 'ArrowDown':
				shiftPosition = { x: 0, y: 10 };
				break;
			case 'ArrowLeft':
				shiftPosition = { x: -10, y: 0 };
				break;
			case 'ArrowRight':
				shiftPosition = { x: 10, y: 0 };
				break;
			default:
				break;
		}

		if (shiftPosition) {
			console.log(shiftPosition);
			updatedObjects = objects.map((obj) => {
				if (!selectedItems.includes(obj.id)) {
					return obj;
				}

				const updatedPosition = {
					x: obj.position.x + shiftPosition.x,
					y: obj.position.y + shiftPosition.y,
				};

				return { ...obj, position: updatedPosition };
			});
		}

		if (updatedObjects) {
			setObjects(updatedObjects);
		}
	}

	function handleResize(event) {
		if (!isEditMode) {
			return;
		}
		event.preventDefault();

		if (selectedItems.length !== 0) {
			const scaleFactor = event.deltaY > 0 ? 0.9 : 1.1; // Scale factor based on mouse wheel direction

			const updatedObjects = objects.map((obj) => {
				if (!selectedItems.includes(obj.id)) {
					return obj;
				}

				const prevScale = obj.scale ?? 0;
				const updatedScale = {
					x: prevScale.x * scaleFactor,
					y: prevScale.y * scaleFactor,
				};

				return { ...obj, scale: updatedScale };
			});

			setObjects(updatedObjects);
		}
	}

	const onSaveState = useCallback(() => {
		const savedState = saveStateToJson(objects);
		setSavedState(savedState);
	}, [objects]);

	const onLoadState = useCallback(() => {
		const loadedObjects = loadStateFromJson(savedState);
		setObjects(loadedObjects);
	}, [savedState]);

	const updateSelectedItems = (id) => {
		setSelectedItems((prevSelected) => {
			if (prevSelected.includes(id)) {
				return prevSelected.filter((itemId) => itemId !== id);
			} else {
				return [...prevSelected, id];
			}
		});
	};

	const updateItem = useCallback(
		(updatedState, id) => {
			const updatedObjects = objects.map((obj) => {
				if (obj.id !== id) {
					return obj;
				}

				return { ...obj, ...updatedState };
			});

			setObjects(updatedObjects);
			// if (app) {
			// 	debugger;
			// 	app.stage.children[0].children.sort((itemA, itemB) => itemA.zIndex - itemB.zIndex);
			// }
		},
		[objects]
	);

	const boxes = objects.map(({ id, position, scale, rotation, textureSrc, zIndex, alpha }) => {
		return (
			<DraggableBox
				key={id}
				id={id}
				texture={Texture.from(textureSrc)}
				alpha={alpha}
				position={position}
				rotation={rotation}
				scale={scale}
				zIndex={zIndex}
				updateItem={updateItem}
				updateSelectedItems={updateSelectedItems}
				cursor="pointer"
				isEditMode={isEditMode}
				tint={selectedItems.includes(id) ? '#F43F5E' : 0xffffff}
			/>
		);
	});

	const onAddObject = useCallback((type) => {
		setObjects((prevObjects) => [
			...prevObjects,
			{
				id: (prevObjects.length + 1).toString(),
				position: { x: 100, y: 100 },
				textureSrc: idToTextureMap[type],
				alpha: 1,
				rotation: 0,
				scale: { x: 0.2, y: 0.2 },
				zIndex: 10,
			},
		]);
	}, []);

	useEffect(() => {
		if (!app) {
			return;
		}

		app.stage.hitArea = app.screen;
		app.stage.sortableChildren = true;
	}, [app]);

	console.log('rerender of editor');

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				gap: 20,
				width: '100%',
				height: '100vh', // Ensure the component fills the viewport height
			}}
		>
			<div>
				<button onClick={onSaveState}>Save State</button>
				<button onClick={onLoadState}>Load State</button>
				<button onClick={() => setIsEditMode((prev) => !prev)}>Edit mode</button>
				<p>Edit mode: {isEditMode ? 'on' : 'off'}</p>
			</div>
			<div
				style={{
					display: 'flex',
					gap: 20,
					width: '100%',
				}}
			>
				<Stage
					options={{
						backgroundColor: 0x000,
						eventMode: 'static',
					}}
					onContextMenu={(e) => e.preventDefault()}
					onPointerDown={(e) => {
						// debugger;

						console.log('pointer down');
						e.preventDefault();
						if (selectedItems.length === 0) {
							return;
						}

						// console.log('pointer down of stage', e.currentTarget, e.target);

						console.log('reset selected');
						console.log(selectedItems.length);
						setSelectedItems([]);
					}}
					// onPointerUp={handleMouseUp}
					width={1160}
					height={760}
					onMount={setApp}
					style={{ border: '1px dashed black' }}
				>
					<Grid
						width={1160}
						height={760}
						pointerdown={(e) => {
							handleMouseDown(e);
						}}
						pointerup={handleMouseUp}
						pointerupoutside={handleMouseUp}
					>
						<AreaSelectionComponent />
						{boxes}
					</Grid>
				</Stage>

				{/* <TestStage /> */}
				<div>
					{/* <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
						<img src={tableSmall} width={120} height={120} />
						<button onClick={() => onAddObject('table')}>Add table</button>
					</div> */}
					<div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
						<img src={table4} width={120} height={220} />
						<button onClick={() => onAddObject('table4')}>Add table</button>
					</div>
					<div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
						<img src={seat} width={120} height={120} />
						<button onClick={() => onAddObject('seat')}>Add seat</button>
					</div>
				</div>
			</div>
			<pre style={{ maxHeight: '600px', height: '100%' }}>
				{JSON.stringify(objects, null, 2)}
			</pre>
		</div>
	);
};

const EditorWithErrorBoundary = () => (
	<ErrorBoundary>
		<Editor />
	</ErrorBoundary>
);

export default EditorWithErrorBoundary;

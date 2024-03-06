// eslint-disable-next-line
// @ts-ignore
import { useCallback, useEffect, useRef, useState } from 'react';
import { Stage, Container, Sprite } from '@pixi/react';
import { Application, FederatedPointerEvent, ICanvas, Point, Rectangle, Texture } from 'pixi.js';
import tableSmall from '../assets/table2.png';
import table3 from '../assets/table3.png';
import table4 from '../assets/table4.png';
import seat from '../assets/seat-v4.png';
import ErrorBoundary from './ErrorBoundary';
import { useKeyboard } from '../hooks/useKeyboard';
import { useCopy } from '../hooks/useCopy';
import { useWheel } from '../hooks/useWheel';
import { useAreaSelection } from '../hooks/useAreaSelection';
import { useDragging } from '../hooks/useDragging';
import Grid from './Grid';

const stageWidth = 1600; // Width of the entire stage
const stageHeight = 1600; // Height of the entire stage
const visibleSquareSize = 800; // S

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
	const [selectedItems, setSelectedItems] = useState<string[]>([]);
	const [isEditMode, setIsEditMode] = useState(true);
	const [app, setApp] = useState<Application<ICanvas>>();
	const [visibleArea, setVisibleArea] = useState({ x: 0, y: 0, scale: { x: 1, y: 1 } });
	const isClickOnArea = useRef(false);
	const stageRef = useRef();
	const viewContainerRef = useRef();

	useEffect(() => {
		globalThis.__PIXI_APP__ = app;
	}, [app]);
	const { handleCopy, handlePaste } = useCopy(selectedItems, onPaste);

	const {
		onAreaSelectionMouseDown,
		onAreaSelectionMouseUp,
		onAreaSelectionMouseMove,
		AreaSelectionComponent,
	} = useAreaSelection(app?.stage, setSelectedItems, visibleArea);
	useKeyboard(isEditMode, handleKeyDown);
	useWheel(isEditMode, handleResize);

	const updateItem = useCallback((updatedState, id) => {
		setObjects((prevObjects) =>
			prevObjects.map((obj) => {
				if (obj.id !== id) {
					return obj;
				}

				return { ...obj, ...updatedState };
			})
		);
	}, []);

	const { onDragEnd, onDragStart, onDragMove, isDragging } = useDragging(
		updateItem,
		visibleArea,
		selectedItems,
		stageWidth,
		stageHeight
	);

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

		const scaleFactor = event.deltaY > 0 ? 0.9 : 1.1;
		if (event.ctrlKey && viewContainerRef.current) {
			const newScaleX = Math.max(
				Math.min(viewContainerRef.current.scale.x * scaleFactor, 4),
				1
			);
			const newScaleY = Math.max(
				Math.min(viewContainerRef.current.scale.y * scaleFactor, 4),
				1
			);

			viewContainerRef.current.scale.set(newScaleX, newScaleY);

			// Update visibleArea scale
			// setVisibleArea((prevArea) => ({
			// 	...prevArea,
			// 	scale: { x: newScaleX, y: newScaleY },
			// }));

			return;
		}

		if (selectedItems.length > 0) {
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

	// useEffect(() => {
	// 	viewContainerRef.current.scale = new Point(visibleArea.scale.x, visibleArea.scale.x);
	// }, [visibleArea.scale]);

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

	const boxes = objects.map(({ id, position, scale, rotation, textureSrc, zIndex, alpha }) => {
		return (
			<Sprite
				key={id}
				texture={Texture.from(textureSrc)}
				alpha={alpha}
				position={position}
				rotation={rotation}
				scale={scale}
				zIndex={zIndex}
				cursor="pointer"
				eventMode="static"
				anchor={0.5}
				data-id={id}
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

	const onPointerMove = useCallback(
		(e: FederatedPointerEvent) => {
			e.preventDefault();
			isClickOnArea.current = false;

			if (isDragging.current) {
				onDragMove(e);
				return;
			}

			if (e.buttons === 2 && viewContainerRef.current) {
				const currentX = Math.abs(viewContainerRef.current.x);
				const currentY = Math.abs(viewContainerRef.current.y);

				viewContainerRef.current.position = {
					x: -Math.min(
						Math.max(currentX - e.movementX, 0),
						stageWidth - visibleSquareSize
					),
					y: -Math.min(
						Math.max(currentY - e.movementY, 0),
						stageHeight - visibleSquareSize
					),
				};
			}
		},
		[onDragMove, isDragging]
	);

	const onPointerUp = useCallback(
		(e: FederatedPointerEvent) => {
			if (!app) {
				return;
			}

			console.log(' pointerUp id', e.pointerId);
			app.stage.off('pointermove', onPointerMove);
			e.nativeEvent.target?.releasePointerCapture(e.pointerId);

			if (isDragging.current) {
				onDragEnd(e);
				return;
			}

			setVisibleArea((prevArea) => ({
				...prevArea,
				x: -viewContainerRef.current?.x,
				y: -viewContainerRef.current?.y,
			}));

			const isClickOnItem = e.target?.isSprite;
			if (!isClickOnArea.current || isClickOnItem) {
				return;
			}

			setSelectedItems([]);
		},
		[app, onDragEnd, onPointerMove, isDragging]
	);

	const onPointerUpOutside = useCallback(
		(e: FederatedPointerEvent) => {
			if (!app) {
				return;
			}

			app.stage.off('pointermove', onPointerMove);
			e.nativeEvent.target?.releasePointerCapture(e.pointerId);
			onDragEnd(e);
		},
		[app, onDragEnd, onPointerMove]
	);

	const onPointerDown = useCallback(
		(e: FederatedPointerEvent) => {
			if (!app) {
				return;
			}

			e.preventDefault();
			isClickOnArea.current = true;
			app.stage.on('pointermove', onPointerMove);

			const isClickOnItem = e.target?.isSprite;
			if (!isClickOnItem) {
				return;
			}

			onDragStart(e);
		},
		[app, onPointerMove, onDragStart]
	);

	const onPointerTap = useCallback((e: FederatedPointerEvent) => {
		if (isClickOnArea.current && e.target?.isSprite) {
			updateSelectedItems(e.target['data-id']);
			return;
		}
	}, []);

	// useEffect(() => {
	// 	if (!app) {
	// 		return;
	// 	}

	// 	// app.stage.hitArea = app.screen;
	// 	// app.stage.sortableChildren = true;
	// }, [app, onPointerUp, onPointerUpOutside]);

	const onMouseMove = useCallback(
		(e: FederatedPointerEvent) => {
			onAreaSelectionMouseMove(e);
		},
		[onAreaSelectionMouseMove]
	);

	const onMouseDown = useCallback(
		(e: FederatedPointerEvent) => {
			if (!app) {
				return;
			}

			onAreaSelectionMouseDown(e);

			// check pointer capture setPointerCapture
			app.stage.on('mousemove', onMouseMove);
		},
		[app, onAreaSelectionMouseDown, onMouseMove]
	);

	const onMouseUp = useCallback(
		(e: FederatedPointerEvent) => {
			if (!app) {
				return;
			}

			app.stage.off('mousemove', onMouseMove);

			onAreaSelectionMouseUp(e);
		},
		[app, onAreaSelectionMouseUp, onMouseMove]
	);

	const onMouseUpOutside = useCallback(
		(e: FederatedPointerEvent) => {
			if (!app) {
				return;
			}

			app.stage.off('mousemove', onMouseMove);

			onAreaSelectionMouseUp(e);
		},
		[onAreaSelectionMouseUp, app, onMouseMove]
	);

	console.log('rerender of editor');

	console.log('viewContainerRef.current', viewContainerRef.current?.scale);
	console.log('visibleArea', visibleArea.scale);

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
					justifyContent: 'center',
				}}
				// onMouseDown={handleMouseMove}
			>
				<Stage
					options={{
						backgroundColor: 0x000,
						eventMode: 'static',
						
					}}
					onContextMenu={(e) => e.preventDefault()}
					// onPointerDown={(e) => {
					// 	console.log('pointer down on stage');
					// }}
					// onPointerMove={handleMouseMove}
					width={visibleSquareSize}
					height={visibleSquareSize}
					onMount={setApp}
					ref={stageRef}
				>
					<Container
						sortableChildren={true}
						eventMode="static"
						pointerdown={onPointerDown}
						pointerup={onPointerUp}
						pointerupoutside={onPointerUpOutside}
						pointertap={onPointerTap}
						mousedown={onMouseDown}
						mouseup={onMouseUp}
						mouseupoutside={onMouseUpOutside}
						// position={{ x: -visibleArea.x, y: -visibleArea.y }}
						scale={{ x: visibleArea.scale.x, y: visibleArea.scale.y }}
						zIndex={1000}
						width={stageWidth}
						height={stageHeight}
						hitArea={new Rectangle(0, 0, stageWidth, stageHeight)}
						ref={viewContainerRef}
					>
						<Container>
							<Grid width={stageWidth} height={stageHeight} />
							<AreaSelectionComponent />
						</Container>
						{boxes}
					</Container>
				</Stage>

				{/* <TestStage /> */}
				{/* <div>
					<div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
						<img src={table4} width={120} height={220} />
						<button onClick={() => onAddObject('table4')}>Add table</button>
					</div>
					<div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
						<img src={seat} width={120} height={120} />
						<button onClick={() => onAddObject('seat')}>Add seat</button>
					</div>
				</div> */}
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

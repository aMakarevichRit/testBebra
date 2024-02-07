// eslint-disable-next-line
// @ts-ignore
import { useCallback, useEffect, useRef, useState } from 'react';
import { Stage, Container, Graphics, useApp } from '@pixi/react';
import { Texture, Sprite as PIXISprite, RoundedRectangle } from 'pixi.js';
import tableSmall from './assets/table2.png';
import table3 from './assets/table3.png';
import table4 from './assets/table4.png';
import seat from './assets/seat-v4.png';
import ErrorBoundary from './ErrorBoundary';
import DraggableBox from './DraggableBox';
import Rectangle from './Rectangle';
import DraggableBox2 from './DraggableBox2';

const idToTextureMap = {
	table: tableSmall,
	table3: table3,
	table4: table4,
	seat: seat,
};

const saveStateToJson = (objects) => {
	const state = objects.map(({ id, sprite: obj }) => {
		return {
			id,
			x: obj.x,
			y: obj.y,
			rotation: obj.rotation,
			scaleIndex: obj.scaleIndex,
			textureSource: obj.texture.textureCacheIds[0], // Assuming only one texture per sprite
		};
	});
	return JSON.stringify(state, null, 2);
};

const loadStateFromJson = (jsonString) => {
	const state = JSON.parse(jsonString);
	const loadedObjects = state.map(({ x, y, rotation, scaleIndex, textureSource, id }) => {
		const texture = Texture.from(textureSource);
		const sprite = new PIXISprite(texture);
		sprite.x = x;
		sprite.y = y;
		sprite.rotation = rotation;
		sprite.scaleIndex = scaleIndex;
		return { id, sprite };
	});
	// const loadedRefObjects = state.map(({ x, y, rotation, textureSource }) => {
	// 	const texture = Texture.from(textureSource);
	// 	const sprite = <Sprite texture={texture} x={x} y={y} rotation={rotation} />;
	// 	return sprite;
	// });
	return loadedObjects;
	// setRefObjects(loadedRefObjects);
};

const Editor = () => {
	const [objects, setObjects] = useState([]);
	const [json, setJson] = useState('');
	const [selected, setSelected] = useState({});
	const [isEditMode, setIsEditMode] = useState(false);
	console.log('test')
	// const [refObjects, setRefObjects] = useState([]);
	const [savedState, setSavedState] = useState('');
	useEffect(() => {
		const table = new PIXISprite(Texture.from(tableSmall));
		table.position = { x: 100, y: 100 };
		table.rotation = 0;
		table.scaleIndex = 0;

		const chair = new PIXISprite(Texture.from(seat));
		chair.position = { x: 200, y: 100 };
		chair.rotation = 0;
		chair.scaleIndex = 0;

		setObjects([
			{ id: 'table', sprite: table },
			{ id: 'chair', sprite: chair },
		]);
		// setRefObjects([
		// 	<Sprite texture={Texture.from(tableSmall)} />,
		// 	<Sprite texture={Texture.from(chairSmall)} />,
		// ]);
	}, []);

	useEffect(() => {
		const handleKeyDown = (event) => {
			if (event.key === 'Delete') {
				debugger;
				const updatetObjects = objects.filter((obj) => !selected[obj.id]);
				setObjects(updatetObjects);
			}
		};

		document.addEventListener('keydown', handleKeyDown);

		return () => {
			document.removeEventListener('keydown', handleKeyDown);
		};
	}, [objects, selected]);

	const handleDragEnd = useCallback((newState, index) => {
		setObjects((prevObjects) => {
			const updatedObjects = prevObjects.map(({ id, sprite: obj }, i) => {
				const updatedSprite = new PIXISprite(Texture.from(obj.texture.textureCacheIds[0]));

				if (i === index) {
					updatedSprite.position = newState.position;
					updatedSprite.rotation = newState.rotation;
					updatedSprite.scaleIndex = newState.scaleIndex;
				} else {
					updatedSprite.position = obj.position;
					updatedSprite.rotation = obj.rotation;
					updatedSprite.scaleIndex = obj.scaleIndex;
				}

				return {
					id,
					sprite: updatedSprite,
				};
			});
			return updatedObjects;
		});
	}, []);

	const onSaveState = useCallback(() => {
		const savedState = saveStateToJson(objects);
		setJson(savedState);
		setSavedState(savedState);
	}, [objects]);

	const onLoadState = useCallback(() => {
		setObjects([]);
		setTimeout(() => {
			const loadedObjects = loadStateFromJson(savedState);
			setObjects(loadedObjects);
		}, 100);
	}, [savedState]);

	const boxes = objects.map(({ id, sprite: obj }, index) => {
		function handleTap(e) {
			const updateSelected = { ...selected };
			if (updateSelected[id]) {
				delete updateSelected[id];
			} else {
				updateSelected[id] = id;
			}
			setSelected(updateSelected);
		}
		console.log('selected', selected);
		return (
			<DraggableBox
				key={id}
				texture={obj.texture}
				x={obj.position.x}
				y={obj.position.y}
				rotation={obj.rotation}
				scaleIndex={obj.scaleIndex}
				onDragEnd={(newState) => handleDragEnd(newState, index)}
				cursor="pointer"
				pointertap={handleTap}
				tint={selected[id] ? '#F43F5E' : 0xffffff}
			/>
		);
	});

	const onAddObject = useCallback((type) => {
		const sprite = new PIXISprite(Texture.from(idToTextureMap[type]));
		sprite.width = 400;
		sprite.height = 400;
		sprite.position = { x: 100, y: 100 };
		sprite.rotation = 0;
		sprite.scaleIndex = 0;

		setObjects((prevObjects) => [...prevObjects, { id: prevObjects.length, sprite }]);
	}, []);

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
						backgroundColor: 0x1d2330,
					}}
					raf={false}
					onContextMenu={(e) => e.preventDefault()}
					onPointerDown={(e) => e.preventDefault()}
					renderOnComponentChange={true}
					width={1100}
					height={780}
				>
					<Container sortableChildren={true} eventMode="static">
						{boxes}
						{/* <ResizableBox texture={Texture.from(table3)} x={300} y={300} /> */}
						{/* <ResizableBox texture={Texture.from(chairSmall)} x={400} y={300} /> */}
					</Container>
				</Stage>

				<div>
					<div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
						<img src={tableSmall} width={120} height={120} />
						<button onClick={() => onAddObject('table')}>Add table</button>
					</div>
					<div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
						<img src={table4} width={120} height={120} />
						<button onClick={() => onAddObject('table4')}>Add table</button>
					</div>
					<div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
						<img src={seat} width={120} height={120} />
						<button onClick={() => onAddObject('seat')}>Add seat</button>
					</div>
				</div>
			</div>
			<pre style={{ maxHeight: '600px', height: '100%' }}>{json}</pre>
		</div>
	);
};

const EditorWithErrorBoundary = () => (
	<ErrorBoundary>
		<Editor />
	</ErrorBoundary>
);

export default EditorWithErrorBoundary;

// eslint-disable-next-line
// @ts-ignore
import { useCallback, useEffect, useRef, useState } from 'react';
import { Stage, Container, Sprite, render } from '@pixi/react';
import { Texture, Sprite as PIXISprite } from 'pixi.js';
import tableSmall from './assets/round_table_small.png';
import chairSmall from './assets/chair_small.png';
import ErrorBoundary from './ErrorBoundary';
import DraggableBox from './DraggableBox';

const width = 800;
const height = 500;

const saveStateToJson = (objects) => {
	debugger;
	console.log('objects is here', objects);
	const state = objects.map(({ id, sprite: obj }) => {
		console.log({
			id,
			x: obj.x,
			y: obj.y,
			rotation: obj.rotation,
			scaleIndex: obj.scaleIndex,
			textureSource: obj.texture.textureCacheIds[0], // Assuming only one texture per sprite
		});

		return {
			id,
			x: obj.x,
			y: obj.y,
			rotation: obj.rotation,
			scaleIndex: obj.scaleIndex,
			textureSource: obj.texture.textureCacheIds[0], // Assuming only one texture per sprite
		};
	});
	return JSON.stringify(state);
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
	// const [refObjects, setRefObjects] = useState([]);
	const [savedState, setSavedState] = useState('');
	const appRef = useRef(null);
	useEffect(() => {
		const table = new PIXISprite(Texture.from(tableSmall));
		table.position = { x: 100, y: 100 };
		table.rotation = 0;
		table.scaleIndex = 0;

		const chair = new PIXISprite(Texture.from(chairSmall));
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
		render(<Editor />, appRef.current);
		render(<Editor />, appRef.current);
		render(<Editor />, appRef.current);
	}, []);

	const handleDragEnd = useCallback((newState, index) => {
		setObjects((prevObjects) => {
			const updatedObjects = prevObjects.map(({ id, sprite: obj }, i) => {
				debugger;
				const updatedSprite = new PIXISprite(Texture.from(obj.texture.textureCacheIds[0]));

				if (i === index) {
					console.log('newState is here', newState);
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
		// console.log('obj is here', obj);
		debugger;
		return (
			<DraggableBox
				key={id}
				texture={obj.texture}
				x={obj.position.x}
				y={obj.position.y}
				rotation={obj.rotation}
				scaleIndex={obj.scaleIndex}
				onDragEnd={(newState) => handleDragEnd(newState, index)}
			/>
		);
	});

	const onAddObject = useCallback((type) => {
		const sprite = new PIXISprite(Texture.from(type === 'table' ? tableSmall : 'chairSmall'));
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
					height: '100%',
				}}
			>
				<Stage
					style={{ flex: 1, height: window.innerHeight }}
					options={{ backgroundColor: 0x1d2330 }}
					raf={false}
					onContextMenu={(e) => e.preventDefault()}
					onPointerDown={(e) => e.preventDefault()}
					width={width} height={height}
				>
					<Container ref={appRef} sortableChildren={true}>{boxes}</Container>
				</Stage>
				{/* <div>
					<div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
						<img src={tableSmall} width={120} height={120} />
						<button onClick={() => onAddObject('table')}>Add table</button>
					</div>
					<div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
						<img src={chairSmall} width={120} height={120} />
						<button onClick={() => onAddObject('chair')}>Add chair</button>
					</div>
				</div> */}
			</div>
		</div>
	);
};

const EditorWithErrorBoundary = () => (
	<ErrorBoundary>
		<Editor />
	</ErrorBoundary>
);

export default EditorWithErrorBoundary;

{
	/* <Container sortableChildren={true} interactive={true}>
				<DraggableBox
					x={100}
					y={100}
					texture={Texture.from(tableSmall)}
					containerRef={containerRef}
				/>
				<DraggableBox
					x={200}
					y={100}
					texture={Texture.from(chairSmall)}
					containerRef={containerRef}
				/>
				<DraggableBox
					x={300}
					y={100}
					texture={Texture.from(tableSmall)}
					containerRef={containerRef}
				/>
			</Container> */
}

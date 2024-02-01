import { useEffect, useState } from 'react';
import { Stage, Container, Sprite } from '@pixi/react';
import { Texture, Sprite as PIXISprite } from 'pixi.js';
import tableSmall from './assets/round_table_small.png';
import chairSmall from './assets/chair_small.png';
import ErrorBoundary from './ErrorBoundary';
import DraggableBox from './DraggableBox';

let savedState;

const Editor = () => {
	const [objects, setObjects] = useState([]);

	const saveStateToJson = () => {
		debugger;
		console.log('objects is here', objects);
		const state = objects.map((obj) => {
			console.log({
				x: obj.x,
				y: obj.y,
				rotation: obj.rotation,
				textureSource: obj.texture.textureCacheIds[0], // Assuming only one texture per sprite
			});

			return {
				x: obj.x,
				y: obj.y,
				rotation: obj.rotation,
				textureSource: obj.texture.textureCacheIds[0], // Assuming only one texture per sprite
			};
		});
		return JSON.stringify(state);
	};

	const loadStateFromJson = (jsonString) => {
		const state = JSON.parse(jsonString);
		const loadedObjects = state.map(({ x, y, rotation, textureSource }) => {
			const texture = Texture.from(textureSource);
			const sprite = new PIXISprite(texture);
			sprite.x = x;
			sprite.y = y;
			sprite.rotation = rotation;
			return sprite;
		});
		setObjects(loadedObjects);
	};

	useEffect(() => {
		setObjects([
			new PIXISprite(Texture.from(tableSmall)),
			new PIXISprite(Texture.from(chairSmall)),
		]);
	}, []);

	return (
		<>
			<button
				onClick={() => {
					savedState = saveStateToJson();
				}}
			>
				Save State
			</button>
			<button onClick={() => loadStateFromJson(savedState)}>Load State</button>
			<Stage
				options={{ backgroundColor: 0x1d2330, resizeTo: window }}
				width={window.innerWidth}
				height={window.innerHeight}
				raf={false}
				onContextMenu={(e) => e.preventDefault()}
			>
				{/* <Container sortableChildren={true} interactive={true}>
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
			</Container> */}
				<Container>
					{objects.map((obj, index) => (
						<DraggableBox
							key={index}
							texture={obj.texture}
							x={obj.x}
							y={obj.y}
							rotation={obj.rotation}
						/>
					))}
				</Container>
			</Stage>
		</>
	);
};

const EditorWithErrorBoundary = () => (
	<ErrorBoundary>
		<Editor />
	</ErrorBoundary>
);

export default EditorWithErrorBoundary;

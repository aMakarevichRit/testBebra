import { Sprite, Stage } from '@pixi/react';
import Viewport from './components/Viewport';

const EditorViewport = () => {
	const width = 800;
	const height = 800;
	return (
		<div>
			<Stage
				width={width}
				height={height}
				options={{ backgroundColor: 0x1099bb, eventMode: 'static' }}
			>
				<Viewport width={width} height={height}>
					<Sprite
						image={'https://pixijs.com/assets/bunny.png'}
						x={20}
						y={20}
						anchor={0.5}
					/>
					<Sprite
						image={'https://pixijs.com/assets/bunny.png'}
						x={180}
						y={20}
						anchor={0.5}
					/>
					<Sprite
						image={'https://pixijs.com/assets/bunny.png'}
						x={20}
						y={180}
						anchor={0.5}
					/>
					<Sprite
						image={'https://pixijs.com/assets/bunny.png'}
						x={180}
						y={180}
						anchor={0.5}
					/>
					<Sprite
						image={'https://pixijs.com/assets/bunny.png'}
						x={100}
						y={100}
						anchor={0.5}
					/>
				</Viewport>
			</Stage>
		</div>
	);
};

export default EditorViewport;

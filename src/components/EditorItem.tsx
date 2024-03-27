import { useRef } from 'react';
import { Graphics as GraphicsComponent, Sprite as ReactSprite } from '@pixi/react';
import { Graphics, Sprite, Texture } from 'pixi.js';
import deleteTexture from '../assets/delete.png';
import rotateTexture from '../assets/rotate.png';
import copyTexture from '../assets/copy.png';

interface Props {}

const ICON_SIZE = 20;
const BORDER_PADDING = 30;

const EditorItem = ({ isSelected, viewContainerRef, ...props }: Props) => {
	const itemRef = useRef<Sprite>(null);

	const drawContainer = (g: Graphics) => {
		if (!itemRef.current || !g) {
			return;
		}

		const width = itemRef.current.width;
		const height = itemRef.current.height;
		console.log('width', width, height);
		// Calculate border position and size considering scale and padding
		const scaleX = itemRef.current.scale.x;
		const scaleY = itemRef.current.scale.y;

		const borderX = (-BORDER_PADDING * scaleX) / 2;
		const borderY = (-BORDER_PADDING * scaleY) / 2;
		const borderWidth = (width + BORDER_PADDING) * scaleX;
		const borderHeight = (height + BORDER_PADDING) * scaleY;

		g.clear();
		g.lineStyle(2, 0xadd8e6, 1);
		g.drawRoundedRect(borderX, borderY, borderWidth, borderHeight, 16);
	};

	console.log('rerender of sprite');

	if (!isSelected) {
		return <ReactSprite {...props} ref={itemRef} />;
	}

	return (
		<ReactSprite {...props} ref={itemRef}>
			<GraphicsComponent draw={drawContainer} />
			<ReactSprite
				texture={Texture.from(rotateTexture)}
				x={-BORDER_PADDING}
				y={-BORDER_PADDING - ICON_SIZE}
				onclick={() => console.log('rotate')}
				cursor="pointer"
				width={ICON_SIZE}
				height={ICON_SIZE}
			/>
			<ReactSprite
				texture={Texture.from(deleteTexture)}
				x={itemRef.current?.width - ICON_SIZE / 2}
				y={-BORDER_PADDING - ICON_SIZE}
				onclick={() => console.log('delete')}
				cursor="pointer"
				width={ICON_SIZE}
				height={ICON_SIZE}
			/>
			<ReactSprite
				texture={Texture.from(copyTexture)}
				x={-BORDER_PADDING / 2 + itemRef.current?.width / 2 - ICON_SIZE / 2}
				y={itemRef.current?.height - BORDER_PADDING / 2 + ICON_SIZE / 2}
				onclick={() => console.log('delete')}
				cursor="pointer"
				width={ICON_SIZE}
				height={ICON_SIZE}
			/>
		</ReactSprite>
	);
};

export { EditorItem };

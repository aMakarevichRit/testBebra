import { useRef } from 'react';
import { Graphics as GraphicsComponent, Sprite as ReactSprite } from '@pixi/react';
import { Graphics, Sprite, Texture } from 'pixi.js';
import deleteTexture from '../assets/delete.png';
import rotateTexture from '../assets/rotate.png';
import copyTexture from '../assets/copy.png';

interface Props {
	isSelected: boolean;
	// Additional props may include position, scale, etc.
}

const ICON_SIZE = 80;
const BORDER_PADDING = 50;

const EditorItem = ({ isSelected, viewContainerRef, ...props }: Props) => {
	const itemRef = useRef<Sprite>(null);
	const iconRef = useRef<Sprite>(null);
	const borderRef = useRef<Graphics>(null);

	const { width, height } = itemRef.current?.texture || { width: 0, height: 0 };

	console.log('rotation', itemRef.current?.rotation, itemRef.current?.worldTransform);
	console.log('icon rotation', iconRef.current?.rotation, iconRef.current?.worldTransform);
	console.log('border rotation', borderRef.current?.rotation);

	const drawContainer = (g: Graphics) => {
		if (!itemRef.current || !g) {
			return;
		}

		g.clear();
		g.lineStyle(10, 0xadd8e6, 1);
		g.drawRoundedRect(
			-width / 2 - BORDER_PADDING,
			-height / 2 - BORDER_PADDING,
			width + BORDER_PADDING * 2,
			height + BORDER_PADDING * 2,
			36
		);
	};

	if (!isSelected) {
		return <ReactSprite {...props} ref={itemRef} />;
	}

	const childRotation =
		itemRef.current?.rotation !== undefined
			? -((itemRef.current.rotation + Math.PI / 2) % (Math.PI * 2))
			: 0;

	return (
		<ReactSprite {...props} ref={itemRef}>
			<GraphicsComponent draw={drawContainer} ref={borderRef} rotation={childRotation} />
			<ReactSprite
				texture={Texture.from(rotateTexture)}
				onclick={() => console.log('rotate')}
				cursor="pointer"
				width={ICON_SIZE}
				height={ICON_SIZE}
				x={-width / 2 - ICON_SIZE / 2 - BORDER_PADDING}
				y={-height / 2 - ICON_SIZE / 2 - BORDER_PADDING}
				ref={iconRef}
				rotation={childRotation}
			/>
			<ReactSprite
				texture={Texture.from(deleteTexture)}
				onclick={() => console.log('delete')}
				cursor="pointer"
				width={ICON_SIZE}
				height={ICON_SIZE}
				x={width / 2 - ICON_SIZE / 2 + BORDER_PADDING}
				y={-height / 2 - ICON_SIZE / 2 - BORDER_PADDING}
				rotation={childRotation}
			/>
			<ReactSprite
				texture={Texture.from(copyTexture)}
				onclick={() => console.log('copy')}
				cursor="pointer"
				width={ICON_SIZE}
				height={ICON_SIZE}
				x={-ICON_SIZE / 2}
				y={height / 2 + BORDER_PADDING - ICON_SIZE / 2}
				rotation={childRotation}
			/>
		</ReactSprite>
	);
};

export { EditorItem };

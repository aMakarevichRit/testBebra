import { useContext, useRef } from 'react';
import { Container, Graphics as GraphicsComponent, Sprite as ReactSprite } from '@pixi/react';
import { Graphics, Sprite, Texture } from 'pixi.js';
import deleteTexture from '../assets/delete.png';
import rotateTexture from '../assets/rotate.png';
import copyTexture from '../assets/copy.png';
import { CoordinatesContext } from './ItemsContext';

interface Props {}

const ICON_SIZE = 20;
const BORDER_PADDING = 30;

const EditorItem = ({ isSelected, viewContainerRef, ...props }: Props) => {
	const itemRef = useRef<Sprite>(null);
	const containerRef = useRef(null);
	const bounds = useRef({ x: 0, y: 0 });
	const iconRefs = useRef([null, null, null]);

	const drawContainer = (g: Graphics) => {
		if (!itemRef.current || !g) {
			return;
		}

		const itemBounds = itemRef.current.getBounds();
		const local = viewContainerRef.current.toLocal({ x: itemBounds.x, y: itemBounds.y });
		bounds.x = local.x;
		bounds.y = local.y;
		// setBounds({ x: local.x, y: local.y });
		g.clear();
		g.lineStyle(2, 0xadd8e6, 1);
		g.drawRoundedRect(
			bounds.x - BORDER_PADDING / 2,
			bounds.y - BORDER_PADDING / 2,
			bounds.width + BORDER_PADDING,
			bounds.height + BORDER_PADDING,
			16
		);
	};
	console.log('rerender of sprite');

	if (!isSelected) {
		return <ReactSprite {...props} ref={itemRef} />;
	}

	return (
		<Container ref={containerRef}>
			<ReactSprite {...props} ref={itemRef} />
			<GraphicsComponent draw={drawContainer} />
			<ReactSprite
				texture={Texture.from(rotateTexture)}
				x={bounds.x - BORDER_PADDING / 2 - ICON_SIZE / 2}
				y={bounds.y - BORDER_PADDING / 2}
				onclick={() => console.log('rotate')}
				cursor="pointer"
				width={ICON_SIZE}
				height={ICON_SIZE}
				ref={iconRefs[0]}
			/>
			<ReactSprite
				texture={Texture.from(deleteTexture)}
				x={bounds.x + itemRef.current?.width}
				y={bounds.y - BORDER_PADDING / 2}
				onclick={() => console.log('delete')}
				cursor="pointer"
				width={ICON_SIZE}
				height={ICON_SIZE}
				ref={iconRefs[1]}
			/>
			<ReactSprite
				texture={Texture.from(copyTexture)}
				x={bounds.x + itemRef.current?.width / 2 - ICON_SIZE / 2}
				y={bounds.y + itemRef.current?.height + ICON_SIZE / 2}
				onclick={() => console.log('delete')}
				cursor="pointer"
				width={ICON_SIZE}
				height={ICON_SIZE}
				ref={iconRefs[2]}
			/>
		</Container>
	);
};

export { EditorItem };

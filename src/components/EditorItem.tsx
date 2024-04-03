import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { Graphics as GraphicsComponent, Sprite as ReactSprite, useApp } from '@pixi/react';
import { Sprite, Texture } from 'pixi.js';
import deleteTexture from '../assets/delete.png';
import rotateTexture from '../assets/rotate.png';
import copyTexture from '../assets/copy.png';
import { DashLineShader, SmoothGraphics } from '@pixi/graphics-smooth';

interface Props {
	isSelected: boolean;
	// Additional props may include position, scale, etc.
}

const ICON_SIZE = 110;
const BORDER_PADDING = 60;

const EditorItem = ({
	isSelected,
	viewContainerRef,
	rotation,
	onCopy,
	onDelete,
	onRotate,
	width,
	height,
	...props
}: Props) => {
	const dataId = props['data-id'];
	const shader = useRef<DashLineShader | null>(null);
	const smoothGraphics = useRef<SmoothGraphics | null>(null);
	const itemRef = useRef<Sprite>(null);

	debugger;
	// const { width, height } = itemRef.current?.texture || { width: 100, height: 100 };
	console.log(width, height);

	const drawContainer = useCallback((height, width) => {
		if (!itemRef.current || !smoothGraphics.current || !shader.current) {
			return;
		}

		smoothGraphics.current.clear();
		smoothGraphics.current.lineStyle({ width: 8, color: 0xadd8e6, shader: shader.current });
		smoothGraphics.current.drawRoundedRect(
			-width / 2 - BORDER_PADDING,
			-height / 2 - BORDER_PADDING,
			width + BORDER_PADDING * 2,
			height + BORDER_PADDING * 2,
			36
		);
	}, []);

	useEffect(() => {
		if (!itemRef.current) {
			return;
		}

		const container = itemRef.current;
		shader.current = new DashLineShader({ dash: 24, gap: 12 });
		smoothGraphics.current = new SmoothGraphics();
		container.addChild(smoothGraphics.current);

		return () => {
			if (!smoothGraphics.current) {
				return;
			}

			container.removeChild(smoothGraphics.current);
		};
	}, []);

	useEffect(() => {
		if (isSelected) {
			drawContainer(height, width);
		} else {
			smoothGraphics.current?.clear();
		}
	}, [drawContainer, isSelected, height, width]);

	console.log('rerender of editor item');

	if (!isSelected) {
		return <ReactSprite {...props} ref={itemRef} />;
	}

	return (
		<ReactSprite
			{...props}
			data-id={dataId}
			ref={itemRef}
			rotation={rotation}
			sortableChildren={true}
		>
			<GraphicsComponent draw={() => drawContainer(height, width)} />
			<ReactSprite
				texture={Texture.from(rotateTexture)}
				onclick={() => onRotate(dataId)}
				cursor="pointer"
				width={ICON_SIZE}
				height={ICON_SIZE}
				x={-width / 2 - ICON_SIZE / 2}
				y={-height / 2 - ICON_SIZE / 2}
				rotation={-rotation}
				anchor={0.5}
				zIndex={1000}
			/>
			<ReactSprite
				texture={Texture.from(deleteTexture)}
				onclick={() => onDelete(dataId)}
				cursor="pointer"
				width={ICON_SIZE}
				height={ICON_SIZE}
				x={width / 2 + ICON_SIZE / 2}
				y={-height / 2 - ICON_SIZE / 2}
				rotation={-rotation}
				anchor={0.5}
				zIndex={1000}
			/>
			<ReactSprite
				texture={Texture.from(copyTexture)}
				onclick={() => onCopy(dataId)}
				cursor="pointer"
				width={ICON_SIZE}
				height={ICON_SIZE}
				y={height / 2 + (ICON_SIZE / 8) * 5}
				rotation={-rotation}
				anchor={0.5}
				zIndex={1000}
			/>
		</ReactSprite>
	);
};
export { EditorItem };

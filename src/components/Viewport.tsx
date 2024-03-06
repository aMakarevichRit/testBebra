import React, { forwardRef } from 'react';
import * as PIXI from 'pixi.js';
import { PixiComponent, useApp } from '@pixi/react';
import { Viewport as PixiViewport } from 'pixi-viewport';
import { EventSystem } from '@pixi/events';
import { Container as PixiContainer } from '@pixi/display';

export interface ViewportProps {
	width: number;
	height: number;
	screenHeight: number;
	screenWidth: number;
	children?: React.ReactNode;
}

export interface PixiComponentViewportProps extends ViewportProps {
	app: PIXI.Application;
}

const PixiComponentViewport = PixiComponent('Viewport', {
	create: (props: PixiComponentViewportProps) => {
		const events = new EventSystem(props.app.renderer);
		events.domElement = props.app.renderer.view as any;

		const { width: worldWidth, height: worldHeight, screenHeight, screenWidth } = props;

		const viewport = new PixiViewport({
			worldWidth,
			worldHeight,
			passiveWheel: false,
			events,
			disableOnContextMenu: true,
		});

		viewport
			.clamp({
				direction: 'all',
			})
			.clampZoom({
				minHeight: screenHeight / 10,
				minWidth: screenWidth / 10,
				maxHeight: worldHeight,
				maxWidth: worldWidth,
			})
			.drag({
				pressDrag: true,
				keyToPress: ['ShiftLeft', ''],
			})
			.wheel({
				percent: 0.1, // smooth the zooming by providing the number of frames to zoom between wheel spins
				interrupt: true, // stop smoothing with any user input on the viewport
			});

		return viewport;
	},
});

const Viewport = forwardRef((props: ViewportProps, ref: React.Ref<PixiViewport>) => {
	const app = useApp();
	return <PixiComponentViewport ref={ref} app={app} {...props} />;
});

export default Viewport;

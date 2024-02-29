import { Graphics, Point, Rectangle } from 'pixi.js';
import { useCallback, useRef } from 'react';
import { Graphics as GraphicsComponent } from '@pixi/react';

const useAreaSelection = (stage, setSelectedItems) => {
	const endPoint = useRef(null);
	const startPoint = useRef(null);
	const graphicsRef = useRef(null);

	const drawSelectionRectangle = useCallback(
		(graphics: Graphics) => {
			if (!startPoint.current || !endPoint.current || !stage) {
				graphics.clear();
				return;
			}

			if (graphics && startPoint.current && endPoint.current) {
				const globalPos1 = stage.toLocal(
					new Point(startPoint.current.x, startPoint.current.y),
					stage
				);
				const globalPos2 = stage.toLocal(
					new Point(endPoint.current.x, endPoint.current.y),
					stage
				);

				const selectionRect = new Rectangle(
					Math.min(globalPos1.x, globalPos2.x),
					Math.min(globalPos1.y, globalPos2.y),
					Math.abs(globalPos1.x - globalPos2.x),
					Math.abs(globalPos1.y - globalPos2.y)
				);

				graphics.clear();
				graphics.beginFill(0x0077ff, 0.3);
				graphics.lineStyle(2, 0x0077ff);
				graphics.drawRoundedRect(
					selectionRect.x,
					selectionRect.y,
					selectionRect.width,
					selectionRect.height,
					4
				);
			}
		},
		[stage]
	);

	const handleMouseMove = useCallback(
		(e) => {
			endPoint.current = { x: e.global.x, y: e.global.y };
			drawSelectionRectangle(graphicsRef.current);
		},
		[endPoint, drawSelectionRectangle]
	);

	const handleMouseDown = useCallback(
		(e) => {
			if (e.target.isSprite) {
				return;
			}
			startPoint.current = { x: e.global.x, y: e.global.y };
			stage.on('pointermove', handleMouseMove);
		},
		[stage, handleMouseMove, startPoint]
	);

	const handleMouseUp = useCallback(() => {
		console.log('updateCoordinates', startPoint.current, endPoint.current);
		if (startPoint.current && endPoint.current && stage) {
			const selected = [];
			const selectionRect = new Rectangle(
				Math.min(startPoint.current.x, endPoint.current.x),
				Math.min(startPoint.current.y, endPoint.current.y),
				Math.abs(startPoint.current.x - endPoint.current.x),
				Math.abs(startPoint.current.y - endPoint.current.y)
			);

			stage.children[1].children.forEach((child) => {
				if (child.getBounds().intersects(selectionRect)) {
					selected.push(child);
				}
			});
			debugger;
			setSelectedItems(
				selected.filter((item) => item.isSprite).map((item) => item['data-id'])
			);
		}

		stage.off('pointermove', handleMouseMove);
		startPoint.current = null;
		endPoint.current = null;
	}, [stage, handleMouseMove, setSelectedItems]);

	const AreaSelectionComponent = () => (
		<GraphicsComponent draw={drawSelectionRectangle} ref={graphicsRef} zIndex={100} />
	);

	return {
		handleMouseUp,
		handleMouseDown,
		AreaSelectionComponent,
	};
};

export { useAreaSelection };
import { Graphics, Point, Rectangle } from 'pixi.js';
import { useCallback, useRef } from 'react';
import { Graphics as GraphicsComponent } from '@pixi/react';

const useAreaSelection = (stage, setSelectedItems, viewContainerRef) => {
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
			if (!viewContainerRef.current) {
				return;
			}

			const local = viewContainerRef.current.toLocal(e.global);
			endPoint.current = { x: local.x, y: local.y };
			drawSelectionRectangle(graphicsRef.current);
		},
		[endPoint, drawSelectionRectangle, viewContainerRef]
	);

	const handleMouseDown = useCallback(
		(e) => {
			if (e.target.isSprite || !viewContainerRef.current) {
				return;
			}

			const local = viewContainerRef.current.toLocal(e.global);
			startPoint.current = { x: local.x, y: local.y };
		},
		[startPoint, viewContainerRef]
	);

	const handleMouseUp = useCallback(
		(e) => {
			if (startPoint.current && endPoint.current && viewContainerRef.current) {
				const selected = [];
				const selectionRect = new Rectangle(
					Math.min(startPoint.current.x, endPoint.current.x),
					Math.min(startPoint.current.y, endPoint.current.y),
					Math.abs(startPoint.current.x - endPoint.current.x),
					Math.abs(startPoint.current.y - endPoint.current.y)
				);

				viewContainerRef.current.children
					.filter((item) => item.isSprite)
					.forEach((child) => {
						const local = viewContainerRef.current.toLocal(child.getBounds());
						const childRect = new Rectangle(
							local.x,
							local.y,
							child.width,
							child.height
						);
						if (childRect.intersects(selectionRect)) {
							selected.push(child);
						}
					});

				setSelectedItems(selected.map((item) => item['data-id']));
			}

			startPoint.current = null;
			endPoint.current = null;
		},
		[viewContainerRef, setSelectedItems]
	);

	const AreaSelectionComponent = () => (
		<GraphicsComponent draw={drawSelectionRectangle} ref={graphicsRef} zIndex={100} />
	);

	return {
		onAreaSelectionMouseUp: handleMouseUp,
		onAreaSelectionMouseDown: handleMouseDown,
		onAreaSelectionMouseMove: handleMouseMove,
		AreaSelectionComponent,
	};
};

export { useAreaSelection };

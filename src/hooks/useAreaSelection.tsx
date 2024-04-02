import { Point, Rectangle } from 'pixi.js';
import { useCallback, useRef } from 'react';
import { DashLineShader, SmoothGraphics } from '@pixi/graphics-smooth';

const useAreaSelection = (setSelectedItems, stage, viewContainerRef) => {
	const endPoint = useRef(null);
	const startPoint = useRef(null);
	const shader = useRef<DashLineShader | null>(null);
	const smoothGraphics = useRef<SmoothGraphics | null>(null);

	const drawSelectionRectangle = useCallback(() => {
		const graphics = smoothGraphics.current;
		if (!graphics || !shader.current) {
			return;
		}

		if (!startPoint.current || !endPoint.current) {
			graphics.clear();
			return;
		}

		if (graphics && startPoint.current && endPoint.current) {
			const globalPos1 = stage.toLocal(new Point(startPoint.current.x, startPoint.current.y));
			const globalPos2 = stage.toLocal(new Point(endPoint.current.x, endPoint.current.y));

			const selectionRect = new Rectangle(
				Math.min(globalPos1.x, globalPos2.x),
				Math.min(globalPos1.y, globalPos2.y),
				Math.abs(globalPos1.x - globalPos2.x),
				Math.abs(globalPos1.y - globalPos2.y)
			);

			graphics.clear();
			graphics.beginFill(0xadd8e6, 0.3);
			graphics.lineStyle({ width: 2, color: 0xadd8e6, shader: shader.current });
			graphics.drawRoundedRect(
				selectionRect.x,
				selectionRect.y,
				selectionRect.width,
				selectionRect.height,
				4
			);
		}
	}, [stage]);

	const handleMouseMove = useCallback(
		(e) => {
			if (!viewContainerRef.current) {
				return;
			}

			const local = viewContainerRef.current.toLocal(e.global);
			endPoint.current = { x: local.x, y: local.y };
			drawSelectionRectangle();
		},
		[endPoint, drawSelectionRectangle, viewContainerRef]
	);

	const handleMouseDown = useCallback(
		(e) => {
			if (e.target.isSprite || !viewContainerRef.current) {
				return;
			}

			shader.current = new DashLineShader({ dash: 36, gap: 6 });
			smoothGraphics.current = new SmoothGraphics();
			viewContainerRef.current.addChild(smoothGraphics.current);

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
			viewContainerRef.current.removeChild(smoothGraphics.current);
		},
		[viewContainerRef, setSelectedItems]
	);

	return {
		onAreaSelectionMouseUp: handleMouseUp,
		onAreaSelectionMouseDown: handleMouseDown,
		onAreaSelectionMouseMove: handleMouseMove,
	};
};

export { useAreaSelection };

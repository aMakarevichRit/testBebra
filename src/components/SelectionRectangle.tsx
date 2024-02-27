import { useContext } from 'react';
import { Graphics as GraphicsComponent, useApp } from '@pixi/react';
import { Graphics, Point, Rectangle } from 'pixi.js';
import { AreaSelectionContext } from './AreaSelectionContext';

const SelectionRectangle = () => {
	const app = useApp();
	const {
		coordinates: { startPoint, endPoint },
	} = useContext(AreaSelectionContext);

	console.log('startPoint', startPoint);
	console.log('endPoint', endPoint);

	const drawSelectionRectangle = (graphics: Graphics) => {
		if (!startPoint || !endPoint || !app) {
			graphics.clear();
			return;
		}

		const { stage } = app;
		if (graphics && startPoint && endPoint) {
			const globalPos1 = stage.toLocal(new Point(startPoint.x, startPoint.y), stage);
			const globalPos2 = stage.toLocal(new Point(endPoint.x, endPoint.y), stage);

			const selectionRect = new Rectangle(
				Math.min(globalPos1.x, globalPos2.x),
				Math.min(globalPos1.y, globalPos2.y),
				Math.abs(globalPos1.x - globalPos2.x),
				Math.abs(globalPos1.y - globalPos2.y)
			);

			graphics.clear();
			graphics.lineStyle(2, 0xff0000);
			graphics.drawRect(
				selectionRect.x,
				selectionRect.y,
				selectionRect.width,
				selectionRect.height
			);
		}
	};

	return <GraphicsComponent draw={drawSelectionRectangle} zIndex={10000} />;
};

export default SelectionRectangle;

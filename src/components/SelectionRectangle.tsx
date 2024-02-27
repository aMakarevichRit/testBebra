import { useState } from 'react';
import { Graphics, useApp } from '@pixi/react';
import { Point, Rectangle } from 'pixi.js';
import { useAreaSelection } from '../hooks/useAreaSelection';

const SelectionRectangle = ({ stage, startPoint, endPoint, ...props }) => {
	const app = useApp();
	const [graphics, setGraphics] = useState(null);

	const drawSelectionRectangle = (graphics) => {
		if (!startPoint || !endPoint) {
			graphics.clear();
			return;
		}

		if (graphics && startPoint && endPoint && stage) {
			const globalPos1 = app?.stage.toLocal(new Point(startPoint.x, startPoint.y), stage);
			const globalPos2 = app?.stage.toLocal(new Point(endPoint.x, endPoint.y), stage);

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

	return (
		<Graphics
			draw={(g) => {
				setGraphics(g);
				drawSelectionRectangle(g);
			}}
			zIndex={10000}
		/>
	);
};

export default SelectionRectangle;

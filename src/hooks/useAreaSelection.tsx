import { Point, Rectangle } from 'pixi.js';
import { useCallback, useState } from 'react';

const useAreaSelection = (stage) => {
	const [selectedItems, setSelectedItems] = useState([]);
	const [startPoint, setStartPoint] = useState(null);
	const [endPoint, setEndPoint] = useState(null);

	const handleMouseMove = useCallback(
		(e) => {
			console.log('mouse move');
			if (e.target) {
				const globalPos = stage.toLocal(new Point(e.clientX, e.clientY), stage);
				console.log('globalPos', globalPos, 'client pos', e.clientX, e.clientY);
				setEndPoint({ x: globalPos.x, y: globalPos.y });
			}
		},
		[stage]
	);

	const handleMouseDown = useCallback(
		(e) => {
			let test = stage;
			// debugger;
			console.log('mouse down');
			const globalPos = stage.toLocal(new Point(e.clientX, e.clientY), stage);
			console.log('globalPos', globalPos, 'client pos', e.clientX, e.clientY);
			setStartPoint({ x: globalPos.x, y: globalPos.y });
			stage.on('pointermove', handleMouseMove);
		},
		[handleMouseMove, stage]
	);

	const handleMouseUp = useCallback(() => {
		console.log('mouse up');
		if (startPoint && endPoint) {
			const selected = [];
			const selectionRect = new Rectangle(
				Math.min(startPoint.x, endPoint.x),
				Math.min(startPoint.y, endPoint.y),
				Math.abs(startPoint.x - endPoint.x),
				Math.abs(startPoint.y - endPoint.y)
			);

			stage.children.forEach((child) => {
				if (child.getBounds().intersects(selectionRect)) {
					selected.push(child);
				}
			});

			setSelectedItems(selected);
			stage.off('pointermove', handleMouseMove);
		}

		setStartPoint(null);
		setEndPoint(null);
	}, [endPoint, startPoint, stage, handleMouseMove]);

	return {
		handleMouseMove,
		handleMouseUp,
		handleMouseDown,
		selectedItems,
	};
};

export { useAreaSelection };

import { Rectangle } from 'pixi.js';
import { useCallback, useState } from 'react';

const useAreaSelection = (stage) => {
	const [selectedItems, setSelectedItems] = useState([]);
	const [startPoint, setStartPoint] = useState(null);
	const [endPoint, setEndPoint] = useState(null);

	const handleMouseTap = useCallback((e) => {
		// setStartPoint(null);
		// setEndPoint(null);
	}, []);

	const handleMouseMove = useCallback((e) => {
		console.log('move');
		if (e.target) {
			setEndPoint({ x: e.global.x, y: e.global.y });
		}
	}, []);

	const handleMouseDown = useCallback(
		(e) => {
			debugger;
			setStartPoint({ x: e.global.x, y: e.global.y });
			stage.on('pointermove', handleMouseMove);
		},
		[stage, handleMouseMove]
	);

	const handleMouseUp = useCallback(
		(e) => {
			debugger;
			if (startPoint && endPoint) {
				const selected = [];
				const selectionRect = new Rectangle(
					Math.min(startPoint.x, endPoint.x),
					Math.min(startPoint.y, endPoint.y),
					Math.abs(startPoint.x - endPoint.x),
					Math.abs(startPoint.y - endPoint.y)
				);

				stage.children[2].children.forEach((child) => {
					if (child.getBounds().intersects(selectionRect)) {
						selected.push(child);
					}
				});

				setSelectedItems(selected);
				console.log(selected);
			}

			stage.off('pointermove', handleMouseMove);
			setStartPoint(null);
			setEndPoint(null);
		},
		[startPoint, stage, handleMouseMove, endPoint]
	);

	return {
		handleMouseUp,
		handleMouseDown,
		handleMouseTap,
		selectedItems,
		startPoint,
		endPoint,
	};
};

export { useAreaSelection };

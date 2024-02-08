import { useState } from 'react';

const useAreaSelection = (stageRef) => {
	const [selectedItems, setSelectedItems] = useState([]);
	const [startPoint, setStartPoint] = useState(null);
	const [endPoint, setEndPoint] = useState(null);

	const handleMouseDown = (event) => {
        console.log('mouse down')
		setStartPoint(event.data.global);
	};

	const handleMouseMove = (event) => {
		if (startPoint) {
			setEndPoint(event.data.global);
		}
	};

	const handleMouseUp = () => {
		if (startPoint && endPoint) {
			const selected = [];
			const selectionRect = new PIXI.Rectangle(
				Math.min(startPoint.x, endPoint.x),
				Math.min(startPoint.y, endPoint.y),
				Math.abs(startPoint.x - endPoint.x),
				Math.abs(startPoint.y - endPoint.y)
			);

			stageRef.children.forEach((child) => {
				if (child.getBounds().intersects(selectionRect)) {
					selected.push(child);
				}
			});

			setSelectedItems(selected);
		}

		setStartPoint(null);
		setEndPoint(null);
	};

	return {
		handleMouseMove,
		handleMouseUp,
		handleMouseDown,
		selectedItems,
	};
};

export { useAreaSelection };

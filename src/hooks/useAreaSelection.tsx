import { Rectangle } from 'pixi.js';
import { useCallback, useContext, useState } from 'react';
import { AreaSelectionContext } from '../components/AreaSelectionContext';

const useAreaSelection = (stage) => {
	const [selectedItems, setSelectedItems] = useState([]);
	const {
		coordinates: { startPoint, endPoint },
		updateCoordinates,
	} = useContext(AreaSelectionContext);

	const handleMouseMove = useCallback(
		(e) => {
			if (e.target) {
				updateCoordinates((prev) => ({
					...prev,
					endPoint: { x: e.global.x, y: e.global.y },
				}));
			}
		},
		[updateCoordinates]
	);

	const handleMouseDown = useCallback(
		(e) => {
			updateCoordinates((prev) => ({
				...prev,
				startPoint: { x: e.global.x, y: e.global.y },
			}));
			stage.on('pointermove', handleMouseMove);
		},
		[stage, handleMouseMove, updateCoordinates]
	);

	const handleMouseUp = useCallback(() => {
		console.log('updateCoordinates', startPoint, endPoint);
		if (startPoint && endPoint) {
			const selected = [];
			const selectionRect = new Rectangle(
				Math.min(startPoint.x, endPoint.x),
				Math.min(startPoint.y, endPoint.y),
				Math.abs(startPoint.x - endPoint.x),
				Math.abs(startPoint.y - endPoint.y)
			);

			stage.children[1].children.forEach((child) => {
				if (child.getBounds().intersects(selectionRect)) {
					selected.push(child);
				}
			});

			setSelectedItems(selected);
			console.log('selected', selected);
		}

		stage.off('pointermove', handleMouseMove);
		updateCoordinates({
			startPoint: null,
			endPoint: null,
		});
	}, [startPoint, stage, handleMouseMove, endPoint, updateCoordinates]);

	return {
		handleMouseUp,
		handleMouseDown,
		selectedItems,
	};
};

export { useAreaSelection };

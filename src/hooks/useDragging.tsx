import { useCallback, useContext, useRef } from 'react';
import { CoordinatesContext } from '../components/ItemsContext';

const useDragging = (
	updateItem,
	selectedItems,
	stageWidth,
	stageHeight,
	viewContainerRef,
	cellSize
) => {
	const offset = useRef({});
	const dropTarget = useRef(null);
	const isDragging = useRef(false);

	const onDragMove = useCallback(
		(e) => {
			// e.nativeEvent.stopImmediatePropagation();
			if (
				isDragging.current &&
				dropTarget.current &&
				selectedItems.length > 0 &&
				viewContainerRef.current
			) {
				const children = dropTarget.current.parent.children;
				children.forEach((item) => {
					const id = item['data-id'];
					if (!selectedItems.includes(id) || !item.isSprite) {
						return;
					}

					const minX = item.width / 2 + 20;
					const minY = item.height / 2 + 20;
					const maxX = stageWidth - item.width / 2 - 20;
					const maxY = stageHeight - item.height / 2 - 20;

					const local = viewContainerRef.current.toLocal(e.global);
					const x = Math.max(minX, Math.min(local.x - offset.current[id].shiftX, maxX));
					const y = Math.max(minY, Math.min(local.y - offset.current[id].shiftY, maxY));

					item.position = { x, y };
					item.alpha = 0.5;
				});
			}
		},
		[selectedItems, stageWidth, stageHeight, viewContainerRef]
	);

	const onDragEnd = useCallback(
		(e) => {
			// debugger;
			if (dropTarget.current) {
				isDragging.current = false;

				const children = dropTarget.current.parent.children;
				children.forEach((item) => {
					if (!selectedItems.includes(item['data-id']) || !item.isSprite) {
						return;
					}

					const cellX = Math.round(item.x / cellSize);
					const cellY = Math.round(item.y / cellSize);
					updateItem(
						{
							position: {
								x: cellX * cellSize,
								y: cellY * cellSize,
							},
							alpha: 1,
							zIndex: item.zIndex,
						},
						item['data-id']
					);
				});

				dropTarget.current = null;
			}
		},
		[updateItem, selectedItems, cellSize]
	);

	const onDragStart = useCallback(
		(e) => {
			// e.nativeEvent.stopImmediatePropagation();
			if (
				e.target &&
				e.target.isSprite &&
				e.button === 0 &&
				selectedItems.includes(e.target['data-id']) &&
				viewContainerRef.current
			) {
				if (selectedItems.length > 0) {
					isDragging.current = true;
					dropTarget.current = e.target;
					const children = e.target.parent.children;
					children.forEach((item) => {
						if (!selectedItems.includes(item['data-id']) || !item.isSprite) {
							return;
						}
						const local = viewContainerRef.current.toLocal(e.global);

						offset.current[item['data-id']] = {
							shiftX: local.x - item.x,
							shiftY: local.y - item.y,
						};

						item.zIndex = item.zIndex + 1;
					});
				}
			}
		},
		[selectedItems, viewContainerRef]
	);

	return {
		onDragStart,
		onDragEnd,
		onDragMove,
		isDragging,
	};
};

export { useDragging };

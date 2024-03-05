import { useCallback, useRef } from 'react';

const useDragging = (updateItem, visibleArea, selectedItems, stageWidth, stageHeight) => {
	const offset = useRef({});
	const dropTarget = useRef(null);
	const isDragging = useRef(false);
	console.log('selectedItems', selectedItems);
	const onDragMove = useCallback(
		(e) => {
			// e.nativeEvent.stopImmediatePropagation();
			debugger;
			if (isDragging.current && dropTarget.current && selectedItems.length > 0) {
				console.log('drag moove');

				// debugger;
				const children = dropTarget.current.parent.children;
				// debugger;
				children.forEach((item) => {
					const id = item['data-id'];
					if (!selectedItems.includes(id) || !item.isSprite) {
						return;
					}

					const minX = item.width / 2 + 20;
					const minY = item.height / 2 + 20;
					console.log('item', item.width, item.height);
					const maxX = stageWidth - item.width / 2 - 20;
					const maxY = stageHeight - item.height / 2 - 20;

					const local = item.parent.toLocal(e.global);
					const x = Math.max(minX, Math.min(local.x - offset.current[id].shiftX, maxX));
					const y = Math.max(minY, Math.min(local.y - offset.current[id].shiftY, maxY));

					item.position = { x, y };
					item.alpha = 0.5;
				});
			}
		},
		[selectedItems, stageWidth, stageHeight]
	);

	const onDragEnd = useCallback(
		(e) => {
			// debugger;
			if (dropTarget.current) {
				isDragging.current = false;
				const cellSize = 10;

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
		[updateItem, selectedItems]
	);

	const onDragStart = useCallback(
		(e) => {
			// e.nativeEvent.stopImmediatePropagation();
			if (
				e.target &&
				e.target.isSprite &&
				e.button === 0 &&
				selectedItems.includes(e.target['data-id'])
			) {
				if (selectedItems.length > 0) {
					isDragging.current = true;
					dropTarget.current = e.target;
					const children = e.target.parent.children;
					// debugger;
					children.forEach((item) => {
						if (!selectedItems.includes(item['data-id']) || !item.isSprite) {
							return;
						}

						offset.current[item['data-id']] = {
							shiftX: e.data.global.x + visibleArea.x - item.x,
							shiftY: e.data.global.y + visibleArea.y - item.y,
						};

						item.zIndex = item.zIndex + 1;
					});
				}
			}
		},
		[visibleArea, selectedItems]
	);

	return {
		onDragStart,
		onDragEnd,
		onDragMove,
		isDragging,
	};
};

export { useDragging };

import { useApp } from '@pixi/react';
import { useCallback, useEffect, useRef, useState } from 'react';

const useDragging = (updateItem) => {
	const app = useApp();
	const offset = useRef({ shiftX: 0, shiftY: 0 });
	const [isClicking, setIsClicking] = useState(false);
	const dropTarget = useRef(null);
	const isDragging = useRef(false);

	const onDragMove = useCallback((e) => {
		if (isDragging.current && dropTarget.current) {
			debugger;
			setIsClicking(false);
			const local = dropTarget.current.parent.toLocal(e.global);
			dropTarget.current.position = {
				x: local.x - offset.current.shiftX,
				y: local.y - offset.current.shiftY,
			};
		}
	}, []);

	const onDragEnd = useCallback(
		(e) => {
			if (dropTarget.current) {
				isDragging.current = false;
				app.stage.off('pointermove', onDragMove);
				const cellSize = 10;
				const cellX = Math.round(dropTarget.current.x / cellSize);
				const cellY = Math.round(dropTarget.current.y / cellSize);
				updateItem({
					position: {
						x: cellX * cellSize,
						y: cellY * cellSize,
					},
					alpha: 1,
				});
				dropTarget.current = null;
			}
		},
		[app.stage, onDragMove, updateItem]
	);

	useEffect(() => {
		app.stage.on('pointerup', onDragEnd);
		app.stage.on('pointerupoutside', onDragEnd);

		return () => {
			app.stage.off('pointerup', onDragEnd);
			app.stage.off('pointerupoutside', onDragEnd);
		};
	}, [app.stage, app.screen, onDragEnd]);

	const onDragStart = useCallback(
		(e) => {
			debugger;
			e.nativeEvent.stopImmediatePropagation();
			// console.log('pointer down of item', e.currentTarget, e.target);
			if (e.currentTarget) {
				setIsClicking(true);
				isDragging.current = true;
				dropTarget.current = e.currentTarget;
				offset.current = {
					shiftX: e.data.global.x - dropTarget.current.x,
					shiftY: e.data.global.y - dropTarget.current.y,
				};
				updateItem({ zIndex: dropTarget.current?.zIndex + 1, alpha: 0.5 });
				app.stage.on('pointermove', onDragMove);
			}
		},
		[app.stage, onDragMove, updateItem]
	);

	return {
		onDragStart,
		onDragEnd,
		onDragMove,
		isClicking,
	};
};

export { useDragging };

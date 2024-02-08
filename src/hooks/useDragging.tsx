import { useApp } from '@pixi/react';
import { useCallback, useEffect, useRef, useState } from 'react';

const useDragging = (updateItem) => {
	const app = useApp();
	const offset = useRef({ shiftX: 0, shiftY: 0 });
	const [position, setPosition] = useState({ x: 100, y: 100 });
	const [alpha, setAlpha] = useState(1);
	const [zIndex, setZIndex] = useState(10);
	const dropTarget = useRef(null);
	const isDragging = useRef(false);
	const isClicking = useRef(false);

	const onDragMove = useCallback(
		(e) => {
			if (isDragging.current && dropTarget.current) {
				isClicking.current = false; // It's a drag, not a click
				const updatedPosition = dropTarget.current.parent.toLocal(
					e.global,
					null,
					dropTarget.current.position
				);
				updateItem({
					position: {
						x: updatedPosition.x - offset.current.shiftX,
						y: updatedPosition.y - offset.current.shiftY,
					},
				});
			}
		},
		[updateItem]
	);

	const onDragEnd = useCallback(
		(e) => {
			if (e.target === e.currentTarget && dropTarget.current) {
				isDragging.current = false;
				setAlpha(1);
				app.stage.off('pointermove', onDragMove);
				updateItem({
					alpha,
					zIndex,
				});
				dropTarget.current = null;
			}
		},
		[app.stage, onDragMove, updateItem, zIndex, alpha]
	);

	useEffect(() => {
		app.stage.eventMode = 'static';
		app.stage.hitArea = app.screen;
		app.stage.on('pointerup', onDragEnd);
		app.stage.on('pointerupoutside', onDragEnd);

		return () => {
			app.stage.off('pointerup', onDragEnd);
			app.stage.off('pointerupoutside', onDragEnd);
		};
	}, [app.stage, app.screen, onDragEnd]);

	const onDragStart = useCallback(
		(e) => {
			isDragging.current = true;
			isClicking.current = true;
			offset.current = {
				shiftX: e.data.global.x - position.x,
				shiftY: e.data.global.y - position.y,
			};
			dropTarget.current = e.currentTarget;
			setAlpha(0.5);
			setZIndex((prevIndex) => prevIndex + 1);
			updateItem({
				alpha,
				zIndex,
			});
			app.stage.on('pointermove', onDragMove);
		},
		[position, app.stage, onDragMove, alpha, zIndex, updateItem]
	);

	return {
		onDragStart,
		onDragEnd,
		onDragMove,
		position,
		alpha,
		zIndex,
		isClicking: isClicking.current,
	};
};

export { useDragging };

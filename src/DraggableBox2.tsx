import { Sprite, useApp } from '@pixi/react';
import { useCallback, useEffect, useRef, useState } from 'react';

const DraggableBox2 = ({ ...props }) => {
	const app = useApp();
	const [alpha, setAlpha] = useState(1);
	const offset = useRef({ shiftX: 0, shiftY: 0 });
	const [position, setPosition] = useState({ x: 400, y: 270 });
	const dropTarget = useRef(null);

	const onDragEnd = useCallback(
		(event: any) => {
			if (dropTarget.current) {
				console.log('onDragEnd');
				app.stage.off('pointermove', onDragMove);
				setAlpha(1);
				dropTarget.current = null;
			}
		},
		[app.stage]
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

	const onDragStart = (e: any) => {
		console.log('onDragStart');
		setAlpha(0.5);
		dropTarget.current = e.currentTarget;
		offset.current = {
			shiftX: e.data.global.x - position.x,
			shiftY: e.data.global.y - position.y,
		};
		debugger;
		app.stage.on('pointermove', onDragMove);
	};

	const onDragMove = (e: any) => {
		if (dropTarget.current) {
			console.log('onDragMove');
			debugger;
			const updatedPosition = dropTarget.current.parent.toLocal(
				e.global,
				null,
				dropTarget.current.position
			);
			setPosition({
				x: updatedPosition.x - offset.current.shiftX,
				y: updatedPosition.y - offset.current.shiftY,
			});
		}
	};

	return (
		<Sprite
			image="https://pixijs.com/assets/bunny.png"
			anchor={0.5}
			position={position}
			eventMode="static"
			alpha={alpha}
			pointerdown={onDragStart}
			cursor={'pointer'}
			{...props}
		/>
	);
};

export default DraggableBox2;

import { Sprite, useApp } from '@pixi/react';
import { memo, useCallback, useEffect, useRef, useState } from 'react';

const scaleOptions = [0.1, 0.2, 0.3, 0.4];

const DraggableBox = memo(
	({
		x = 0,
		y = 0,
		rotation: defaultRotation = 0,
		scaleIndex: defaultScaleIndex = 0,
		zIndex: defaultZIndex = 10,
		onDragEnd,
		texture,
		isEditMode,
		...props
	}) => {
		const app = useApp();
		const isDragging = useRef(false);
		const isClicking = useRef(false);
		const offset = useRef({ shiftX: 0, shiftY: 0 });
		const [position, setPosition] = useState({ x: x || 0, y: y || 0 });
		const [alpha, setAlpha] = useState(1);
		const [zIndex, setZIndex] = useState(defaultZIndex);
		const [rotation, setRotation] = useState(defaultRotation);
		const dropTarget = useRef(null);
		const [scaleOptionIndex, setScaleOptionIndex] = useState(defaultScaleIndex);
		const onDragMove = useCallback(
			(e) => {
				if (isDragging.current && dropTarget.current) {
					isClicking.current = false; // It's a drag, not a click
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
			},
			[setPosition]
		);

		const onStart = useCallback(
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
				app.stage.on('pointermove', onDragMove);
			},
			[onDragMove, position, app.stage]
		);

		const onEnd = useCallback(
			(e) => {
				if (e.target === e.currentTarget && dropTarget.current) {
					isDragging.current = false;
					setAlpha(1);
					app.stage.off('pointermove', onDragMove);
					dropTarget.current = null;

					if (onDragEnd) {
						onDragEnd({
							position: position,
							rotation,
							scaleIndex: scaleOptionIndex,
						});
					}
				}
			},

			[onDragEnd, rotation, scaleOptionIndex, position, onDragMove, app.stage]
		);

		useEffect(() => {
			app.stage.eventMode = 'static';
			app.stage.hitArea = app.screen;
			app.stage.on('pointerup', onEnd);
			app.stage.on('pointerupoutside', onEnd);

			return () => {
				app.stage.off('pointerup', onEnd);
				app.stage.off('pointerupoutside', onEnd);
			};
		}, [app.stage, app.screen, onEnd]);

		function onRightClick(e) {
			console.log('right click');
			setScaleOptionIndex((prev) => (prev + 1) % scaleOptions.length);
		}

		function handleClick(e) {
			// Rotate the texture by 90 degrees only if it's a click
			if (isClicking.current) {
				setRotation((prevRotation) => (prevRotation + Math.PI / 2) % (Math.PI * 2));
			}
		}

		const editModeProps = {
			pointerdown: onStart,
			pointerup: onEnd,
			pointerupoutside: onEnd,
			click: handleClick,
			rightclick: onRightClick,
		};

		const viewModeProps = {};

		return (
			<Sprite
				renderable={true}
				alpha={alpha}
				position={position}
				texture={texture}
				zIndex={zIndex}
				eventMode="static"
				rotation={rotation}
				
				anchor={{ x: 0.5, y: 0.5 }}
				scale={scaleOptions[scaleOptionIndex]}
				{...(isEditMode ? editModeProps : viewModeProps)}
				{...props}
			/>
		);
	}
);

export default DraggableBox;

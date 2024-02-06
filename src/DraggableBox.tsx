import { Sprite } from '@pixi/react';
import { memo, useCallback, useRef, useState } from 'react';

const scaleOptions = [
	{ x: 1, y: 1 },
	{ x: 1.25, y: 1.25 },
	{ x: 1.5, y: 1.5 },
	{ x: 2, y: 2 },
	{ x: 3, y: 3 },
];

const DraggableBox = memo(
	({
		x = 0,
		y = 0,
		rotation: defaultRotation = 0,
		scaleIndex: defaultScaleIndex = 0,
		onDragEnd,
		texture,
		...props
	}) => {
		const isDragging = useRef(false);
		const isClicking = useRef(false);
		const nodeRef = useRef(null);
		const offset = useRef({ x: 0, y: 0 });
		const [position, setPosition] = useState({ x: x || 0, y: y || 0 });
		const [alpha, setAlpha] = useState(1);
		const [zIndex, setZIndex] = useState(10);
		const [rotation, setRotation] = useState(defaultRotation);
		const [scaleOptionIndex, setScaleOptionIndex] = useState(defaultScaleIndex);
		const onMove = useCallback(
			(e) => {
				if (isDragging.current) {
					isClicking.current = false; // It's a drag, not a click
					setPosition({
						x: e.clientX - offset.current.x,
						y: e.clientY - offset.current.y,
					});
				}
			},
			[setPosition]
		);

		const onStart = useCallback(
			(e) => {
				isDragging.current = true;
				isClicking.current = true;
				debugger;
				// console.log('position before offset', position.x, position.y);

				offset.current = {
					x: e.originalEvent.clientX - e.data.global.x,
					y: e.originalEvent.clientY - e.data.global.y,
				};

				// console.log('offset', offset.current);
				setAlpha(0.5);
				setZIndex((prevIndex) => prevIndex + 1);
				document.addEventListener('pointermove', onMove);
			},
			[onMove]
		);

		const onEnd = useCallback(
			(e) => {
				if (e.target === e.currentTarget) {
					isDragging.current = false;
					setAlpha(1);
					document.removeEventListener('pointermove', onMove);
					if (onDragEnd) {
						onDragEnd({
							position: position,
							rotation,
							scaleIndex: scaleOptionIndex,
						});
					}
				}
			},

			[onDragEnd, rotation, scaleOptionIndex, position]
		);

		function onRightClick(e) {
			setScaleOptionIndex((prev) => (prev + 1) % scaleOptions.length);
		}

		function handleClick(e) {
			// Rotate the texture by 90 degrees only if it's a click
			if (isClicking.current) {
				setRotation((prevRotation) => (prevRotation + Math.PI / 2) % (Math.PI * 2));
			}
		}

		return (
			<Sprite
				alpha={alpha}
				position={position}
				texture={texture}
				zIndex={zIndex}
				eventMode="static"
				pointerdown={onStart}
				pointerup={onEnd}
				pointerupoutside={onEnd}
				// pointermove={onMove}
				rotation={rotation}
				click={handleClick}
				onrightclick={onRightClick}
				anchor={{ x: 0.5, y: 0.5 }}
				scale={scaleOptions[0]}
				ref={nodeRef}
				{...props}
			/>
		);
	}
);

export default DraggableBox;
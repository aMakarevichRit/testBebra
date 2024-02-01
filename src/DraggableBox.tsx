import { Sprite } from '@pixi/react';
import { useCallback, useRef, useState } from 'react';

const scaleOptions = [
	{ x: 1, y: 1 },
	{ x: 1.25, y: 1.25 },
	{ x: 1.5, y: 1.5 },
	{ x: 2, y: 2 },
	{ x: 3, y: 3 },
];

const DraggableBox = ({ x = 0, y = 0, rotation: defaultRotation, texture, ...props }) => {
	const isDragging = useRef(false);
	const isClicking = useRef(false);
	const offset = useRef({ x: 0, y: 0 });
	const [position, setPosition] = useState({ x: x || 0, y: y || 0 });
	const [alpha, setAlpha] = useState(1);
	const [zIndex, setZIndex] = useState(10);
	const [rotation, setRotation] = useState(defaultRotation);
	const [scaleOptionIndex, setScaleOptionIndex] = useState(0);

	function onStart(e) {
		isDragging.current = true;
		offset.current = {
			x: e.data.global.x - position.x,
			y: e.data.global.y - position.y,
		};
		isClicking.current = true; // Assume it's a click until proven otherwise
		setAlpha(0.5);
		setZIndex((prevIndex) => prevIndex + 1);
		document.addEventListener('pointermove', onMove);
	}

	function onEnd(e) {
		isDragging.current = false;
		setAlpha(1);
		if (!isClicking.current) {
			// If it's not a click, update position
			setPosition({
				x: e.data.global.x - offset.current.x,
				y: e.data.global.y - offset.current.y,
			});
		}
		document.removeEventListener('pointermove', onMove);
	}

	const onMove = useCallback(
		(e: PointerEvent) => {
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

	function onRightClick(e) {
		e.preventDefault();
		setScaleOptionIndex((prev) => (prev + 1) % scaleOptions.length);
	}

	function handleClick() {
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
			width={100}
			height={100}
			zIndex={zIndex}
			interactive={true}
			pointerdown={onStart}
			pointerup={onEnd}
			rotation={rotation}
			pointerupoutside={onEnd}
			click={handleClick}
			anchor={{ x: 0.5, y: 0.5 }}
			scale={scaleOptions[scaleOptionIndex]}
			onrightclick={onRightClick}
			{...props}
		/>
	);
};

export default DraggableBox;

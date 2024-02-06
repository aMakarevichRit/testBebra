import { useState } from 'react';
import { Sprite } from '@pixi/react';
import resize from './assets/resize.png';

const ResizableBox = ({ x = 0, y = 0, texture, ...props }) => {
	const [dragging, setDragging] = useState(false);
	const [hovering, setHovering] = useState(false);
	const [dimensions, setDimensions] = useState({ width: 100, height: 100 });
	const [position, setPosition] = useState({ x: x || 0, y: y || 0 });

	const handleMouseDown = (e) => {
		setDragging(true);
	};

	const handleMouseUp = (e) => {
		setDragging(false);
	};

	const handleMouseMove = (e) => {
		if (!dragging) return;

		// Resize sprite based on mouse movement
		// Adjust sprite width and height accordingly
        debugger;
		const mouseX = e.clientX - dimensions.width;
		const mouseY = e.clientY - dimensions.height;

		// Update sprite dimensions
		setDimensions({ width: mouseX, height: mouseY });
	};

	return (
		<>
			<Sprite
				position={position}
				texture={texture}
				zIndex={100}
				width={dimensions.width}
				height={dimensions.height}
				eventMode="static"
				onmousedown={handleMouseDown}
				onmouseup={handleMouseUp}
				onmousemove={handleMouseMove}
				onmouseover={() => setHovering(true)}
				anchor={{ x: 0.5, y: 0.5 }}
				{...props}
			/>
			
		</>
	);
};

// {hovering && (
//     <img
//         src={resize}
//         alt="Resize Icon"
//         style={{
//             position: 'absolute',
//             top: 'calc(100% - 20px)',
//             left: 'calc(100% - 20px)',
//             width: '20px',
//             height: '20px',
//             cursor: 'se-resize', // Set cursor to resize cursor
//         }}
//     />
// )}

export default ResizableBox;

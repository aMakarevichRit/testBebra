import { Sprite, Stage } from '@pixi/react';
import { useState } from 'react';
import table4 from '../assets/table4.png';
import seat from '../assets/seat-v4.png';
import { Texture } from 'pixi.js';

const TestStage = (props) => {
	const [selectedItems, setSelectedItems] = useState([]);

	const handlePointerDown = (event) => {
		if (!event.target?.isSprite) {
			// Reset selected items when clicking on the stage area
			setSelectedItems([]);
		}
	};

	const handleItemClick = (itemId, e) => {
		setSelectedItems((prevSelectedItems) => {
			if (prevSelectedItems.includes(itemId)) {
				// Item is already selected, deselect it
				return prevSelectedItems.filter((id) => id !== itemId);
			} else {
				// Item is not selected, add it to the selected items
				return [...prevSelectedItems, itemId];
			}
		});
	};

	return (
		<Stage
			width={800}
			height={600}
			onPointerDown={handlePointerDown}
			raf={false}
			renderOnComponentChange={true}
		>
			{/* Draggable items */}
			<Sprite
				x={100}
				y={100}
				texture={Texture.from(table4)}
				eventMode="static"
				pointerdown={(e) => handleItemClick('item1', e)}
				tint={selectedItems.includes('item1') ? 0xff0000 : 0xffffff} // Highlight selected items
			/>
			<Sprite
				x={200}
				y={200}
				texture={Texture.from(seat)}
				eventMode="static"
				pointerdown={(e) => handleItemClick('item2', e)}
				tint={selectedItems.includes('item2') ? 0xff0000 : 0xffffff} // Highlight selected items
			/>
			{/* Add more draggable items as needed */}
		</Stage>
	);
};

export default TestStage;

import { Sprite } from '@pixi/react';
import { useDragging } from '../hooks/useDragging';
import { memo } from 'react';

const DraggableBox = memo(
	({ isEditMode, id, updateSelectedItems, updateItem, ...props }) => {
		// const update = (updatedState) => updateItem(updatedState, id);
		// const { onDragEnd, onDragStart, isClicking } = useDragging(update, visibleArea);


		const editModeProps = {
			// pointerdown: onDragStart,
			// pointerup: onDragEnd,
			// pointerupoutside: onDragEnd,
			// pointertap: onPointerTap,
		};

		const viewModeProps = {};

		return (
			<Sprite
				eventMode="static"
				anchor={0.5}
				data-id={id}
				{...(isEditMode ? editModeProps : viewModeProps)}
				{...props}
			/>
		);
	}
);
export default DraggableBox;

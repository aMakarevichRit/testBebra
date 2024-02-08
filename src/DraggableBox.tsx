import { Sprite } from '@pixi/react';
import { useDragging } from './hooks/useDragging';
import { memo } from 'react';

const DraggableBox = memo(({ isEditMode, updateSelectedItems, updateItemState, id, ...props }) => {


	const editModeProps = {
		pointerdown: onDragStart,
		pointerup: onDragEnd,
		pointerupoutside: onDragEnd,
	};

	const viewModeProps = {};

	return (
		<Sprite
			position={position}
			eventMode="static"
			anchor={{ x: 0.5, y: 0.5 }}
			
			{...(isEditMode ? editModeProps : viewModeProps)}
			{...props}
		/>
	);
});
export default DraggableBox;

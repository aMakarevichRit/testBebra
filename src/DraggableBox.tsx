import { Sprite } from '@pixi/react';
import { memo } from 'react';
import { useDragging } from './hooks/useDragging';

const DraggableBox = ({ position: defaultPosition, isEditMode, ...props }) => {
	const { alpha, zIndex, position, onDragEnd, onDragStart } = useDragging(defaultPosition);

	const editModeProps = {
		pointerdown: onDragStart,
		pointerup: onDragEnd,
		pointerupoutside: onDragEnd,
	};

	const viewModeProps = {};

	return (
		<Sprite
			alpha={alpha}
			position={position}
			eventMode="static"
			zIndex={zIndex}
			anchor={{ x: 0.5, y: 0.5 }}
			{...(isEditMode ? editModeProps : viewModeProps)}
			{...props}
		/>
	);
};

export default DraggableBox;

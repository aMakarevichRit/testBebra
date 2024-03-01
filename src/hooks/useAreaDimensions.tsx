import { useEffect } from 'react';

const useAreaDimensions = (isEditMode, handleMouseMove) => {
	useEffect(() => {
		if (!isEditMode) {
			return;
		}

		document.addEventListener('mousemove', handleMouseMove);

		return () => {
			document.removeEventListener('mousemove', handleMouseMove);
		};
	}, [isEditMode, handleMouseMove]);
};

export { useAreaDimensions };

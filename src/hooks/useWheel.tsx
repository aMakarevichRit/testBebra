import { useEffect } from 'react';

const useWheel = (isEditMode, handleResize) => {
	useEffect(() => {
		if (!isEditMode) {
			return;
		}

		document.addEventListener('wheel', handleResize);

		return () => {
			document.removeEventListener('wheel', handleResize);
		};
	}, [isEditMode, handleResize]);
};

export { useWheel };

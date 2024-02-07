import { useEffect } from 'react';

const useKeyboard = (isEditMode, handleKeyDown) => {
	useEffect(() => {
		if (!isEditMode) {
			return;
		}

		document.addEventListener('keydown', handleKeyDown);

		return () => {
			document.removeEventListener('keydown', handleKeyDown);
		};
	}, [isEditMode, handleKeyDown]);
};

export { useKeyboard };

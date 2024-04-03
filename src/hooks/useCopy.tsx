import { useCallback } from 'react';

const useCopy = (value, onPaste) => {
	const handleCopy = useCallback(() => {
		navigator.clipboard.writeText(JSON.stringify(value)).catch((error) => {
			console.error('Error copying data:', error);
		});
	}, [value]);

	const handlePaste = useCallback(() => {
		navigator.clipboard
			.readText()
			.then((value) => {
				try {
					const parsedData = JSON.parse(value);
					onPaste(parsedData);
				} catch (error) {
					console.error('Error parsing pasted data:', error);
				}
			})
			.catch((error) => {
				console.error('Error pasting data:', error);
			});
	}, [onPaste]);

	return {
		handleCopy,
		handlePaste,
	};
};

export { useCopy };

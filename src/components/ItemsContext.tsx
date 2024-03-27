import { createContext, useState } from 'react';

const CoordinatesContext = createContext({});

// CoordinatesProvider component to wrap your application
const CoordinatesProvider = ({ children }) => {
	const [coordinates, setCoordinates] = useState({});

	const setCoordinatesById = (itemId, coords) => {
		setCoordinates((prevCoordinates) => ({
			...prevCoordinates,
			[itemId]: coords,
		}));
	};

	const getCoordinatesById = (itemId: string) => {
		return coordinates[itemId] || { x: 0, y: 0 };
	};

	return (
		<CoordinatesContext.Provider value={{ setCoordinatesById, getCoordinatesById }}>
			{children}
		</CoordinatesContext.Provider>
	);
};

export { CoordinatesContext, CoordinatesProvider };

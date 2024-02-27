import { ComponentPropsWithoutRef, Dispatch, SetStateAction, createContext, useState } from 'react';

type ProviderProps = ComponentPropsWithoutRef<'div'>;

interface Point {
	x: number;
	y: number;
}

interface AreaSelectionState {
	coordinates: {
		startPoint: Point | null;
		endPoint: Point | null;
	};
	updateCoordinates: Dispatch<SetStateAction<AreaSelectionState['coordinates']>>;
}

const defaultState: AreaSelectionState = {
	coordinates: {
		startPoint: null,
		endPoint: null,
	},
	updateCoordinates: () => {},
};

const AreaSelectionContext = createContext(defaultState);

const AreaSelectionProvider = ({ children }: ProviderProps) => {
	const [coordinates, setCoordinates] = useState<AreaSelectionState['coordinates']>({
		startPoint: null,
		endPoint: null,
	});

	return (
		<AreaSelectionContext.Provider
			value={{
				coordinates,
				updateCoordinates: setCoordinates,
			}}
		>
			{children}
		</AreaSelectionContext.Provider>
	);
};

export { AreaSelectionProvider, AreaSelectionContext };

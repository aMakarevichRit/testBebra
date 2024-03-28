import { useCallback } from 'react';
import { Graphics as GraphicsComponent } from '@pixi/react';
import { Graphics } from 'pixi.js';

const highlightedSquareSize = 5;

const Grid = ({ width, height, cellSize, ...props }) => {
	const gridWidth = Math.floor(width / cellSize);
	const gridHeight = Math.floor(height / cellSize);

	const drawGrid = useCallback(
		(g: Graphics) => {
			g.clear();
			g.lineStyle(1, 0xcccccc, 0.5);

			for (let i = 0; i <= gridWidth; i++) {
				const x = i * cellSize;
				g.moveTo(x, 0);
				g.lineTo(x, gridHeight * cellSize);
			}

			for (let i = 0; i <= gridHeight; i++) {
				const y = i * cellSize;
				g.moveTo(0, y);
				g.lineTo(gridWidth * cellSize, y);
			}

			for (let x = 0; x < gridWidth; x += highlightedSquareSize) {
				for (let y = 0; y < gridHeight; y += highlightedSquareSize) {
					g.lineStyle(2, 0x888888, 1);
					g.drawRect(
						x * cellSize,
						y * cellSize,
						highlightedSquareSize * cellSize,
						highlightedSquareSize * cellSize
					);
				}
			}
		},
		[gridHeight, gridWidth, cellSize]
	);

	return (
		<>
			<GraphicsComponent draw={drawGrid} />
		</>
	);
};

export default Grid;

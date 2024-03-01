import { useCallback } from 'react';
import { Container, Graphics, useApp } from '@pixi/react';
import { Rectangle } from 'pixi.js';

const gridSize = 20;
const highlightedSquareSize = 5;

const Grid = ({ width, height, ...props }) => {
	// const gridSize = {
	// 	rows: Math.floor(height / cellSize),
	// 	columns: Math.floor(width / cellSize),
	// };
	const gridWidth = Math.floor(width / gridSize);
	const gridHeight = Math.floor(height / gridSize);

	const drawGrid = useCallback(
		(g) => {
			// g.lineStyle(1, 0x000000); // Set line style

			// // Draw vertical lines
			// for (let col = 0; col <= gridSize.columns; col++) {
			// 	const x = col * cellSize;
			// 	g.moveTo(x, 0);
			// 	g.lineTo(x, gridSize.rows * cellSize);
			// }

			// // Draw horizontal lines
			// for (let row = 0; row <= gridSize.rows; row++) {
			// 	const y = row * cellSize;
			// 	g.moveTo(0, y);
			// 	g.lineTo(gridSize.columns * cellSize, y);
			// }
			g.lineStyle(1, 0xcccccc, 0.5);
			for (let i = 0; i <= gridWidth; i++) {
				g.moveTo(i * gridSize, 0);
				g.lineTo(i * gridSize, gridHeight * gridSize);
			}

			for (let i = 0; i <= gridHeight; i++) {
				g.moveTo(0, i * gridSize);
				g.lineTo(gridWidth * gridSize, i * gridSize);
			}

			for (let x = 0; x < gridWidth; x += highlightedSquareSize) {
				for (let y = 0; y < gridHeight; y += highlightedSquareSize) {
					g.lineStyle(2, 0x888888, 1);
					g.drawRect(
						x * gridSize,
						y * gridSize,
						highlightedSquareSize * gridSize,
						highlightedSquareSize * gridSize
					);
				}
			}
		},
		[gridHeight, gridWidth]
	);

	return (
		<>
			<Graphics draw={drawGrid} />
		</>
	);
};

export default Grid;

import React, { useRef, useState } from 'react';
import { Stage, Container, Sprite } from '@pixi/react';
import { Texture } from 'pixi.js';
import tableSmall from './assets/round_table_small.png';
import chairSmall from './assets/chair_small.png';

const scaleOptions = [
    { x: 1, y: 1 },
    { x: 1.25, y: 1.25 },
    { x: 1.5, y: 1.5 },
    { x: 2, y: 2 },
    { x: 3, y: 3 },
];

const DraggableBox = ({ x = 0, y = 0, texture, ...props }) => {
    const isDragging = useRef(false);
    const isClicking = useRef(false);
    const offset = useRef({ x: 0, y: 0 });
    const [position, setPosition] = useState({ x: x || 0, y: y || 0 });
    const [alpha, setAlpha] = useState(1);
    const [zIndex, setZIndex] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [scaleOptionIndex, setScaleOptionIndex] = useState(0);

    function onStart(e) {
        isDragging.current = true;
        offset.current = {
            x: e.data.global.x - position.x,
            y: e.data.global.y - position.y,
        };
        isClicking.current = true; // Assume it's a click until proven otherwise
        setAlpha(0.5);
        setZIndex((prevIndex) => prevIndex + 1);
    }

    function onEnd() {
        isDragging.current = false;
        setAlpha(1);
        if (!isClicking.current) {
            // If it's not a click, update position
            setPosition({
                x: e.data.global.x - offset.current.x,
                y: e.data.global.y - offset.current.y,
            });
        }
    }

    function onMove(e) {
        if (isDragging.current) {
            isClicking.current = false; // It's a drag, not a click
            setPosition({
                x: e.data.global.x - offset.current.x,
                y: e.data.global.y - offset.current.y,
            });
        }
    }

    function onRightClick(e) {
        e.preventDefault();
        setScaleOptionIndex((prev) => (prev + 1) % scaleOptions.length);
    }

    function handleClick() {
        // Rotate the texture by 90 degrees only if it's a click
        if (isClicking.current) {
            setRotation((prevRotation) => (prevRotation + Math.PI / 2) % (Math.PI * 2));
        }
    }

    return (
        <Sprite
            {...props}
            alpha={alpha}
            position={position}
            texture={texture}
            width={100}
            height={100}
            zIndex={zIndex}
            interactive={true}
            pointerdown={onStart}
            pointerup={onEnd}
            pointerupoutside={onEnd}
            pointermove={onMove}
            click={handleClick}
            rotation={rotation}
            anchor={{ x: 0.5, y: 0.5 }}
            scale={scaleOptions[scaleOptionIndex]}
            onrightclick={onRightClick}
        />
    );
};

const Editor = () => {
    return (
        <Stage
            options={{ backgroundColor: 0x1d2330, resizeTo: window }}
            width={window.innerWidth}
            height={window.innerHeight}
            raf={false}
            onContextMenu={(e) => e.preventDefault()}
        >
            <Container sortableChildren={true} interactive={true}>
                <DraggableBox x={100} y={100} texture={Texture.from(tableSmall)} />
                <DraggableBox x={200} y={100} texture={Texture.from(chairSmall)} />
                <DraggableBox x={300} y={100} texture={Texture.from(tableSmall)} />
            </Container>
        </Stage>
    );
};

export default Editor;

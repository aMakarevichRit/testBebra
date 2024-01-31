import React, { useRef, useState } from 'react';
import { Stage, Container, Sprite } from '@pixi/react';
import { Texture } from 'pixi.js';
import tableSmall from './assets/round_table_small.png';
import chairSmall from './assets/chair_small.png';

const DraggableBox = ({ tint, x = 0, y = 0, texture, ...props }) => {
  const isDragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: x || 0, y: y || 0 });
  const [alpha, setAlpha] = useState(1);
  const [zIndex, setZIndex] = useState(1);
  const [rotation, setRotation] = useState(0);

  function onStart(e) {
    isDragging.current = true;
    offset.current = {
      x: e.data.global.x - position.x,
      y: e.data.global.y - position.y,
    };

    setAlpha(0.5);
    setZIndex((prevIndex) => prevIndex + 1);
  }

  function onEnd() {
    isDragging.current = false;
    setAlpha(1);
  }

  function onMove(e) {
    if (isDragging.current) {
      setPosition({
        x: e.data.global.x - offset.current.x,
        y: e.data.global.y - offset.current.y,
      });
    }
  }

  function handleClick() {
    // Rotate the texture by 90 degrees
    setRotation((prevRotation) => (prevRotation + Math.PI / 2) % (Math.PI * 2));
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
      tint={tint}
      interactive={true}
      pointerdown={onStart}
      pointerup={onEnd}
      pointerupoutside={onEnd}
      pointermove={onMove}
      click={handleClick}
      rotation={rotation}
      anchor={{ x: 0.5, y: 0.5 }}
    />
  );
};

const Editor = () => {
  return (
    <Stage width={800} height={600} options={{backgroundColor: 0x1d2330}}>
      <Container sortableChildren={true}>
        <DraggableBox x={100} y={100} texture={Texture.from(tableSmall)} />
        <DraggableBox x={200} y={100} texture={Texture.from(chairSmall)} />
        <DraggableBox x={300} y={100} texture={Texture.from(tableSmall)} />
      </Container>
    </Stage>
  );
};

export default Editor;

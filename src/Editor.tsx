// RestaurantLayoutEditor.js

import { Stage, Container, Sprite } from '@pixi/react';
import tableSmall from './assets/round_table_small.png';
import chairSmall from './assets/chair_small.png'
import { Texture } from 'pixi.js';
import { useRef, useState } from 'react';

const width = 800;
const height = 500;
const backgroundColor = 0x1d2330;

let index = 1;

const DraggableBox = ({ tint, x = 0, y = 0,texture, ...props }) => {
  const isDragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: x || 0, y: y || 0 })
  const [alpha, setAlpha] = useState(1);
  const [zIndex, setZIndex] =useState(index);
  
  function onStart(e) {
    isDragging.current = true;    
    offset.current = {
      x: e.data.global.x - position.x,
      y: e.data.global.y - position.y
    };
    
    setAlpha(0.5);
    setZIndex(index++);
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
      })
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
      tint={tint}
      interactive={true}
      pointerdown={onStart}
      pointerup={onEnd}
      pointerupoutside={onEnd}
      pointermove={onMove}
    />
  );
};

const Editor = () => {


  return (
    <Stage width={800} height={600} options={{ backgroundColor }}>
      <Container sortableChildren={true}>
      <DraggableBox x={0} texture={Texture.from(tableSmall)} />
        <DraggableBox  x={100} texture={Texture.from(chairSmall)} />
        <DraggableBox  x={200}texture={Texture.from(tableSmall)} />
      </Container>
    </Stage>
  );
};

export  {Editor};

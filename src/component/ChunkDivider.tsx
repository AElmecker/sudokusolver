import React, { useMemo } from 'react';
import './ChunkDivider.css';

export interface ChunkDividerProps {
  size: number,
  length: number,
  containerWidth: number
}

function ChunkDivider(props: ChunkDividerProps): JSX.Element {
  const width: number = useMemo(() => props.length * props.size - props.size, [props.length, props.size]);
  const elements: JSX.Element[] = useMemo(() => {
    const items: JSX.Element[] = [];
    for (let x = 0; x < props.size; x++) {
        for (let y = 0; y < props.size; y++) {
            items.push(<div key={`${x} ${y}`} className="grid" style={getStyle(x, y, width)} />);
        }
      }
    return items;
  }, [props.size, width]);

  return (<>{elements}</>);
}

function getStyle(x: number, y: number, width: number): React.CSSProperties {
  return {
    top: -1 + width * y,
    left: -1 + width * x,
    width: width - 3,
    height: width - 3
  };
}

export default ChunkDivider;
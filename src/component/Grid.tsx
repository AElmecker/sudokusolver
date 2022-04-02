import React, { useMemo } from 'react';
import { EMPTY_DISPLAY_VALUE } from '../App';
import ChunkDivider from './ChunkDivider';
import GridItem from './GridItem';
import './Grid.css';
import { DisplayMatrix, StateAction } from '../types';

export interface GridProps {
  displayMatrix: DisplayMatrix,
  setDisplayMatrix: StateAction<DisplayMatrix>,
  solved: boolean,
  gridItemLength: number,
  chunkSize: number,
  width: number
}

function Grid({displayMatrix, setDisplayMatrix, solved, gridItemLength, chunkSize, width}: GridProps): JSX.Element {
  const length: number = useMemo(() => displayMatrix.length, [displayMatrix]);
  const style: React.CSSProperties = useMemo(() => {
    return {width: width};
  }, [width]);
  const allowedValues: string[] = useMemo(() => {
    const values: string[] = [];
    values.push("");
    for (let x = 1; x <= length; x++) {
      values.push(`${x}`)
    }
    return values;
  }, [length]);

  const gridElements: JSX.Element[] = useMemo(() => {
    const elements: JSX.Element[] = [];
    for (let y = 0; y < length; y++) {
      const rowElements: JSX.Element[] = [];
      for (let x = 0; x < displayMatrix.length; x++) {
        rowElements.push(<GridItem 
          key={x}
          value={displayMatrix[x][y]}
          length={gridItemLength}
          allowedValues={allowedValues}
          disabled={solved}
          onChange={(value: string | undefined) => onItemClick(value, x, y, displayMatrix, setDisplayMatrix)} />);
      }
      elements.push(<div key={y} className="grid-row" style={style}>{rowElements}</div>);
    }
    return elements;
}, [displayMatrix, setDisplayMatrix, solved, gridItemLength, style, allowedValues, length]);

  return(
    <div className="grid-container" style={style}>
      <ChunkDivider size={chunkSize} length={gridItemLength} containerWidth={width} />
      {gridElements}
    </div>
  );
}

function onItemClick(
    value: string | undefined,
    x: number,
    y: number,
    displayMatrix: DisplayMatrix,
    setDisplayMatrix: StateAction<DisplayMatrix>) {
  if (value === undefined || value === "") {
    displayMatrix[x][y] = EMPTY_DISPLAY_VALUE;
    setDisplayMatrix(displayMatrix);
  } else {
    const newValue = parseInt(value);
    if (newValue >= 1 && newValue <= displayMatrix.length) {
      displayMatrix[x][y] = {
        value: newValue,
        input: true,
        solveStep: false,
        currentStep: false
      };
      setDisplayMatrix(displayMatrix);
    }
  }
}


export default Grid;
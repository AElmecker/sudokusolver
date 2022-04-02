import React, { useMemo } from 'react';
import { displayToNumberMatrix, EMPTY_DISPLAY_VALUE } from '../App';
import ChunkDivider from './ChunkDivider';
import GridItem from './GridItem';
import './Grid.css';
import { DisplayMatrix, StateAction } from '../types';
import { getChunkStart, getPossibleValues } from '../solver/solver';
import { Matrix } from '../solver/types';
import ErrorBoundary from './ErrorBoundary';

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
  const internalMatrix: Matrix = useMemo(() => displayToNumberMatrix(displayMatrix), [displayMatrix]);
  const allValues: number[] = useMemo(() => {
    const values: number[] = [];
    for (let x = 1; x <= Math.pow(chunkSize, 2); x++) {
      values.push(x);
    }
    return values;
  }, [chunkSize]);

  const gridElements: JSX.Element[] = useMemo(() => {
    const elements: JSX.Element[] = [];
    for (let y = 0; y < length; y++) {
      const rowElements: JSX.Element[] = [];
      for (let x = 0; x < displayMatrix.length; x++) {
        const possibleValues = getPossibleValues(allValues, chunkSize, internalMatrix, {x: x, y: y});
        possibleValues.push(displayMatrix[x][y].value);
        possibleValues.filter((value) => value !== 0).sort((a, b) => a - b)
        const allowedValues: string[] = [];
        allowedValues.push("");
        possibleValues.filter((value) => value !== 0)
          .sort((a, b) => a - b)
          .forEach((value) => allowedValues.push(`${value}`));

        rowElements.push(<GridItem 
          key={x}
          value={displayMatrix[x][y]}
          length={gridItemLength}
          allowedValues={allowedValues}
          disabled={solved}
          onChange={(value: string | undefined) => onItemClick(value, x, y, displayMatrix, setDisplayMatrix, chunkSize)} />);
      }
      elements.push(<div key={y} className="grid-row" style={style}>{rowElements}</div>);
    }
    return elements;
}, [displayMatrix, setDisplayMatrix, solved, gridItemLength, chunkSize, style, allValues, length, internalMatrix]);

  return(
    <div className="grid-container" style={style}>
      <ErrorBoundary>
        <ChunkDivider size={chunkSize} length={gridItemLength} containerWidth={width} />
        {gridElements}
      </ErrorBoundary>
    </div>
  );
}

function onItemClick(
    value: string | undefined,
    x: number,
    y: number,
    displayMatrix: DisplayMatrix,
    setDisplayMatrix: StateAction<DisplayMatrix>,
    chunkSize: number) {
  if (value === undefined || value === "") {
    displayMatrix[x][y] = EMPTY_DISPLAY_VALUE;
    setDisplayMatrix(displayMatrix);
  } else {
    const newValue: number = parseInt(value);
    if (newValue >= 1 && newValue <= displayMatrix.length) {
      displayMatrix[x][y] = {
        value: newValue,
        input: true,
        solveStep: false,
        currentStep: false,
        invalid: checkInputInvalid(newValue, x, y, displayMatrix, chunkSize)
      };
      setDisplayMatrix(displayMatrix);
    }
  }
}

function checkInputInvalid(value: number, x: number, y: number, displayMatrix: DisplayMatrix, chunkSize: number): boolean {
  // validate that row does not contain value already
  for (let i = 0; i < displayMatrix.length; i++) {
    if (i !== x && displayMatrix[i][y].value === value) {
      return true;
    }
  }

  // validate that column does not contain value already
  for (let i = 0; i < displayMatrix.length; i++) {
    if (i !== y && displayMatrix[x][i].value === value) {
      return true;
    }
  }

  // validate that chunk does not contain value already
  const chunkStart = getChunkStart(chunkSize, {x: x, y: y});
  for (let i = chunkStart.x * chunkSize; i < (chunkStart.x * chunkSize) + chunkSize; i++) {
    if (i !== x) {
      for (let j = (chunkStart.y * chunkSize); j < (chunkStart.y * chunkSize) + chunkSize; j++) {
        if (j !== y && displayMatrix[i][j].value === value) {
          return true;
        }
      }
    }
  }

  return false;
}

export default Grid;
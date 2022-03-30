import React, { useEffect, useState } from 'react';
import './App.css';
import './solver/solver';
import { copyMatrix, EMPTY_VALUE, solve } from './solver/solver';
import { Matrix } from './solver/types';

type StateAction<T> = React.Dispatch<React.SetStateAction<T>>;

function App() {
  const [chunkSize, setChunkSize] = useState(3);
  const [displayMatrix, setDisplayMatrix] = useState<Matrix>([]);

  useEffect(() => {
    setDisplayMatrix(createEmptyMatrix(chunkSize));
  }, [chunkSize]);

  const width = 50 * displayMatrix.length - displayMatrix.length;
  return (
    <div className="main">
      <div className="header">
        <h1 style={{textAlign: "center"}}>Sudoku Solver</h1>
        <div className="button-container">
          <button onClick={() => setChunkSize(2)}>2 x 2</button>
          <button onClick={() => setChunkSize(3)}>3 x 3</button>
          <button onClick={() => {
            setDisplayMatrix(createEmptyMatrix(chunkSize));
          }}>Reset</button>
          <button onClick={() => {
            const result = solve({chunkSize: chunkSize, matrix: displayMatrix});
            setDisplayMatrix(result.result);
          }}>Solve</button>
        </div>
      </div>
      <div className="container" style={{width: width}}>
        {gridLines(chunkSize, width)}
        {mapToGrid(copyMatrix(displayMatrix), setDisplayMatrix)}
      </div>
    </div>
  );
}

function gridLines(chunkSize: number, containerWidth: number): JSX.Element[] {
  const width = 50 * chunkSize - chunkSize;
  const elements: JSX.Element[] = [];

  elements.push(<div key={"main"} className="grid"
    style={{
      top: -1,
      left: -1,
      width: containerWidth - 3,
      height: containerWidth - 3}}
    />);

  for (let x = 0; x < chunkSize; x++) {
    for (let y = 0; y < chunkSize; y++) {
      elements.push(<div key={`${x} ${y}`} className="grid"
      style={{
        top: -1 + width * y,
        left: -1 + width * x,
        width: width - 3,
        height: width - 3
      }} />);
    }
  }

  return elements;
}

function mapToGrid(displayMatrix: Matrix, setDisplayMatrix: StateAction<Matrix>): JSX.Element[] {
  const length = displayMatrix.length;
  const elements: JSX.Element[] = [];
  for (let y = 0; y < length; y++) {
    elements.push(<div key={y} className="row" style={{width: 50 * displayMatrix.length - displayMatrix.length}}>
        {mapToRow(y, displayMatrix, setDisplayMatrix)}
      </div>
    );
  }

  return elements;
}

function mapToRow(y: number, displayMatrix: Matrix, setDisplayMatrix: StateAction<Matrix>): JSX.Element[] {
  const elements: JSX.Element[] = [];
  const allowedValues: string[] = []
  allowedValues.push("");
  for (let x = 1; x <= displayMatrix.length; x++) {
    allowedValues.push(`${x}`)
  }
  for (let x = 0; x < displayMatrix.length; x++) {
    const value = displayMatrix[x][y] !== EMPTY_VALUE ? `${displayMatrix[x][y]}` : "";
    elements.push(
      <select key={x} style={{width: 50, height: 50}} value={value} 
        onChange={(ev: any) => onItemClick(ev.target.value, x, y, displayMatrix, setDisplayMatrix)}>
      {allowedValues.map(option => <option key={option} value={option}>{option}</option>)}
      </select>
    );
  }
  return elements;
}

function onItemClick(value: any, x: number, y: number, displayMatrix: Matrix, setDisplayMatrix: StateAction<Matrix>) {
  if (value === undefined || value === "") {
    displayMatrix[x][y] = EMPTY_VALUE;
    setDisplayMatrix(displayMatrix);
  } else {
    const newValue = parseInt(value);
    if (newValue >= 1 && newValue <= displayMatrix.length) {
      displayMatrix[x][y] = newValue;
      setDisplayMatrix(displayMatrix);
    }
  }
}

function createEmptyMatrix(chunkSize: number): Matrix {
  const matrix: Matrix = [];
  for (let x = 0; x < Math.pow(chunkSize, 2); x++) {
    matrix[x] = [];
    for (let y = 0; y < Math.pow(chunkSize, 2); y++) {
      matrix[x][y] = EMPTY_VALUE;
    }
  }
  return matrix;
}

export default App;

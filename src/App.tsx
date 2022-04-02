import React, { useEffect, useMemo, useState } from 'react';
import './App.css';
import { EXAMPLE_EVIL_1 } from './exampleData';
import './solver/solver';
import { copyMatrix, EMPTY_VALUE, solve } from './solver/solver';
import { BaseMatrix, Matrix, SolveStep } from './solver/types';

type StateAction<T> = React.Dispatch<React.SetStateAction<T>>;
export type DisplayMatrix = BaseMatrix<DisplayValue>;

interface DisplayValue {
  value: number,
  input: boolean,
  solveStep: boolean,
  currentStep: boolean
}

const SQUARE_LENGTH = 75;
const EMPTY_DISPLAY_VALUE = {value: EMPTY_VALUE, input: false,  solveStep: false, currentStep: false};

function App() {
  const [chunkSize, setChunkSize] = useState(3);
  const [inputMatrix, setInputMatrix] = useState<DisplayMatrix>([]);
  const [displayMatrix, setDisplayMatrix] = useState<DisplayMatrix>([]);
  const [solveSteps, setSolveSteps] = useState<SolveStep[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(-1);
  const [solved, setSolved] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const reset = useMemo(() => (chunkSize: number, displayMatrix: DisplayMatrix) => {
    setDisplayMatrix(EXAMPLE_EVIL_1);
    setInputMatrix(displayMatrix);
    setSolveSteps([]);
    setCurrentStep(-1);
    setSolved(false);
    setError(null);
  }, [])

  useEffect(() => {
    reset(chunkSize, displayMatrix);
  }, [chunkSize]);

  useEffect(() => {
    if (solved) {
      setDisplayMatrix(appendSteps(inputMatrix, solveSteps, currentStep));
    }
  }, [solved, inputMatrix, solveSteps, currentStep])

  const width = SQUARE_LENGTH * displayMatrix.length - displayMatrix.length;
  return (
    <div className="main">
      <div className="header">
        <h1 style={{textAlign: "center"}}>Sudoku Solver</h1>
        <div className="button-container">
          <button onClick={() => setChunkSize(2)}>2 x 2</button>
          <button onClick={() => setChunkSize(3)}>3 x 3</button>
          <button onClick={() => reset(chunkSize, displayMatrix)}>Reset</button>
          {
            solved ? 
            <button onClick={() => {
              setInputMatrix(displayMatrix);
              setSolveSteps([]);
              setCurrentStep(-1);
              setSolved(false);
              setError(null);
            }}>Unlock</button> :
            <button onClick={() => {
              const result = solve({chunkSize: chunkSize, matrix: displayToNumberMatrix(displayMatrix)});
              if (result.steps.length > 0) {
                setInputMatrix(displayMatrix);
                setSolveSteps(result.steps);
                setSolved(true);
                if (result.error !== undefined) {
                  setError(result.error);
                }
              } else {
                setError("No solve steps!");
              }
            }}>Solve</button>
          }
        </div>
        <div className="button-container" style={{display: solveSteps.length === 0 ? "none" : "flex"}}>
        <button disabled={currentStep === -1} 
            onClick={() => setCurrentStep(-1)}>None</button>
          <button disabled={currentStep === -1} 
            onClick={() => setCurrentStep(currentStep - 1)}>Prev. Step</button>
          <button disabled={solveSteps.length - 1 === currentStep} 
            onClick={() => setCurrentStep(currentStep + 1)}>Next Step</button>
          <button disabled={solveSteps.length - 1 === currentStep} 
            onClick={() => setCurrentStep(solveSteps.length - 1)}>Show All</button>
        </div>
      </div>
      <div className="container" style={{width: width}}>
        {gridLines(chunkSize, width)}
        {mapToGrid(copyMatrix(displayMatrix), setDisplayMatrix, solved)}
      </div>
      {error !== null && <div className="container" style={{width: width}}>
        {error}
      </div>}
    </div>
  );
}

function gridLines(chunkSize: number, containerWidth: number): JSX.Element[] {
  const width = SQUARE_LENGTH * chunkSize - chunkSize;
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

function mapToGrid(displayMatrix: DisplayMatrix, setDisplayMatrix: StateAction<DisplayMatrix>, solved: boolean): JSX.Element[] {
  const length = displayMatrix.length;
  const elements: JSX.Element[] = [];
  for (let y = 0; y < length; y++) {
    elements.push(<div key={y} className="row" style={{width: SQUARE_LENGTH * displayMatrix.length - displayMatrix.length}}>
        {mapToRow(y, displayMatrix, setDisplayMatrix, solved)}
      </div>
    );
  }

  return elements;
}

function mapToRow(y: number, displayMatrix: DisplayMatrix, setDisplayMatrix: StateAction<DisplayMatrix>, solved: boolean): JSX.Element[] {
  const elements: JSX.Element[] = [];
  const allowedValues: string[] = []
  allowedValues.push("");
  for (let x = 1; x <= displayMatrix.length; x++) {
    allowedValues.push(`${x}`)
  }
  for (let x = 0; x < displayMatrix.length; x++) {
    const value = displayMatrix[x][y].value !== EMPTY_VALUE ? `${displayMatrix[x][y].value}` : "";
    elements.push(
      <select key={x}
        style={{width: SQUARE_LENGTH, height: SQUARE_LENGTH}}
        value={value}
        className={getClassForDisplayValue(displayMatrix[x][y])}
        disabled={solved}
        onChange={(ev: any) => onItemClick(ev.target.value, x, y, displayMatrix, setDisplayMatrix)}>
      {allowedValues.map(option => <option key={option} value={option}>{option}</option>)}
      </select>
    );
  }
  return elements;
}

function onItemClick(value: any, x: number, y: number, displayMatrix: DisplayMatrix, setDisplayMatrix: StateAction<DisplayMatrix>) {
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

function getClassForDisplayValue(value: DisplayValue): string {
  if (value.currentStep) {
    return "current-step";
  } else if (value.solveStep) {
    return "step";
  } else {
    return "";
  }
}

function createEmptyMatrix(chunkSize: number): DisplayMatrix {
  const matrix: DisplayMatrix = [];
  for (let x = 0; x < Math.pow(chunkSize, 2); x++) {
    matrix[x] = [];
    for (let y = 0; y < Math.pow(chunkSize, 2); y++) {
      matrix[x][y] = EMPTY_DISPLAY_VALUE;
    }
  }
  return matrix;
}

function appendSteps(baseMatrix: DisplayMatrix, solveSteps: SolveStep[], currentStep: number): DisplayMatrix {
  const displayMatrix = copyMatrix(baseMatrix);
  if (solveSteps.length === 0 || currentStep === -1) {
    return displayMatrix;
  }

  for(let i = 0; i < currentStep + 1; i++) {
    const step = solveSteps[i];
    displayMatrix[step.position.x][step.position.y] = {
      value: step.value,
      input: false,
      solveStep: true,
      currentStep: i === currentStep
    }
  }

  return displayMatrix;
}

function displayToNumberMatrix(source: DisplayMatrix): Matrix {
  const destination: Matrix = []

  for (let x = 0; x < source.length; x++) {
    destination[x] = []
    for (let y = 0; y < source[x].length; y++) {
      destination[x][y] = source[x][y].value;
    }
  }

  return destination;
}

export default App;

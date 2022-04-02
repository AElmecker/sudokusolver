import React, { useEffect, useMemo, useState } from 'react';
import './App.css';
import Grid from './component/Grid';
import './solver/solver';
import { copyMatrix, EMPTY_VALUE, solve } from './solver/solver';
import { Matrix, SolveStep } from './solver/types';
import { DisplayMatrix, DisplayValue } from './types';

const SQUARE_LENGTH = 75;
export const EMPTY_DISPLAY_VALUE: DisplayValue = {value: EMPTY_VALUE, input: false,  solveStep: false, currentStep: false, invalid: false};

function App() {
  const [chunkSize, setChunkSize] = useState(3);
  const [inputMatrix, setInputMatrix] = useState<DisplayMatrix>(createEmptyMatrix(chunkSize));
  const [displayMatrix, setDisplayMatrix] = useState<DisplayMatrix>(createEmptyMatrix(chunkSize));
  const [solveSteps, setSolveSteps] = useState<SolveStep[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(-1);
  const [solved, setSolved] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const reset = useMemo(() => (chunkSize: number) => {
    setChunkSize(chunkSize);
    setDisplayMatrix(createEmptyMatrix(chunkSize));
    setInputMatrix(createEmptyMatrix(chunkSize));
    setSolveSteps([]);
    setCurrentStep(-1);
    setSolved(false);
    setError(null);
  }, [])

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
          <button disabled={chunkSize===2} onClick={() => chunkSize !== 2 && reset(2)}>2 x 2</button>
          <button disabled={chunkSize===3} onClick={() => chunkSize !== 3 && reset(3)}>3 x 3</button>
          <button onClick={() => reset(chunkSize)}>Reset</button>
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
              if (containsNoInput(displayMatrix)) {
                setError("Please provide an input!");
                return;
              }
              if (containsInvalidInput(displayMatrix)) {
                setError("Input is invalid!");
                return;
              }

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
      <Grid displayMatrix={copyMatrix(displayMatrix)} setDisplayMatrix={setDisplayMatrix} solved={solved} gridItemLength={SQUARE_LENGTH} chunkSize={chunkSize} width={width} />
      {error !== null && <div className="container" style={{width: width}}>
        {error}
      </div>}
    </div>
  );
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
      currentStep: i === currentStep,
      invalid: false
    }
  }

  return displayMatrix;
}

export function displayToNumberMatrix(source: DisplayMatrix): Matrix {
  const destination: Matrix = []

  for (let x = 0; x < source.length; x++) {
    destination[x] = []
    for (let y = 0; y < source[x].length; y++) {
      destination[x][y] = source[x][y].value;
    }
  }

  return destination;
}

function containsInvalidInput(source: DisplayMatrix): boolean {
  for (let x = 0; x < source.length; x++) {
    for (let y = 0; y < source[x].length; y++) {
      if (source[x][y].invalid) {
        return true;
      }
    }
  }

  return false;
}

function containsNoInput(source: DisplayMatrix): boolean {
  for (let x = 0; x < source.length; x++) {
    for (let y = 0; y < source[x].length; y++) {
      if (source[x][y].value !== EMPTY_VALUE) {
        return false;
      }
    }
  }

  return true;
}

export default App;

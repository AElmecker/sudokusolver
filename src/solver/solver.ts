import { Matrix, Position, SolveInput, SolveResult, SolveStep } from "./types";

export const EMPTY_VALUE = 0
const MAX_ITERATIONS = 250;

export function solve(input: SolveInput): SolveResult {
  validateInput(input);
  const allowedValues = getAllowedValues(input.chunkSize);
  const resultMatrix = copyMatrix(input.matrix)
  const steps: SolveStep[] = []

  let unsolvedPosition = getFirstUnsolvedPosition(null, resultMatrix);
  let iterations = 0;
  let currentStep = 0;
  while (unsolvedPosition !== null && iterations < MAX_ITERATIONS) {
    const possibleValues = getPossibleValues(allowedValues, input.chunkSize, resultMatrix, unsolvedPosition);

    if (possibleValues.length === 0) {
      console.log(`something went wrong, there should be at least one possible value for x=${unsolvedPosition.x}, y=${unsolvedPosition.y}`);
    } else if (possibleValues.length === 1) {
      console.log(`Found match: x=${unsolvedPosition.x}, y=${unsolvedPosition.y}, val=${possibleValues[0]}`)
      resultMatrix[unsolvedPosition.x][unsolvedPosition.y] = possibleValues[0];
      steps.push({
        position: unsolvedPosition,
        step: currentStep,
        value: possibleValues[0]
      });
      currentStep++;
    } else {
      console.log(`skipping x=${unsolvedPosition.x}, y=${unsolvedPosition.y}, too many possibilities currently: ${possibleValues}`);
    }

    // these statements need to be at last in while
    unsolvedPosition = getFirstUnsolvedPosition(unsolvedPosition, resultMatrix);
    if (unsolvedPosition === null) {
      // check whole matrix again if there are still unsolved positions
      unsolvedPosition = getFirstUnsolvedPosition(null, resultMatrix);
    }
    iterations++;
  }

  return {
    input: input,
    steps: steps,
    result: resultMatrix
  }
}

function getFirstUnsolvedPosition(last: Position | null, matrix: Matrix): Position | null {
  let startX = 0;
  let startY = 0;

  if (last !== null) {
    if ((last.y + 1) < matrix[last.x].length) {
      startX = last.x;
      startY = last.y + 1;
    } else {
      if ((last.x + 1) < matrix.length) {
        startX = last.x + 1;
        startY = 0;
      }
    }
  }

  for (let x = startX; x < matrix.length; x++) {
    for (let y = startY; y < matrix[x].length; y++) {
      if (matrix[x][y] === EMPTY_VALUE) {
        return { x: x, y: y };
      }
    }
  }

  return null;
}

function getPossibleValues(allowedValues: number[], chunkSize: number, matrix: Matrix, position: Position): number[] {
  const usedValues = [];
  usedValues.push(...getUsedValuesFromChunk(chunkSize, matrix, position));
  usedValues.push(...getUsedValuesFromAxisX(matrix, position));
  usedValues.push(...getUsedValuesFromAxisY(matrix, position));
  // distinct items
  const distinctValues = usedValues.filter((value, index, self) => self.indexOf(value) === index);

  return allowedValues.filter(item => distinctValues.indexOf(item) < 0);
}


function getUsedValuesFromChunk(chunkSize: number, matrix: Matrix, position: Position): number[] {
  const usedValues: number[] = []
  const chunkX = Math.floor(position.x/chunkSize);
  const chunkY = Math.floor(position.y/chunkSize);

  for (let x = 0; x < chunkSize; x++) {
    for (let y = 0; y < chunkSize; y++) {
      const actualX = (chunkX * chunkSize) + x;
      const actualY = (chunkY * chunkSize) + y;
      const value = matrix[actualX][actualY];
      if (value !== EMPTY_VALUE) {
        usedValues.push(value);
      }
    }
  }

  return usedValues;
}

function getUsedValuesFromAxisY(matrix: Matrix, position: Position): number[] {
  const usedValues: number[] = []

  for (let y = 0; y < matrix[position.x].length; y++) {
    if (y !== position.y) {
      const value = matrix[position.x][y];
      if (value !== EMPTY_VALUE) {
        usedValues.push(value);
      }
    }
  }

  return usedValues;
}

function getUsedValuesFromAxisX(matrix: Matrix, position: Position): number[] {
  const usedValues: number[] = []

  // push all values which are already used in the x axis
  for (let x = 0; x < matrix.length; x++) {
    if (x !== position.x) {
      const value = matrix[x][position.y];
      if (value !== EMPTY_VALUE) {
        usedValues.push(value);
      }
    }
  }

  return usedValues;
}

function getAllowedValues(chunkSize: number): number[] {
  const allowedValues = [];
  for (let i = 1; i <= Math.pow(chunkSize, 2); i++) {
    allowedValues.push(i);
  }
  return allowedValues;
}

export function copyMatrix(source: Matrix): Matrix {
  const destination: Matrix = []

  for (let x = 0; x < source.length; x++) {
    destination[x] = []
    for (let y = 0; y < source[x].length; y++) {
      destination[x][y] = source[x][y];
    }
  }

  return destination;
}

function validateInput(input: SolveInput) {
  // check chunk size greater 0
  if (input.chunkSize <= 0) {
    throw new Error(`chunk size must be greater than 0 but was ${input.chunkSize}!`);
  }

  // check x axis is chunkSize^2
  const expectedMax = Math.pow(input.chunkSize, 2);
  if (input.matrix.length !== expectedMax) {
    throw new Error(`matrix axis x must be exactly ${expectedMax} but was ${input.matrix.length}`);
  }

  // check y axis of each x is chunkSize^2
  for (let x = 0; x < input.matrix.length; x++) {
    if (input.matrix[x].length !== expectedMax) {
      throw new Error(`matrix axis y (of x=${x}) must be exactly ${expectedMax} but was ${input.matrix[x].length}`);
    }
  }

  // check if every value is between 1 and chunkSize^2 or EMPTY_VALUE
  for (let x = 0; x < input.matrix.length; x++) {
    for (let y = 0; y < input.matrix[x].length; y++) {
      const value = input.matrix[x][y];
      if ((value < 1 || value > expectedMax) && value !== EMPTY_VALUE) {
        throw new Error(`value of ${x}/${y} must be between 1 and ${expectedMax} (or ${EMPTY_VALUE}) but was ${value}}`);
      }
    }
  }
}
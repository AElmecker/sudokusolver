export type BaseMatrix<T> = T[][];
export type Matrix = BaseMatrix<number>;

export interface SolveInput {
  chunkSize: number,
  matrix: number[][]
}

export interface Position {
  x: number,
  y: number
}

export interface SolveStep {
  step: number,
  position: Position,
  value: number
}

export interface SolveResult {
  input: SolveInput,
  steps: SolveStep[],
  result: number[][],
  error?: string
}

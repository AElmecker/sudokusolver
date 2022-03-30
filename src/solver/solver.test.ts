import { Matrix, SolveInput } from "./types";
import * as solver from './solver'

test.each([
  [[]],
  [[[], []]],
  [createMatrix()]
])('copied matrix equals source', (source: Matrix) => {
  expect(solver.copyMatrix(source)).toStrictEqual(source);
});

test('changing source after copy does not affect destination', () => {
  const source = createMatrix();
  const destination = solver.copyMatrix(source);
  expect(destination).toStrictEqual(source);

  source[0][0] = 1000;
  expect(destination).not.toEqual(source);
  expect(destination[0][0]).toEqual(0);
  expect(source[0][0]).toEqual(1000);
});

test('changing destination after copy does not affect source', () => {
  const source = createMatrix();
  const destination = solver.copyMatrix(source);
  expect(destination).toStrictEqual(source);

  destination[0][0] = 1000;
  expect(destination).not.toEqual(source);
  expect(source[0][0]).toEqual(0);
  expect(destination[0][0]).toEqual(1000);
});

test('simpler 2x2 sudoku can be solved', () => {
  const input: SolveInput = {
    chunkSize: 2,
    matrix: [
      [1, 0, 0, 0],
      [3, 2, 0, 4],
      [2, 0, 4, 0],
      [0, 1, 0, 2]
    ]
  };
  const output = solver.solve(input);
  expect(output.result).toEqual([
    [1, 4, 2, 3],
    [3, 2, 1, 4],
    [2, 3, 4, 1],
    [4, 1, 3, 2]
  ]);
  expect(output.steps.length).toEqual(8);
});

test('simple 2x2 sudoku can be solved', () => {
  const input: SolveInput = {
    chunkSize: 2,
    matrix: [
      [3, 0, 0, 0],
      [0, 0, 1, 0],
      [0, 2, 0, 0],
      [0, 0, 0, 2]
    ]
  };
  const output = solver.solve(input);
  expect(output.result).toEqual([
    [3, 1, 2, 4],
    [2, 4, 1, 3],
    [4, 2, 3, 1],
    [1, 3, 4, 2]
  ]);
  expect(output.steps.length).toEqual(12);
});

test.skip('simple 3x3 sudoku can be solved', () => {
  const input: SolveInput = {
    chunkSize: 3,
    matrix: [
      [0, 7, 0, 8, 0, 0, 0, 9, 0],
      [3, 0, 0, 6, 0, 7, 2, 0, 4],
      [0, 2, 0, 0, 1, 0, 0, 0, 0],
      [0, 6, 0, 0, 7, 0, 0, 4, 2],
      [0, 0, 3, 5, 0, 8, 9, 0, 0],
      [7, 8, 0, 0, 9, 0, 0, 6, 0],
      [0, 0, 0, 0, 4, 0, 0, 7, 0],
      [4, 0, 6, 7, 0, 5, 0, 0, 8],
      [0, 5, 0, 0, 0, 2, 0, 3, 0]
    ]
  };
  const output = solver.solve(input);
  expect(output.result).toEqual([
    [5, 7, 4, 8, 2, 3, 6, 9, 1],
    [3, 1, 9, 6, 5, 7, 2, 8, 4],
    [6, 2, 8, 4, 1, 9, 7, 5, 3],
    [9, 6, 5, 3, 7, 1, 8, 4, 2],
    [2, 4, 3, 5, 6, 8, 9, 1, 7],
    [7, 8, 1, 2, 9, 4, 3, 6, 5],
    [8, 3, 2, 1, 4, 6, 5, 7, 9],
    [4, 9, 6, 7, 3, 5, 1, 2, 8],
    [1, 5, 7, 9, 8, 2, 4, 3, 6]
  ]);
  expect(output.steps.length).toEqual(49);
});

function createMatrix(): Matrix {
  const matrix: Matrix = [];
  for (let x = 0; x < 5; x++) {
    matrix[x] = [];
    for (let y = 0; y < 5; y++) {
      matrix[x][y] = x * y;
    }
  }
  return matrix;
}
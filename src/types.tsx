import { BaseMatrix } from "./solver/types";

export type StateAction<T> = React.Dispatch<React.SetStateAction<T>>;
export type DisplayMatrix = BaseMatrix<DisplayValue>;

export interface DisplayValue {
  value: number,
  input: boolean,
  solveStep: boolean,
  currentStep: boolean,
  invalid: boolean
}

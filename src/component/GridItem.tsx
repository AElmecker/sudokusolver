import { useMemo } from 'react';
import { EMPTY_VALUE } from '../solver/solver';
import { DisplayValue } from '../types';
import './GridItem.css';

export interface GridItemProps {
  value: DisplayValue,
  length: number,
  disabled?: boolean,
  allowedValues: string[],
  onChange?: (value: string | undefined) => void
}

function GridItem(props: GridItemProps): JSX.Element {
  const optionsList: JSX.Element[] = useMemo(() => {
    return props.allowedValues.map(option => <option key={option} value={option}>{option}</option>);
  }, [props.allowedValues]);

  return(
    <select
      value={props.value.value !== EMPTY_VALUE ? `${props.value.value}` : ""} 
      className={getClassForDisplayValue(props.value)} style={{width: props.length, height: props.length}}
      disabled={props.disabled !== undefined ? props.disabled : false}
      onChange={(ev: any) => {
        if (props.onChange !== undefined) {
          props.onChange(ev.target.value);
        }
      }}>
      {optionsList}
    </select>
  );
}

function getClassForDisplayValue(value: DisplayValue): string {
  if (value.currentStep) {
    return "current-step";
  } else if (value.solveStep) {
    return "step";
  } else if (value.invalid) {
    return "invalid-input";
   }else {
    return "";
  }
}

export default GridItem;
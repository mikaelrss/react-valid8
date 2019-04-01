import * as React from "react";
import style from "./style.css";
import { IFieldState } from "./Form";

interface IProps {
  elem: React.ReactElement;
  fieldState: IFieldState;
  onChange: any;
  onBlur: any;
  error?: string;
}

const ErrorInput = ({ elem, fieldState, onChange, error, onBlur }: IProps) => {
  const value = fieldState ? fieldState.value : "";
  const pristine = fieldState ? fieldState.pristine : true;
  return (
    <div>
      {React.cloneElement(elem, { value, onChange, onBlur })}
      {!pristine && <span className={style.error}>{error}</span>}
    </div>
  );
};

export default ErrorInput;

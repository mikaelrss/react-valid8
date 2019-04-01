import * as React from "react";
import classNames from "classnames";


import { IFieldState } from "./Form";

type IProps = {
  elem: React.ReactElement;
  fieldState: IFieldState;
  onChange: any;
  onBlur: any;
  error?: string;
  errorInputStyle?: string;
  errorStyle?: string;
};

const ErrorInput = ({
  elem,
  fieldState,
  onChange,
  error,
  onBlur,
  errorInputStyle,
  errorStyle
}: IProps) => {
  const value = fieldState ? fieldState.value : "";
  const pristine = fieldState ? fieldState.pristine : true;
  const hasError = !pristine && !!error;
  return (
    <>
      {React.cloneElement(elem, {
        value,
        onChange,
        onBlur,
        className: classNames(elem.props.className, {
          [errorInputStyle || ""]: hasError
        }),
        "aria-invalid": hasError
      })}
      {hasError && (
        <span className={classNames({ [errorStyle || ""]: hasError })}>
          {error}
        </span>
      )}
    </>
  );
};

export default ErrorInput;

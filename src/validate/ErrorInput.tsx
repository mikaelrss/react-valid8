import * as React from "react";
import classNames from "classnames";

import { IFieldState } from "./Form";

type IProps = {
  elem: React.ReactElement;
  fieldState: IFieldState;
  onChange: any;
  onBlur: any;
  error?: string;
  errorInputClassName?: string;
  errorClassName?: string;
};

const ErrorInput = ({
  elem,
  fieldState,
  onChange,
  error,
  onBlur,
  errorInputClassName,
  errorClassName
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
          [errorInputClassName || ""]: hasError
        }),
        "aria-invalid": hasError
      })}
      {hasError && (
        <span className={classNames({ [errorClassName || ""]: hasError })}>
          {error}
        </span>
      )}
    </>
  );
};

export default ErrorInput;

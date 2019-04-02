import * as React from "react";
import classNames from "classnames";

import { IFieldState } from "./Form";

type IProps = {
  elem: React.ReactElement;
  fieldState: IFieldState;
  onChange: any;
  onBlur: any;
  injectErrorAsProps?: boolean;
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
  errorClassName,
  injectErrorAsProps
}: IProps) => {
  const value = fieldState ? fieldState.value : "";
  const pristine = fieldState ? fieldState.pristine || false : true;
  const shouldShowError = !pristine && !!error;
  const shouldInject = injectErrorAsProps || elem.props.injectErrorAsProps;
  const injectProps = shouldInject
    ? {
        error,
        showError: shouldShowError
      }
    : {};
  return (
    <>
      {React.cloneElement(elem, {
        ...elem.props,
        value,
        onChange,
        onBlur,
        className: classNames(elem.props.className, {
          [errorInputClassName || ""]: shouldShowError
        }),
        "aria-invalid": shouldShowError,
        ...injectProps
      })}
      {shouldShowError && !shouldInject && (
        <span
          className={classNames({ [errorClassName || ""]: shouldShowError })}
        >
          {error}
        </span>
      )}
    </>
  );
};

export default ErrorInput;

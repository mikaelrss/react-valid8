import React, { ChangeEvent } from "react";
import moize from "moize";
import isUrl from "is-url";

import ErrorInput from "./ErrorInput";

type ValueMap = { [key: string]: string | number | null };

type ErrorMap = ValueMap | {};

export type UtilFunctions = {
  isUrl: (url: string) => boolean;
};

type IValidateFunction = (values: ValueMap, utils?: UtilFunctions) => ErrorMap;

export interface IFieldState {
  value: any;
  pristine?: boolean;
}

export interface IProps {
  validate: IValidateFunction;
  submit: (values: ValueMap) => void;
  injectErrorAsProps?: boolean;
  children?: React.ReactNode;
  initialValues?: ValueMap;
  errorInputClassName?: string;
  errorClassName?: string;
  formClassName?: string;
}

interface IState {
  [key: string]: IFieldState;
}

class Form extends React.Component<IProps, IState> {
  state = {};

  componentDidMount() {
    console.log("HOLLO HOT RELEAD");
    this.setInitialValues();
  }

  utils: UtilFunctions = {
    isUrl
  };

  mapStateToValues = () =>
    Object.keys(this.state).reduce(
      (acc, key) => ({
        ...acc,
        [key]: this.state[key].value
      }),
      {}
    );

  someFieldsPristine = () =>
    Object.values(this.state).some((field: IFieldState) => !!field.pristine);

  setInitialValues = () => {
    const { children } = this.props;
    const fields = {};
    // @ts-ignore
    const childs = React.Children.toArray(children)
      .reduce(
        (arr: React.ReactElement[], el: React.ReactElement) => [
          ...arr,
          el,
          ...el.props.children
        ],
        []
      )
      // @ts-ignore
      .filter(element => element && element.props && element.props.name);
    childs.forEach((elem: React.ReactElement) => {
      const name = elem.props.name;
      fields[name] = {
        value: this.props.initialValues
          ? this.props.initialValues[name] || ""
          : "",
        pristine: true
      };
    });

    this.setState(fields);
  };

  setFormAsTouched = () => {
    this.setState(state =>
      Object.keys(state).reduce(
        (acc, key) => ({
          ...acc,
          [key]: {
            ...state[key],
            pristine: false
          }
        }),
        {}
      )
    );
  };

  setValueState = (field: string, state: IFieldState) => {
    this.setState({
      [field]: state
    });
  };

  validate = (values: ValueMap): ErrorMap =>
    this.props.validate(values, this.utils);

  handleSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();
    if (this.someFieldsPristine()) this.setFormAsTouched();
    const { submit } = this.props;
    const values = this.mapStateToValues();
    const errors = this.validate(values);
    if (Object.keys(errors).length <= 0) submit(values);
  };

  renderErrorInput = moize(
    (
      name: string,
      elem: React.ReactElement,
      error: string,
      fieldState: IFieldState
    ) => (
      <ErrorInput
        key={name}
        elem={elem}
        fieldState={fieldState}
        onChange={({
          currentTarget: { value, checked }
        }: ChangeEvent<HTMLInputElement>) => {
          this.setValueState(name, {
            value: value === "on" ? checked : value
          });
        }}
        onBlur={() => {
          this.setValueState(name, {
            // @ts-ignore
            ...this.state[name],
            pristine: false
          });
        }}
        injectErrorAsProps={this.props.injectErrorAsProps}
        error={error}
        errorInputClassName={this.props.errorInputClassName}
        errorClassName={this.props.errorClassName}
      />
    )
  );

  findValueElement = (elem: React.ReactElement, errors: any): any => {
    if (!elem.props) return elem;
    const { name, children } = elem.props;
    if (name)
      return this.renderErrorInput(name, elem, errors[name], this.state[name]);
    if (children) {
      return React.cloneElement(elem, {
        ...elem.props,
        children: React.Children.map(
          elem.props.children,
          (child: React.ReactElement) => this.findValueElement(child, errors)
        )
      });
    }
    return elem;
  };

  renderChildren = (children: React.ReactNode) => {
    const errors = this.validate(this.mapStateToValues());
    const valueElementErrors = (elem: React.ReactElement) =>
      this.findValueElement(elem, errors);

    return React.Children.map(children, valueElementErrors);
  };

  render() {
    const { children, formClassName } = this.props;
    return (
      <form onSubmit={this.handleSubmit} className={formClassName}>
        {this.renderChildren(children)}
      </form>
    );
  }
}

export default Form;

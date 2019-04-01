import * as React from "react";

import ErrorInput from "./ErrorInput";

type ValueMap = { [key: string]: string | number | null };

type ErrorMap = ValueMap | {};

type IValidateFunction = (values: ValueMap) => ErrorMap;

export interface IFieldState {
  value: any;
  pristine?: boolean;
}

interface IProps {
  children: React.ReactNode;
  validate: IValidateFunction;
  submit: (values: ValueMap) => void;
  initialValues?: ValueMap;
  errorInputStyle?: string;
  errorStyle?: string;
  formStyle?: string;
}

interface IState {
  [key: string]: IFieldState;
}

class Form extends React.Component<IProps, IState> {
  state = {};

  componentDidMount() {
    this.setInitialValues();
  }

  mapStateToValues = () =>
    Object.keys(this.state).reduce(
      (acc, key) => ({
        ...acc,
        [key]: this.state[key].value
      }),
      {}
    );

  allFieldsPristine = () =>
    Object.values(this.state).every((field: IFieldState) => !!field.pristine);

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

  handleSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();
    const { validate, submit } = this.props;
    if (this.allFieldsPristine()) {
      this.setFormAsTouched();
      return;
    }
    const values = this.mapStateToValues();
    const errors = validate(values);
    if (Object.keys(errors).length <= 0) submit(values);
  };

  renderErrorInput = (
    name: string,
    elem: React.ReactElement,
    error: string
  ) => (
    <ErrorInput
      key={name}
      elem={elem}
      fieldState={this.state[name]}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
        this.setValueState(name, {
          value: e.target.value
        });
      }}
      onBlur={() => {
        this.setValueState(name, {
          // @ts-ignore
          ...this.state[name],
          pristine: false
        });
      }}
      error={error}
      errorInputStyle={this.props.errorInputStyle}
      errorStyle={this.props.errorStyle}
    />
  );

  findValueElement = (elem: React.ReactElement, errors: any): any => {
    if (!elem.props) return elem;
    const { name, children } = elem.props;
    if (name) return this.renderErrorInput(name, elem, errors[name]);
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

  render() {
    const { children, validate, formStyle } = this.props;
    const errors = validate(this.mapStateToValues());
    const valueElementErrors = (elem: React.ReactElement) =>
      this.findValueElement(elem, errors);
    return (
      <form onSubmit={this.handleSubmit} className={formStyle}>
        {React.Children.map(children, valueElementErrors)}
      </form>
    );
  }
}

export default Form;

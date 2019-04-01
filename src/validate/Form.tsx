import * as React from "react";

import style from "./style.css";
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
}

interface IState {
  [key: string]: IFieldState;
}

class FormParent extends React.Component<IProps, IState> {
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

  isElementValue = (elem: React.ReactElement) => !!elem.props.name;

  allFieldsPristine = () =>
    Object.values(this.state).every((field: IFieldState) => !!field.pristine);

  setInitialValues = () => {
    const { children } = this.props;
    const fields = {};
    React.Children.map(children, (elem: React.ReactElement) => {
      const name = elem.props.name;
      if (this.isElementValue(elem)) {
        fields[name] = {
          value: this.props.initialValues
            ? this.props.initialValues[name] || ""
            : "",
          pristine: true
        };
      }
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
    if (Object.keys(validate(values)).length <= 0) submit(values);
  };

  render() {
    const { children, validate } = this.props;
    const errors = validate(this.mapStateToValues());
    return (
      <form onSubmit={this.handleSubmit} className={style.columns}>
        {React.Children.map(children, (elem: React.ReactElement) => {
          const { name } = elem.props;
          if (!name) return React.cloneElement(elem);
          return (
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
                  ...this.state[name],
                  pristine: false
                });
              }}
              error={errors[name]}
            />
          );
        })}
      </form>
    );
  }
}

export default FormParent;

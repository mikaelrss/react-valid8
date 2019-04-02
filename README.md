# react-valid8

> Validation library for React forms

[![NPM](https://img.shields.io/npm/v/react-valid8.svg)](https://www.npmjs.com/package/react-valid8) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save react-valid8
```

or

```
yarn add react-valid8
```

## Usage

react-valid8 follows a redux-form style way of validating forms. It provides a simple way of
displaying error messages by their rightful input fields. Just wrap your input fields in the `Form`
component, and give the field a `name` property, and `react-valid8` will automatically pick up the input
field and give the correct errors to the correct fields.

```jsx harmony
import React from "react";
import Form from "react-valid8";

class MyComponent extends React.Component {
  handleSubmit = values => {
    // Retrieves the values from the form so you can do whatever you like in your submit
  };

  validateValues = values => {
    const errors = {};
    if (!values.title) errors.title = "Title is required";
    if (!values.description) errors.description = "Description is required";
    if (!values.category) errors.category = "Category is required";
    if (!values.amount) errors.amount = "Amount is required";
    if (isNaN(values.amount)) errors.amount = "Amount must be a number";
    return errors;
  };

  render() {
    return (
      <Form
        validate={this.validateValues}
        submit={this.handleSubmit}
        initialValues={{
          title: "Very title",
          category: "Option A",
          amount: 12
        }}
      >
        <label>
          This is a label, nesting the named field
          <input type="text" name="title" />
        </label>
        <input />
        <input type="textarea" name="description" />
        <select name="category">
          <option>Option A</option>
          <option>Option B</option>
          <option>Option C</option>
        </select>
        <input type="text" name="amount" />
        <input />
        <button>Submit</button>
      </Form>
    );
  }
}
```

## Props

```typescript jsx
type IMap = {
  [key: string]: any;
};

interface IProps {
  validate: (values: IMap) => IMap; // custom function to provide error messages based on validation
  //provides error messages to fields corresponding to kep value
  submit: (values: IMap) => void; // custom function for handling submitting.
  // Will be called when the form has no errors
  initialValues?: IMap; // an object containing initial values of fields. (optional)
  errorInputClassName?: string; // className to style the input field on error (optional)
  errorClassName?: string; // className to style the error message field on error (optional)
  formClassName?: string; // className to style the form (optional)
  injectErrorsAsProps?: boolean;
}
```

### Child component props

Each child of the `Form` component that wants to register error messages needs to be decorated with the 
`name` prop. In addition to this, each component can add an optional `injectErrorAsProps` which is a `boolean`
that specifies whether the errors should be injected to the child component as props. This is set to `false`
by default. When this is `false` a `span` with the error message as content an the `className` 
prop set to `errorClassName` will be placed directly adjacent to the child component of `Form`.

When this value is `true` `Form` will not display the error message automatically, but rather pass it as a 
prop to the child component.


## License

MIT © [mikaelrss](https://github.com/mikaelrss)

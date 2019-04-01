/**
 * @class ExampleComponent
 */

import * as React from "react";

import FormParent from "./validate/Form";

type IValues = {
  title: string;
  description: string;
  category: string;
  testName: number;
};

export type Props = { text: string };

export default class ExampleComponent extends React.Component<Props> {
  handleSubmit = (values: IValues) => {
    console.log("This function is handling submit");
    console.log("MY  values brings all the bois to the yard", values);
  };

  validateValues = (values: IValues) => {
    const errors: any = {};
    if (!values.title) errors.title = "Title is required";
    if (!values.description) errors.description = "Description is required";
    if (!values.category) errors.category = "Category is required";
    if (!values.testName) errors.testName = "Test Name is required";
    if (isNaN(values.testName)) errors.testName = "Test Name must be a number";
    return errors;
  };

  render() {
    return (
      <div>
        <FormParent validate={this.validateValues} submit={this.handleSubmit}>
          <input type="text" name="title" />
          <input />
          <input type="textarea" name="description" />
          <select name="category">
            <option>Option A</option>
            <option>Option B</option>
            <option>Option C</option>
          </select>
          <input type="text" name="testName" />
          <input />
          <button>Submit</button>
        </FormParent>
      </div>
    );
  }
}

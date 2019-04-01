import React, { Component } from "react";

import Form from "react-valid8";

export default class App extends Component {
  handleSubmit = values => {
    console.log("This function is handling submit");
    console.log("MY  values brings all the bois to the yard", values);
  };

  validateValues = values => {
    console.log(values);
    const errors = {};
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
        <Form
          validate={this.validateValues}
          submit={this.handleSubmit}
          initialValues={{
            testName: 12
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
          <input type="text" name="testName" />
          <input />
          <button>Submit</button>
        </Form>
      </div>
    );
  }
}

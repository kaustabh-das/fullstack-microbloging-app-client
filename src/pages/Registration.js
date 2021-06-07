import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";

function Registration() {
  const initialValues = {
    username: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string().min(3).max(25).required(),
    password: Yup.string().min(4).max(20).required(),
  });

  const onSubmit = (data) => {
    // console.log(data);
    axios.post("http://localhost:3001/auth", data).then((response) => {  // Here data is the body. 
      console.log("User data is send.");
    });
  };

  return (
    <div>
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        <Form className="formContainer">
          <label>Username: </label>
          <ErrorMessage name="username" component="span" />
          <Field
            id="inputCreatePost"
            name="username"
            placeholder="(Ex. John...)"
          />
          <label>Password: </label>
          <ErrorMessage name="password" component="span" />
          <Field
            autoComplete="off"
            type="password"
            id="inputCreatePost"
            name="password"
            placeholder="Your Password..."
          />
          <button className="button" type="submit">
            Register
          </button>
        </Form>
      </Formik>
    </div>
  );
}

export default Registration;

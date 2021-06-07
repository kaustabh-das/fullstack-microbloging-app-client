import React, { useContext, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";

function CreatePost() {
//   const { authState } = useContext(AuthContext);

  let history = useHistory();

  const initialValues = {
    title: "",
    postText: "",
  };

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      history.push("/login");
    }
  }, []);

  const validationSchema = Yup.object().shape({
    title: Yup.string().required(),
    postText: Yup.string().required(),
  });

  const onSubmit = (data) => {
    // console.log(data);
    axios.post("http://localhost:3001/posts", data, {
      headers: {
        accessToken: localStorage.getItem("accessToken"), // It is a config object where we send a header object. This header object value is used in backend middleware validation function to get the value of token from frontend. 
      },
    }).then((response) => {  // Here data is the body. 
      console.log("Data is send.");
      history.push("/");
    });
  };

  return (
    <div className="createPostPage">
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        <Form className="formContainer">
          <label>Title: </label>
          <ErrorMessage name="title" component="span" />
          <Field
            id="inputCreatePost"
            name="title" // 'name' should be same as in the database.
            placeholder="(Ex. Title...)"
          />
          <label>Post: </label>
          <ErrorMessage name="postText" component="span" />
          <Field
            id="inputCreatePost"
            name="postText"
            placeholder="(Ex. Post...)"
          />
          <button className="button" type="submit">
            Create Post
          </button>
        </Form>
      </Formik>
    </div>
  );
}

export default CreatePost;

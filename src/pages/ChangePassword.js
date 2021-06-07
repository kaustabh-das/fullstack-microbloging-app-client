import React, { useState } from "react";
import axios from "axios";

function ChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const changePassword = () => {
    axios.put(
      "http://localhost:3001/auth/changepassword",
      {
        oldPassword: oldPassword,
        newPassword: newPassword,
      },
      {
        headers: {
          accessToken: localStorage.getItem("accessToken"), // It is a config object where we send a header object. This header object value is used in backend middleware validation function to get the value of token from frontend.
        },
      }
    ).then((response) => {
        if (response.data.error) {
            alert(response.data.error);
        } else {
            alert("password changed successfully");
        }
    });
  };

  return (
    <div>
      <h1>Change Your Password</h1>
      <input
        type="text"
        placeholder="Old Password"
        onChange={(event) => {
          setOldPassword(event.target.value);
        }}
      />
      <input
        type="text"
        placeholder="New password"
        onChange={(event) => {
          setNewPassword(event.target.value);
        }}
      />
      <button onClick={changePassword}>Save Changes</button>
    </div>
  );
}

export default ChangePassword;

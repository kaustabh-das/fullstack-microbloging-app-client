import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../helpers/AuthContext";
import { useHistory } from "react-router-dom";

function Post() {
  const [postObject, setPostObject] = useState({});
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const { authState } = useContext(AuthContext);

  let history = useHistory();
  let { id } = useParams(); // The useParams Hook returns an object containing key-value pairs of the passed parameters in a dynamic URL. For example, let's say you have a User page component that accepts an id as a param in the URL.

  useEffect(() => {
    //This api request is done to get the data of a individual post page by id.
    axios.get(`http://localhost:3001/posts/byId/${id}`).then((response) => {
      setPostObject(response.data);
    });

    //This api request is done to get all the comments of a individual post in the post page by id.
    axios.get(`http://localhost:3001/comments/${id}`).then((response) => {
      setComments(response.data);
    });
  }, []);

  const addComment = () => {
    axios
      .post(
        "http://localhost:3001/comments",
        {
          CommentBody: newComment,
          PostId: id,
        },
        {
          headers: {
            accessToken: localStorage.getItem("accessToken"), // It is a config object where we send a header object. This header object value is used in backend middleware validation function to get the value of token from frontend.
          },
        }
      )
      .then((response) => {
        // console.log("Comment Added");

        // Due to this logic we don't have to refresh the post page after adding a new comment, it update the useState automatically.
        if (response.data.error) {
          console.log(response.data.error);
        } else {
          const commentToAdd = {
            CommentBody: newComment,
            username: response.data.username,
          };
          setComments([...comments, commentToAdd]); // Here we first take the previous value and then we add a new value in the state.
          setNewComment("");
        }
      });
  };

  const deleteComment = (id) => {
    axios
      .delete(`http://localhost:3001/comments/${id}`, {
        headers: {
          accessToken: localStorage.getItem("accessToken"), // It is a config object where we send a header object. This header object value is used in backend middleware validation function to get the value of token from frontend.
        },
      })
      .then(() => {
        setComments(
          comments.filter((val) => {
            return val.id !== id;
          })
        );
      });
  };

  const deletePost = (id) => {
    axios
      .delete(`http://localhost:3001/posts/${id}`, {
        headers: {
          accessToken: localStorage.getItem("accessToken"), // It is a config object where we send a header object. This header object value is used in backend middleware validation function to get the value of token from frontend.
        },
      })
      .then(() => {
        history.push("/");
        alert("Delete Sucessfully");
      });
  };

  const editPost = (option) => {
    if (option === "title") {
      let newTitle = prompt("Enter New Title:");
      axios.put(
        `http://localhost:3001/posts/title`,
        {
          newTitle: newTitle,
          id: id,
        },
        {
          headers: {
            accessToken: localStorage.getItem("accessToken"), // It is a config object where we send a header object. This header object value is used in backend middleware validation function to get the value of token from frontend.
          },
        }
      );
      setPostObject({...postObject, title: newTitle});
    } else {
      let newPostText = prompt("Enter New Text");
      axios.put(
        `http://localhost:3001/posts/postText`,
        {
          newText: newPostText,
          id: id,
        },
        {
          headers: {
            accessToken: localStorage.getItem("accessToken"), // It is a config object where we send a header object. This header object value is used in backend middleware validation function to get the value of token from frontend.
          },
        }
      );
      setPostObject({...postObject, postText: newPostText});
    }
  };

  return (
    <div className="postPage">
      <div className="leftSide">
        <div className="post" id="individual">
          <div
            className="title"
            onClick={() => {
              if (authState.username === postObject.username) {
                editPost("title");
              }
            }}
          >
            {postObject.title}
          </div>
          <div
            className="body"
            onClick={() => {
              if (authState.username === postObject.username) {
                editPost("body");
              }
            }}
          >
            {postObject.postText}
          </div>
          <div className="footer">
            {postObject.username}
            {authState.username === postObject.username && (
              <button
                onClick={() => {
                  deletePost(postObject.id);
                }}
              >
                Delete Post
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="rightSide">
        <div className="addCommentContainer">
          <input
            type="text"
            placeholder="Comment..."
            autoComplete="off"
            value={newComment}
            onChange={(event) => {
              setNewComment(event.target.value);
            }}
          />
          <button onClick={addComment}> Add Comments </button>
        </div>
        <div className="listOfComments">
          {comments.map((comment, key) => {
            return (
              <div key={key} className="comment">
                <label>Username:{comment.username}</label>
                {comment.CommentBody}
                {authState.username === comment.username && (
                  <button onClick={() => deleteComment(comment.id)}>
                    Delete
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Post;

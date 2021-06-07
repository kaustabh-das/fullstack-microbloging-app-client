import React from "react";
import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { useHistory, Link } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";

function Home() {
  const [listOfPosts, setlistOfPosts] = useState([]);
  const [likedPosts, setlikedPosts] = useState([]);
//   const { authState } = useContext(AuthContext);

  let history = useHistory(); // The useHistory hook gives you access to the history instance that you may use to navigate.

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      history.push("./login");
    } else {
      axios
        .get("http://localhost:3001/posts", {
          headers: { accessToken: localStorage.getItem("accessToken") },
        })
        .then((response) => {
          //   console.log(response);
          setlistOfPosts(response.data.listOfPosts);
          setlikedPosts(
            response.data.likedPosts.map((like) => {
              return like.PostId;
            })
          );
        });
    }
  }, []);

  const likeAPost = (postId) => {
    axios
      .post(
        "http://localhost:3001/Likes",
        { PostId: postId },
        { headers: { accessToken: localStorage.getItem("accessToken") } }
      )
      .then((response) => {
        // alert(response.data);
        setlistOfPosts(
          listOfPosts.map((post) => {
            if (post.id === postId) {
              if (response.data.liked) {
                return { ...post, Likes: [...post.Likes, 0] };
              } else {
                const likesArray = post.Likes;
                likesArray.pop();
                return { ...post, Likes: likesArray };
              }
            } else {
              return post;
            }
          })
        );

        if (likedPosts.includes(postId)) {
          setlikedPosts(
            likedPosts.filter((id) => {
              // The includes() method determines whether a string contains the characters of a specified string. This method returns true if the string contains the characters, and false if not.
              return id !== postId;
            })
          );
        } else {
          setlikedPosts([...likedPosts, postId]);
        }
      });
  };

  return (
    <div>
      {listOfPosts.map((value, key) => {
        return (
          <div key={key} className="post">
            <div className="title">{value.title}</div>
            <div
              className="body"
              onClick={() => {
                history.push(`/post/${value.id}`);
              }}
            >
              {value.postText}
            </div>
            <div className="footer">
              <Link to={`/profile/${value.UserId}`}>{value.username}</Link>
              <button
                onClick={() => {
                  likeAPost(value.id);
                }}
              >
                {likedPosts.includes(value.id) ? "Unlike" : "Like"}
              </button>
              <label>{value.Likes.length}</label>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Home;

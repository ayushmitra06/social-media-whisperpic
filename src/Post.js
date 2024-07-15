import React, { useEffect, useState } from "react";
import "./Post.css";
import Avatar from "@mui/material/Avatar";
import { db } from "./FireBase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
  where,
  writeBatch,
} from "firebase/firestore";
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Button } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Post = ({ postId, username, caption, user, imageUrl }) => {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  // console.log("This is user " + username)
  // console.log(user)
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);

 
  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const postDocRef = doc(db, "posts", postId);
        const likesCollectionRef = collection(postDocRef, "likes");
        const likesQuery = query(likesCollectionRef);
        const likesSnapshot = await getDocs(likesQuery);

        setLikes(likesSnapshot.size);

        if (user) {
          const userLikeQuery = query(likesCollectionRef, where("uid", "==", user.uid));
          const userLikeSnapshot = await getDocs(userLikeQuery);
          setLiked(!userLikeSnapshot.empty);
        }
      } catch (error) {
        console.error("Error fetching likes:", error);
      }
    };

    fetchLikes();
  }, [postId, user]);

  const handleLike = async () => {
    if(user === null) {
      alert("Please sign in to like a post");
      return;
    }
    const postDocRef = doc(db, "posts", postId);
    const likesCollectionRef = collection(postDocRef, "likes");

    if (liked) {
      const userLikeQuery = query(likesCollectionRef, where("uid", "==", user.uid));
      const userLikeSnapshot = await getDocs(userLikeQuery);
      const batch = writeBatch(db);

      userLikeSnapshot.forEach(doc => {
        batch.delete(doc.ref);
      });

      await batch.commit();
      setLikes(likes - 1);
    } else {
      await addDoc(likesCollectionRef, { uid: user.uid });
      setLikes(likes + 1);
    }

    setLiked(!liked);
  };

  useEffect(() => {
    let unsubscribe;

    if (postId) {
      const postRef = collection(db, "posts", postId, "comments");
      const q = query(postRef, orderBy("timestamp", "desc"));
      unsubscribe = onSnapshot(q, (snapshot) => {
        setComments(snapshot.docs.map((doc) => doc.data()));
      });
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [postId]);

  const postComment = async (e) => {
    e.preventDefault();

    try {
      // Add the comment to the database
      const commentData = {
        text: comment,
        username: user.displayName,
        timestamp: Timestamp.now(),
      };

      const postRef = doc(db, "posts", postId); // Reference to the post document
      const commentsCollectionRef = collection(postRef, "comments"); // Reference to the comments subcollection

      await addDoc(commentsCollectionRef, commentData);

      setComment("");
    } catch (error) {
      console.error("Error adding comment: ", error);
      // Handle error (e.g., show error message to user)
    }
  };

  const handleDelete = async () => {
    try {
      if (user && user.displayName === username) {
        // Check if the logged-in user is the owner of the post
        const postDocRef = doc(db, "posts", postId);
        await deleteDoc(postDocRef);
        toast.success("Post successfully deleted!");
      } else {
        console.error("You are not authorized to delete this post.");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Error deleting post!");
      // Handle error (e.g., show error message to user)
    }
  };
  return (
    <div className="post">
      <div className="post_header">
        <Avatar
          className="post_avatar"
          alt={username}
          src="/static/images/avatar/1.jpg"
        />
        <h3>{username}</h3>
        {user && user.displayName === username && (
        <div className="delete_icon_container">
          <DeleteIcon onClick={handleDelete} className="delete_icon" />
        </div>
        )}
      </div>

      <img
        alt={username + " post image"}
        className="post_image"
        src={imageUrl}
      />
      <h4 className="post_text">
        <strong>{username}</strong>: {caption}
      </h4>
      <div className="post_comments">
        {comments.map((comment) => (
          <p>
            <b>{comment.username}</b> {comment.text}
          </p>
        ))}
      </div>

      <div className="post_likes">
        <Button onClick={handleLike}>
          {liked ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
          {likes}
        </Button>
      </div>

      {user && (
        <form className="post_commentBox">
          <input
            className="post_input"
            type="text"
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button className="post_button" type="submit" onClick={postComment}>
            Post
          </button>
        </form>
      )}
    </div>
  );
};

export default Post;

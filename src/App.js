import React, { useState, useEffect } from "react";
import "./App.css";
import Post from "./Post";
import { auth, db } from "./FireBase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import { Input } from "@mui/material";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import ImageUpload from "./ImageUpload";
import { InstagramEmbed } from "react-social-media-embed";
import 'react-toastify/dist/ReactToastify.css';

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  borderRadius: "20px", // Rounded borders
  outline: "none", // Remove default outline
};
// const storiesData = [
//   {imageUrl: "https://thumbs.dreamstime.com/blog/2023/03/ai-generated-art-real-art-my-two-cents-87048-image271553088.jpg", username: "Kriti"},
//   {imageUrl: "https://t4.ftcdn.net/jpg/06/20/41/55/360_F_620415503_nwuRSJY7WE9bkwxEuo8F9BoGthLRvdb4.jpg", username: "rahul"},
//   {imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTkAbm245hjPHTJeCG5Opb7RFFLJngABq6HMQ&s", username: "Ayush"},
//   {imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzYSqwNIJSvLA8ZBXpbCYVMX8wqgEkOxl7QA&s", username: "Ananya"},
//   {imageUrl: "https://t3.ftcdn.net/jpg/06/17/13/26/360_F_617132669_YptvM7fIuczaUbYYpMe3VTLimwZwzlWf.jpg", username: "Aditya"},
//   {imageUrl: "https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671140.jpg?size=338&ext=jpg&ga=GA1.1.2113030492.1720310400&semt=ais_user", username: "Lira"},

// ]

function App() {
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  const [openSignIn, setOpenSignIn] = useState(false);

  // const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // User has logged in
        console.log(authUser);
        setUser(authUser);

        if (!authUser.displayName) {
          // If we just created someone
          updateProfile(authUser, {
            displayName: username,
          })
            .then(() => {
              console.log("Profile updated successfully");
            })
            .catch((error) => {
              console.error("Error updating profile", error);
            });
        }
      } else {
        // User has logged out
        setUser(null);
      }
    });

    return () => {
      // Perform some cleanup actions
      unsubscribe();
    };
  }, [user, username]);

  useEffect(() => {
    const postsCollection = collection(db, "posts");
    const q = query(postsCollection, orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const signUp = (event) => {
    event.preventDefault();

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        // console.log("User signed up:", user);

        // Update profile
        updateProfile(user, {
          displayName: username,
        })
          .then(() => {
            console.log("Profile updated successfully");
          })
          .catch((error) => {
            console.error("Error updating profile", error);
          });
      })
      .catch((error) => alert(error.message));

    setOpen(false);
  };

  const signIn = (event) => {
    event.preventDefault();

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log("User signed in:", user);
      })
      .catch((error) => alert(error.message));

    setOpenSignIn(false);
  };

  return (
    <div className="app">
      <div>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <form className="app_signup">
              <center>
                <img
                  className="app_headerImage"
                  src="https://1000logos.net/wp-content/uploads/2017/02/Logo-Instagram.png"
                  alt="Instagram Logo"
                />
              </center>
              <Input
                placeholder="Username"
                type="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <Input
                placeholder="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button type="submit" onClick={signUp}>
                Sign Up
              </Button>
            </form>
          </Box>
        </Modal>
      </div>

      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <form className="app_signup">
            <center>
              <img
                className="app_headerImage"
                src="https://1000logos.net/wp-content/uploads/2017/02/Logo-Instagram.png"
                alt="Instagram Logo"
              />
            </center>
            <Input
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signIn}>
              Sign In
            </Button>
          </form>
        </Box>
      </Modal>

      <div className="app_header">
        <h2 className="app_header_logo">WhisperPic</h2>
        {/* <img
          className="app_headerImage"
          src="https://1000logos.net/wp-content/uploads/2017/02/Logo-Instagram.png"
          alt="Instagram Logo"
        /> */}
        {/* stories section */}
        {/* <div className="app_stories">
          <h2>Stories</h2>
          <div className="app_storiesContainer">
              {storiesData.map((story) => {
                return (
                  <div className="app_story">
                    <img src={story.imageUrl} alt="Story 1" />
                    <span>{story.username}</span>
                  </div>
                );
              })}
          </div>
        </div> */}

        {user ? (
          <Button
            sx={{
              backgroundColor: "#3d52a0",
              color: "white",
              padding: "10px 20px",
              margin: "0 10px",
              fontSize: "18px",
              textTransform: "none",
              borderRadius: "18px",
              "&:hover": { backgroundColor: "#007bb5" },
            }}
            onClick={() => auth.signOut()}
          >
            Logout
          </Button>
        ) : (
          <div className="app_loginContainer">
            <Button
              sx={{
                backgroundColor: "#3d52a0",
                color: "white",
                padding: "10px 20px",
                margin: "0 10px",
                fontSize: "18px",
                textTransform: "none",
                borderRadius: "18px",
                "&:hover": { backgroundColor: "#007bb5" },
              }}
              onClick={() => setOpenSignIn(true)}
            >
              Sign In
            </Button>
            <Button
              sx={{
                backgroundColor: "#3d52a0",
                color: "white",
                padding: "10px 20px",
                margin: "0 10px",
                fontSize: "18px",
                textTransform: "none",
                borderRadius: "18px",
                "&:hover": { backgroundColor: "#007bb5" },
              }}
              onClick={() => setOpen(true)}
            >
              Sign Up
            </Button>
          </div>
        )}
      </div>

      <div className="app_posts">
        <div className="app_postsLeft">
          {posts.map((post) => (
            <Post
              user={user}
              postId={post.id}
              key={post.id}
              username={post.username}
              caption={post.caption}
              imageUrl={post.imageUrl}
            />
          ))}
        </div>
        {/* style={{ display: "flex", justifyContent: "center" }} */}
        <div className="app_postsRight">
          <InstagramEmbed
            boxShadow="0 0 10px #000"
            url="https://www.instagram.com/p/C1h6jJIPqEL/"
            width={328}
          />
          <InstagramEmbed
            url="https://www.instagram.com/p/Cu7I4J4Ma6v/"
            width={328}
          />
          <InstagramEmbed
            url="https://www.instagram.com/p/C9AiVBut3fe/"
            width={328}
          />
        </div>
      </div>

      {user?.displayName ? (
        <ImageUpload className="imageUpload" username={user.displayName} />
      ) : (
        <h3 className="login_msg">Sorry you need to login to upload</h3>
      )}
    </div>
  );
}

export default App;

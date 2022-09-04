import React, { useState, useEffect } from "react";
import "./App.css";
import Post from "./Post.js";
import { db, auth } from "./firebase.js";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import { Input } from "@mui/material";
import ImageUpload from "./ImageUpload";
import UploadBox from "./UploadBox";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
const buttonStyle = {
  marginLeft: 8,
};

function App() {
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignin, setOpenSignin] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        setUser(null);
      }
    });
    return unsubscribe();
  }, [user, username]);
  useEffect(() => {
    db.collection("Posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        setPosts(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            post: doc.data(),
          }))
        );
      });
  }, []);
  const signUp = (event) => {
    event.preventDefault();
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username,
        });
      })
      .then((authUser) => {
        setUser(authUser);
      })
      .catch((error) => alert(error.message));

    setOpen(false);
  };

  const signIn = (event) => {
    event.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .then((authUser) => {
        setUser(authUser);
      })
      .catch((error) => alert(error.message));

    setOpenSignin(false);
  };
  const handleLogout = () => {
    auth.signOut().then(() => setUser(null));
  };

  return (
    <div className="App">
      <div className="app__header">
        <img
          className="app__headerImage"
          src={require("./images/Instagram_logo1.svg.png")}
          alt="instagram-logo"
        />
        <div className="app__upload">
          {user?.displayName ? (
            <ImageUpload username={user.displayName} />
          ) : (
            <UploadBox />
          )}
        </div>
        {user ? (
          <Button
            variant="contained"
            component="label"
            size="small"
            onClick={handleLogout}
          >
            Logout
          </Button>
        ) : (
          <div className="app__loginContainer">
            <Button
              variant="contained"
              component="label"
              size="small"
              onClick={() => setOpenSignin(true)}
            >
              Login
            </Button>

            <Button
              variant="contained"
              component="label"
              size="small"
              style={buttonStyle}
              onClick={() => setOpen(true)}
            >
              Sign Up
            </Button>
          </div>
        )}
      </div>
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={style}>
          <form className="app__signup">
            <center>
              <img
                className="app__headerImage"
                src={require("./images/Instagram_logo1.svg.png")}
                alt="instagram-logo"
              />
            </center>
            <Input
              placeholder="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            ></Input>

            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></Input>

            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></Input>
            <Button type="submit" onClick={signUp}>
              Sign Up
            </Button>
          </form>
        </Box>
      </Modal>

      <Modal open={openSignin} onClose={() => setOpenSignin(false)}>
        <Box sx={style}>
          <form className="app__signup">
            <center>
              <img
                className="app__headerImage"
                src={require("./images/Instagram_logo1.svg.png")}
                alt="instagram-logo"
              />
            </center>

            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></Input>

            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></Input>
            <Button type="submit" onClick={signIn}>
              Sign In
            </Button>
          </form>
        </Box>
      </Modal>

      <div className="app__posts">
        {posts.map(({ id, post }) => {
          return (
            <Post
              key={id}
              postId={id}
              user={user}
              username={post.username}
              imageURL={post.imageUrl}
              caption={post.caption}
            />
          );
        })}
      </div>
    </div>
  );
}

export default App;

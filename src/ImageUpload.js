import { Button } from "@mui/material";
import React, { useState } from "react";
import { db, storage } from "./firebase";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/storage";
import "firebase/compat/firestore";
import "./imageupload.css";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
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

function ImageUpload(username) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [caption, setCaption] = useState("");

  const [progress, setProgress] = useState(0);
  const [image, setImage] = useState(null);

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };
  const handleUpload = () => {
    const uploadTask = storage.ref(`images/${image.name}`).put(image);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
        if (progress === 100) {
          setOpen(false);
        }
      },
      (error) => {
        console.log(error);
        alert(error.message);
      },
      () => {
        storage
          .ref("images")
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            db.collection("Posts").add({
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              caption: caption,
              imageUrl: url,
              username: username,
            });
            setProgress(0);
            setCaption("");
            setImage(null);
          });
      }
    );
  };

  return (
    <div>
      <Button
        variant="contained"
        component="label"
        size="small"
        onClick={handleOpen}
      >
        ADD POST
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <center>
            <h2>Create new post</h2>
          </center>
          <div className="imageUpload">
            <progress
              className="imageUpload__progress"
              value={progress}
              max="100"
            />
            <input
              className="caption"
              type="text"
              placeholder="Enter a caption...."
              onChange={(event) => setCaption(event.target.value)}
              value={caption}
            />
            <input
              className="choose-file"
              type="file"
              onChange={handleChange}
            />
            <div className="buttons">
              <Button
                variant="contained"
                component="label"
                size="small"
                onClick={handleUpload}
              >
                Upload
              </Button>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
}

export default ImageUpload;

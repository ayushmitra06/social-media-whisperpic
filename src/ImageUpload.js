import React, { useState } from 'react';
import './imageUpload.css';
import { storage, db } from './FireBase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const ImageUpload = ({ username }) => {
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);
  const [caption, setCaption] = useState('');

  const handleUpload = () => {
    if (!image) return;

    const storageRef = ref(storage, `images/${image.name}`);
    const uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (error) => {
        console.log(error);
        alert(error.message);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          addDoc(collection(db, 'posts'), {
            timestamp: serverTimestamp(),
            caption: caption,
            imageUrl: url,
            username: username,
          });

          setProgress(0);
          setCaption('');
          setImage(null);
          window.scrollTo(0, 0);
        });
      }
    );
  };

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  return (
    <div className='imageUpload'>
      <progress className='imageUpload_progress' value={progress} max="100" />
      <input type="text" placeholder="Enter a caption..." value={caption} onChange={e => setCaption(e.target.value)} />
      <input type="file" onChange={handleChange} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
};

export default ImageUpload;

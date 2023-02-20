import { Button } from '@mui/material'
import React, { useContext,useState } from 'react';
import { db , storage } from './firebase';
import firebase from 'firebase/compat/app';
import { UserContext } from './UserContext';
import './ImageUpload.css'
function ImageUpload() {
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);
  const [caption , setCaption] = useState('');
  const {user, setUser} = useContext(UserContext);
  
  const handleChange = (event) => {
      setImage(event.target.files[0]);
      console.log(image)
  }
  const handleUpload = () => {
      console.log(image)
      const uploadTask = storage.ref(`/images/${image.name}`).put(image);
      uploadTask.on(
        "state_changed",
        (snapshot)=> {
          const progress = Math.round(
            (snapshot.bytesTransferred/snapshot.totalBytes * 100)
          );
          setProgress(progress);
        },
        (error)=>{
          console.log(error);
          alert(error.message);
        },
        () => {
          storage
            .ref("images")
            .child(image.name)
            .getDownloadURL()
            .then(url => {
              db.collection("posts").add({
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                caption: caption,
                imageUrl: url,
                username: user?.displayName,
                profilepic: user?.photoURL
              });
              setProgress(0);
              setCaption("");
              setImage(null);
              
            })
        }
      )
  }
  // const handleUpload = ()=>{
  //   if(image==null)
  //   return;
  //   const imageref = storage.ref('/images/${image.name}').put(image)
  //   .on("state_changed", alert("success"),alert);
  //   console.log(image)
  //   imageref();
  // }
  return (
    <div className='imageupload'>
      <progress value={progress} max="100"/>
      <input type="text"placeholder='Enter a Caption...' onChange={(e)=>setCaption(e.target.value)} value={caption}/>
      <input type="file" onChange={handleChange}/>
      <Button onClick={handleUpload}>
        Upload
      </Button>
    </div>
  )
}

export default ImageUpload

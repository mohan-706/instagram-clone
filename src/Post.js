import React, { useState, useEffect , useContext} from 'react'
import './Post.css'
import Avatar from '@mui/material/Avatar';
import { db } from './firebase';
import { UserContext } from './UserContext';
import firebase from 'firebase/compat/app';
function Post({postId,username,caption,imageUrl,profilepic}) {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('');
  const {user, setUser} = useContext(UserContext);
  useEffect(()=>{
    let unsubscribe;
    if(postId){
      unsubscribe=db
        .collection("posts")
        .doc(postId)
        .collection("comments")
        .orderBy('timestamp','desc')
        .onSnapshot((snapshot)=>{
            setComments(snapshot.docs.map((doc) => doc.data()));
        });
    }
    return () =>{
      unsubscribe();
    };
  },[postId]);
  const postComment = (event) => {
    event.preventDefault();
    db.collection("posts").doc(postId).collection("comments").add({
      text: comment,
      username: user?.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    })
    setComment("");
  }
  return (
    <div className='post'>
      <div className='post_header'>
          <Avatar
            className='post_avatar'
            alt='MOhan'
            src={profilepic}
            />
          <h3>{username}</h3>
      </div>

      <img className='post_image' src={imageUrl}/>

      <h4><strong>{username}: </strong>{caption}</h4>

      <div className='post_comments'>
          {comments.map((comment)=>(
            <p>
              <strong>{comment.username} </strong> {comment.text}
            </p>
          ))}
      </div>
      {user &&(
          <form className='post_commentbox'>
          <input
            className='post_input'
            type="text"
            placeholder='Add a comment...'
            value={comment}
            onChange={(e)=> setComment(e.target.value)}
          />
          <button
          className='post_button'
          disabled={!comment}
          type="submit"
          onClick={postComment}
          >
            Post
          </button>
        </form>
      )}
      
    </div>
  )
}

export default Post

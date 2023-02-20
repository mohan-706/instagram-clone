import React , {useEffect, useState} from 'react';
import './App.css';
import { db } from './firebase';
import Header from './Header';
import Post from './Post';

import { UserContext } from './UserContext';
import ImageUpload from './ImageUpload';


function App() {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  
  

  useEffect(() => {
    db.collection('posts').orderBy('timestamp','desc').onSnapshot(snapshot => {
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      })));
    })
  },[]);

  return (
    <div className="App">
      <UserContext.Provider value={{user,setUser}}>
          <div className='app_header'><Header/></div>
          
          {
            posts.map(({id,post}) =>(
              <Post key={id} postId={id} username={post.username} caption={post.caption} imageUrl={post.imageUrl} profilepic={post.profilepic}/>
            ))
          }
          
      </UserContext.Provider>
      
      
    </div>
  );
}

export default App;

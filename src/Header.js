import React ,  {useContext, useEffect, useState} from 'react'
import './Header.css'
import { MagnifyingGlassIcon , PlusCircleIcon} from '@heroicons/react/24/solid'
import {  auth , storage } from './firebase';

import { Input } from '@mui/material';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';

import Avatar from '@mui/material/Avatar';
import { UserContext } from './UserContext';
import ImageUpload from './ImageUpload';


function Header() {
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const {user, setUser} = useContext(UserContext);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [openLogOut, setOpenLogOut] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [image, setImage] = useState(null);
  const [progressimg, setProgressimg] = useState(0);
  const [openUpload, setOpenUpload] = useState(false);

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
          setProgressimg(progress);
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
              user.updateProfile({
                photoURL : url
                
              })
              console.log(user.photoURL)
              setProgressimg(0);
              
              setImage(null);
              
            })
            setOpenProfile(false);
        }
      )
  }
  
  useEffect(()=> {
    const unsubscribe=auth.onAuthStateChanged((authUser)=>{
      if(authUser){
        console.log(authUser);
        setUser(authUser);
      }
      else{
          setUser(null);
      }
    })
    return ()=>{
      unsubscribe();
    }
  },[user, username]);

  const signUp = (event) => {
    event.preventDefault();
    auth
    .createUserWithEmailAndPassword(email, password)
    .then((authUser)=>{
      return authUser.user.updateProfile({
        displayName: username
      })
    })
    .catch((error)=>alert(error.message));
    setOpen(false);
  }

  const signIn = (event) => {
    event.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error)=>alert(error.message));
    setOpenSignIn(false);
  }

  const logOut = () => {
    if (user) {
      auth.signOut();
      setOpenLogOut(false);
      }
  };
  return (
    
    <div className='header'>
      <Modal
      open={openProfile}
      onClose={() => setOpenProfile(false)}
      >
        <div className='modall'>
          <form className='signup_form'>
              <center>
                <img
                  alt=''
                  className='logo1'
                  src='logo.png'
                />
              </center>
              <span>Do you wanna Update your profile</span>
              <div className='profile_buttons'>
              
              <input type="file" onChange={handleChange}/>
              <Button onClick={handleUpload}>
                Upload
              </Button>
              
              </div>

          </form>
          
          
        </div>
      </Modal>

      <Modal
      open={openUpload}
      onClose={() => setOpenUpload(false)}
      >
        <div className='modall'>
          <ImageUpload/>
          
          
        </div>
      </Modal>

      <div>
        <img className='logo' alt='' src='logo.png'/>
        <img className='logo2'alt='' src='logo2.webp'/>
        
      </div>
      
      
      {/* skhahcjalds */}
      <div>
      <center>
      <Modal
      open={open}
      onClose={() => setOpen(false)}
      >
        <div className='modall'>
          <form className='signup_form'>
              <center>
                <img
                  alt=''
                  className='logo1'
                  src='logo.png'
                />
              </center>
              <Input
              className='input'
              placeholder='username'
              type='text'
              value={username}
              onChange={(e)=>setUsername(e.target.value)}
              />
              <Input
              className='input'
              placeholder='email'
              type='text'
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              />
              <Input
              className='input'
              placeholder='password'
              type='text'
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              />
              <Button onClick={signUp} >Sign Up</Button>
          </form>
          
          
        </div>
      </Modal>

      <Modal
      open={openSignIn}
      onClose={() => setOpenSignIn(false)}
      >
        <div className='modall'>
          <form className='signup_form'>
              <center>
                <img
                  alt=''
                  className='logo1'
                  src='logo.png'
                />
              </center>
              <Input
              className='input'
              placeholder='email'
              type='text'
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              />
              <Input
              className='input'
              placeholder='password'
              type='text'
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              />
              <Button onClick={signIn} >Log In</Button>
          </form>
          
          
        </div>
      </Modal>

      <Modal
      open={openLogOut}
      onClose={() => setOpenLogOut(false)}
      >
        <div className='modall'>
          <form className='signup_form'>
              <center>
                <img
                  alt=''
                  className='logo1'
                  src='logo.png'
                />
              </center>
              <span>Do you wanna log out</span>
              <div className='logout_buttons'>
                <Button onClick={logOut} >Yes</Button>
                <Button onClick={()=> setOpenLogOut(false)} >No</Button>
              </div>

          </form>
          
          
        </div>
      </Modal>

      </center>
      
      </div>
      <div className='upload_container'>
      {user?(
        <><PlusCircleIcon onClick={()=> setOpenUpload(true)} className='create_icon'/></>
      ):(<></>)}
      
      {user ?(
        <div className='login_container'>
        <Button onClick={()=> setOpenLogOut(true)}>Logout</Button>
        </div>
        
      ) : (
        <div className='login_container'>
            <Button onClick={()=> setOpenSignIn(true)}>Log In</Button>
            <Button onClick={()=> setOpen(true)}>Sign Up</Button>
            
        </div>
        
      )}</div>
      
<div className='header_profile'>

{user ?(
        <>
        {user?.photoURL?(
              <>
              
              <Avatar
                  className='post_avatar'
                  alt='MOhan'
                  src={user?.photoURL}
                  onClick={()=> setOpenProfile(true)}
                  />
              </>
                  
      ):(
        <div >
        <Avatar onClick={()=> setOpenProfile(true)}>{user.displayName[0].toUpperCase()}</Avatar>
        
        
    </div>
      )}</>
        
      ) : (
        <></>
        
      )}</div>
      
    </div>
  )
}

export default Header;


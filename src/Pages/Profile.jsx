import  { useEffect, useState } from 'react'
import {Link, Navigate, useNavigate} from 'react-router-dom'
import {useSelector } from 'react-redux'
import { useRef } from 'react';
import { app } from '../FireBase';
import {getDownloadURL, getStorage,ref , uploadBytesResumable} from 'firebase/storage' 
import { useDispatch } from 'react-redux';
import { updateUserSuccess,updateUserFailure,updateUserStart ,deleteUserStart,deleteUserSuccess,deleteUserFailure, signoutUserStart} from '../Redux/user/userSlice';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { Button, Modal } from 'flowbite-react';
import DeleteIcon from '@mui/icons-material/Delete';
const Profile = () => {
  const {currentUser, loading,error} = useSelector((state)=> state.user);
  const [file, setfile]= useState(undefined);
  const [FileuploadError, setFileuploadError]= useState(false);
  const navigate = useNavigate();

  const [openModal, setOpenModal] = useState(false);
  const dispatch = useDispatch();
  const [FormData,setFormData] = useState({});

  const [Fileper, setFileper] = useState(0);

  const fileRef = useRef(null)
  const [updatesuccess,setupdatesuccess] = useState(false);
 const handlechange = (e) =>{
    setFormData({ ...FormData,[e.target.id]:e.target.value});
 }

 useEffect(() => {
   if (file) {
     handleFileUpload(file);
    }
  }, [file]);
  // console.log(FormData);
  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on('state_changed',
    (snapshot) =>{
      const progress = (snapshot.bytesTransferred/snapshot.totalBytes) * 100;
      setFileper(Math.round(progress));
    },
    
    (error) =>{
      setFileuploadError(true);
    },
    () =>{
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>
      setFormData({...FormData, avatar: downloadURL})
    )
  }
);

};
const handlesubmit = async(e)=>{
  if(currentUser.role === 'admin'){
    e.preventDefault();
    try {
      dispatch(updateUserStart())
      const res = await fetch(`/api/user/updateAdmin/${currentUser._id}`,{
       method:'POST',
       headers: {
         'Content-Type': 'application/json',
       },
        body:JSON.stringify(FormData),
      });
      const data = await res.json();
      if(data.success === false){
        dispatch(updateUserFailure(data.message));
         return;
       }
     dispatch(updateUserSuccess(data));
     setupdatesuccess(true);
     
   }catch (error) {
      dispatch(updateUserFailure(error.message));
    }
        
    
   }
  
   else
   e.preventDefault();
   try {
     dispatch(updateUserStart())
     const res = await fetch(`/api/user/update/${currentUser._id}`,{
      method:'POST',
      headers: {
        'Content-Type': 'application/json',
      },
       body:JSON.stringify(FormData),
     });
     const data = await res.json();
     if(data.success === false){
       dispatch(updateUserFailure(data.message));
        return;
      }
    dispatch(updateUserSuccess(data));
    setupdatesuccess(true);
    
  }catch (error) {
     dispatch(updateUserFailure(error.message));
   }
       
   
  }

  const handleDelete = async() =>{

  try {
    dispatch(deleteUserStart())
    const res = await fetch(`/api/user/delete/${currentUser._id}`,{
     method:'DELETE',
    
    });
    const data = await res.json();
    if(data.success === false){
      dispatch(deleteUserFailure(data));
       return;
     }
   dispatch(deleteUserSuccess(data));
  //  localStorage.clear();
  //  dispatch(resetState());

    
  } catch (error) {
    dispatch(deleteUserFailure(error.message));
  }
  }

  const handlesignout = async()=>{
    try {
      dispatch(signoutUserStart());
      const res = await fetch('/api/auth/signout')
      const data = await res.json();
      if (data.success === false){
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
      navigate ('/signIn');

    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  }
return (

    <div className='p-5 max-w-lg md:ml-52  bg-white/50 '>
    <h1 className='text-3xl text-center font-semibold my-7  font-serif transition ease-in-out delay-100 hover:-translate-y-1 hover:scale-120 hover:text-orange-600 duration-200 '>Profile</h1>

    <form className='flex flex-col gap-4' onSubmit={handlesubmit}>
      <input onChange={(e)=> setfile(e.target.files[0])}type='file' ref={fileRef} hidden accept='image/*' />

    <img onClick={()=>fileRef.current.click()} className='rounded-full  h-24 w-24 object-cover cursor-pointer self-center ' 
        src={FormData.avatar || currentUser.avatar} alt='Avatar' />


    <p className='text-sm self-center'>

          {FileuploadError ? (
            <span className='text-red-700'>
              Error Image upload (image must be less than 5 mb)
            </span>
          ) : Fileper > 0 && Fileper < 100 ? (
            <span className='text-slate-700'>{`Uploading ${Fileper}%`}</span>
          ) : Fileper === 100 ? (
            <span className='text-green-700'>Image successfully uploaded!</span>
          ) : (
            ''
          )}
        </p>

        {!currentUser?.role== 'admin' && (<input type='text' placeholder='username' className='border p-4 rounded-lg w-auto' id='username' defaultValue={currentUser.username} onChange={handlechange} />)}

      <input type='email' placeholder='Email' className='border p-4 rounded-lg w-auto' id='email' defaultValue={currentUser.email} onChange={handlechange} />

      <input type='password' placeholder='Password' className='border p-4 rounded-lg w-auto' id='password'  onChange={handlechange}   />

      <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>          {loading ? 'Loading...' : 'Update'}</button>

      
 
    </form>
      <div className="flex justify-between mt-5">
        <Button onClick={() => setOpenModal(true)} className='text-white font-medium cursor-pointer'><DeleteIcon/> Delete account</Button>
        <Button onClick={handlesignout} className='text-white font-medium	cursor-pointer'>Sign-out</Button>
      </div>
       <p className='text-white mt-5'>{updatesuccess ? "user successfully updated": ""}</p>
     {/* <Button onClick={() => setOpenModal(true)}>Toggle modal</Button> */}
     


      <Modal
       show={openModal}
       onClose={() => setOpenModal(false)}
       popup
        size='md'
      >
        <Modal.Header />
        <Modal.Body>
          <div className='text-center'>
          <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
              Are you sure you want to delete your Account?
            </h3>
            <div className='flex justify-center gap-4'>
            <Button color='failure' onClick={handleDelete}>
            Yes, I'm sure
            </Button>
            <Button color='gray' onClick={() => setOpenModal(false)}>
            No, cancel
            </Button>
            </div>
            </div>
          </Modal.Body>
      </Modal>
          
       </div>
    
      
  )
}

export default Profile
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';

import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { app } from '../FireBase';
import { useSelector } from 'react-redux';

const InsertCustomerModal = ({ onClose, onSave }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [filePer, setFilePer] = useState(0);
  const [formData, setFormData] = useState({});

  const [ecode, setEcode] = useState('');
  const [name, setName] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [area, setArea] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});

  const fileRef = useRef(null);

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePer(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, Profile: downloadURL })
        );
      }
    );
  };

  const validate = () => {
    const newErrors = {};
    
    if (!ecode) newErrors.ecode = 'Ecode is required';
    else if (!/^\d{3}$/.test(ecode)) newErrors.ecode = 'Ecode must be exactly 3 characters long (only digits are allowed)';

    if (!name) newErrors.name = 'Name is required';
    else if (!/^[a-zA-Z\s]{5,30}$/.test(name)) newErrors.name = 'Name must be 5-30 letters long and contain only letters and spaces';

    if (!email) newErrors.email = 'Email is required';
    else if (!/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/.test(email)) newErrors.email = 'Invalid email format';

    if (!phoneNo) newErrors.phoneNo = 'Phone number is required';
    else if (!/^\d{10}$/.test(phoneNo)) newErrors.phoneNo = 'Phone number must be exactly 10 digits';

    if (!area) newErrors.area = 'Area is required';

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await axios.post('/api/Engineer/AddEngineer', {
        Name: name,
        email,
        PhoneNo: phoneNo,
        ECode: ecode,
        Area: area,
        Profile: formData.Profile,
      });
      onSave(response.data);
      onClose();
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setErrors({ duplicate: 'Engineer with this ecode already exists.' });
      } else {
        console.error('Error inserting Engineer:', error);
      }
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
      <div className="bg-white p-5 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">Insert Engineer</h2>
        <form onSubmit={handleSubmit}>
          <input
            onChange={(e) => setFile(e.target.files[0])}
            type="file"
            ref={fileRef}
            hidden
            accept="image/*"
            required
          />
          <img
            onClick={() => fileRef.current.click()}
            className="rounded-full h-24 w-24 object-cover cursor-pointer self-center"
            src={formData.Profile || currentUser.Profile}
            alt="ProfilePic"
          />
          <p className="text-sm self-center">
            {fileUploadError ? (
              <span className="text-red-700">
                Error Image upload (image must be less than 5 MB)
              </span>
            ) : filePer > 0 && filePer < 100 ? (
              <span className="text-slate-700">{`Uploading ${filePer}%`}</span>
            ) : filePer === 100 ? (
              <span className="text-green-700">Image successfully uploaded!</span>
            ) : (
              ''
            )}
          </p>
          <div className="mb-4">
            <label className="block text-gray-700">Ecode</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded"
              value={ecode}
              maxLength={3}
              onChange={(e) => setEcode(e.target.value)}
              required
            />
            {errors.ecode && <p className="text-red-500 text-sm mt-1">{errors.ecode}</p>}
            {errors.duplicate && <p className="text-red-500 text-sm mt-1">{errors.duplicate}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              className="w-full px-3 py-2 border rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Phone No</label>
            <input
              type="tel"
              className="w-full px-3 py-2 border rounded"
              value={phoneNo}
              maxLength={10}
              onChange={(e) => setPhoneNo(e.target.value)}
              required
            />
            {errors.phoneNo && <p className="text-red-500 text-sm mt-1">{errors.phoneNo}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Area</label>
            <select
              value={area}
              onChange={(e) => setArea(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">Select Area</option>
              <option value="Udhana">Udhana</option>
              <option value="Vesu">Vesu</option>
              <option value="Adajan">Adajan</option>
              <option value="Bhatar">Bhatar</option>
              <option value="Rander">Rander</option>
            </select>
            {errors.area && <p className="text-red-500 text-sm mt-1">{errors.area}</p>}
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 px-4 py-2 bg-gray-300 rounded"
            >
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InsertCustomerModal;

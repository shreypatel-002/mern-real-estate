import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const InsertCustomerModal = ({ onClose, onSave }) => {
  const [ecode, setEcode] = useState('');
  const [name, setName] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [area, setArea] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!ecode) newErrors.ecode = 'Ecode is required';
    else if (!/^[0-9]{3}$/.test(ecode)) newErrors.ecode = 'Ecode must be digit only with 3 characters long ';

    if (!name) newErrors.name = 'Name is required';
    else if (!/^[A-Za-z]{3,40}$/.test(name)) newErrors.name = 'Name  only contain letters ';

    if (!email) newErrors.email = 'Email is required';
    else if (!/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/.test(email)) newErrors.email = 'Invalid email format';

    if (!phoneNo) newErrors.phoneNo = 'Phone number is required';
    else if (!/^[0-9]{10}$/.test(phoneNo)) newErrors.phoneNo = 'Phone number must be exactly 10 digits';

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
      const response = await axios.post('/api/Engineer/AddEngineer', { Name: name, email, PhoneNo: phoneNo, ECode: ecode, Area: area });
      onSave(response.data);
      onClose();
      toast.success('Engineer added successfully!');
    } catch (error) {
      console.error('Error inserting Engineer:', error);
      toast.error('Error: ' + (error.response?.data?.message || error.message), {
        position: "bottom-right"
      });
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
      <div className="bg-white p-5 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">Insert Engineer</h2>
        <form onSubmit={handleSubmit}>
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
            <button type="button" onClick={onClose} className="mr-2 px-4 py-2 bg-gray-300 rounded">
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

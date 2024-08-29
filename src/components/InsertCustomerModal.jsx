// components/InsertCustomerModal.js
import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const InsertCustomerModal = ({ onClose, onSave }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [CustomerID, setCustomerID] = useState('');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    
    if (!name) newErrors.name = 'Name is required';
    else if (!/^[a-zA-Z\s]{5,30}$/.test(name)) newErrors.name = 'Name must be 5-30 letters long and contain only letters and spaces';

    if (!email) newErrors.email = 'Email is required';
    else if (!/^[A-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/.test(email)) newErrors.email = 'Invalid email format';

    if (!phoneNo) newErrors.phoneNo = 'Phone number is required';
    else if (!/^\d{10}$/.test(phoneNo)) newErrors.phoneNo = 'Phone number must be exactly 10 digits';

    if (!CustomerID) newErrors.CustomerID = 'customerId is required';
    else if (!/^\d{3}$/.test(CustomerID)) newErrors.CustomerID = 'customerID Should be 3 characters long and unique (only digits is allowed)';
   

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
      const response = await axios.post('/api/Customer/AddCustomer', { Name: name, PhoneNo: phoneNo, Email: email,CustomerID });
      onSave(response.data);
      onClose();
      // toast.success('Customer added successfully!'),{
      //   position: "bottom-right"
      // };
    } catch (error) {
      console.error('Error inserting customer:', error);
      // toast.error('Error adding customer: ' + (error.response?.data?.message || error.message), {
      //   position: "bottom-right"
      // });
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
      <div className="bg-white p-5 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">Insert Customer</h2>
        <form onSubmit={handleSubmit}>
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
              type="text"
              className="w-full px-3 py-2 border rounded"
              value={phoneNo}
              maxLength={10}
              onChange={(e) => setPhoneNo(e.target.value)}
              required
            />
            {errors.phoneNo && <p className="text-red-500 text-sm mt-1">{errors.phoneNo}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">CustomerID</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded"
              value={CustomerID}
              maxLength={3}
              onChange={(e) => setCustomerID(e.target.value)}
              required
              
            />
              {errors.CustomerID && <p className="text-red-500 text-sm mt-1">{errors.CustomerID}</p>}
              {errors.duplicate && <p className="text-red-500 text-sm mt-1">{errors.duplicate}</p>}
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

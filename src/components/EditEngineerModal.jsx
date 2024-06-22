import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EditEngineerModal = ({ isOpen, onClose, onSave, updatedEngineer }) => {
  const [formData, setFormData] = useState({
    ...updatedEngineer,
    
  });

  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`/api/Engineer/UpdateEngineer/${updatedEngineer._id}`, formData);
      onSave(response.data.updatedEngineer);
      onClose();
      location.reload();
    } catch (error) {
      console.error('Error updating engineer:', error);
    }
  };

  return isOpen ? (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white p-6 rounded-md shadow-md w-full max-w-3xl">
        <h2 className="text-lg font-semibold mb-4">Edit Engineer</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <div className="mb-4">
              <label className="block text-gray-700">Engineer ECode</label>
              <input
                type="text"
                name="ECode"
                value={formData.ECode}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Name</label>
              <input
                type="text"
                name="Name"
                value={formData.Name}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Phone No</label>
              <input
                type="text"
                name="PhoneNo"
                value={formData.PhoneNo}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Area</label>
              <input
                type="text"
                name="Area"
                value={formData.Area}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button
              type="button"
              onClick={onClose}
              className="mr-4 bg-gray-500 text-white py-2 px-4 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded-md"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  ) : null;
};

export default EditEngineerModal;

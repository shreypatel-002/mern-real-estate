import React, { useEffect, useState } from 'react';
import axios from 'axios';

const EditLeadModal = ({ lead, onClose, onSave }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [formData, setFormData] = useState({
    ...lead,
    callDate: lead.callDate ? formatDate(lead.callDate) : '',
  });

  const [Engineers, setEngineers] = useState([]);
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const fetchEngineers = async () => {
      try {
        const engineersResponse = await axios.get('/api/Engineer/ShowEngineer');
        setEngineers(engineersResponse.data.Engineers);
      } catch (error) {
        console.error('Error fetching engineers:', error);
      }
    };
    const fetchCustomers = async () => {
      try {
        const customerResponse = await axios.get('/api/Customer/CustomerList');
        setCustomers(customerResponse.data.customers);
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    };
    
    fetchEngineers();
    fetchCustomers();
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`/api/Lead/Edit/${lead._id}`, formData);
      onSave(response.data);
      location.reload();
    } catch (error) {
      console.error('Error updating lead:', error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white p-6 rounded-md shadow-md w-full max-w-3xl">
        <h2 className="text-lg font-semibold mb-4">Edit Lead</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <div className="mb-4"> 
               <label className="block text-gray-700">Customer Name</label>
              <select
                id="Name"
                value={formData.CustomerID}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              >
                <option value="">Select</option>
                {customers.map((customer) => (
                  <option key={customer._id} value={customer._id}>
                    {customer.Name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Phone Number</label>
              <input
                type="tel"
                id="PhoneNo"
                placeholder='Enter valid 10 digit phone number'
                maxLength={10}
                pattern='[0-9]{10}'
                value={formData.PhoneNo}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Issue Category</label>
              <select
                id="issueCategory"
                value={formData.issueCategory}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              >
                <option value="">Select</option>
            <option value="Billing">Billing</option>
            <option value="Technical Support">Technical Support</option>
            <option value="Account Management">Account Management</option>
            <option value="Product Issues">Product Issues</option>
            <option value="Service Issues">Service Issues</option>
            <option value="Shipping and Delivery">Shipping and Delivery</option>
            <option value="Customer Service">Customer Service</option>
            <option value="Warranty and Guarantee">Warranty and Guarantee</option>
            <option value="Feedback and Suggestions">Feedback and Suggestions</option>
            <option value="Legal and Compliance">Legal and Compliance</option>
            <option value="Miscellaneous">Miscellaneous</option>
              </select>
            </div>
            <div className="mb-4 col-span-2">
              <label className="block text-gray-700">Issue Description</label>
              <textarea
                id="issueDescription"
                value={formData.issueDescription}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              ></textarea>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Call Date</label>
              <input
                type="date"
                id="callDate"
                value={formData.callDate}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Call Time</label>
              <input
                type="time"
                id="callTime"
                value={formData.callTime}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Support Agent Name</label>
              <select
                id="supportAgentName"
                value={formData.supportAgentName}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              >
                <option value="">Select</option>
                {Engineers.map((engineer) => (
                  <option key={engineer._id} value={engineer._id}>
                    {engineer.Name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Priority Level</label>
              <select
                id="priorityLevel"
                value={formData.priorityLevel}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              >
                <option value="">Select</option>
                <option value="Low">Low 🟢</option>
                <option value="Medium">Medium 🟡</option>
                <option value="High">High 🔴</option>
                <option value="Critical">Critical</option>
              </select>
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
  );
};

export default EditLeadModal;

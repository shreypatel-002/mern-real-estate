import React, { useEffect, useState } from 'react';
import ShowToast from '../components/ShowToast.jsx'; // Import the Toast component
import axios from 'axios';
import Select from 'react-select';

const CreateLead = () => {
  const initialFormData = {
    CustomerID: '',
    Name: '',
    PhoneNo: '',
    email: '',
    issueCategory: '',
    issueDescription: '',
    callDate: '',
    callTime: '',
    supportAgentName: '',
    priorityLevel: '',
  };

  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [customer, setCustomer] = useState([]);
  const [engineers, setEngineers] = useState([]);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleCustomerChange = (selectedOption) => {
    const selectedCustomer = customer.find(cust => cust._id === (selectedOption ? selectedOption.value : ''));

    setFormData({
      ...formData,
      CustomerID: selectedOption ? selectedOption.value : '',
      Name: selectedCustomer ? selectedCustomer.Name : '',
      PhoneNo: selectedCustomer ? selectedCustomer.PhoneNo : '',
      email: selectedCustomer ? selectedCustomer.Email : '',
      customerName: selectedCustomer ? selectedCustomer.Name : ''
    });
  };

  const handleEngineerChange = (selectedOption) => {
    setFormData({
      ...formData,
      supportAgentName: selectedOption ? selectedOption.value : ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/Lead/Create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        setError(data.message || 'Error creating lead');
        setToast({ show: true, message: data.message || 'Error creating lead', type: 'error' });
        return;
      }

      setToast({ show: true, message: 'Lead created successfully!', type: 'success' });
      clearForm();

      // Delay reload to ensure toast shows up before reloading
      setTimeout(() => {
        location.reload();
      }, 1000);
      
    } catch (error) {
      setLoading(false);
      setError(error.message);
      setToast({ show: true, message: error.message, type: 'error' });
    }
  };

  const clearForm = () => {
    setFormData(initialFormData);
  };

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get('/api/Customer/CustomerList');
        setCustomer(response.data.customers);
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    };

    const fetchEngineers = async () => {
      try {
        const response = await axios.get('/api/Engineer/ShowEngineer');
        setEngineers(response.data.Engineers);
      } catch (error) {
        console.error('Error fetching engineers:', error);
      }
    };

    fetchCustomers();
    fetchEngineers();
  }, []);

  const closeToast = () => {
    setToast({ show: false, message: '', type: '' });
  };

  const customerOptions = customer.map(cust => ({
    value: cust._id,
    label: cust.CustomerID,
  }));

  const engineerOptions = engineers.map(engn => ({
    value: engn._id,
    label: engn.Name,
  }));

  return (
    <div className="flex flex-col items-center mt-2 min-w-full">
      {toast.show && (
        <ShowToast message={toast.message} type={toast.type} onClose={closeToast} />
      )}
      <form className="grid grid-cols-1 gap-6 max-w-4xl mx-auto p-6 bg-white/40 rounded-md shadow-md sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4" onSubmit={handleSubmit}>
        <h2 className="col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4 text-3xl font-bold text-center mb-6">Customer Support Form</h2>

        <div className="col-span-1 sm:col-span-1 mb-4">
          <label className="block font-semibold mb-1" htmlFor="customerId">Select Customer</label>
          <Select
            id="CustomerID"       
            options={customerOptions}
            onChange={handleCustomerChange}
            isClearable
            required
            className="w-full"
          />
        </div>
        <div className="col-span-1 sm:col-span-1 mb-4">
          <label className="block font-semibold mb-1" htmlFor="Name">Enter Customer Name</label>
          <input
            id="Name"       
            value={formData.Name}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="col-span-1 sm:col-span-1 mb-4">
          <label className="block font-semibold mb-1" htmlFor="PhoneNo">Phone Number:</label>
          <input
            type="tel"
            id="PhoneNo"
            value={formData.PhoneNo}
            onChange={handleChange}
            pattern="[0-9]{10}"
            required
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="col-span-1 sm:col-span-1 mb-4">
          <label className="block font-semibold mb-1" htmlFor="email">Email Address:</label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="col-span-1 sm:col-span-1 mb-4">
          <label className="block font-semibold mb-1" htmlFor="issueCategory">Issue Category:</label>
          <select
            id="issueCategory"
            value={formData.issueCategory}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md"
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
        <div className="col-span-1 sm:col-span-2 mb-4">
          <label className="block font-semibold mb-1" htmlFor="issueDescription">Issue Description:</label>
          <textarea
            id="issueDescription"
            value={formData.issueDescription}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md"
          ></textarea>
        </div>
        <div className="col-span-1 sm:col-span-1 mb-4">
          <label className="block font-semibold mb-1" htmlFor="callDate">Call Date:</label>
          <input
            type="date"
            id="callDate"
            value={formData.callDate}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="col-span-1 sm:col-span-1 mb-4">
          <label className="block font-semibold mb-1" htmlFor="callTime">Call Time:</label>
          <input
            type="time"
            id="callTime"
            value={formData.callTime}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="col-span-1 sm:col-span-1 mb-4">
          <label className="block font-semibold mb-1" htmlFor="supportAgentName">Select Engineer</label>
          <Select
            id="supportAgentName"
            options={engineerOptions}
            onChange={handleEngineerChange}
            isClearable
            required
            className="w-full"
          />
        </div>
        <div className="col-span-1 sm:col-span-1 mb-4">
          <label className="block font-semibold mb-1" htmlFor="priorityLevel">Priority Level:</label>
          <select
            id="priorityLevel"
            value={formData.priorityLevel}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">Select</option>
            <option value="Low">Low 🟢</option>
            <option value="Medium">Medium 🟡</option>
            <option value="High">High 🔴</option>
            <option value="Critical">Critical</option>
          </select>
        </div>
    
        <div className="col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4 mt-4">
          <button
            type="submit"
            className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80 w-full"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateLead;

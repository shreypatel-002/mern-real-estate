import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal } from 'flowbite-react';

const EditTaskModal = ({ isOpen, onClose, onSave, updatedTask }) => {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

   

    const [formData, setFormData] = useState({
          ...updatedTask,
        dueDate: updatedTask.dueDate ? formatDate(updatedTask.dueDate) : '',
    });

    const [customers, setCustomers] = useState([]);
    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const customerResponse = await axios.get('/api/Customer/CustomerList');
                setCustomers(customerResponse.data.customers);
            } catch (error) {
                console.error('Error fetching customers:', error);
            }
        };

        fetchCustomers();
    }, []);

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
            const response = await axios.put(`/api/Engineer/updateTask/${updatedTask._id}`, formData);
            onSave(response.data.updatedTask);
            onClose();
            location.reload();
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    return  <Modal show={isOpen} onClose={onClose} size="6xl">
   
    <Modal.Body className="max-h-screen overflow-y-auto">
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white p-6 rounded-md shadow-md w-full max-w-3xl">
                <h2 className="text-lg font-semibold mb-4">Edit Task</h2>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        <div className="mb-4">
                            <label className="block text-gray-700">Title</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Description</label>
                            <input
                                type="text"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Customer</label>
                            <select
                                name="Customer"
                                value={formData.Customer}
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
                            <label className="block text-gray-700">DueDate</label>
                            <input
                                type="date"
                                name="dueDate"
                                value={formData.dueDate}
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
        </Modal.Body> 
        </Modal>
};

export default EditTaskModal;

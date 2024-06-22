import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal } from 'flowbite-react';
import { CircularProgress } from '@mui/material';

const TaskList = ({ isOpen, onClose, eCode }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingTaskId, setUpdatingTaskId] = useState(null);
  const [remarks, setRemarks] = useState('');
  const [remarksModalOpen, setRemarksModalOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  useEffect(() => {
    if (!eCode) return;

    const fetchTasks = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/Engineer/tasks?ECode=${eCode}`);
        setTasks(response.data.tasks);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchTasks();
  }, [eCode]);

  const handleStatusChange = (taskId, newStatus) => {
    if (newStatus === 'Completed') {
      setSelectedTaskId(taskId);
      setRemarksModalOpen(true);
    } else {
      updateTaskStatus(taskId, newStatus);
    }
  };

  const updateTaskStatus = async (taskId, newStatus, remarks = '') => {
    setUpdatingTaskId(taskId);
    try {
      const response = await axios.put(`/api/Engineer/update/${taskId}`, { status: newStatus, remarks });
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === taskId ? { ...task, status: newStatus, remarks } : task
        )
      );
      setUpdatingTaskId(null);
    } catch (error) {
      setError(error);
      setUpdatingTaskId(null);
    }
  };

  const handleRemarksSubmit = () => {
    updateTaskStatus(selectedTaskId, 'Completed', remarks);
    setRemarks('');
    setRemarksModalOpen(false);
  };

  if (loading) return <div className="flex justify-center items-center"><CircularProgress /></div>;
  if (error) return <p>Error loading tasks</p>;

  return (
    <>
      <Modal show={isOpen} onClose={onClose}>
        <Modal.Header>
          Tasks
        </Modal.Header>
        <Modal.Body>
          <table className="min-w-full divide-y divide-gray-200 border shadow-sm">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DueDate</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tasks.map((task) => (
                <tr key={task._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{task.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.Customer?.Name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(task.dueDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.status}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <select
                      value={task.status}
                      onChange={(e) => handleStatusChange(task._id, e.target.value)}
                      disabled={updatingTaskId === task._id}
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700 "
            onClick={onClose}
          >
            Close
          </button>
        </Modal.Footer>
      </Modal>

      <Modal show={remarksModalOpen} onClose={() => setRemarksModalOpen(false)}>
        <Modal.Header>
          Remarks
        </Modal.Header>
        <Modal.Body>
          <textarea
            className="w-full p-2 border rounded"
            rows="4"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="Enter remarks for completion"
          ></textarea>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
            onClick={handleRemarksSubmit}
          >
            Submit
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default TaskList;

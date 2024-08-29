import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Modal } from 'flowbite-react';
import { CircularProgress } from '@mui/material';
import EditTaskModal from './EditTaskModal';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

const TaskList = ({ isOpen, onClose, eCode }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingTaskId, setUpdatingTaskId] = useState(null);
  const [remarks, setRemarks] = useState('');
  const [remarksModalOpen, setRemarksModalOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [engineers, setEngineers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null); // Added state for engineer to delete

  const [selectedTask, setSelectedTask] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    if (!eCode) return;

    const fetchTasks = async () => {
      setLoading(true);
      try {
        const [taskResponse,engineersResponse, customerResponse] = await Promise.all([
          axios.get(`/api/Engineer/tasks?ECode=${eCode}`),
          axios.get('/api/Engineer/ShowEngineer'),
        ]);
        setTasks(taskResponse.data.tasks || []);
        setEngineers(engineersResponse.data.Engineers);
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
      await axios.put(`/api/Engineer/updateTask/${taskId}`, { status: newStatus, remarks });
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
  const handleEditClick = (task) => {
    setSelectedTask(task);
     setIsEditModalOpen(true)
  };
  const handleSaveEditTask = (task) => {
    if (!task || !task._id) return; // Ensure the engineer object is valid
    setTasks(tasks.map(updatedTask => updatedTask._id === task._id ? task : updatedTask));
    setIsEditModalOpen(false);
  };
  const handleDeleteClick = (TaskId) => {
    setTaskToDelete(TaskId); // Set the engineer to delete
    setIsModalOpen(true); // Open the confirmation modal
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`/api/Engineer/deleteTask/${taskToDelete}`);
      setTasks(tasks.filter(task => task._id !== taskToDelete));
      setIsModalOpen(false); // Close the confirmation modal
    } catch (error) {
      console.error('Error deleting task:', error);
      setError(error);
      setIsModalOpen(false); // Close the confirmation modal
    }
  };


  
  const getEngineerName = (engineerId) => {
    const engineer = engineers.find(eng => eng._id === engineerId);
    return engineer ? engineer.Name : 'Unknown';
  };

  if (loading) return <div className="flex justify-center items-center"><CircularProgress /></div>;
  if (error) return <p>Error loading tasks</p>;

  return (
    <>
      <Modal show={isOpen} onClose={onClose} size="6xl">
        <Modal.Header>
          Tasks
        </Modal.Header>
        <Modal.Body className="max-h-screen overflow-y-auto">
          <table className="min-w-full divide-y divide-gray-200 border shadow-sm">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">engineer Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">customer Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remarks</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tasks.map((task) => (
                <tr key={task._id} className={task.status === 'Completed' ? 'bg-green-100' : ' bg-lime-100'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{task.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getEngineerName(task.assignedTo)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.Customer?.Name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(task.dueDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.status}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.remarks}</td>
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button className=' bg-sky-500 text-white py-2 px-4 rounded hover:bg-blue-500' onClick={()=>handleEditClick(task)} >
                         Update
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button className=' bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700'   onClick={() => handleDeleteClick(task._id)}>
                         Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700"
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
            className="w-full p-5 border rounded"
            rows="4"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="Enter remarks for completion"
          ></textarea>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
            onClick={handleRemarksSubmit}
          >
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
      {isEditModalOpen && selectedTask && (
        <EditTaskModal
          isOpen={isEditModalOpen}
          updatedTask={selectedTask}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleSaveEditTask}
        />
      )}
       {isModalOpen && (
        <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <Modal.Header />
          <Modal.Body>
            <div className="text-center">
              <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
              <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                Are you sure you want to delete this engineer?
              </h3>
              <div className="flex justify-center gap-4">
                <Button color="failure" onClick={confirmDelete}>
                  Yes, I'm sure
                </Button>
                <Button color="gray" onClick={() => setIsModalOpen(false)}>
                  No, cancel
                </Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      )}
    </>
  );
};

export default TaskList;

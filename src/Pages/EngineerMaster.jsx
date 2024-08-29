import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import InsertEngineerModal from '../components/InsertEngineerModal.jsx';
import EditEngineerModal from '../components/EditEngineerModal.jsx';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, Modal, Pagination } from 'flowbite-react';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import { CircularProgress } from '@mui/material';
import AssignTaskModal from '../components/AssignTaskModal.jsx';
import TaskList from '../components/TaskList.jsx';
import AssignmentIcon from '@mui/icons-material/Assignment';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

const EngineerMaster = () => {
  const [data, setData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('');
  const [isInsertModalOpen, setIsInsertModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAssignTaskModalOpen, setIsAssignTaskModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedEngineer, setSelectedEngineer] = useState(null);
  const [selectedEngineerECode, setSelectedEngineerECode] = useState(null);
  const [limit, setLimit] = useState(6);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [engineerToDelete, setEngineerToDelete] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const fetchData = async (searchQuery = '', filter = '', limit = 6, page = 1) => {
    setLoading(true);
    try {
      const startIndex = (page - 1) * limit;
      const response = await axios.get(`/api/Engineer/ShowEngineer?SearchTerm=${searchQuery}&filter=${filter}&limit=${limit}&startIndex=${startIndex}`);
      setData(response.data.Engineers || []);
      setTotalCount(response.data.totalCount);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching engineers:', error);
      setError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('SearchTerm');
    const filterFromUrl = urlParams.get('filter');
    const limitFromUrl = parseInt(urlParams.get('limit')) || limit;
    const pageFromUrl = parseInt(urlParams.get('page')) || currentPage;

    setSearchTerm(searchTermFromUrl || '');
    setFilter(filterFromUrl || '');
    setLimit(limitFromUrl);
    setCurrentPage(pageFromUrl);
  }, [location.search]);

  useEffect(() => {
    fetchData(searchTerm, filter, limit, currentPage);
  }, [searchTerm, filter, limit, currentPage]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set('SearchTerm', searchTerm);
    urlParams.set('filter', filter);
    urlParams.set('limit', limit);
    urlParams.set('page', 1);
    navigate(`?${urlParams.toString()}`);
    fetchData(searchTerm, filter, limit, 1);
  };

  const handleInsertClick = () => {
    setIsInsertModalOpen(true);
  };

  const handleSaveEngineer = (newEngineer) => {
    setData([...data, newEngineer]);
    setIsInsertModalOpen(false);
  };

  const handleEditClick = (engineer) => {
    setSelectedEngineer(engineer);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (engineerId) => {
    setEngineerToDelete(engineerId);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`/api/Engineer/deleteEngineer/${engineerToDelete}`);
      setData(data.filter(engineer => engineer._id !== engineerToDelete));
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error deleting engineer:', error);
      setError(error);
      setIsModalOpen(false);
    }
  };

  const handleSaveEditEngineer = (engineer) => {
    if (!engineer || !engineer._id) return;
    setData(data.map(updatedEngineer => updatedEngineer._id === engineer._id ? engineer : updatedEngineer));
    setIsEditModalOpen(false);
  };

  const handleAssignTaskClick = () => {
    setIsAssignTaskModalOpen(true);
  };

  const handleSaveTask = async (newTask) => {
    try {
      await axios.post('/api/Engineer/task', newTask);
      setIsAssignTaskModalOpen(false);
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  const handleViewTasks = (eCode) => {
    setSelectedEngineerECode(eCode);
    setIsTaskModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEngineerECode(null);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('SearchTerm', searchTerm);
    urlParams.set('filter', filter);
    urlParams.set('limit', limit);
    urlParams.set('page', page);
    navigate(`?${urlParams.toString()}`);
    fetchData(searchTerm, filter, limit, page);
  };

  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div className="flex justify-center min-h-screen sm:px-6 md:px-7 lg:px-8 bg-white/40 w-full">
      <div className="w-full overflow-auto mt-6 items-center">
        <h2 className='col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4 text-3xl font-bold text-center mb-6 font-serif '>Engineer Dashboard</h2>
        <div className="flex flex-row gap-5 items-center justify-between mb-5">
          <form onSubmit={handleSearchSubmit} className="flex flex-row items-center gap-2 bg-white/30 p-2 rounded shadow-md">
            <input
              type="text"
              placeholder="Search.."
              className="rounded-lg p-2 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="text-gray-600 hover:text-gray-800">
              <FaSearch className="size-6" />
            </button>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="ml-2 p-2 rounded-lg outline-none"
            >
              <option value="">All</option>
              <option value="Udhana">Udhana</option>
              <option value="Vesu">Vesu</option>
              <option value="Adajan">Adajan</option>
              <option value="Bhatar">Bhatar</option>
              <option value="Rander">Rander</option>
            </select>
          </form>
          <button
            type="button"
            className="bg-blue-500 text-white py-2 px-4 rounded-full uppercase hover:opacity-95 disabled:opacity-50 flex items-center gap-2"
            onClick={handleInsertClick}
          >
            <GroupAddIcon />
            Insert
          </button>
          <button
            type="button"
            className="bg-green-500 text-white py-2 px-2 rounded-full uppercase hover:opacity-95 disabled:opacity-50 flex items-center gap-1"
            onClick={handleAssignTaskClick}
          >
            <AssignmentIcon />
            Assign Task
          </button>
        </div>
        {loading ? (
          <div className="flex justify-center items-center">
            <CircularProgress />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((engineer) => (
            <div key={engineer._id} className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="flex justify-center mt-4"> {/* Added a flex container to center the image */}
                <img
                  className="h-32 w-32 object-cover rounded-full" // Added `rounded-full` and set a fixed height and width
                  src={`${engineer.Profile}`}
                  alt="Profile"
                />
              </div>
              <div className="p-3"> {/* Reduced padding */}
                <h3 className="text-lg font-bold mb-1 text-center">{engineer.Name}</h3> {/* Centered the text */}
                <p className="text-gray-600 text-sm mb-1 text-center"><strong>Engineer Code:</strong> {engineer.ECode}</p> {/* Centered the text */}
                <p className="text-gray-600 text-sm mb-1 text-center"><strong>Phone No:</strong> {engineer.PhoneNo}</p> {/* Centered the text */}
                <p className="text-gray-600 text-sm mb-1 text-center"><strong>Area:</strong> {engineer.Area}</p> {/* Centered the text */}
                <div className="flex justify-between items-center mt-2"> {/* Reduced margin */}
                  <button
                    className="bg-green-500 text-white py-1 px-2 rounded hover:bg-green-700 text-xs"
                    onClick={() => handleViewTasks(engineer.ECode)}
                  >
                    View Tasks
                  </button>
                  <button
                    className="bg-yellow-500 text-white py-1 px-2 rounded hover:bg-yellow-700 text-xs"
                    onClick={() => handleEditClick(engineer)}
                  >
                    <EditIcon fontSize="small" /> {/* Adjust icon size */}
                  </button>
                  <button
                    className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-700 text-xs"
                    onClick={() => handleDeleteClick(engineer._id)}
                  >
                    <DeleteIcon fontSize="small" /> {/* Adjust icon size */}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        )}
        <div className="mt-4 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
      {isInsertModalOpen && (
        <InsertEngineerModal
          isOpen={isInsertModalOpen}
          onClose={() => setIsInsertModalOpen(false)}
          onSave={handleSaveEngineer}
        />
      )}
      {isEditModalOpen && selectedEngineer && (
        <EditEngineerModal
          isOpen={isEditModalOpen}
          updatedEngineer={selectedEngineer}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleSaveEditEngineer}
        />
      )}
      {isAssignTaskModalOpen && (
        <AssignTaskModal
          isVisible={isAssignTaskModalOpen}
          onClose={() => setIsAssignTaskModalOpen(false)}
          onSave={handleSaveTask}
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
      {isTaskModalOpen && selectedEngineerECode && (
        <TaskList
          isOpen={isTaskModalOpen}
          onClose={handleCloseModal}
          eCode={selectedEngineerECode}
        />
      )}
    </div>
  );
};

export default EngineerMaster;

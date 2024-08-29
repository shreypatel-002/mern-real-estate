import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import InsertCustomerModal from '../components/InsertCustomerModal.jsx';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, Modal, Pagination } from 'flowbite-react';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import { CircularProgress } from '@mui/material';
import EditCustomerModal from '../components/EditCustomerModal.jsx';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

const CustomerMaster = () => {
  const [data, setData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerToDelete, setCustomerToDelete] = useState(null); // Added state for engineer to delete
  const [isInsertModalOpen, setIsInsertModalOpen] = useState(false);


  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [limit, setLimit] = useState(5); // Number of records per page
  const [currentPage, setCurrentPage] = useState(1); // Current page
  const navigate = useNavigate();
  const location = useLocation();

  const fetchData = async (searchQuery = '', limit = 5, page = 1) => {
    setLoading(true);
    try {
      const startIndex = (page - 1) * limit;
      const response = await axios.get(`/api/Customer/CustomerList?SearchTerm=${searchQuery}&limit=${limit}&startIndex=${startIndex}`);
     
      setData(response.data.customers || []);
      setTotalCount(response.data.totalCount);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('SearchTerm');
    const limitFromUrl = parseInt(urlParams.get('limit')) || limit;
    const pageFromUrl = parseInt(urlParams.get('page')) || currentPage;

    setSearchTerm(searchTermFromUrl || '');
    setLimit(limitFromUrl);
    setCurrentPage(pageFromUrl);
  }, [location.search]);


  useEffect(() => {
    fetchData(searchTerm, limit, currentPage);
  }, [searchTerm, limit, currentPage]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('SearchTerm', searchTerm);
    urlParams.set('limit', limit);
    urlParams.set('page', 1); // Reset to first page on new search
    navigate(`?${urlParams.toString()}`);
    fetchData(searchTerm, limit, 1);
  };

  const handleInsertClick = () => {
    setIsInsertModalOpen(true);
  };
  const handleEditClick = (customer) => {
    setSelectedCustomer(customer);
    setIsEditModalOpen(true);
  };
  const handleSaveEditCustomer = (customer) => {
    if (!customer || !customer._id) return; // Ensure the engineer object is valid
    setData(data.map(updatedCustomer => updatedCustomer._id === customer._id ? customer : updatedCustomer));
    setIsEditModalOpen(false);
  };

  const handleDeleteClick = (customerid) => {
    setCustomerToDelete(customerid); // Set the customer to delete
    setIsModalOpen(true); // Open the confirmation modal
  };
  const confirmDelete = async () => {
    try {
      await axios.delete(`/api/Customer/deletecustomer/${customerToDelete}`);
      setData(data.filter(customer => customer._id !== customerToDelete));
      setIsModalOpen(false); // Close the confirmation modal
    } catch (error) {
      console.error('Error deleting engineer:', error);
      setError(error);
      setIsModalOpen(false); // Close the confirmation modal
    }
  };
  const handleSave = (newCustomer) => {
    setData([...data, newCustomer]);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('SearchTerm', searchTerm);
    urlParams.set('limit', limit);
    urlParams.set('page', page);
    navigate(`?${urlParams.toString()}`);
    fetchData(searchTerm, limit, page);
  };

  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div className="flex justify-center min-h-screen px-4 sm:px-6 md:px-7 lg:px-8 bg-white/25 w-full">
      <div className="w-full overflow-auto mt-6 items-center">
      <h2 className='col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4 text-3xl font-bold text-center mb-6 font-serif '>Customer Dashboard</h2>
        <div className="flex flex-row gap-5 items-center justify-between mb-5">
          <form onSubmit={handleSearchSubmit} className="flex flex-row items-center gap-2 bg-white/40  p-2 rounded shadow-md">
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
          </form>
          
          <button
            type="button"
            className="bg-blue-500 text-white p-2 rounded-lg uppercase hover:opacity-95 disabled:opacity-50 flex items-center gap-2"
            onClick={handleInsertClick}
          >
            <GroupAddIcon />
            Insert
          </button>
        </div>
        {loading ? (
          <div className="flex justify-center items-center">
            <CircularProgress />
          </div>
        ) : (
          <>
            <table className="min-w-full divide-y divide-gray-200 border shadow-sm">
              <thead className="bg-white/90 ">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Phone No
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Customer ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white/90 divide-y divide-gray-200">
                {data.map((customer) => (
                  <tr key={customer._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{customer.Name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{customer.Email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{customer.PhoneNo}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{customer.CustomerID}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <button
                        className="bg-yellow-500 text-white py-1 px-2 rounded hover:bg-yellow-700 mr-2"
                        onClick={() => handleEditClick(customer)}
                      >
                        <EditIcon />
                      </button>
                      <button
                        className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-700"
                        onClick={() => handleDeleteClick(customer._id)}
                      >
                        <DeleteIcon />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-between items-center mt-4">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          </>
        )}
      </div>

      {isInsertModalOpen && (
        <InsertCustomerModal
        isOpen={isInsertModalOpen}
          onClose={() => setIsInsertModalOpen(false)}
          onSave={handleSave}
        />
      )}
      {isEditModalOpen && selectedCustomer && (
        <EditCustomerModal
          isOpen={isEditModalOpen}
          updatedCustomer={selectedCustomer}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleSaveEditCustomer}
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
    </div>
  );
};

export default CustomerMaster;

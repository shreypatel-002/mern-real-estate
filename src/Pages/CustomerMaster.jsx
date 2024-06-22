import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import InsertCustomerModal from '../components/InsertCustomerModal.jsx';
import { useNavigate, useLocation } from 'react-router-dom';
import { Pagination } from 'flowbite-react';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import { CircularProgress } from '@mui/material';

const CustomerMaster = () => {
  const [data, setData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [limit, setLimit] = useState(8); // Number of records per page
  const [currentPage, setCurrentPage] = useState(1); // Current page
  const navigate = useNavigate();
  const location = useLocation();

  const fetchData = async (searchQuery = '', limit = 8, page = 1) => {
    setLoading(true);
    try {
      const startIndex = (page - 1) * limit;
      const response = await axios.get(`/api/Customer/CustomerList?SearchTerm=${searchQuery}&limit=${limit}&startIndex=${startIndex}`);
      setData(response.data.customers);
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
    fetchData(searchTermFromUrl, limitFromUrl, pageFromUrl);
  }, [location.search]);

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
    setIsModalOpen(true);
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
    <div className="flex justify-center min-h-screen px-4 sm:px-6 md:px-7 lg:px-8 bg-gray-100 w-full">
      <div className="w-full overflow-auto mt-6 items-center">
        <div className="flex flex-row gap-5 items-center justify-between mb-5">
          <form onSubmit={handleSearchSubmit} className="flex flex-row items-center gap-2 bg-white p-2 rounded shadow-md">
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
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone No
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer ID
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.map((item) => (
                  <tr key={item._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.Name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.Email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.PhoneNo}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.CustomerID}</td>
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
      {isModalOpen && (
        <InsertCustomerModal
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default CustomerMaster;

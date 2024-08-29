import { CircularProgress, Pagination } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios

const TrackStatus = () => {
  const [data, setData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // Start loading as false initially
  const [searchTerm, setSearchTerm] = useState('');

  const [limit, setLimit] = useState(1); // Number of records per page
  const [currentPage, setCurrentPage] = useState(1); // Current page
  const navigate = useNavigate();
  const location = useLocation();

  const fetchData = async (searchQuery = '', limit = 1, page = 1) => {
    if (!searchQuery) {
      setData([]); // Clear the data state if the search query is empty
      setTotalCount(0);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const startIndex = (page - 1) * limit;
      const response = await axios.get(`/api/Lead/TrackLead?SearchTerm=${searchQuery}&limit=${limit}&startIndex=${startIndex}`);
      setData(response.data.Trackleads || []);
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

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to the first page on new search
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('SearchTerm', searchTerm);
    urlParams.set('limit', limit);
    urlParams.set('page', 1); // Reset to first page on new search
    navigate(`?${urlParams.toString()}`);
    fetchData(searchTerm, limit, 1);
  };

  const handlePageChange = (event, page) => {
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
        <h2 className="col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4 text-3xl font-bold text-center mb-6 font-serif">
          Customer Dashboard
        </h2>
        <div className="flex flex-row gap-5 items-center justify-between mb-5">
          <form onSubmit={handleSearchSubmit} className="flex flex-row items-center gap-2 bg-white/40 p-2 rounded shadow-md">
            <input
              type="text"
              placeholder="Search.."
              className="rounded-lg p-2 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="text-gray-600 hover:text-gray-800">
              <FaSearch size={20} /> {/* Adjust the size using inline style or prop */}
            </button>
          </form>
        </div>
        {loading ? (
          <div className="flex justify-center items-center">
            <CircularProgress />
          </div>
        ) : (
          <>
            {data.length === 0 && searchTerm ? (
              <div className="text-center text-gray-500">No leads found</div>
            ) : (
              <>
                <table className="min-w-full divide-y divide-gray-200 border shadow-sm">
                  <thead className="bg-white/90">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                        Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                        Email
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                        issue Description 
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                       Issue Category
                      </th>
                     
                    </tr>
                  </thead>
                  <tbody className="bg-white/90 divide-y divide-gray-200">
                    {data.map((track) => (
                      <tr key={track._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{track.Name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{track.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{track.issueDescription}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{track.issueCategory}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {/* <div className="flex justify-between items-center mt-4">
                  <Pagination
                    page={currentPage}
                    count={totalPages}
                    onChange={handlePageChange}
                  />
                </div> */}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TrackStatus;

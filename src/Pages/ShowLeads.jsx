import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EditLeadModal from '../components/EditLeadModel';
import { Button, Modal, Pagination } from 'flowbite-react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

const ShowLeads = () => {
  const [data, setData] = useState([]);
  const [engineers, setEngineers] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLead, setSelectedLead] = useState(null);
  const [leadToDelete, setleadToDelete] = useState(null); // Added state for engineer to delete
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [leadsResponse, engineersResponse, customersResponse] = await Promise.all([
          axios.get('/api/Lead/Show'),
          axios.get('/api/Engineer/ShowEngineer'),
          axios.get('/api/Customer/CustomerList')
        ]);

        setData(leadsResponse.data);
        setEngineers(engineersResponse.data.Engineers);
        setCustomers(customersResponse.data.customers);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleEditClick = (lead) => {
    setSelectedLead(lead);
  };
  const handleDeleteClick =(leadId)=>{
    setleadToDelete(leadId)
    setIsModalOpen(true); // Open the confirmation modal
  }
  const confirmDelete = async () => {
    try {
      await axios.delete(`/api/Lead/delete/${leadToDelete}`);
      setData(data.filter(lead => lead._id !== leadToDelete));
      setIsModalOpen(false); // Close the confirmation modal
    } catch (error) {
      console.error('Error deleting engineer:', error);
      setError(error);
      setIsModalOpen(false); // Close the confirmation modal
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen"><p>Loading...</p></div>;
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen"><p>Error: {error.message}</p></div>;
  }

  const getCustomerName = (customerId) => {
    const customer = customers.find(cust => cust._id === customerId);
    return customer ? customer.Name : 'Unknown';
  };

  const getEngineerName = (engineerId) => {
    const engineer = engineers.find(eng => eng._id === engineerId);
    return engineer ? engineer.Name : 'Unknown';
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  return (
    <div className="flex flex-col min-h-screen px-4 sm:px-6 md:px-7 lg:px-8 mt-1">
      <div className="w-full overflow-auto ">
      <h2 className="col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4 text-3xl font-bold text-center mb-6 font-serif">Lead Records</h2>
        <table className="min-w-full divide-y divide-gray-200 ">
          <thead className="bg-white/90">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">tracking id</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issue Category</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Call Date</th>
              {/* <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority Level</th> */}
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Engineer Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 bg-white/90">
            {currentItems.map((item) => (
              <tr key={item._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{getCustomerName(item.CustomerID)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.LeadID}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.email}</td>
               
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.issueCategory}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(item.callDate).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getEngineerName(item.supportAgentName)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button 
                    className="text-blue-500 hover:underline mr-2" 
                    onClick={() => handleEditClick(item)}
                  >
                    Edit
                  </button>
                  <button 
                    className="text-red-500 hover:underline" 
                    onClick={()=>handleDeleteClick(item._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center mt-4">
        <Pagination
          currentPage={currentPage}
          layout="navigation"
          onPageChange={setCurrentPage}
          showIcons
          totalPages={totalPages}
        />
      </div>
      {selectedLead && 
        <EditLeadModal 
          lead={selectedLead} 
          onClose={() => setSelectedLead(null)}
          onSave={(updatedLead) => {
            setData(data.map(lead => lead._id === updatedLead._id ? updatedLead : lead));
            setSelectedLead(null);
          }}
        />
      }
       {isModalOpen && (
        <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <Modal.Header />
          <Modal.Body>
            <div className="text-center">
              <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
              <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                Are you sure you want to delete this lead ?
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

export default ShowLeads;

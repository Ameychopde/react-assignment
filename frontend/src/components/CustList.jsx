// src/components/CustomerList.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CustForm from './CustForm'; // Import CustomerForm component

const CustList = () => {
  const [customers, setCustomers] = useState([]);
  const [userActions, setUserActions] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    fullName: '',
    email: '',
    mobile: '',
    addresses: [{ line1: '', line2: '', postcode: '', state: '', city: '' }]
  });
  const [refresh, setRefresh] = useState(false); // State to trigger refresh

  // Fetch customers when component mounts or refresh is triggered
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/customers/get-cust');
        setCustomers(response.data);
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    };

    fetchCustomers();
  }, [refresh]); // Depend on refresh state

  const handleEditClick = (customer) => {
    setEditingId(customer._id); // Ensure correct ID field
    setEditForm(customer);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm({ ...editForm, [name]: value });
  };

  const handleAddressChange = (index, field, value) => {
    const newAddresses = editForm.addresses.slice();
    newAddresses[index][field] = value;
    setEditForm({ ...editForm, addresses: newAddresses });
  };

  const handleSaveEdit = async () => {
    try {
      await axios.put(`http://localhost:5000/api/customers/update-cust/${editingId}`, editForm);
      setUserActions((prevActions) => [...prevActions, { action: 'Edit', customerId: editingId }]);
      setCustomers((prevCustomers) => prevCustomers.map(customer =>
        customer._id === editingId ? editForm : customer
      ));
      setEditingId(null);
    } catch (error) {
      console.error('Error updating customer:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({
      fullName: '',
      email: '',
      mobile: '',
      addresses: [{ line1: '', line2: '', postcode: '', state: '', city: '' }]
    });
  };

  const handleDeleteClick = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/customers/delete-cust/${id}`);
      if (response.status === 200) {
        setUserActions((prevActions) => [...prevActions, { action: 'Delete', customerId: id }]);
        setCustomers((prevCustomers) => prevCustomers.filter(customer => customer._id !== id));
      } else {
        console.error('Failed to delete customer');
      }
    } catch (error) {
      console.error('Error deleting customer:', error);
    }
  };

  // Function to trigger a refresh
  const handleAddCustomer = () => {
    setRefresh(prev => !prev); // Toggle refresh state
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">React Assignment</h1>
      <CustForm onAddCustomer={handleAddCustomer} /> {/* Render CustomerForm and pass callback */}
      <div className="overflow-x-auto mt-6">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pan</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {customers.length > 0 ? (
              customers.map((customer) => (
                <tr key={customer._id}> {/* Use _id if that's your ID field */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{customer.pan}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {editingId === customer._id ? (
                      <input
                        type="text"
                        name="fullName"
                        value={editForm.fullName}
                        onChange={handleEditChange}
                        className="border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        required
                      />
                    ) : (
                      customer.fullName
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {editingId === customer._id ? (
                      <input
                        type="email"
                        name="email"
                        value={editForm.email}
                        onChange={handleEditChange}
                        className="border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        required
                      />
                    ) : (
                      customer.email
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {editingId === customer._id ? (
                      <>
                        <div className="space-y-2">
                          {editForm.addresses.map((address, index) => (
                            <div key={index} className="border p-2 rounded-md">
                              <div className="flex flex-col mb-2">
                                <label className="text-xs font-medium text-gray-500">Line 1</label>
                                <input
                                  type="text"
                                  value={address.line1}
                                  onChange={(e) => handleAddressChange(index, 'line1', e.target.value)}
                                  className="border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                              </div>
                              <div className="flex flex-col mb-2">
                                <label className="text-xs font-medium text-gray-500">Line 2</label>
                                <input
                                  type="text"
                                  value={address.line2}
                                  onChange={(e) => handleAddressChange(index, 'line2', e.target.value)}
                                  className="border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                              </div>
                              <div className="flex flex-col mb-2">
                                <label className="text-xs font-medium text-gray-500">City</label>
                                <input
                                  type="text"
                                  value={address.city}
                                  onChange={(e) => handleAddressChange(index, 'city', e.target.value)}
                                  className="border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                              </div>
                              <div className="flex flex-col mb-2">
                                <label className="text-xs font-medium text-gray-500">State</label>
                                <input
                                  type="text"
                                  value={address.state}
                                  onChange={(e) => handleAddressChange(index, 'state', e.target.value)}
                                  className="border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                              </div>
                              <div className="flex flex-col mb-2">
                                <label className="text-xs font-medium text-gray-500">Postcode</label>
                                <input
                                  type="text"
                                  value={address.postcode}
                                  onChange={(e) => handleAddressChange(index, 'postcode', e.target.value)}
                                  className="border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                        <button
                          onClick={handleSaveEdit}
                          className="text-green-600 hover:text-green-900 mr-2"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="text-red-600 hover:text-red-900"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEditClick(customer)}
                          className="text-yellow-600 hover:text-yellow-900 mr-2"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteClick(customer._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-gray-500">No customers found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    
    </div>
  );
};

export default CustList;

// src/components/CustomerForm.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
// define the form 
const CustForm = ({ onAddCustomer }) => {
  const [formData, setFormData] = useState({
    pan: "",
    fullName: "",
    email: "",
    mobile: "",
    addresses: [{ line1: "", line2: "", postcode: "", state: "", city: "" }],
  });

  const [isPanValid, setIsPanValid] = useState(false);
  const [panVerificationStatus, setPanVerificationStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fetchedPostcodes, setFetchedPostcodes] = useState({}); // Track fetched postcodes
// checking for pan card verfication 
  useEffect(() => {
    const verifyPan = async (panNumber) => {
      if (panNumber.length === 10) {
        try {
          const response = await axios.post(
            "https://lab.pixel6.co/api/verify-pan.php",
            { panNumber }
          );
          if (response.data.isValid) {
            setFormData({ ...formData, fullName: response.data.fullName });
            setIsPanValid(true);
            setPanVerificationStatus("PAN is valid");
          } else {
            setIsPanValid(false);
            setPanVerificationStatus("PAN is invalid");
          }
        } catch (error) {
          console.error("Error verifying PAN:", error);
          setIsPanValid(false);
          setPanVerificationStatus("PAN verification failed");
        }
      } else {
        setIsPanValid(false);
        setPanVerificationStatus("PAN should be 10 characters long");
      }
    };

    if (formData.pan) {
      verifyPan(formData.pan);
    } else {
      setIsPanValid(false);
      setPanVerificationStatus(null);
    }
  }, [formData.pan]);
// Adding  address got by postcode using  provided api 
  useEffect(() => {
    formData.addresses.forEach((address, index) => {
      if (
        address.postcode &&
        address.postcode.length === 6 &&
        !fetchedPostcodes[address.postcode]
      ) {
        fetchStateAndCity(address.postcode, index);
      }
    });
  }, [formData.addresses]);

  const fetchStateAndCity = async (postcode, index) => {
    try {
      const response = await axios.post(
        "https://lab.pixel6.co/api/get-postcode-details.php",
        { postcode: postcode }
      );
      if (
        response.data.status === "Success" &&
        response.data.statusCode === 200
      ) {
        const updatedAddresses = [...formData.addresses];
        updatedAddresses[index].state = response.data.state[0].name;
        updatedAddresses[index].city = response.data.city[0].name;
        setFormData({ ...formData, addresses: updatedAddresses });
        setFetchedPostcodes({ ...fetchedPostcodes, [postcode]: true }); 
      } else {
        console.error("Error fetching state and city:", response.data);
      }
    } catch (error) {
      console.error("Error fetching state and city:", error);
    }
  };
  // Hadlling the the input  given by users .
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  //  handling the address change as max 10 time use can add address .
  const handleAddressChange = (index, field, value) => {
    const newAddresses = formData.addresses.slice();
    newAddresses[index][field] = value;
    if (field === "postcode") {
      
      const newFetchedPostcodes = { ...fetchedPostcodes };
      delete newFetchedPostcodes[value];
      setFetchedPostcodes(newFetchedPostcodes);
    }
    setFormData({ ...formData, addresses: newAddresses });
  };

  const handleAddAddress = () => {
    if (formData.addresses.length < 10) {
      setFormData({
        ...formData,
        addresses: [
          ...formData.addresses,
          { line1: "", line2: "", postcode: "", state: "", city: "" },
        ],
      });
    }
  };

  const handleRemoveAddress = (index) => {
    const newAddresses = formData.addresses.slice();
    newAddresses.splice(index, 1);
    setFormData({ ...formData, addresses: newAddresses });
  };

  // sending the creat post request to the server after submiting the from  . 
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isPanValid) {
      setIsSubmitting(true);
      try {
        await axios.post(
          "http://localhost:5000/api/customers/create-cust",
          formData
        );
        alert("Customer added successfully");
        setFormData({
          pan: "",
          fullName: "",
          email: "",
          mobile: "",
          addresses: [
            { line1: "", line2: "", postcode: "", state: "", city: "" },
          ],
        });
        // Calling the callback to update the customer list
        setIsPanValid(false);
        if (onAddCustomer) onAddCustomer(); 
      } catch (error) {
        console.error("Error adding customer:", error);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      alert("Please enter a valid PAN");
    }
  };

  return (
    <div className="flex justify-center pt-10 pb-10 items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold mb-4">Add Customer</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">PAN</label>
          <input
            type="text"
            name="pan"
            maxLength={10}
            value={formData.pan}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
          {panVerificationStatus && (
            <p
              className={`mt-2 text-sm ${
                isPanValid ? "text-green-600" : "text-red-600"
              }`}
            >
              {panVerificationStatus}
            </p>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
            readOnly
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Mobile
          </label>
          <div className="flex items-center">
            <span className="bg-gray-200 px-3 py-2 text-gray-600">+91</span>
            <input
              type="text"
              name="mobile"
              value={formData.mobile}
              onChange={handleInputChange}
              className="ml-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              maxLength={10}
              required
            />
          </div>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-4">Addresses</h3>
          {formData.addresses.map((address, index) => (
            <div
              key={index}
              className="mb-4 p-4 border border-gray-300 rounded-md"
            >
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Address Line 1
                </label>
                <input
                  type="text"
                  value={address.line1}
                  onChange={(e) =>
                    handleAddressChange(index, "line1", e.target.value)
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
              </div>
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Address Line 2
                </label>
                <input
                  type="text"
                  value={address.line2}
                  onChange={(e) =>
                    handleAddressChange(index, "line2", e.target.value)
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Postcode
                </label>
                <input
                  type="number" 
                  value={address.postcode}
                  onChange={(e) => {
                  
                    const newValue = e.target.value.slice(0, 6);
                    handleAddressChange(index, "postcode", newValue);
                  }}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  maxLength={6}
                  required
                />
              </div>
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  State
                </label>
                <input
                  type="text"
                  value={address.state}
                  onChange={(e) =>
                    handleAddressChange(index, "state", e.target.value)
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  readOnly
                />
              </div>
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  City
                </label>
                <input
                  type="text"
                  value={address.city}
                  onChange={(e) =>
                    handleAddressChange(index, "city", e.target.value)
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  readOnly
                />
              </div>
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => handleRemoveAddress(index)}
                  className="mt-2 text-sm text-red-600 hover:underline"
                >
                  Remove Address
                </button>
              )}
            </div>
          ))}
          {formData.addresses.length < 10 && (
            <button
              type="button"
              onClick={handleAddAddress}
              className="mt-2 mb-4 text-sm text-blue-600 hover:underline"
            >
              Add Another Address
            </button>
          )}
        </div>
        <button
          type="submit"
          className={`mt-4 px-6 py-2 bg-green-600 text-white rounded-md ${
            isSubmitting
              ? "bg-gray-400"
              : "bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500"
          }`}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Customer Adding..." : "Add Customer"}
        </button>
      </form>
    </div>
  );
};

export default CustForm;

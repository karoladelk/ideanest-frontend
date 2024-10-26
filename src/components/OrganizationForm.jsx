import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'https://ideanest-backend.vercel.app/api';

function OrganizationForm({ selectedOrg, setShowForm, refreshOrganizations }) {
  // Set initial state based on whether an organization is selected (edit mode) or not (create mode)
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedOrg) {
      setName(selectedOrg.name);
      setDescription(selectedOrg.description);
    }
  }, [selectedOrg]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const authToken = localStorage.getItem('authToken');

    try {
      if (selectedOrg) {
        // Update organization
        await axios.put(
          `${API_URL}/organization/${selectedOrg._id}`,
          { name, description }, // Only name and description are updated
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
              'Content-Type': 'application/json',
            },
          }
        );
        alert('Organization updated successfully!');
      } else {
        // Create a new organization
        await axios.post(
          `${API_URL}/organization`,
          { name, description },
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
              'Content-Type': 'application/json',
            },
          }
        );
        alert('Organization created successfully!');
      }
      setShowForm(false); // Close form
      refreshOrganizations(); // Refresh list
    } catch (error) {
      console.error('Error submitting organization:', error);
      alert('Error submitting organization');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50">
      <div className="w-full max-w-md p-6 bg-white rounded-md shadow-lg">
        <h3 className="text-xl font-bold mb-4">
          {selectedOrg ? 'Update Organization' : 'Create Organization'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 text-white rounded-md ${
                loading ? 'bg-gray-500' : 'bg-indigo-600 hover:bg-indigo-500'
              }`}
            >
              {loading ? 'Submitting...' : selectedOrg ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default OrganizationForm;
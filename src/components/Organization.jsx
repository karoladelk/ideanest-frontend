import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'https://ideanest-backend.vercel.app/api';

function OrganizationDashboard() {
  const [organizations, setOrganizations] = useState([]);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchOrganizations = async () => {
    try {
      const authToken = localStorage.getItem('authToken');
      const response = await axios.get(`${API_URL}/organization`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setOrganizations(response.data || []);
    } catch (error) {
      console.error('Error fetching organizations:', error);
    }
  };

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const handleCreate = () => {
    setSelectedOrg(null); 
    setShowForm(true);
  };

  const handleEdit = (org) => {
    setSelectedOrg(org);
    setShowForm(true);
  };

  const handleDelete = async (orgId) => {
    const authToken = localStorage.getItem('authToken');
    try {
      await axios.delete(`${API_URL}/organization/${orgId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      alert('Organization deleted successfully!');
      fetchOrganizations();
    } catch (error) {
      console.error('Error deleting organization:', error);
      alert('Failed to delete organization');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Organization Dashboard</h2>
      <div className="flex justify-center mb-6">
        <button
          onClick={handleCreate}
          className="px-4 py-2 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-500"
        >
          Create Organization
        </button>
      </div>
      <div className="space-y-4">
        {organizations.length ? (
          organizations.map((org) => (
            <div key={org.organization_id} className="p-4 bg-white rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-gray-900">{org.org}</h3>
              <p className="text-gray-700">{org.description}</p>
              <p className="text-gray-500">Members: 
                <p>
                  {org.organization_members.map((member) => (
                    <span key={member.email} className="text-grey-80">{member.email} </span>
                  ))}
                </p>

              </p>
              <button
                onClick={() => handleEdit(org)}
                className="mt-4 text-indigo-600 hover:underline"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(org.organization_id)}
                className="ml-4 text-red-500 hover:underline"
              >
                Delete
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-600">No organizations available.</p>
        )}
      </div>
      {showForm && (
        <OrganizationForm
          selectedOrg={selectedOrg}
          setShowForm={setShowForm}
          refreshOrganizations={fetchOrganizations}
        />
      )}
    </div>
  );
}

function OrganizationForm({ selectedOrg, setShowForm, refreshOrganizations }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [members, setMembers] = useState([]);
  const [memberInput, setMemberInput] = useState('');
  const [loading, setLoading] = useState(false);

  // Set initial values for edit mode
  useEffect(() => {
    if (selectedOrg) {
      setName(selectedOrg.name);
      setDescription(selectedOrg.description);
      setMembers(selectedOrg.members || []); // Only used for display if editing
    }
  }, [selectedOrg]);

  // Add a member with default access level 'reader'
  const handleAddMember = () => {
    if (memberInput && !members.some((member) => member.email === memberInput)) {
      setMembers([...members, { email: memberInput, access_level: 'reader' }]);
      setMemberInput('');
    }
  };

  // Remove a member from the list
  const handleRemoveMember = (member) => {
    setMembers(members.filter((m) => m.email !== member.email));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const authToken = localStorage.getItem('authToken');

    try {
      if (selectedOrg) {
        // Update organization (only name and description)
        await axios.put(
          `${API_URL}/organization/${selectedOrg.organization_id}`,
          { name, description },
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
              'Content-Type': 'application/json',
            },
          }
        );
        alert('Organization updated successfully!');
      } else {
        // Create a new organization (with members)
        await axios.post(
          `${API_URL}/organization`,
          { name, description, organization_members: members },
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
              'Content-Type': 'application/json',
            },
          }
        );
        alert('Organization created successfully!');
      }
      setShowForm(false); // Close form after submission
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
          {!selectedOrg && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Add Members</label>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Member email"
                  value={memberInput}
                  onChange={(e) => setMemberInput(e.target.value)}
                  className="flex-1 px-3 py-2 mt-1 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
                <button
                  type="button"
                  onClick={handleAddMember}
                  className="px-4 ml-2 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-500"
                >
                  Add
                </button>
              </div>
              <div className="mt-2 space-y-1">
                {members.map((member) => (
                  <div key={member.email} className="flex items-center justify-between">
                    <span className="text-gray-700">
                      {member.email} ({member.access_level})
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveMember(member)}
                      className="text-red-500 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
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

export default OrganizationDashboard;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  ClockIcon,
  TrashIcon,
  ChatBubbleLeftIcon 
} from '@heroicons/react/24/outline';

const CounselingManagement = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [adminNote, setAdminNote] = useState('');

  useEffect(() => {
    fetchRequests();
  }, [filter]);

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const url = filter === 'all' 
        ? `${process.env.REACT_APP_API_URL}/api/counseling`
        : `${process.env.REACT_APP_API_URL}/api/counseling?status=${filter}`;
      
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRequests(response.data);
    } catch (error) {
      console.error('Error fetching counseling requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/counseling/${id}`,
        { status, adminNote },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(`Request ${status} successfully!`);
      setSelectedRequest(null);
      setAdminNote('');
      fetchRequests();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  const deleteRequest = async (id) => {
    if (!window.confirm('Are you sure you want to delete this request?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/counseling/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Request deleted successfully!');
      fetchRequests();
    } catch (error) {
      console.error('Error deleting request:', error);
      alert('Failed to delete request');
    }
  };

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    accepted: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    completed: 'bg-blue-100 text-blue-800',
  };

  const statusIcons = {
    pending: ClockIcon,
    accepted: CheckCircleIcon,
    rejected: XCircleIcon,
    completed: CheckCircleIcon,
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Counseling Requests</h1>
        <p className="text-gray-600 mt-1">Review and manage counseling requests</p>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6 flex space-x-2 overflow-x-auto">
        {['all', 'pending', 'accepted', 'rejected', 'completed'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${
              filter === status
                ? 'bg-primary text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
            {status === 'pending' && requests.filter(r => r.status === 'pending').length > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                {requests.filter(r => r.status === 'pending').length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Requests List */}
      <div className="grid grid-cols-1 gap-6">
        {requests.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <ChatBubbleLeftIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No counseling requests found</p>
          </div>
        ) : (
          requests.map((request) => {
            const StatusIcon = statusIcons[request.status];
            return (
              <div key={request._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{request.name}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1 ${statusColors[request.status]}`}>
                        <StatusIcon className="h-4 w-4" />
                        <span>{request.status}</span>
                      </span>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>📧 {request.email}</p>
                      <p>📞 {request.phone}</p>
                      <p className="text-xs text-gray-500">
                        Submitted: {new Date(request.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => deleteRequest(request._id)}
                    className="text-red-600 hover:bg-red-50 p-2 rounded-lg"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>

                {/* Message */}
                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 mb-1">Message:</p>
                  <p className="text-gray-600">{request.message}</p>
                </div>

                {/* Admin Note */}
                {request.adminNote && (
                  <div className="mb-4 p-4 bg-blue-50 rounded-lg border-l-4 border-primary">
                    <p className="text-sm font-medium text-gray-700 mb-1">Admin Note:</p>
                    <p className="text-gray-600">{request.adminNote}</p>
                  </div>
                )}

                {/* Action Buttons */}
                {request.status === 'pending' && (
                  <div className="mt-4 pt-4 border-t">
                    {selectedRequest === request._id ? (
                      <div className="space-y-3">
                        <textarea
                          value={adminNote}
                          onChange={(e) => setAdminNote(e.target.value)}
                          placeholder="Add a note (optional)..."
                          rows="2"
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <div className="flex space-x-3">
                          <button
                            onClick={() => updateStatus(request._id, 'accepted')}
                            className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center justify-center space-x-2"
                          >
                            <CheckCircleIcon className="h-5 w-5" />
                            <span>Accept</span>
                          </button>
                          <button
                            onClick={() => updateStatus(request._id, 'rejected')}
                            className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 flex items-center justify-center space-x-2"
                          >
                            <XCircleIcon className="h-5 w-5" />
                            <span>Reject</span>
                          </button>
                          <button
                            onClick={() => {
                              setSelectedRequest(null);
                              setAdminNote('');
                            }}
                            className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setSelectedRequest(request._id)}
                        className="w-full bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                      >
                        Review Request
                      </button>
                    )}
                  </div>
                )}

                {request.status === 'accepted' && (
                  <button
                    onClick={() => updateStatus(request._id, 'completed')}
                    className="w-full mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                  >
                    Mark as Completed
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default CounselingManagement;
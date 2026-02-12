import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [role, setRole] = useState(localStorage.getItem('role'));
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  if (role === 'admin') return <AdminView onLogout={handleLogout} />;
  if (role === 'reception') return <ReceptionView onLogout={handleLogout} />;
  return <UserView onLogout={handleLogout} />;
};

// --- ADMIN VIEW ---
const AdminView = ({ onLogout }) => {
  const [pendingStaff, setPendingStaff] = useState([]);
  const [stats, setStats] = useState({ users: 0, receptionists: 0 });

  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/auth/pending-reception', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPendingStaff(res.data);
      // For stats, in a real app you'd hit a specific stats endpoint
      setStats({ users: 12, receptionists: res.data.length }); 
    } catch (err) {
      console.error("Error fetching data", err);
    }
  };

  const approveUser = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/auth/approve/${id}`);
      alert("Staff Approved!");
      fetchPending(); // Refresh list
    } catch (err) {
      alert("Approval failed");
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-red-600">Admin Control Panel</h1>
        <button onClick={onLogout} className="bg-gray-800 text-white px-4 py-2 rounded">Logout</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500">
          <h3 className="text-gray-500 font-medium">Total Active Users</h3>
          <p className="text-4xl font-bold">{stats.users}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-yellow-500">
          <h3 className="text-gray-500 font-medium">Pending Approvals</h3>
          <p className="text-4xl font-bold">{pendingStaff.length}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Pending Receptionist Requests</h2>
        {pendingStaff.length === 0 ? (
          <p className="text-gray-500">No pending requests.</p>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-bottom bg-gray-100">
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {pendingStaff.map(staff => (
                <tr key={staff.id} className="border-b">
                  <td className="p-3">{staff.name}</td>
                  <td className="p-3">{staff.email}</td>
                  <td className="p-3">
                    <button 
                      onClick={() => approveUser(staff.id)}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    > Approve </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

// --- RECEPTION VIEW ---
const ReceptionView = ({ onLogout }) => (
  <div className="p-8 text-center">
    <h1 className="text-3xl font-bold text-blue-600 mb-4">Reception Dashboard</h1>
    <p className="text-gray-600 mb-6">Manage bookings and guest check-ins here.</p>
    <button onClick={onLogout} className="bg-blue-600 text-white px-6 py-2 rounded">Logout</button>
  </div>
);

// --- USER VIEW ---
const UserView = ({ onLogout }) => (
  <div className="p-8 text-center">
    <h1 className="text-3xl font-bold text-green-600 mb-4">Guest Portal</h1>
    <p className="text-gray-600 mb-6">Book your favorite rooms at StaySip.</p>
    <button onClick={onLogout} className="bg-green-600 text-white px-6 py-2 rounded">Logout</button>
  </div>
);

export default Dashboard;
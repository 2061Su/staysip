import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [role] = useState(localStorage.getItem('role'));
  const [userName] = useState(localStorage.getItem('userName') || 'Guest');
  const [activeTab, setActiveTab] = useState(role === 'admin' ? 'staff' : (role === 'reception' ? 'rooms' : 'bookings'));
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex relative">
      {/* GLOBAL TOAST NOTIFICATION */}
      {toast && (
        <div className="fixed top-5 right-5 bg-green-600 text-white px-6 py-3 rounded-lg shadow-2xl z-50 font-bold animate-in fade-in slide-in-from-top-4 duration-300">
          {toast}
        </div>
      )}

      {/* SIDEBAR */}
      <div className="w-64 bg-slate-900 text-white p-6 flex flex-col shadow-xl">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-extrabold text-blue-400 italic">StaySip</h1>
          <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">Portal: {role}</p>
        </div>
        
        <nav className="flex-1 space-y-2">
          {role === 'admin' && (
            <button onClick={() => setActiveTab('staff')} className={`w-full text-left px-4 py-3 rounded-lg transition-all ${activeTab === 'staff' ? 'bg-blue-600 shadow-lg' : 'hover:bg-slate-800'}`}>
              🛡️ Staff Control
            </button>
          )}

          {(role === 'admin' || role === 'reception') && (
            <button onClick={() => setActiveTab('rooms')} className={`w-full text-left px-4 py-3 rounded-lg transition-all ${activeTab === 'rooms' ? 'bg-blue-600 shadow-lg' : 'hover:bg-slate-800'}`}>
              🏨 Manage Rooms
            </button>
          )}

          <button onClick={() => setActiveTab('bookings')} className={`w-full text-left px-4 py-3 rounded-lg transition-all ${activeTab === 'bookings' ? 'bg-blue-600 shadow-lg' : 'hover:bg-slate-800'}`}>
            📅 {role === 'user' ? 'My Bookings' : 'Reservations'}
          </button>
        </nav>

        <div className="pt-6 border-t border-slate-700">
          <p className="text-sm text-slate-400 mb-4 text-center italic">Hi, {userName}</p>
          <button onClick={handleLogout} className="w-full bg-red-500/10 text-red-500 border border-red-500/50 p-2 rounded-lg hover:bg-red-600 hover:text-white transition-all font-bold">
            Logout
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex-1 p-10 overflow-y-auto">
        <header className="mb-8 border-b pb-4">
          <h2 className="text-3xl font-bold text-slate-800 uppercase tracking-tight">
            {activeTab === 'staff' && "Staff Management"}
            {activeTab === 'rooms' && "Room Inventory"}
            {activeTab === 'bookings' && (role === 'user' ? "Make a Reservation" : "Master Reservation Desk")}
          </h2>
        </header>

        {activeTab === 'staff' && role === 'admin' && <StaffManagement showToast={showToast} />}
        {activeTab === 'rooms' && (role === 'admin' || role === 'reception') && <RoomManagement showToast={showToast} />}
        {activeTab === 'bookings' && <BookingManagement role={role} showToast={showToast} />}
      </div>
    </div>
  );
};

// --- STAFF COMPONENT ---
const StaffManagement = ({ showToast }) => {
  const [pending, setPending] = useState([]);
  const [active, setActive] = useState([]);

  const fetchData = async () => {
    try {
      const pRes = await axios.get('http://localhost:5000/api/auth/pending-reception');
      const aRes = await axios.get('http://localhost:5000/api/hotel/active-staff');
      setPending(pRes.data);
      setActive(aRes.data);
    } catch (err) { console.error("Error fetching staff"); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleApprove = async (id) => {
    await axios.put(`http://localhost:5000/api/auth/approve/${id}`);
    showToast("✅ Staff Approved");
    fetchData();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this receptionist?")) {
      await axios.delete(`http://localhost:5000/api/hotel/staff/${id}`);
      showToast("🗑️ Staff Removed");
      fetchData();
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-bold mb-4 text-amber-600">⏳ Pending Approvals</h3>
        <table className="w-full text-left">
          <thead><tr className="bg-slate-50 text-slate-500 text-xs uppercase"><th className="p-3">Name</th><th className="p-3">Email</th><th className="p-3">Action</th></tr></thead>
          <tbody>
            {pending.map(s => (
              <tr key={s.id} className="border-b"><td className="p-3">{s.name}</td><td className="p-3">{s.email}</td><td className="p-3"><button onClick={() => handleApprove(s.id)} className="bg-green-600 text-white px-4 py-1 rounded">Approve</button></td></tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-bold mb-4 text-blue-600">✅ Active Staff</h3>
        <table className="w-full text-left">
          <thead><tr className="bg-slate-50 text-slate-500 text-xs uppercase"><th className="p-3">Name</th><th className="p-3">Email</th><th className="p-3 text-right">Action</th></tr></thead>
          <tbody>
            {active.map(s => (
              <tr key={s.id} className="border-b"><td className="p-3">{s.name}</td><td className="p-3">{s.email}</td><td className="p-3 text-right"><button onClick={() => handleDelete(s.id)} className="text-red-500 font-bold">Delete</button></td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- ROOM COMPONENT ---
const RoomManagement = ({ showToast }) => {
  const [rooms, setRooms] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [newRoom, setNewRoom] = useState({ roomNumber: '', type: 'Deluxe', price: '' });

  const fetchRooms = async () => {
    const res = await axios.get('http://localhost:5000/api/hotel/rooms');
    setRooms(res.data);
  };

  useEffect(() => { fetchRooms(); }, []);

  const addRoom = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:5000/api/hotel/rooms', newRoom);
    showToast("🏨 Room Added");
    setNewRoom({ roomNumber: '', type: 'Deluxe', price: '' });
    fetchRooms();
  };

  const handleUpdate = async (id) => {
    await axios.put(`http://localhost:5000/api/hotel/rooms/${id}`, editData);
    setEditingId(null);
    showToast("✨ Room Updated");
    fetchRooms();
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="font-bold mb-4 text-slate-700">Add New Room to Inventory</h3>
        <form onSubmit={addRoom} className="grid grid-cols-4 gap-4">
          <input type="text" placeholder="Room #" className="border p-2 rounded-lg" value={newRoom.roomNumber} onChange={e => setNewRoom({...newRoom, roomNumber: e.target.value})} required />
          <select className="border p-2 rounded-lg" value={newRoom.type} onChange={e => setNewRoom({...newRoom, type: e.target.value})}>
            <option>Deluxe</option><option>Suite</option><option>Standard</option>
          </select>
          <input type="number" placeholder="Price" className="border p-2 rounded-lg" value={newRoom.price} onChange={e => setNewRoom({...newRoom, price: e.target.value})} required />
          <button className="bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition">Create Room</button>
        </form>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {rooms.map(r => (
          <div key={r.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
            {editingId === r.id ? (
              <div className="space-y-2">
                <input className="border w-full p-1 text-sm" value={editData.roomNumber} onChange={e => setEditData({...editData, roomNumber: e.target.value})} />
                <input type="number" className="border w-full p-1 text-sm" value={editData.price} onChange={e => setEditData({...editData, price: e.target.value})} />
                <div className="flex gap-2">
                  <button onClick={() => handleUpdate(r.id)} className="bg-green-600 text-white flex-1 text-xs py-1 rounded">Save</button>
                  <button onClick={() => setEditingId(null)} className="bg-gray-400 text-white flex-1 text-xs py-1 rounded">X</button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-start">
                  <span className="text-2xl font-black text-slate-700">#{r.roomNumber}</span>
                  <button onClick={() => { setEditingId(r.id); setEditData(r); }} className="text-blue-500 text-[10px] font-bold uppercase hover:underline">Edit</button>
                </div>
                <p className="text-gray-400 text-xs font-bold uppercase mt-1">{r.type}</p>
                <p className="text-green-600 font-bold mt-2 text-xl">${r.price}</p>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// --- BOOKING COMPONENT ---
const BookingManagement = ({ role, showToast }) => {
  const [bookings, setBookings] = useState([]); 
  const [rooms, setRooms] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [formData, setFormData] = useState({ roomId: '', customerName: '', phoneNumber: '', bookingDate: '' });
  const userId = localStorage.getItem('userId');

  const fetchData = async () => {
    try {
      const rRes = await axios.get('http://localhost:5000/api/hotel/rooms');
      setRooms(rRes.data);
      const bUrl = role === 'user' ? `http://localhost:5000/api/hotel/my-bookings/${userId}` : 'http://localhost:5000/api/hotel/bookings';
      const bRes = await axios.get(bUrl);
      setBookings(bRes.data);
    } catch (err) { console.error("Error fetching data"); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleBooking = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/hotel/bookings', { ...formData, userId });
      showToast("✅ Reservation Confirmed!");
      setFormData({ roomId: '', customerName: '', phoneNumber: '', bookingDate: '' });
      fetchData();
    } catch (err) {
      alert("❌ " + (err.response?.data?.error || "This date is already booked."));
    }
  };

  const handleUpdate = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/hotel/bookings/${id}`, editData);
      setEditingId(null);
      showToast("📝 Booking Updated");
      fetchData();
    } catch (err) { alert(err.response?.data?.error || "Update failed"); }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="font-bold mb-4 text-blue-600">New Reservation</h3>
        <form onSubmit={handleBooking} className="grid grid-cols-2 gap-4">
          <select className="border p-2 rounded-lg" value={formData.roomId} onChange={e => setFormData({...formData, roomId: e.target.value})} required>
            <option value="">Select Room</option>
            {rooms.map(r => <option key={r.id} value={r.id}>Room {r.roomNumber} (${r.price})</option>)}
          </select>
          <input type="date" className="border p-2 rounded-lg" min={new Date().toISOString().split("T")[0]} value={formData.bookingDate} onChange={e => setFormData({...formData, bookingDate: e.target.value})} required />
          <input type="text" placeholder="Guest Name" className="border p-2 rounded-lg" value={formData.customerName} onChange={e => setFormData({...formData, customerName: e.target.value})} required />
          <input type="text" placeholder="Phone Number" className="border p-2 rounded-lg" value={formData.phoneNumber} onChange={e => setFormData({...formData, phoneNumber: e.target.value})} required />
          <button className="col-span-2 bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition">Book Now</button>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <h3 className="p-4 font-bold bg-slate-50 border-b">
          {role === 'user' ? "📜 Your Personal History" : "All Hotel Reservations"}
        </h3>
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
            <tr><th className="p-4">Guest</th><th className="p-4">Date</th><th className="p-4">Room</th><th className="p-4 text-center">Action</th></tr>
          </thead>
          <tbody>
            {bookings.length === 0 ? (
                <tr><td colSpan="4" className="p-10 text-center text-slate-400">No records found.</td></tr>
            ) : bookings.map(b => (
              <tr key={b.id} className="border-b hover:bg-slate-50">
                {editingId === b.id ? (
                  <>
                    <td className="p-2"><input className="border p-1 rounded w-full" value={editData.customerName} onChange={e => setEditData({...editData, customerName: e.target.value})} /></td>
                    <td className="p-2"><input type="date" className="border p-1 rounded w-full" value={editData.bookingDate} onChange={e => setEditData({...editData, bookingDate: e.target.value})} /></td>
                    <td className="p-2">
                        <select className="border p-1 rounded w-full" value={editData.roomId} onChange={e => setEditData({...editData, roomId: e.target.value})}>
                            {rooms.map(r => <option key={r.id} value={r.id}>Room {r.roomNumber}</option>)}
                        </select>
                    </td>
                    <td className="p-2 flex gap-1 justify-center">
                        <button onClick={() => handleUpdate(b.id)} className="bg-green-600 text-white px-2 py-1 rounded text-xs">Save</button>
                        <button onClick={() => setEditingId(null)} className="bg-gray-400 text-white px-2 py-1 rounded text-xs">X</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="p-4 font-bold">{b.customerName}</td>
                    <td className="p-4">{b.bookingDate}</td>
                    <td className="p-4">Room {b.Room?.roomNumber || b.roomId}</td>
                    <td className="p-4 text-center flex justify-center gap-4">
                        <button onClick={() => { setEditingId(b.id); setEditData(b); }} className="text-blue-600 font-bold hover:underline">Edit</button>
                        <button onClick={async () => { if(window.confirm("Cancel?")) { await axios.delete(`http://localhost:5000/api/hotel/bookings/${b.id}`); showToast("🗑️ Booking Cancelled"); fetchData(); } }} className="text-red-600 font-bold hover:underline">Cancel</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};


export default Dashboard;
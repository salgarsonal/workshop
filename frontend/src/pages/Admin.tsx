import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  getAllAttendees,
  deleteAttendee,
  getAllSpeakers as getSpeakers,
  createSpeaker,
  updateSpeaker,
  deleteSpeaker,
  getSessions,
  createSession,
  updateSession,
  deleteSession,
  getDesignationBreakdown,
  setAdminPassword,
} from '../services/api';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface Attendee {
  id: string;
  name: string;
  email: string;
  designation: string;
  registeredAt: string;
}

interface Speaker {
  id: string;
  name: string;
  bio: string;
  photoUrl?: string;
  sessions?: string[];
}

interface Session {
  id: string;
  title: string;
  description: string;
  time: string;
  speakerIds: string[];
  capacity?: number;
}

type Tab = 'attendees' | 'speakers' | 'sessions' | 'analytics';

const COLORS = ['#0ea5e9', '#0284c7', '#0369a1', '#075985', '#0c4a6e', '#7dd3fc', '#38bdf8'];

function Admin() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('attendees');
  const [loading, setLoading] = useState(false);

  // Attendees state
  const [attendees, setAttendees] = useState<Attendee[]>([]);

  // Speakers state
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [showSpeakerModal, setShowSpeakerModal] = useState(false);
  const [editingSpeaker, setEditingSpeaker] = useState<Speaker | null>(null);
  const [speakerForm, setSpeakerForm] = useState({ name: '', bio: '', photoUrl: '' });

  // Sessions state
  const [sessions, setSessions] = useState<Session[]>([]);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [editingSession, setEditingSession] = useState<Session | null>(null);
  const [sessionForm, setSessionForm] = useState({
    title: '',
    description: '',
    time: '',
    speakerIds: [] as string[],
    capacity: '',
  });

  // Analytics state
  const [breakdown, setBreakdown] = useState<{ designation: string; count: number }[]>([]);

  useEffect(() => {
    // Check if admin is logged in
    const password = sessionStorage.getItem('adminPassword');
    if (!password) {
      navigate('/');
      return;
    }

    setAdminPassword(password);
    loadData();
  }, [navigate]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'attendees') {
        const response = await getAllAttendees();
        setAttendees(response.data);
      } else if (activeTab === 'speakers') {
        const response = await getSpeakers();
        setSpeakers(response.data);
      } else if (activeTab === 'sessions') {
        const response = await getSessions();
        setSessions(response.data);
      } else if (activeTab === 'analytics') {
        const response = await getDesignationBreakdown();
        setBreakdown(response.data);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
      alert('Failed to load data. Please check your admin password.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const handleDeleteAttendee = async (id: string) => {
    if (!confirm('Are you sure you want to delete this attendee?')) return;
    try {
      await deleteAttendee(id);
      setAttendees(attendees.filter((a) => a.id !== id));
    } catch (error) {
      alert('Failed to delete attendee');
    }
  };

  const handleSpeakerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingSpeaker) {
        await updateSpeaker(editingSpeaker.id, speakerForm);
      } else {
        await createSpeaker(speakerForm);
      }
      setShowSpeakerModal(false);
      setEditingSpeaker(null);
      setSpeakerForm({ name: '', bio: '', photoUrl: '' });
      loadData();
    } catch (error) {
      alert('Failed to save speaker');
    }
  };

  const handleEditSpeaker = (speaker: Speaker) => {
    setEditingSpeaker(speaker);
    setSpeakerForm({
      name: speaker.name,
      bio: speaker.bio,
      photoUrl: speaker.photoUrl || '',
    });
    setShowSpeakerModal(true);
  };

  const handleDeleteSpeaker = async (id: string) => {
    if (!confirm('Are you sure you want to delete this speaker?')) return;
    try {
      await deleteSpeaker(id);
      setSpeakers(speakers.filter((s) => s.id !== id));
    } catch (error) {
      alert('Failed to delete speaker');
    }
  };

  const handleSessionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const sessionData = {
        title: sessionForm.title,
        description: sessionForm.description,
        time: sessionForm.time,
        speakerIds: sessionForm.speakerIds,
        capacity: sessionForm.capacity ? parseInt(sessionForm.capacity) : undefined,
      };

      if (editingSession) {
        await updateSession(editingSession.id, sessionData);
      } else {
        await createSession(sessionData);
      }
      setShowSessionModal(false);
      setEditingSession(null);
      setSessionForm({ title: '', description: '', time: '', speakerIds: [], capacity: '' });
      loadData();
    } catch (error) {
      alert('Failed to save session');
    }
  };

  const handleEditSession = (session: Session) => {
    setEditingSession(session);
    setSessionForm({
      title: session.title,
      description: session.description,
      time: session.time,
      speakerIds: session.speakerIds,
      capacity: session.capacity?.toString() || '',
    });
    setShowSessionModal(true);
  };

  const handleDeleteSession = async (id: string) => {
    if (!confirm('Are you sure you want to delete this session?')) return;
    try {
      await deleteSession(id);
      setSessions(sessions.filter((s) => s.id !== id));
    } catch (error) {
      alert('Failed to delete session');
    }
  };

  const toggleSpeakerInSession = (speakerId: string) => {
    if (sessionForm.speakerIds.includes(speakerId)) {
      setSessionForm({
        ...sessionForm,
        speakerIds: sessionForm.speakerIds.filter((id) => id !== speakerId),
      });
    } else {
      setSessionForm({
        ...sessionForm,
        speakerIds: [...sessionForm.speakerIds, speakerId],
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <button
              onClick={() => {
                sessionStorage.removeItem('adminPassword');
                navigate('/');
              }}
              className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-gray-200">
          {(['attendees', 'speakers', 'sessions', 'analytics'] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-semibold capitalize transition-all ${
                activeTab === tab
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading...</p>
          </div>
        ) : (
          <>
            {/* Attendees Tab */}
            {activeTab === 'attendees' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Attendees ({attendees.length})</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Designation</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Registered</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {attendees.map((attendee) => (
                        <tr key={attendee.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3">{attendee.name}</td>
                          <td className="px-4 py-3">{attendee.email}</td>
                          <td className="px-4 py-3">{attendee.designation}</td>
                          <td className="px-4 py-3">
                            {new Date(attendee.registeredAt).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => handleDeleteAttendee(attendee.id)}
                              className="text-red-600 hover:text-red-800 font-semibold"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* Speakers Tab */}
            {activeTab === 'speakers' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Speakers ({speakers.length})</h2>
                  <button
                    onClick={() => {
                      setEditingSpeaker(null);
                      setSpeakerForm({ name: '', bio: '', photoUrl: '' });
                      setShowSpeakerModal(true);
                    }}
                    className="btn-primary"
                  >
                    Add Speaker
                  </button>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {speakers.map((speaker) => (
                    <div key={speaker.id} className="border border-gray-200 rounded-lg p-4">
                      {speaker.photoUrl && (
                        <img
                          src={speaker.photoUrl}
                          alt={speaker.name}
                          className="w-20 h-20 rounded-full object-cover mb-3"
                        />
                      )}
                      <h3 className="font-bold text-lg mb-2">{speaker.name}</h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{speaker.bio}</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditSpeaker(speaker)}
                          className="flex-1 px-3 py-1 bg-primary-600 text-white rounded hover:bg-primary-700 text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteSpeaker(speaker.id)}
                          className="flex-1 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Sessions Tab */}
            {activeTab === 'sessions' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Sessions ({sessions.length})</h2>
                  <button
                    onClick={() => {
                      setEditingSession(null);
                      setSessionForm({ title: '', description: '', time: '', speakerIds: [], capacity: '' });
                      setShowSessionModal(true);
                    }}
                    className="btn-primary"
                  >
                    Add Session
                  </button>
                </div>
                <div className="space-y-4">
                  {sessions.map((session) => (
                    <div key={session.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-sm font-semibold text-primary-600 bg-primary-50 px-3 py-1 rounded-full">
                              {session.time}
                            </span>
                            {session.capacity && (
                              <span className="text-sm text-gray-600">Capacity: {session.capacity}</span>
                            )}
                          </div>
                          <h3 className="text-xl font-bold mb-2">{session.title}</h3>
                          <p className="text-gray-600 mb-2">{session.description}</p>
                          <p className="text-sm text-gray-500">
                            Speakers: {session.speakerIds.length}
                          </p>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => handleEditSession(session)}
                            className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteSession(session.id)}
                            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card"
              >
                <h2 className="text-2xl font-bold mb-6">Attendee Breakdown by Designation</h2>
                {breakdown.length > 0 ? (
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={breakdown}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ designation, percent }) => `${designation}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={120}
                          fill="#8884d8"
                          dataKey="count"
                        >
                          {breakdown.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <p className="text-gray-600 text-center py-12">No data available</p>
                )}
              </motion.div>
            )}
          </>
        )}
      </div>

      {/* Speaker Modal */}
      {showSpeakerModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-8 max-w-md w-full"
          >
            <h2 className="text-2xl font-bold mb-6">
              {editingSpeaker ? 'Edit Speaker' : 'Add Speaker'}
            </h2>
            <form onSubmit={handleSpeakerSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Name *</label>
                <input
                  type="text"
                  value={speakerForm.name}
                  onChange={(e) => setSpeakerForm({ ...speakerForm, name: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Bio *</label>
                <textarea
                  value={speakerForm.bio}
                  onChange={(e) => setSpeakerForm({ ...speakerForm, bio: e.target.value })}
                  className="input-field"
                  rows={4}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Photo URL</label>
                <input
                  type="url"
                  value={speakerForm.photoUrl}
                  onChange={(e) => setSpeakerForm({ ...speakerForm, photoUrl: e.target.value })}
                  className="input-field"
                  placeholder="https://example.com/photo.jpg"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowSpeakerModal(false);
                    setEditingSpeaker(null);
                  }}
                  className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button type="submit" className="flex-1 btn-primary">
                  {editingSpeaker ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Session Modal */}
      {showSessionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-8 max-w-2xl w-full my-8"
          >
            <h2 className="text-2xl font-bold mb-6">
              {editingSession ? 'Edit Session' : 'Add Session'}
            </h2>
            <form onSubmit={handleSessionSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Title *</label>
                <input
                  type="text"
                  value={sessionForm.title}
                  onChange={(e) => setSessionForm({ ...sessionForm, title: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description *</label>
                <textarea
                  value={sessionForm.description}
                  onChange={(e) => setSessionForm({ ...sessionForm, description: e.target.value })}
                  className="input-field"
                  rows={4}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Time *</label>
                <input
                  type="text"
                  value={sessionForm.time}
                  onChange={(e) => setSessionForm({ ...sessionForm, time: e.target.value })}
                  className="input-field"
                  placeholder="e.g., 10:00 AM - 11:00 AM"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Speakers *</label>
                <div className="border border-gray-300 rounded-lg p-4 max-h-48 overflow-y-auto">
                  {speakers.length === 0 ? (
                    <p className="text-gray-500 text-sm">No speakers available. Add speakers first.</p>
                  ) : (
                    <div className="space-y-2">
                      {speakers.map((speaker) => (
                        <label key={speaker.id} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={sessionForm.speakerIds.includes(speaker.id)}
                            onChange={() => toggleSpeakerInSession(speaker.id)}
                            className="w-4 h-4"
                          />
                          <span>{speaker.name}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Capacity</label>
                <input
                  type="number"
                  value={sessionForm.capacity}
                  onChange={(e) => setSessionForm({ ...sessionForm, capacity: e.target.value })}
                  className="input-field"
                  placeholder="Optional"
                  min="1"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowSessionModal(false);
                    setEditingSession(null);
                  }}
                  className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button type="submit" className="flex-1 btn-primary">
                  {editingSession ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default Admin;


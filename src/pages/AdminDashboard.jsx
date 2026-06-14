import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LearningContext } from '../context/LearningContext';
import { Plus, Edit, Trash2, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import Loader from '../components/Loader';
import './AdminDashboard.css';
import AdminTopicEditor from '../components/AdminTopicEditor';

const AdminDashboard = () => {
  const { userProfile } = useContext(AuthContext);
  const { 
    categories, topics, addTopic, deleteTopic, addCategory, updateCategory, deleteCategory,
    loading 
  } = useContext(LearningContext);
  const [activeTab, setActiveTab] = useState('topics');
  const [editingTopicId, setEditingTopicId] = useState(null);
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [roadmaps, setRoadmaps] = useState([]);
  const [roadmapsLoading, setRoadmapsLoading] = useState(false);

  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    } else if (activeTab === 'roadmaps') {
      fetchRoadmaps();
    }
  }, [activeTab]);

  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      const res = await fetch(import.meta.env.VITE_API_URL + '/api/users', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUsersLoading(false);
    }
  };

  const fetchRoadmaps = async () => {
    setRoadmapsLoading(true);
    try {
      const res = await fetch(import.meta.env.VITE_API_URL + '/api/roadmaps');
      if (res.ok) {
        const data = await res.json();
        setRoadmaps(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setRoadmapsLoading(false);
    }
  };

  const handleDeleteRoadmap = async (id) => {
    if (!window.confirm("Are you sure you want to delete this roadmap?")) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/roadmaps/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
      });
      if (res.ok) fetchRoadmaps();
    } catch (err) {
      console.error(err);
    }
  };

  const handleResetProgress = async (email) => {
    if (!window.confirm(`Are you sure you want to reset all learning progress for ${email}? This action cannot be undone.`)) return;
    
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/users/${email}/progress`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
      });
      if (res.ok) {
        alert('Progress reset successfully!');
      } else {
        const err = await res.json();
        alert('Failed to reset progress: ' + err.error);
      }
    } catch (err) {
      console.error(err);
      alert('Error resetting progress');
    }
  };

  const handleAddTopic = () => {
    const title = prompt("Enter new topic title:");
    if (title) {
      addTopic(title, 'general');
    }
  };

  const handleDeleteTopic = (id) => {
    if (window.confirm("Are you sure you want to delete this topic?")) {
      deleteTopic(id);
    }
  };

  const handleAddCategory = () => {
    const title = prompt("Enter new category name:");
    if (title) {
      addCategory(title);
    }
  };

  const handleEditCategory = (cat) => {
    const title = prompt("Edit category name:", cat.title);
    if (title && title !== cat.title) {
      updateCategory(cat.id, title);
    }
  };

  const handleDeleteCategory = (id) => {
    if (window.confirm("Are you sure you want to delete this category? (Topics inside it will not be deleted)")) {
      deleteCategory(id);
    }
  };

  if (editingTopicId) {
    return <AdminTopicEditor topicId={editingTopicId} onClose={() => setEditingTopicId(null)} />;
  }

  if (loading) return <Loader />;

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p className="text-secondary">Manage your learning content, topics, and resources.</p>
      </div>

      <div className="admin-tabs">
        <button className={`tab-btn ${activeTab === 'topics' ? 'active' : ''}`} onClick={() => setActiveTab('topics')}>Topics</button>
        <button className={`tab-btn ${activeTab === 'categories' ? 'active' : ''}`} onClick={() => setActiveTab('categories')}>Categories</button>
        <button className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>Users</button>
        <button className={`tab-btn ${activeTab === 'roadmaps' ? 'active' : ''}`} onClick={() => setActiveTab('roadmaps')}>Roadmaps</button>
        <Link to="/admin/certificates" className="tab-btn" style={{ textDecoration: 'none' }}>Certificates</Link>
      </div>

      <div className="admin-content">
        {activeTab === 'topics' && (
          <div className="admin-panel card">
            <div className="panel-header">
              <h3>Manage Topics</h3>
              <button className="btn-primary" onClick={handleAddTopic}><Plus size={16} className="mr-2"/> Add Topic</button>
            </div>
            <div className="data-table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Videos</th>
                    <th>Resources</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {topics.map(topic => (
                    <tr key={topic.id}>
                      <td className="font-medium">{topic.title}</td>
                      <td>
                        <span className="badge">
                          {categories.find(c => c.id === topic.categoryId)?.title || topic.categoryId}
                        </span>
                      </td>
                      <td>{topic.videos?.length || 0}</td>
                      <td>{topic.resources?.length || 0}</td>
                      <td>
                        <div className="action-buttons">
                          <button className="icon-btn sm" onClick={() => setEditingTopicId(topic.id)}><Edit size={16}/></button>
                          <button className="icon-btn sm text-danger" onClick={() => handleDeleteTopic(topic.id)}><Trash2 size={16}/></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="admin-panel card">
             <div className="panel-header">
              <h3>Manage Categories</h3>
              <button className="btn-primary" onClick={handleAddCategory}><Plus size={16} className="mr-2"/> Add Category</button>
            </div>
            <div className="data-table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>ID</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map(cat => (
                    <tr key={cat.id}>
                      <td className="font-medium">{cat.title}</td>
                      <td className="text-tertiary">{cat.id}</td>
                      <td>
                        <div className="action-buttons">
                          <button className="icon-btn sm" onClick={() => handleEditCategory(cat)}><Edit size={16}/></button>
                          <button className="icon-btn sm text-danger" onClick={() => handleDeleteCategory(cat.id)}><Trash2 size={16}/></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {categories.length === 0 && (
                    <tr>
                      <td colSpan="3" className="text-center p-4 text-tertiary">No categories found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="admin-panel card">
            <div className="panel-header">
              <h3>Manage Users</h3>
            </div>
            {usersLoading ? (
              <Loader size="small" />
            ) : (
              <div className="data-table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Joined</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user.email}>
                        <td className="font-medium">{user.email}</td>
                        <td>
                          <span className={`badge ${user.role === 'admin' ? 'bg-primary text-white' : ''}`} style={user.role === 'admin' ? { backgroundColor: 'var(--accent-primary)', color: 'white', border: 'none' } : {}}>
                            {user.role}
                          </span>
                        </td>
                        <td className="text-tertiary">
                          {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                        </td>
                        <td>
                          <button 
                            className="btn-danger sm" 
                            onClick={() => handleResetProgress(user.email)}
                            title="Reset all learning progress and streaks for this user"
                          >
                            Reset Progress
                          </button>
                        </td>
                      </tr>
                    ))}
                    {users.length === 0 && (
                      <tr>
                        <td colSpan="4" className="text-center p-4 text-tertiary">No users found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'roadmaps' && (
          <div className="admin-panel card">
            <div className="panel-header">
              <h3>Manage Roadmaps</h3>
              <Link to="/admin/roadmap/new" className="btn-primary" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                <Plus size={16} className="mr-2"/> Create Roadmap
              </Link>
            </div>
            {roadmapsLoading ? (
              <Loader size="small" />
            ) : (
              <div className="data-table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Slug</th>
                      <th>Category</th>
                      <th>Created</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {roadmaps.map(rm => (
                      <tr key={rm.id}>
                        <td className="font-medium">{rm.title}</td>
                        <td className="text-tertiary">{rm.slug}</td>
                        <td><span className="badge">{rm.category}</span></td>
                        <td className="text-tertiary">{new Date(rm.createdAt).toLocaleDateString()}</td>
                        <td>
                          <div className="action-buttons">
                            <Link to={`/admin/roadmap/${rm.id}`} className="icon-btn sm"><Edit size={16}/></Link>
                            <button className="icon-btn sm text-danger" onClick={() => handleDeleteRoadmap(rm.id)}><Trash2 size={16}/></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {roadmaps.length === 0 && (
                      <tr>
                        <td colSpan="5" className="text-center p-4 text-tertiary">No roadmaps found. Create one!</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

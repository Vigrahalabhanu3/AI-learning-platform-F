import { useState, useContext, useEffect, useRef } from 'react';
import { LearningContext } from '../context/LearningContext';
import { Save, X, Plus, Trash2, Video, FileText, Music, UploadCloud, HelpCircle } from 'lucide-react';
import Loader from './Loader';
import './AdminTopicEditor.css';

const AdminTopicEditor = ({ topicId, onClose }) => {
  const { categories, topics, updateTopicDetails, addVideo, deleteVideo, updateVideo, addResource, deleteResource, updateResource, addQuiz, deleteQuiz } = useContext(LearningContext);
  const [topic, setTopic] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    categoryId: '',
    description: '',
    notes: '',
    isLocked: false
  });

  const [newVideo, setNewVideo] = useState({ title: '', url: '', serialNumber: 0 });
  const [editingVideoId, setEditingVideoId] = useState(null);
  
  const [newResource, setNewResource] = useState({ title: '', type: 'pdf', isUrl: false, url: '' });
  const [editingResourceId, setEditingResourceId] = useState(null);
  
  const [resourceFile, setResourceFile] = useState(null);
  const [newQuiz, setNewQuiz] = useState({ question: '', options: ['', '', '', ''], answer: 0 });
  const fileInputRef = useRef(null);

  useEffect(() => {
    const t = topics.find(t => t.id === topicId);
    if (t) {
      setTopic(t);
      setFormData({
        title: t.title,
        categoryId: t.categoryId,
        description: t.description,
        notes: t.notes,
        isLocked: !!t.isLocked
      });
    }
  }, [topicId, topics]);

  if (!topic) return <Loader />;

  const handleSaveTopic = () => {
    updateTopicDetails(topic.id, formData);
    alert('Topic saved successfully!');
  };

  const handleAddVideo = () => {
    if (newVideo.title && newVideo.url) {
      if (editingVideoId) {
        updateVideo(topic.id, editingVideoId, newVideo);
        setEditingVideoId(null);
      } else {
        addVideo(topic.id, newVideo);
      }
      setNewVideo({ title: '', url: '', serialNumber: 0 });
    }
  };

  const handleEditVideo = (vid) => {
    setNewVideo({ title: vid.title, url: vid.url, serialNumber: vid.serialNumber || 0 });
    setEditingVideoId(vid.id);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setResourceFile(file);
      if (!newResource.title) {
        // Auto-fill title from filename
        const nameWithoutExt = file.name.split('.').slice(0, -1).join('.');
        setNewResource(prev => ({ ...prev, title: nameWithoutExt }));
      }
      if (file.type.includes('audio')) {
        setNewResource(prev => ({ ...prev, type: 'audio' }));
      } else if (file.type.includes('pdf')) {
        setNewResource(prev => ({ ...prev, type: 'pdf' }));
      } else if (file.type.includes('image')) {
        setNewResource(prev => ({ ...prev, type: 'infographic' }));
      }
    }
  };

  const handleAddResource = () => {
    if (newResource.isUrl) {
      if (!newResource.url) {
        alert("Please provide a valid URL.");
        return;
      }
    } else {
      if (!resourceFile) {
        alert("Please select a file to upload.");
        return;
      }
    }

    if (!newResource.title) {
      alert("Please provide a title for the resource.");
      return;
    }

    const data = new FormData();
    data.append('title', newResource.title);
    data.append('type', newResource.type);
    
    if (newResource.isUrl) {
      data.append('url', newResource.url);
    } else if (resourceFile) {
      data.append('file', resourceFile);
    }

    if (editingResourceId) {
      updateResource(topic.id, editingResourceId, data);
      setEditingResourceId(null);
    } else {
      addResource(topic.id, data);
    }
    
    setNewResource({ title: '', type: 'pdf', isUrl: newResource.isUrl, url: '' });
    setResourceFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleEditResource = (res) => {
    const isUrl = res.url && (!res.url.startsWith('http://localhost') || res.url.includes('cloudinary'));
    setNewResource({ title: res.title, type: res.type, isUrl: !!isUrl, url: res.url || '' });
    setEditingResourceId(res.id);
  };

  const handleAddQuiz = () => {
    if (!newQuiz.question.trim()) return alert("Question is required.");
    if (newQuiz.options.some(opt => !opt.trim())) return alert("All 4 options must be filled.");
    
    addQuiz(topic.id, newQuiz);
    setNewQuiz({ question: '', options: ['', '', '', ''], answer: 0 });
  };

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...newQuiz.options];
    updatedOptions[index] = value;
    setNewQuiz({ ...newQuiz, options: updatedOptions });
  };

  return (
    <div className="admin-topic-editor">
      <header className="editor-header flex justify-between align-center mb-6">
        <div>
          <h2 className="text-xl font-bold">Editing Topic: <span className="text-primary">{topic.title}</span></h2>
          <p className="text-secondary text-sm mt-1">Make changes to your topic data and media here.</p>
        </div>
        <div className="flex gap-3">
          <button className="btn-secondary" onClick={onClose}><X size={18} className="mr-2"/> Close</button>
          <button className="btn-primary" onClick={handleSaveTopic}><Save size={18} className="mr-2"/> Save Changes</button>
        </div>
      </header>

      <div className="editor-layout">
        {/* Basic Info Column */}
        <div className="editor-col main-col">
          <div className="editor-card">
            <h3>Basic Information</h3>
            <div className="form-group">
              <label>Title</label>
              <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="input-field" placeholder="Topic Title" />
            </div>
            <div className="form-group">
              <label>Category</label>
              <div className="select-wrapper">
                <select value={formData.categoryId} onChange={e => setFormData({...formData, categoryId: e.target.value})} className="input-field">
                  {categories.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="input-field" rows="3" placeholder="Brief description..."></textarea>
            </div>
            <div className="form-group mb-4">
              <label className="flex align-center gap-2 cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  checked={formData.isLocked} 
                  onChange={e => setFormData({...formData, isLocked: e.target.checked})} 
                  className="accent-primary w-4 h-4"
                />
                <span className="font-semibold">Lock Course (Prevent user access)</span>
              </label>
            </div>
            <div className="form-group">
              <label>Notes (Markdown)</label>
              <textarea value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} className="input-field font-mono" rows="12" placeholder="# Start writing notes..."></textarea>
            </div>
          </div>
        </div>

        {/* Media & Resources Column */}
        <div className="editor-col side-col flex flex-col gap-6">
          
          {/* Videos */}
          <div className="editor-card media-card">
            <h3 className="flex align-center gap-2"><Video size={20} className="text-primary"/> Manage Videos</h3>
            <ul className="media-list">
              {topic.videos?.map(vid => (
                <li key={vid.id} className="media-item">
                  <div className="media-info">
                    <span className="media-title flex align-center gap-2">
                      <span className="badge bg-secondary text-xs rounded px-1">{vid.serialNumber || 0}</span> {vid.title}
                    </span>
                    <a href={vid.url} target="_blank" rel="noreferrer" className="text-xs text-secondary truncate">{vid.url}</a>
                  </div>
                  <div className="flex gap-1">
                    <button className="icon-btn sm text-secondary" onClick={() => handleEditVideo(vid)}><Plus size={16}/></button>
                    <button className="icon-btn sm text-danger" onClick={() => deleteVideo(topic.id, vid.id)}><Trash2 size={16}/></button>
                  </div>
                </li>
              ))}
              {(!topic.videos || topic.videos.length === 0) && <li className="text-secondary text-sm p-2 text-center">No videos yet.</li>}
            </ul>
            <div className="add-media-box">
              <div className="flex gap-2 mb-2">
                <input type="number" placeholder="Serial No." value={newVideo.serialNumber} onChange={e => setNewVideo({...newVideo, serialNumber: parseInt(e.target.value) || 0})} className="input-field sm w-1/4" />
                <input type="text" placeholder="Video Title" value={newVideo.title} onChange={e => setNewVideo({...newVideo, title: e.target.value})} className="input-field sm w-3/4" />
              </div>
              <input type="text" placeholder="YouTube / Cloudinary URL" value={newVideo.url} onChange={e => setNewVideo({...newVideo, url: e.target.value})} className="input-field sm mb-3 w-full" />
              <div className="flex gap-2">
                {editingVideoId && <button className="btn-secondary sm w-1/3" onClick={() => { setEditingVideoId(null); setNewVideo({title:'', url:'', serialNumber:0}); }}>Cancel</button>}
                <button className="btn-primary sm flex-1" onClick={handleAddVideo}>
                  <Plus size={16} className="mr-2"/> {editingVideoId ? 'Update Video' : 'Add Video'}
                </button>
              </div>
            </div>
          </div>

          {/* Resources Upload */}
          <div className="editor-card media-card">
            <h3 className="flex align-center gap-2"><FileText size={20} className="text-primary"/> Manage Resources</h3>
            <ul className="media-list">
              {topic.resources?.map(res => (
                <li key={res.id} className="media-item">
                  <div className="media-info">
                    <span className="media-title flex align-center gap-2">
                      {res.type === 'audio' ? <Music size={14}/> : <FileText size={14}/>} {res.title}
                    </span>
                    {res.url && res.url.includes('cloudinary') && <span className="text-xs text-secondary truncate">Cloudinary Link</span>}
                  </div>
                  <div className="flex gap-1">
                    <button className="icon-btn sm text-secondary" onClick={() => handleEditResource(res)}><Plus size={16}/></button>
                    <button className="icon-btn sm text-danger" onClick={() => deleteResource(topic.id, res.id)}><Trash2 size={16}/></button>
                  </div>
                </li>
              ))}
              {(!topic.resources || topic.resources.length === 0) && <li className="text-secondary text-sm p-2 text-center">No resources yet.</li>}
            </ul>
            
            <div className="add-media-box upload-box">
              <div className="resource-input-tabs flex gap-2 mb-3">
                 <button 
                   className={`flex-1 text-sm py-1 rounded ${!newResource.isUrl ? 'bg-primary text-white' : 'bg-transparent text-secondary border border-gray-600'}`}
                   onClick={() => setNewResource({...newResource, isUrl: false})}
                 >Upload File</button>
                 <button 
                   className={`flex-1 text-sm py-1 rounded ${newResource.isUrl ? 'bg-primary text-white' : 'bg-transparent text-secondary border border-gray-600'}`}
                   onClick={() => setNewResource({...newResource, isUrl: true})}
                 >Paste URL</button>
              </div>

              {!newResource.isUrl ? (
                <div className="file-drop-area mb-3">
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleFileChange} 
                    className="file-input"
                    accept=".pdf,audio/*,image/*"
                  />
                  <div className="file-msg flex flex-col align-center gap-2 text-center">
                    <UploadCloud size={32} className={resourceFile ? "text-primary" : "text-secondary"} />
                    <span className="text-sm">{resourceFile ? resourceFile.name : "Drag & drop a file"}</span>
                  </div>
                </div>
              ) : (
                <div className="form-group mb-3">
                  <input type="text" placeholder="Resource URL (e.g. Cloudinary)" value={newResource.url || ''} onChange={e => setNewResource({...newResource, url: e.target.value})} className="input-field sm w-full" />
                </div>
              )}

              {(resourceFile || (newResource.isUrl && newResource.url)) && (
                <div className="mt-3">
                  <input type="text" placeholder="Resource Title" value={newResource.title} onChange={e => setNewResource({...newResource, title: e.target.value})} className="input-field sm mb-2" />
                  <div className="select-wrapper sm mb-3">
                    <select value={newResource.type} onChange={e => setNewResource({...newResource, type: e.target.value})} className="input-field sm">
                      <option value="pdf">PDF Document</option>
                      <option value="audio">Audio File</option>
                      <option value="infographic">Infographic Image</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    {editingResourceId && <button className="btn-secondary sm w-1/3" onClick={() => { setEditingResourceId(null); setNewResource({title:'', type:'pdf', isUrl:false, url:''}); }}>Cancel</button>}
                    <button className="btn-primary sm flex-1" onClick={handleAddResource}>
                      <Plus size={16} className="mr-2"/> {editingResourceId ? 'Update Resource' : (newResource.isUrl ? 'Add URL Resource' : 'Upload File')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quizzes */}
          <div className="editor-card media-card">
            <h3 className="flex align-center gap-2"><HelpCircle size={20} className="text-primary"/> Manage Quizzes</h3>
            <ul className="media-list">
              {topic.quizzes?.map(quiz => (
                <li key={quiz.id} className="media-item">
                  <div className="media-info">
                    <span className="media-title truncate">{quiz.question}</span>
                  </div>
                  <button className="icon-btn sm text-danger" onClick={() => deleteQuiz(topic.id, quiz.id)}><Trash2 size={16}/></button>
                </li>
              ))}
              {(!topic.quizzes || topic.quizzes.length === 0) && <li className="text-secondary text-sm p-2 text-center">No quizzes yet.</li>}
            </ul>
            
            <div className="add-media-box">
              <textarea placeholder="Quiz Question" value={newQuiz.question} onChange={e => setNewQuiz({...newQuiz, question: e.target.value})} className="input-field sm mb-2" rows="2"></textarea>
              <div className="flex flex-col gap-2 mb-3">
                {newQuiz.options.map((opt, i) => (
                  <div key={i} className="flex align-center gap-2">
                    <input type="radio" name="correct_answer" checked={newQuiz.answer === i} onChange={() => setNewQuiz({...newQuiz, answer: i})} />
                    <input type="text" placeholder={`Option ${i+1}`} value={opt} onChange={e => handleOptionChange(i, e.target.value)} className="input-field sm w-full" />
                  </div>
                ))}
              </div>
              <button className="btn-secondary sm w-full" onClick={handleAddQuiz}><Plus size={16} className="mr-2"/> Add Quiz Question</button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminTopicEditor;

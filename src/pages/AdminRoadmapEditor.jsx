import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import RoadmapCanvas from '../components/roadmap/RoadmapCanvas';
import useRoadmapStore from '../store/useRoadmapStore';
import Loader from '../components/Loader';
import { ArrowLeft } from 'lucide-react';

const AdminRoadmapEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [roadmapMeta, setRoadmapMeta] = useState(null);
  const { setNodes, setEdges, nodes, edges } = useRoadmapStore();

  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/roadmaps/${id}`);
        if (res.ok) {
          const data = await res.json();
          setRoadmapMeta(data);
          setNodes(data.nodes || []);
          setEdges(data.edges || []);
        } else {
          alert('Roadmap not found');
          navigate('/admin');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (id !== 'new') {
      fetchRoadmap();
    } else {
      setRoadmapMeta({ title: 'New Roadmap', slug: '' });
      setNodes([]);
      setEdges([]);
      setLoading(false);
    }
  }, [id, navigate, setNodes, setEdges]);

  const handleSave = useCallback(async () => {
    if (!roadmapMeta || !roadmapMeta.title) {
      alert("Please enter a Roadmap Title in the top left before saving.");
      return;
    }

    try {
      const url = id === 'new' ? import.meta.env.VITE_API_URL + '/api/roadmaps' : `${import.meta.env.VITE_API_URL}/api/roadmaps/${id}`;
      const method = id === 'new' ? 'POST' : 'PUT';
      
      const payload = {
        title: roadmapMeta.title,
        slug: roadmapMeta.slug || roadmapMeta.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        nodes,
        edges,
        isLocked: roadmapMeta.isLocked || false
      };

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const saved = await res.json();
        alert('Roadmap saved successfully!');
        if (id === 'new') {
          navigate(`/admin/roadmap/${saved.id}`);
        }
      } else {
        const errData = await res.json().catch(() => null);
        alert('Failed to save roadmap: ' + (errData?.error || 'Unknown error'));
      }
    } catch (err) {
      console.error(err);
      alert('Error saving roadmap: ' + err.message);
    }
  }, [id, roadmapMeta, nodes, edges, navigate]);

  const handleImportJson = useCallback(() => {
    const jsonStr = prompt("Paste Roadmap JSON (can be a ReactFlow object, a raw array of topics, or a nested tree with 'children'):");
    if (!jsonStr) return;
    try {
      const data = JSON.parse(jsonStr);
      
      if (Array.isArray(data)) {
        // Handle raw array of topic objects by auto-generating nodes and edges
        const generatedNodes = data.map((item, index) => ({
          id: `node_${Date.now()}_${index}`,
          type: 'custom',
          position: { x: 250, y: index * 180 + 50 },
          data: {
            title: item.title || `Node ${index + 1}`,
            type: item.type || 'Topic Node',
            description: item.description || '',
            videoUrl: item.videoUrl || '',
            difficulty: item.difficulty || 'Beginner',
            duration: item.duration || item.estimatedDuration || '',
            isLocked: false,
            isCompleted: false
          }
        }));

        const generatedEdges = [];
        for (let i = 1; i < generatedNodes.length; i++) {
          generatedEdges.push({
            id: `edge_${generatedNodes[i-1].id}_${generatedNodes[i].id}`,
            source: generatedNodes[i-1].id,
            target: generatedNodes[i].id,
            type: 'default',
            animated: true,
            style: { stroke: 'var(--text-tertiary)', strokeWidth: 2 }
          });
        }

        setNodes(generatedNodes);
        setEdges(generatedEdges);
        alert(`Successfully imported and generated ${generatedNodes.length} nodes!`);
        
      } else if (data.children && Array.isArray(data.children)) {
        // Handle nested tree structure
        if (data.title && roadmapMeta) {
          setRoadmapMeta(prev => ({ ...prev, title: data.title }));
        }

        let newNodes = [];
        let newEdges = [];
        let yOffset = 50;

        const processNode = (item, parentId, depth) => {
          const currentId = `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          
          newNodes.push({
            id: currentId,
            type: 'custom',
            position: { x: 250 + (depth * 250), y: yOffset },
            data: {
              title: item.title || 'Untitled',
              type: depth === 0 ? 'Roadmap Concept' : (depth === 1 ? 'Main Topic' : 'Subtopic'),
              description: item.description || '',
              videoUrl: '',
              difficulty: 'Beginner',
              duration: '',
              isLocked: false,
              isCompleted: false
            }
          });

          if (parentId) {
            newEdges.push({
              id: `edge_${parentId}_${currentId}`,
              source: parentId,
              target: currentId,
              type: 'smoothstep',
              animated: true,
              style: { stroke: 'var(--text-tertiary)', strokeWidth: 2 }
            });
          }

          yOffset += 120; // Prevent overlaps

          if (item.children && Array.isArray(item.children)) {
            item.children.forEach(child => processNode(child, currentId, depth + 1));
          }
        };

        // If the root node is just a container title (like "Python Full Stack Roadmap"), 
        // we can process the children directly or process the root itself.
        // Let's process the root itself so it branches out nicely.
        processNode(data, null, 0);

        setNodes(newNodes);
        setEdges(newEdges);
        alert(`Successfully imported nested roadmap tree with ${newNodes.length} nodes!`);
        
      } else {
        // Handle standard ReactFlow object export
        if (data.nodes && Array.isArray(data.nodes)) {
          setNodes(data.nodes);
        }
        if (data.edges && Array.isArray(data.edges)) {
          setEdges(data.edges);
        }
        alert('ReactFlow JSON imported successfully!');
      }
    } catch (e) {
      alert('Invalid JSON format: ' + e.message);
    }
  }, [setNodes, setEdges, roadmapMeta]);

  if (loading) return <Loader />;

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '16px 24px', background: 'var(--bg-secondary)', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button className="icon-btn" onClick={() => navigate('/admin')}>
            <ArrowLeft size={20} />
          </button>
          <input 
            type="text" 
            placeholder="Roadmap Title..." 
            value={roadmapMeta?.title || ''} 
            onChange={(e) => setRoadmapMeta({ ...roadmapMeta, title: e.target.value })}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', fontSize: '1.2rem', outline: 'none', fontWeight: 600 }}
            disabled={roadmapMeta?.isLocked}
          />
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '12px' }}>
            {roadmapMeta?.isLocked ? (
              <button className="btn-secondary" onClick={() => setRoadmapMeta({ ...roadmapMeta, isLocked: false })}>
                Unlock Roadmap
              </button>
            ) : (
              <button className="btn-secondary" style={{ color: '#f59e0b', borderColor: '#f59e0b' }} onClick={() => setRoadmapMeta({ ...roadmapMeta, isLocked: true })}>
                Lock Roadmap
              </button>
            )}
          </div>
        </div>
        <div style={{ flex: 1, position: 'relative' }}>
          <RoadmapCanvas 
            isAdmin={!roadmapMeta?.isLocked} 
            onSave={!roadmapMeta?.isLocked ? handleSave : null} 
            roadmapTitle={roadmapMeta?.title} 
            onImportJson={!roadmapMeta?.isLocked ? handleImportJson : null}
          />
        </div>
    </div>
  );
};

export default AdminRoadmapEditor;

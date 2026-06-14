import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import RoadmapCanvas from '../components/roadmap/RoadmapCanvas';
import useRoadmapStore from '../store/useRoadmapStore';
import Loader from '../components/Loader';
import { AuthContext } from '../context/AuthContext';
import { ArrowLeft } from 'lucide-react';

const RoadmapView = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { userProfile, fetchUserProfile } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [roadmapMeta, setRoadmapMeta] = useState(null);
  const { nodes, setNodes, setEdges } = useRoadmapStore();
  const [progress, setProgress] = useState({ completedNodes: [] });
  const { updateNodeData } = useRoadmapStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch roadmap
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/roadmaps/${slug}`);
        if (!res.ok) {
          navigate('/roadmaps');
          return;
        }
        const roadmapData = await res.json();
        setRoadmapMeta(roadmapData);
        
        let userProgress = { completedNodes: [] };
        if (userProfile) {
          const progRes = await fetch(`${import.meta.env.VITE_API_URL}/api/roadmaps/${roadmapData.id}/progress`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
          });
          if (progRes.ok) userProgress = await progRes.json();
        }
        setProgress(userProgress);

        // Process nodes for locked/completed status
        const completedSet = new Set(userProgress.completedNodes);
        
        // simple prerequisite logic: if node has data.prerequisites array, check if they are in completedSet
        const processedNodes = (roadmapData.nodes || []).map(node => {
          let isLocked = false;
          // Note: In a real complex graph, we might traverse incoming edges.
          // For now, we assume simple prerequisite logic if provided, or unlocked by default
          if (node.data?.prerequisites && Array.isArray(node.data.prerequisites)) {
            isLocked = !node.data.prerequisites.every(prereqId => completedSet.has(prereqId));
          }
          
          return {
            ...node,
            data: {
              ...node.data,
              isCompleted: completedSet.has(node.id),
              isLocked
            }
          };
        });

        setNodes(processedNodes);
        setEdges(roadmapData.edges || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug, navigate, userProfile, setNodes, setEdges]);

  const handleMarkComplete = async (nodeId) => {
    if (!userProfile || !roadmapMeta) return;
    try {
      // Optimistically update progress %
      const currentCompleted = new Set(progress.completedNodes || []);
      currentCompleted.add(nodeId);
      const totalNodes = nodes.length || 1;
      const progressPercentage = Math.round((currentCompleted.size / totalNodes) * 100);
      
      setProgress(prev => ({
        ...prev,
        completedNodes: Array.from(currentCompleted),
        progressPercentage
      }));

      // Update backend
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/roadmaps/${roadmapMeta.id}/progress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({ nodeId, progressPercentage })
      });
      
      const data = await res.json();
      if (data.streakUpdated) {
        fetchUserProfile(localStorage.getItem('auth_token'));
      }
      
      // Update store visually
      updateNodeData(nodeId, { isCompleted: true });
    } catch (err) {
      console.error('Failed to save progress:', err);
    }
  };

  if (loading) return <Loader />;

  return (
    <div style={{ width: '100%', height: '100%', minHeight: 'calc(100vh - 60px)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '16px 24px', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button className="icon-btn" onClick={() => navigate('/roadmaps')}>
          <ArrowLeft size={20} />
        </button>
        <h1 style={{ margin: 0, fontSize: '1.2rem' }}>{roadmapMeta?.title}</h1>
        {userProfile && (
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ background: 'rgba(255,255,255,0.1)', height: '8px', width: '100px', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ height: '100%', background: 'var(--accent-primary)', width: `${progress.progressPercentage || 0}%` }} />
            </div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{progress.progressPercentage || 0}%</span>
          </div>
        )}
      </div>
      <div style={{ flex: 1, position: 'relative' }}>
        <RoadmapCanvas isAdmin={false} roadmapTitle={roadmapMeta?.title} onMarkComplete={handleMarkComplete} />
      </div>
    </div>
  );
};

export default RoadmapView;

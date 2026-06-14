import { useCallback, useState } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  Panel,
} from '@xyflow/react';
import useRoadmapStore from '../../store/useRoadmapStore';
import CustomNode from './CustomNode';
import NodeSidebar from './NodeSidebar';
import './Roadmap.css';
import { Save, Plus } from 'lucide-react';

const nodeTypes = {
  custom: CustomNode,
};

const RoadmapCanvas = ({ isAdmin, onSave, roadmapTitle, onImportJson, onMarkComplete }) => {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, addNode, updateNodeData } = useRoadmapStore();
  const [selectedNodeId, setSelectedNodeId] = useState(null);

  const handleNodeClick = useCallback((event, node) => {
    setSelectedNodeId(node.id);
  }, []);

  const handleAddNode = useCallback(() => {
    const newNode = {
      id: `node_${Date.now()}`,
      type: 'custom',
      position: { x: Math.random() * 200, y: Math.random() * 200 },
      data: { 
        title: 'New Topic', 
        type: 'Topic Node',
        description: '',
        isLocked: false,
        isCompleted: false 
      },
    };
    addNode(newNode);
    setSelectedNodeId(newNode.id);
  }, [addNode]);

  const handleUpdateNode = useCallback((id, data) => {
    updateNodeData(id, data);
  }, [updateNodeData]);

  const selectedNode = nodes.find(n => n.id === selectedNodeId);

  return (
    <div className="roadmap-container">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={isAdmin ? onNodesChange : undefined}
        onEdgesChange={isAdmin ? onEdgesChange : undefined}
        onConnect={isAdmin ? onConnect : undefined}
        onNodeClick={handleNodeClick}
        nodeTypes={nodeTypes}
        fitView
        nodesDraggable={isAdmin}
        nodesConnectable={isAdmin}
        elementsSelectable={true}
      >
        <Background color="#ccc" gap={16} />
        <Controls />
        <MiniMap 
          nodeColor={(n) => {
            if (n.data?.isCompleted) return '#10b981';
            if (n.data?.isLocked) return '#6b7280';
            return '#3b82f6';
          }}
          maskColor="rgba(0,0,0,0.5)"
        />

        <Panel position="top-left" style={{ padding: '16px', background: 'rgba(0,0,0,0.5)', borderRadius: '8px', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <h2 style={{ margin: 0, fontSize: '1.2rem' }}>{roadmapTitle || 'Roadmap'}</h2>
        </Panel>

        {isAdmin && (
          <Panel position="top-right" style={{ display: 'flex', gap: '8px' }}>
            <button className="btn-secondary" onClick={handleAddNode}>
              <Plus size={16} className="mr-2" /> Add Node
            </button>
            {onImportJson && (
              <button className="btn-secondary" onClick={onImportJson}>
                 Import JSON
              </button>
            )}
            {onSave && (
              <button className="btn-primary" onClick={onSave}>
                <Save size={16} className="mr-2" /> Save Roadmap
              </button>
            )}
          </Panel>
        )}
      </ReactFlow>

      {selectedNode && (
        <NodeSidebar 
          node={selectedNode} 
          onClose={() => setSelectedNodeId(null)} 
          onUpdate={handleUpdateNode}
          onMarkComplete={onMarkComplete}
          isAdmin={isAdmin}
        />
      )}
    </div>
  );
};

export default RoadmapCanvas;

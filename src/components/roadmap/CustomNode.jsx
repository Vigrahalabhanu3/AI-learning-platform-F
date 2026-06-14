import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { CheckCircle, Lock, Video, FileText, HelpCircle, Code } from 'lucide-react';

const getTypeIcon = (type) => {
  switch (type) {
    case 'Video Node': return <Video size={14} />;
    case 'Project Node': return <Code size={14} />;
    case 'Quiz Node': return <HelpCircle size={14} />;
    case 'Notes Node': return <FileText size={14} />;
    default: return <FileText size={14} />;
  }
};

const CustomNode = ({ data, isConnectable }) => {
  const isLocked = data.isLocked;
  const isCompleted = data.isCompleted;

  let className = 'custom-node';
  if (isLocked) className += ' locked';
  if (isCompleted) className += ' completed';

  return (
    <div className={className}>
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
      />
      
      <div className="custom-node-header">
        <span className="custom-node-type" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {getTypeIcon(data.type || 'Topic Node')}
          {data.type || 'Topic'}
        </span>
        {isCompleted && <CheckCircle size={16} color="#10b981" />}
        {isLocked && <Lock size={16} color="#6b7280" />}
      </div>
      
      <h3 className="custom-node-title">{data.title || 'Untitled Node'}</h3>
      
      <div className="custom-node-meta">
        {data.duration && <span>⏱ {data.duration}</span>}
        {data.difficulty && <span>⚡ {data.difficulty}</span>}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
      />
    </div>
  );
};

export default memo(CustomNode);

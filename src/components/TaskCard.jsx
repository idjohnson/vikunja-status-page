import './TaskCard.css';

export function TaskCard({ task }) {
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const maskDescription = (description) => {
    if (!description) return '';
    const marker = ':: Requested by';
    const markerIndex = description.indexOf(marker);
    
    if (markerIndex === -1) {
      return description;
    }
    
    const visiblePart = description.substring(0, markerIndex + marker.length);
    const maskedPart = description.substring(markerIndex + marker.length);
    const asterisks = '*'.repeat(Math.min(maskedPart.trim().length, 20));
    
    return `${visiblePart} ${asterisks}`;
  };

  const isResolved = task.done || task.percent_done === 100;
  const priorityLabels = {
    0: 'Unset',
    1: 'Low',
    2: 'Medium',
    3: 'High',
    4: 'Urgent',
    5: 'Critical',
  };

  return (
    <div className={`task-card ${isResolved ? 'resolved' : 'active'}`}>
      <div className="task-header">
        <h3 className="task-title">{task.title}</h3>
        <span className={`status-badge ${isResolved ? 'resolved' : 'active'}`}>
          {isResolved ? '✓ Resolved' : '◷ Active'}
        </span>
      </div>

      {task.description && (
        <p className="task-description">{maskDescription(task.description)}</p>
      )}

      <div className="task-meta">
        <div className="meta-item">
          <span className="meta-label">Created:</span>
          <span className="meta-value">{formatDate(task.created)}</span>
        </div>

        {task.updated && (
          <div className="meta-item">
            <span className="meta-label">Updated:</span>
            <span className="meta-value">{formatDate(task.updated)}</span>
          </div>
        )}

        {task.priority > 0 && (
          <div className="meta-item">
            <span className="meta-label">Priority:</span>
            <span className={`priority-badge priority-${task.priority}`}>
              {priorityLabels[task.priority]}
            </span>
          </div>
        )}

        {task.percent_done > 0 && (
          <div className="meta-item">
            <span className="meta-label">Progress:</span>
            <span className="meta-value">{task.percent_done}%</span>
          </div>
        )}
      </div>

      {task.labels && task.labels.length > 0 && (
        <div className="task-labels">
          {task.labels.map((label) => (
            <span
              key={label.id}
              className="label-badge"
              style={{
                backgroundColor: label.hex_color + '20',
                color: label.hex_color,
                borderColor: label.hex_color,
              }}
            >
              {label.title}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

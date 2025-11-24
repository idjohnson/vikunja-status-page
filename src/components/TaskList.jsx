import { TaskCard } from './TaskCard';
import './TaskList.css';

export function TaskList({ tasks, loading, error }) {
  if (loading) {
    return (
      <div className="status-message">
        <div className="loading-spinner"></div>
        <p>Loading user requests...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="status-message error">
        <p>⚠️ Error loading tasks: {error.message}</p>
      </div>
    );
  }

  if (!tasks || tasks.length === 0) {
    return (
      <div className="status-message">
        <p>No user requests found.</p>
      </div>
    );
  }

  const activeTasks = tasks.filter(
    (task) => !task.done && task.percent_done !== 100
  );
  const resolvedTasks = tasks.filter(
    (task) => task.done || task.percent_done === 100
  );

  return (
    <div className="task-list-container">
      {activeTasks.length > 0 && (
        <section className="task-section">
          <h2 className="section-title">
            Active Issues
            <span className="count-badge">{activeTasks.length}</span>
          </h2>
          <div className="task-grid">
            {activeTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </section>
      )}

      {resolvedTasks.length > 0 && (
        <section className="task-section">
          <h2 className="section-title">
            Resolved Issues
            <span className="count-badge resolved">{resolvedTasks.length}</span>
          </h2>
          <div className="task-grid">
            {resolvedTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

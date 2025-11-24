import { useState, useEffect } from 'react';
import { vikunjaAPI } from './api/vikunja';
import { TaskList } from './components/TaskList';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await vikunjaAPI.getUserRequestTasks();
      setTasks(data);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err);
      console.error('Failed to fetch tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleRefresh = () => {
    fetchTasks();
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">User Requests Status</h1>
          <p className="app-subtitle">
            Tracking user requests from Vikunja
          </p>
        </div>
        <div className="header-actions">
          <button
            className="refresh-button"
            onClick={handleRefresh}
            disabled={loading}
          >
            {loading ? '⟳' : '↻'} Refresh
          </button>
          {lastUpdated && (
            <span className="last-updated">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </span>
          )}
        </div>
      </header>

      <main className="app-main">
        <TaskList tasks={tasks} loading={loading} error={error} />
      </main>

      <footer className="app-footer">
        <p>Powered by Vikunja API</p>
      </footer>
    </div>
  );
}

export default App;

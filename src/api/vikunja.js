const getEnv = (key) => {
  // Keep this for potential other uses, but we rely on the proxy now
  if (typeof window !== 'undefined' && window.RUNTIME_CONFIG && window.RUNTIME_CONFIG[key]) {
    return window.RUNTIME_CONFIG[key];
  }
  return import.meta.env[key];
};

// Always use relative path. The proxy (Vite in dev, Express in prod) will handle the rest.
const API_URL = '/api/v1';
const API_TOKEN = getEnv('VITE_VIKUNJA_API_TOKEN');

console.log('Vikunja API Config:', {
  url: API_URL,
  hasToken: !!API_TOKEN,
  mode: import.meta.env.MODE
});

class VikunjaAPI {
  constructor() {
    this.baseUrl = API_URL;
    this.token = API_TOKEN;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
      ...options.headers,
    };

    console.log(`[API] Requesting ${url}`, { method: options.method || 'GET', headers });

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      console.log(`[API] Response from ${url}:`, {
        status: response.status,
        statusText: response.statusText,
        contentType: response.headers.get("content-type")
      });

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") === -1) {
        const text = await response.text();
        console.error('[API] Non-JSON response:', text.substring(0, 150));
        throw new Error(`API returned non-JSON response (status ${response.status}). The API URL might be incorrect.`);
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(`[API] Data received from ${url}:`, data);
      return data;
    } catch (error) {
      console.error('[API] Request failed:', error);
      throw error;
    }
  }

  async getAllTasks(params = {}) {
    const queryParams = new URLSearchParams(params);
    return this.request(`/tasks/all?${queryParams}`);
  }

  async getTask(taskId) {
    return this.request(`/tasks/${taskId}`);
  }

  async getLabels() {
    return this.request('/labels');
  }

  async getTaskLabels(taskId) {
    return this.request(`/tasks/${taskId}/labels`);
  }

  /**
   * Get all tasks with the 'userrequest' label
   * Uses the filter parameter to query tasks by label
   */
  async getUserRequestTasks() {
    // Get all labels first to find the userrequest label ID
    const labels = await this.getLabels();
    const userRequestLabel = labels.find(
      label => label.title.toLowerCase() === 'userrequest'
    );

    if (!userRequestLabel) {
      console.warn('No "userrequest" label found');
      return [];
    }

    // Filter tasks by label using the filter parameter
    // The filter syntax is: labels = <label_id>
    const tasks = await this.getAllTasks({
      filter: `labels = ${userRequestLabel.id}`,
      per_page: 100,
    });

    return tasks;
  }
}

export const vikunjaAPI = new VikunjaAPI();

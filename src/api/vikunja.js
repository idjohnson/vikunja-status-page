const API_URL = import.meta.env.VITE_VIKUNJA_API_URL || '/api/v1';
const API_TOKEN = import.meta.env.VITE_VIKUNJA_API_TOKEN;

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

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
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

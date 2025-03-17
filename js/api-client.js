/**
 * API Client for Nepal Infrastructure Projects
 * Handles communication with the server API
 */

class ApiClient {
    constructor(baseUrl = '') {
        this.baseUrl = baseUrl;
    }
    
    /**
     * Get all projects with optional filtering
     * @param {Object} filters - Optional filters (type, province, status, keyword)
     * @returns {Promise<Array>} Array of projects
     */
    async getProjects(filters = {}) {
        try {
            const queryParams = new URLSearchParams();
            
            // Add filters to query params
            if (filters.type) queryParams.append('type', filters.type);
            if (filters.province) queryParams.append('province', filters.province);
            if (filters.status) queryParams.append('status', filters.status);
            if (filters.keyword) queryParams.append('keyword', filters.keyword);
            
            const url = `${this.baseUrl}/api/projects?${queryParams.toString()}`;
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error fetching projects:', error);
            throw error;
        }
    }
    
    /**
     * Get details for a specific project
     * @param {string} projectId - Project ID
     * @returns {Promise<Object>} Project data with details
     */
    async getProjectDetails(projectId) {
        try {
            const response = await fetch(`${this.baseUrl}/api/projects/${projectId}`);
            
            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error(`Error fetching project ${projectId}:`, error);
            throw error;
        }
    }
    
    /**
     * Save markdown content for a project
     * @param {string} projectId - Project ID
     * @param {string} content - Markdown content
     * @returns {Promise<Object>} Response
     */
    async saveMarkdownContent(projectId, content) {
        try {
            const response = await fetch(`${this.baseUrl}/api/markdown`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ projectId, content })
            });
            
            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error saving markdown:', error);
            throw error;
        }
    }
    
    /**
     * Import projects from CSV data
     * @param {Array} projects - Array of project objects
     * @returns {Promise<Object>} Response
     */
    async importProjects(projects) {
        try {
            const response = await fetch(`${this.baseUrl}/api/projects`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(projects)
            });
            
            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error importing projects:', error);
            throw error;
        }
    }
}

// Create global API client instance
const apiClient = new ApiClient();

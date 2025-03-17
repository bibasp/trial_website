/**
 * Projects Page JavaScript
 * Handles loading, filtering, and display of infrastructure projects
 */

// Global variable to store all projects
let allProjects = [];

// DOM Elements
const projectsList = document.querySelector('.projects-list');
const resultCount = document.getElementById('result-count');
const categoryFilter = document.getElementById('filter-category');
const statusFilter = document.getElementById('filter-status');
const provinceFilter = document.getElementById('filter-province');
const typeFilter = document.getElementById('filter-type');
const gridViewBtn = document.getElementById('grid-view');
const listViewBtn = document.getElementById('list-view');

// Current view state (grid or list)
let currentView = 'grid';

// Load projects from JSON
function loadProjects() {
    // Try different possible paths for the JSON file
    const possiblePaths = [
        'data/nepal_projects.json',
        '../data/nepal_projects.json',
        './data/nepal_projects.json',
        '/data/nepal_projects.json'
    ];
    
    // Log the attempt
    console.log('Attempting to load JSON data...');
    
    // Try each path in sequence until one works
    tryNextPath(possiblePaths, 0);
}

// Helper function to try loading from different paths
function tryNextPath(paths, index) {
    if (index >= paths.length) {
        // We've tried all paths and failed
        projectsList.innerHTML = `<div class="error">
            <p>Failed to load projects. Please try again later.</p>
            <p>Tried all possible paths but couldn't access the JSON file.</p>
            <p>Troubleshooting:</p>
            <ul>
                <li>Check if the file exists at: data/nepal_projects.json</li>
                <li>Make sure you're running from a web server (not just opening the file directly)</li>
                <li>Check browser console for more details</li>
            </ul>
        </div>`;
        return;
    }
    
    const path = paths[index];
    console.log(`Attempting to fetch from: ${path}`);
    
    fetch(path)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(projects => {
            console.log(`Successfully loaded ${projects.length} projects from ${path}`);
            
            // Store all projects globally
            allProjects = projects;
            
            // Update the UI
            updateResultCount(projects.length);
            displayProjects(projects);
            
            // Populate filter dropdowns
            populateFilterOptions(projects);
        })
        .catch(error => {
            console.error(`Error loading from ${path}:`, error);
            // Try the next path
            tryNextPath(paths, index + 1);
        });
}

// Update the result count display
function updateResultCount(count) {
    resultCount.textContent = count;
}

// Display projects based on current filters and view mode
function displayProjects(projects) {
    // Clear the projects container
    projectsList.innerHTML = '';
    
    if (projects.length === 0) {
        projectsList.innerHTML = '<div class="no-results">No projects match your criteria.</div>';
        return;
    }
    
    // Add the appropriate class to the container based on view mode
    projectsList.className = currentView === 'grid' ? 'projects-list grid-view' : 'projects-list list-view';
    
    // Create and append project elements
    projects.forEach(project => {
        const projectElement = createProjectElement(project);
        projectsList.appendChild(projectElement);
    });
}

// Create a project element (card or list item)
function createProjectElement(project) {
    const element = document.createElement('div');
    element.className = currentView === 'grid' ? 'project-card' : 'project-list-item';
    
    // Format budget
    let formattedBudget = 'N/A';
    const budget = project.revised_budget && project.revised_budget !== "NULL" ? project.revised_budget : project.initial_budget;
    if (budget && budget !== "NULL") {
        formattedBudget = `${project.currency || 'NPR'} ${Number(budget).toLocaleString()}`;
    }
    
    // Format progress percentage
    const progress = project.physical_progress_percent && project.physical_progress_percent !== "NULL" ? project.physical_progress_percent : '0';
    
    // Status classes
    let statusClass = 'status-unknown';
    if (project.status) {
        if (project.status.toLowerCase().includes('ongoing')) statusClass = 'status-ongoing';
        else if (project.status.toLowerCase().includes('complete')) statusClass = 'status-complete';
        else if (project.status.toLowerCase().includes('operational')) statusClass = 'status-complete';
        else if (project.status.toLowerCase().includes('partial')) statusClass = 'status-partially';
        else if (project.status.toLowerCase().includes('halted')) statusClass = 'status-halted';
        else if (project.status.toLowerCase().includes('planning')) statusClass = 'status-planning';
    }
    
    if (currentView === 'grid') {
        // Grid view (card)
        element.innerHTML = `
            <div class="project-header">
                <h3>${project.project_name}</h3>
                <span class="project-status ${statusClass}">${project.status || 'Unknown'}</span>
            </div>
            <div class="project-content">
                <div class="project-meta">
                    <div class="project-meta-item">
                        <span class="meta-label">Type</span>
                        <span class="meta-value">${project.type_main_category || 'N/A'}</span>
                    </div>
                    <div class="project-meta-item">
                        <span class="meta-label">Location</span>
                        <span class="meta-value">${project.Province !== "NULL" ? project.Province : 'N/A'}</span>
                    </div>
                    <div class="project-meta-item">
                        <span class="meta-label">Budget</span>
                        <span class="meta-value">${formattedBudget}</span>
                    </div>
                    <div class="project-meta-item">
                        <span class="meta-label">Category</span>
                        <span class="meta-value">${project.category || 'N/A'}</span>
                    </div>
                </div>
                ${project.key_features && project.key_features !== "NULL" ? 
                    `<p class="project-description">${project.key_features}</p>` : ''}
                
                <div class="progress-label">
                    <span>Progress</span>
                    <span>${progress}%</span>
                </div>
                <div class="progress-bar">
                    <div class="progress" style="width: ${progress}%"></div>
                </div>
            </div>
            <div class="project-footer">
                <a href="project-detail.html?id=${project.project_id}" class="btn-detail">View Details</a>
            </div>
        `;
    } else {
        // List view
        element.innerHTML = `
            <div class="list-item-main">
                <h3>${project.project_name}</h3>
                <div class="list-item-meta">
                    <span class="project-status ${statusClass}">${project.status || 'Unknown'}</span>
                    <span class="project-location">${project.Province !== "NULL" ? project.Province : 'N/A'}</span>
                    <span class="project-type">${project.type_main_category || 'N/A'}</span>
                </div>
            </div>
            <div class="list-item-progress">
                <div class="progress-bar">
                    <div class="progress" style="width: ${progress}%"></div>
                </div>
                <span>${progress}%</span>
            </div>
            <div class="list-item-action">
                <a href="project-detail.html?id=${project.project_id}" class="btn-detail">Details</a>
            </div>
        `;
    }
    
    return element;
}

// Populate filter dropdowns based on available project data
function populateFilterOptions(projects) {
    // Extract unique values for each filter
    const categories = new Set();
    const statuses = new Set();
    const provinces = new Set();
    const types = new Set();
    
    projects.forEach(project => {
        if (project.type_main_category && project.type_main_category !== "NULL") {
            categories.add(project.type_main_category);
        }
        if (project.status && project.status !== "NULL") {
            statuses.add(project.status);
        }
        if (project.Province && project.Province !== "NULL") {
            provinces.add(project.Province);
        }
        if (project.type_sub_category && project.type_sub_category !== "NULL") {
            types.add(project.type_sub_category);
        }
    });
    
    // Populate category filter
    populateFilter(categoryFilter, categories);
    
    // Populate status filter
    populateFilter(statusFilter, statuses);
    
    // Populate province filter
    populateFilter(provinceFilter, provinces);
    
    // Populate type filter
    populateFilter(typeFilter, types);
}

// Helper function to populate a filter dropdown
function populateFilter(selectElement, values) {
    // Keep the first option (All...)
    const firstOption = selectElement.options[0];
    
    // Clear existing options (except the first)
    selectElement.innerHTML = '';
    selectElement.appendChild(firstOption);
    
    // Add new options
    [...values].sort().forEach(value => {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = value;
        selectElement.appendChild(option);
    });
}

// Apply filters and update the projects display
function applyFilters() {
    const category = categoryFilter.value;
    const status = statusFilter.value;
    const province = provinceFilter.value;
    const type = typeFilter.value;
    
    // Filter projects based on selected criteria
    const filteredProjects = allProjects.filter(project => {
        return (category === 'all' || project.type_main_category === category) &&
               (status === 'all' || project.status === status) &&
               (province === 'all' || project.Province === province) &&
               (type === 'all' || project.type_sub_category === type);
    });
    
    // Update the UI with filtered projects
    updateResultCount(filteredProjects.length);
    displayProjects(filteredProjects);
}

// Switch between grid and list views
function switchView(viewMode) {
    currentView = viewMode;
    
    // Update active state of view buttons
    if (viewMode === 'grid') {
        gridViewBtn.classList.add('active');
        listViewBtn.classList.remove('active');
    } else {
        gridViewBtn.classList.remove('active');
        listViewBtn.classList.add('active');
    }
    
    // Re-display projects with the new view mode
    applyFilters();
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Load projects data
    loadProjects();
    
    // Filter change events
    categoryFilter.addEventListener('change', applyFilters);
    statusFilter.addEventListener('change', applyFilters);
    provinceFilter.addEventListener('change', applyFilters);
    typeFilter.addEventListener('change', applyFilters);
    
    // View switch events
    gridViewBtn.addEventListener('click', () => switchView('grid'));
    listViewBtn.addEventListener('click', () => switchView('list'));
});

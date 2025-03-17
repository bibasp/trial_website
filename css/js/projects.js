document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements - Updated to match IDs in HTML
    const tileViewBtn = document.getElementById('tile-view');
    const tableViewBtn = document.getElementById('table-view');
    const projectsGrid = document.getElementById('tile-grid');
    const tableContainer = document.getElementById('table-container');
    const projectsTable = document.getElementById('projects-table');
    const resultCountElement = document.getElementById('result-count');
    const projectTypeFilter = document.getElementById('project-type');
    const locationFilter = document.getElementById('location');
    const statusFilter = document.getElementById('status');
    const keywordFilter = document.getElementById('keyword');
    const applyFiltersBtn = document.getElementById('apply-filters');
    const resetFiltersBtn = document.getElementById('reset-filters');
    const sortBySelect = document.getElementById('sort-by');
    
    // Display loading indicator
    projectsGrid.innerHTML = '<div class="loading">Loading projects...</div>';
    resultCountElement.textContent = '...';
    
    // Wait for CSV data to load, then initialize the page
    loadProjectsFromCSV().then(projects => {
        // Update the count with actual number of projects
        resultCountElement.textContent = projects.length;
        
        if (projects.length === 0) {
            projectsGrid.innerHTML = `
                <div class="error-message">
                    <h3>No projects found</h3>
                    <p>Please check if the CSV file exists at "data/nepal_projects.csv" and has valid data.</p>
                </div>`;
            return;
        }
        
        // Clear loading indicator
        projectsGrid.innerHTML = '';
        
        // Populate the projects grid and table
        renderProjects(sortProjects(projects, sortBySelect.value));
        
        // Update filter options based on available data
        updateFilterOptions(projects);
    }).catch(error => {
        console.error('Failed to load projects:', error);
        
        // Check if we have fallback data from data.js
        if (typeof projectsData !== 'undefined' && projectsData.length > 0) {
            console.log('Falling back to static data from data.js');
            // Use the static data instead
            const projects = projectsData;
            resultCountElement.textContent = projects.length;
            projectsGrid.innerHTML = '';
            renderProjects(sortProjects(projects, sortBySelect.value));
            updateFilterOptions(projects);
        } else {
            // Show error message if no fallback data
            projectsGrid.innerHTML = `
                <div class="error-message">
                    <h3>Failed to load project data</h3>
                    <p>${error.message}</p>
                    <p>Please check the browser console for more details.</p>
                    <p class="troubleshoot-tips">
                        <strong>Troubleshooting tips:</strong>
                        <ul>
                            <li>If running locally, please use a local web server instead of opening files directly.</li>
                            <li>Check that the file path is correct: ${CSV_FILE_PATH}</li>
                            <li>Make sure the CSV file exists and has proper permissions.</li>
                        </ul>
                    </p>
                </div>`;
            resultCountElement.textContent = '0';
        }
    });
    
    // Toggle View Functions
    tileViewBtn.addEventListener('click', function() {
        tileViewBtn.classList.add('active');
        tableViewBtn.classList.remove('active');
        projectsGrid.classList.add('active');
        tableContainer.classList.remove('active');
    });
    
    tableViewBtn.addEventListener('click', function() {
        tableViewBtn.classList.add('active');
        tileViewBtn.classList.remove('active');
        tableContainer.classList.add('active');
        projectsGrid.classList.remove('active');
    });
    
    // Filter and Sort Function
    function filterAndSortProjects() {
        const typeValue = projectTypeFilter.value;
        const locationValue = locationFilter.value;
        const statusValue = statusFilter.value;
        const keyword = keywordFilter.value.toLowerCase();
        const sortValue = sortBySelect.value;
        
        // Show loading state
        projectsGrid.innerHTML = '<div class="loading">Loading projects...</div>';
        projectsTable.innerHTML = '';
        
        // Get fresh data from CSV and apply filters
        loadProjectsFromCSV().then(projects => {
            // Filter projects
            let filteredProjects = projects.filter(project => {
                return (!typeValue || project.type_main_category === typeValue) && 
                       (!locationValue || project.Province === locationValue) &&
                       (!statusValue || (project.status && project.status.includes(statusValue))) &&
                       (!keyword || 
                        (project.project_name && project.project_name.toLowerCase().includes(keyword)) || 
                        (project.type_main_category && project.type_main_category.toLowerCase().includes(keyword)) ||
                        (project.type_sub_category && project.type_sub_category.toLowerCase().includes(keyword)));
            });
            
            // Sort projects
            filteredProjects = sortProjects(filteredProjects, sortValue);
            
            // Update result count
            resultCountElement.textContent = filteredProjects.length;
            
            // Render the projects
            projectsGrid.innerHTML = '';
            projectsTable.innerHTML = '';
            renderProjects(filteredProjects);
        });
    }
    
    // Update filter options based on available data
    function updateFilterOptions(projects) {
        // Create sets of unique values for each filter
        const typeOptions = new Set();
        const locationOptions = new Set();
        const statusOptions = new Set();
        
        projects.forEach(project => {
            if (project.type_main_category) typeOptions.add(project.type_main_category);
            if (project.Province) locationOptions.add(project.Province);
            if (project.status) statusOptions.add(project.status);
        });
        
        // Update the filter dropdowns
        updateSelectOptions(projectTypeFilter, typeOptions);
        updateSelectOptions(locationFilter, locationOptions);
        updateSelectOptions(statusFilter, statusOptions);
    }
    
    // Helper function to update select options
    function updateSelectOptions(selectElement, optionsSet) {
        // Save current value
        const currentValue = selectElement.value;
        
        // Clear current options except the first one (empty option)
        while (selectElement.options.length > 1) {
            selectElement.remove(1);
        }
        
        // Add new options
        Array.from(optionsSet).sort().forEach(option => {
            const optElement = document.createElement('option');
            optElement.value = option;
            optElement.textContent = option;
            selectElement.appendChild(optElement);
        });
        
        // Restore value if it still exists
        if (Array.from(optionsSet).includes(currentValue)) {
            selectElement.value = currentValue;
        }
    }
    
    // Sort function
    function sortProjects(projects, sortValue) {
        return [...projects].sort((a, b) => {
            switch (sortValue) {
                case 'name-asc':
                    return (a.project_name || '').localeCompare(b.project_name || '');
                case 'name-desc':
                    return (b.project_name || '').localeCompare(a.project_name || '');
                case 'date-asc':
                    return new Date(a.start_date || '9999-12-31') - new Date(b.start_date || '9999-12-31');
                case 'date-desc':
                    return new Date(b.start_date || '0000-01-01') - new Date(a.start_date || '0000-01-01');
                case 'progress-asc':
                    return (parseFloat(a.physical_progress_percent) || 0) - (parseFloat(b.physical_progress_percent) || 0);
                case 'progress-desc':
                    return (parseFloat(b.physical_progress_percent) || 0) - (parseFloat(a.physical_progress_percent) || 0);
                default:
                    return 0;
            }
        });
    }
    
    // Render function
    function renderProjects(projects) {
        // Render grid view
        projects.forEach(project => {
            const card = document.createElement('div');
            card.className = 'project-card';
            
            const status = project.status || 'Unknown';
            const statusClass = getStatusClass(status);
            
            card.innerHTML = `
                <div class="project-header">
                    <h3>${project.project_name || 'Unnamed Project'}</h3>
                    <span class="project-status ${statusClass}">${status}</span>
                </div>
                <div class="project-content">
                    <p class="project-category">${project.type_main_category || 'Unknown Category'} - ${project.type_sub_category || 'Unknown Type'}</p>
                    <p class="project-location">${project.Province || 'Location not specified'}</p>
                    ${project.physical_progress_percent ? `
                    <div class="progress-bar">
                        <div class="progress" style="width: ${project.physical_progress_percent}%"></div>
                        <span>${project.physical_progress_percent}% complete</span>
                    </div>` : ''}
                </div>
                <div class="project-footer">
                    <a href="project-detail.html?id=${project.project_id}" class="btn btn-outline">View Details</a>
                </div>
            `;
            
            projectsGrid.appendChild(card);
            
            // Add to table view
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${project.project_name || 'Unnamed Project'}</td>
                <td>${project.type_main_category || ''}</td>
                <td>${project.type_sub_category || ''}</td>
                <td>${project.Province || ''}</td>
                <td><span class="status-pill ${statusClass}">${status}</span></td>
                <td><a href="project-detail.html?id=${project.project_id}" class="btn btn-sm">View</a></td>
            `;
            
            projectsTable.appendChild(row);
        });
    }
    
    // Get status class
    function getStatusClass(status) {
        status = status.toLowerCase();
        if (status.includes('complete') || status.includes('operational')) return 'status-complete';
        if (status.includes('ongoing')) return 'status-ongoing';
        if (status.includes('planning')) return 'status-planning';
        if (status.includes('halt')) return 'status-halted';
        return 'status-unknown';
    }
    
    // Add event listeners to filters and sort
    applyFiltersBtn.addEventListener('click', filterAndSortProjects);
    resetFiltersBtn.addEventListener('click', function() {
        projectTypeFilter.value = '';
        locationFilter.value = '';
        statusFilter.value = '';
        keywordFilter.value = '';
        sortBySelect.value = 'name-asc';
        filterAndSortProjects();
    });
    
    sortBySelect.addEventListener('change', filterAndSortProjects);
});

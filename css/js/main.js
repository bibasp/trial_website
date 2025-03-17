/**
 * Main JavaScript file for Nepal Infrastructure Projects website
 */

document.addEventListener('DOMContentLoaded', function() {
    // Function to load and display featured projects on the home page
    async function loadFeaturedProjects() {
        try {
            // Try to load projects from CSV first
            let projects;
            try {
                projects = await loadProjectsFromCSV();
                console.log('Successfully loaded CSV data');
            } catch (error) {
                // Fall back to static data if CSV loading fails
                console.log('Failed to load CSV, falling back to static data:', error);
                projects = projectsData || [];
            }
            
            // If no projects are available, show an error
            if (!projects || projects.length === 0) {
                console.error('No project data available');
                return;
            }
            
            // Sort projects by progress and select featured ones
            const featuredProjects = projects
                .sort((a, b) => (b.physical_progress_percent || 0) - (a.physical_progress_percent || 0))
                .slice(0, 3); // Take top 3 projects
                
            // Get the container
            const projectsGrid = document.querySelector('.projects-grid');
            if (!projectsGrid) return;
            
            // Clear existing content
            projectsGrid.innerHTML = '';
            
            // Add each project to the grid
            featuredProjects.forEach(project => {
                const status = project.status || 'Unknown';
                const statusClass = getStatusClass(status);
                
                const projectElement = document.createElement('div');
                projectElement.className = 'project-card featured';
                
                projectElement.innerHTML = `
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
                
                projectsGrid.appendChild(projectElement);
            });
            
            // Update statistics on the dashboard
            updateDashboardStats(projects);
        } catch (error) {
            console.error('Error loading featured projects:', error);
        }
    }
    
    // Function to update dashboard statistics
    function updateDashboardStats(projects) {
        // Calculate statistics
        const totalProjects = projects.length;
        
        // Count projects by category
        const categoryCounts = {};
        projects.forEach(project => {
            const category = project.type_main_category || 'Uncategorized';
            categoryCounts[category] = (categoryCounts[category] || 0) + 1;
        });
        
        // Count projects by province
        const provinceCounts = {};
        projects.forEach(project => {
            const province = project.Province || 'Unspecified';
            provinceCounts[province] = (provinceCounts[province] || 0) + 1;
        });
        
        // Count projects by status
        const statusCounts = {};
        projects.forEach(project => {
            const status = project.status || 'Unknown';
            statusCounts[status] = (statusCounts[status] || 0) + 1;
        });
        
        // Update the stats in the DOM
        const totalProjectsElement = document.querySelector('.stats-grid .stat-number');
        if (totalProjectsElement) {
            totalProjectsElement.textContent = totalProjects;
        }
        
        // Update category stats
        updateStatsList('category-stats', categoryCounts);
        
        // Update province stats
        updateStatsList('province-stats', provinceCounts);
        
        // Update status stats
        updateStatsList('status-stats', statusCounts);
    }
    
    // Helper function to update stats list items
    function updateStatsList(listId, counts) {
        const list = document.getElementById(listId);
        if (!list) return;
        
        // Sort by count (descending)
        const sortedItems = Object.entries(counts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5); // Take top 5
        
        // Clear existing items
        list.innerHTML = '';
        
        // Add new items
        sortedItems.forEach(([label, count]) => {
            const li = document.createElement('li');
            li.innerHTML = `<span>${label}</span><span>${count}</span>`;
            list.appendChild(li);
        });
    }
    
    // Helper function to get CSS class for project status
    function getStatusClass(status) {
        status = status.toLowerCase();
        if (status.includes('complete') || status.includes('operational')) return 'status-complete';
        if (status.includes('ongoing')) return 'status-ongoing';
        if (status.includes('planning')) return 'status-planning';
        if (status.includes('halt')) return 'status-halted';
        return 'status-unknown';
    }
    
    // Load featured projects when DOM is ready
    loadFeaturedProjects();
});

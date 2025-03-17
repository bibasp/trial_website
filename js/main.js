// ...existing code...

// Load projects from JSON file instead of CSV
function loadProjectsFromJSON() {
    // Try different possible paths for the JSON file
    const possiblePaths = [
        'data/nepal_projects.json',
        'data/nepal_projects.json'
        '../data/nepal_projects.json',
        './data/nepal_projects.json',
        '/data/nepal_projects.json'
    ];
    
    // Try each path in sequence until one works
    tryNextPath(possiblePaths, 0);
}

// Helper function to try loading from different paths
function tryNextPath(paths, index) {
    if (index >= paths.length) {
        console.error('Failed to load JSON data after trying all possible paths');
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
            
            // Display all projects
            displayProjects(projects);
            
            // Update dashboard statistics
            updateDashboardStats(projects);
            
            // Update featured projects
            updateFeaturedProjects(projects);
        })
        .catch(error => {
            console.error(`Error loading from ${path}:`, error);
            // Try the next path
            tryNextPath(paths, index + 1);
        });
}

function displayProjects(projects) {
    const projectsContainer = document.querySelector('.portfolio-container');
    if (!projectsContainer) {
        console.error('Projects container not found');
        return;
    }
    
    // Clear any existing projects
    projectsContainer.innerHTML = '';
    
    // Display all projects from JSON
    projects.forEach(project => {
        const projectElement = createProjectElement(project);
        projectsContainer.appendChild(projectElement);
    });
}

function createProjectElement(project) {
    // Create a project element based on your HTML structure
    const projectDiv = document.createElement('div');
    projectDiv.className = 'col-lg-4 col-md-6 portfolio-item filter-app';
    
    // Adjust the HTML structure based on the JSON data fields
    projectDiv.innerHTML = `
        <div class="portfolio-wrap">
            <img src="${project.image_url || 'img/portfolio/default.jpg'}" class="img-fluid" alt="${project.project_name || 'Project'}">
            <div class="portfolio-info">
                <h4>${project.project_name || 'Unnamed Project'}</h4>
                <p>${project.type_main_category || ''} - ${project.status || ''}</p>
                <div class="portfolio-links">
                    <a href="project-detail.html?id=${project.project_id}" title="More Details"><i class="bx bx-link"></i></a>
                </div>
            </div>
        </div>
    `;
    
    return projectDiv;
}

function updateDashboardStats(projects) {
    // Update total projects count
    document.getElementById('total-projects').textContent = projects.length;
    
    // Calculate category stats
    const categories = {};
    projects.forEach(project => {
        const category = project.type_main_category || 'Uncategorized';
        categories[category] = (categories[category] || 0) + 1;
    });
    
    // Update category stats
    const categoryList = document.getElementById('category-stats');
    if (categoryList) {
        categoryList.innerHTML = '';
        Object.entries(categories)
            .sort((a, b) => b[1] - a[1]) // Sort by count in descending order
            .slice(0, 5) // Take top 5
            .forEach(([category, count]) => {
                categoryList.innerHTML += `<li><span>${category}</span><span>${count}</span></li>`;
            });
    }
    
    // Calculate province stats
    const provinces = {};
    projects.forEach(project => {
        const province = project.Province || 'Unknown';
        provinces[province] = (provinces[province] || 0) + 1;
    });
    
    // Update province stats
    const provinceList = document.getElementById('province-stats');
    if (provinceList) {
        provinceList.innerHTML = '';
        Object.entries(provinces)
            .sort((a, b) => b[1] - a[1]) // Sort by count in descending order
            .slice(0, 5) // Take top 5
            .forEach(([province, count]) => {
                provinceList.innerHTML += `<li><span>${province}</span><span>${count}</span></li>`;
            });
    }
    
    // Calculate status stats
    const statuses = {};
    projects.forEach(project => {
        const status = project.status || 'Unknown';
        statuses[status] = (statuses[status] || 0) + 1;
    });
    
    // Update status stats
    const statusList = document.getElementById('status-stats');
    if (statusList) {
        statusList.innerHTML = '';
        Object.entries(statuses)
            .sort((a, b) => b[1] - a[1]) // Sort by count in descending order
            .slice(0, 5) // Take top 5
            .forEach(([status, count]) => {
                statusList.innerHTML += `<li><span>${status}</span><span>${count}</span></li>`;
            });
    }
}

function updateFeaturedProjects(projects) {
    // Find featured projects by ID
    const featuredIds = ["TR-HW-001", "EN-HP-001", "WA-DW-001"]; // IDs from the sample content
    const featuredProjects = projects.filter(project => featuredIds.includes(project.project_id));
    
    // Get the container
    const projectsGrid = document.querySelector('.projects-grid');
    if (!projectsGrid || featuredProjects.length === 0) return;
    
    // Clear existing featured projects
    projectsGrid.innerHTML = '';
    
    // Add each featured project
    featuredProjects.forEach(project => {
        // Format currency
        const budget = project.revised_budget || project.initial_budget;
        let formattedBudget = 'N/A';
        if (budget && budget !== "NULL") {
            formattedBudget = `${project.currency || 'Rs'} ${Number(budget).toLocaleString()}`;
        }
        
        // Determine status class
        let statusClass = 'status-unknown';
        if (project.status) {
            if (project.status.toLowerCase().includes('ongoing')) statusClass = 'status-ongoing';
            else if (project.status.toLowerCase().includes('complete')) statusClass = 'status-complete';
            else if (project.status.toLowerCase().includes('operational')) statusClass = 'status-complete';
            else if (project.status.toLowerCase().includes('partial')) statusClass = 'status-partially';
        }
        
        const progressValue = project.physical_progress_percent && project.physical_progress_percent !== "NULL" 
            ? project.physical_progress_percent : '0';
        
        const projectCard = document.createElement('div');
        projectCard.className = project.project_id === "TR-HW-001" ? "project-card featured" : "project-card";
        
        projectCard.innerHTML = `
            <div class="project-header">
                <h3>${project.project_name}</h3>
                <span class="project-status ${statusClass}">${project.status}</span>
            </div>
            <div class="project-content">
                <p class="project-description">${project.key_features || 'No description available.'}</p>
                
                <div class="project-meta">
                    <div class="project-meta-item">
                        <span class="meta-label">Budget</span>
                        <span class="meta-value">${formattedBudget}</span>
                    </div>
                    <div class="project-meta-item">
                        <span class="meta-label">Agency</span>
                        <span class="meta-value">${project.implementing_agency !== "NULL" ? project.implementing_agency : 'N/A'}</span>
                    </div>
                    <div class="project-meta-item">
                        <span class="meta-label">Type</span>
                        <span class="meta-value">${project.type_specific_type !== "NULL" ? project.type_specific_type : project.type_sub_category}</span>
                    </div>
                    <div class="project-meta-item">
                        <span class="meta-label">Category</span>
                        <span class="meta-value">${project.category || 'N/A'}</span>
                    </div>
                </div>
                
                <div class="progress-label">
                    <span>Project Progress</span>
                    <span>${progressValue}%</span>
                </div>
                <div class="progress-bar">
                    <div class="progress" style="width: ${progressValue}%"></div>
                </div>
            </div>
            <div class="project-footer">
                <a href="project-detail.html?id=${project.project_id}" class="btn-detail-page">View Details</a>
            </div>
        `;
        
        projectsGrid.appendChild(projectCard);
    });
}

// Make sure this function is called when the page loads
document.addEventListener('DOMContentLoaded', function() {
    loadProjectsFromJSON();
});

// ...existing code...

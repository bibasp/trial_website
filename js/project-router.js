/**
 * Project Router - Routes project requests to either dedicated HTML pages or the generic detail page
 */

// Map of project IDs to their dedicated HTML pages
const PROJECT_PAGES = {
    "TR-HW-001": "pages/kathmandu-tarai-expressway.html", // Renamed from Fast Track to Expressway
    // Add more project mappings here as you create dedicated pages
    // Example: "EN-HP-001": "pages/upper-tamakoshi-hydroelectric-project.html",
};

/**
 * Routes to the appropriate project page based on the project ID
 * @param {string} projectId - The project ID to route to
 * @returns {string} The URL to redirect to
 */
function routeToProjectPage(projectId) {
    // Check if this project has a dedicated page
    if (PROJECT_PAGES[projectId]) {
        return PROJECT_PAGES[projectId];
    }
    
    // Default to the generic project detail page
    return `project-detail.html?id=${projectId}`;
}

/**
 * Handle click events on project links to route them appropriately
 */
document.addEventListener('DOMContentLoaded', function() {
    // Find all links to projects and add click event handlers
    const projectLinks = document.querySelectorAll('a[href^="project-detail.html?id="]');
    
    projectLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            // Prevent the default link behavior
            event.preventDefault();
            
            // Extract the project ID from the link
            const url = new URL(link.href);
            const projectId = url.searchParams.get('id');
            
            if (projectId) {
                // Get the appropriate route for this project
                const projectUrl = routeToProjectPage(projectId);
                
                // Redirect to the project page
                window.location.href = projectUrl;
            }
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    // Get project ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('id');
    const markdownSource = urlParams.get('source');
    
    if (!projectId) {
        displayError("Project ID not specified");
        return;
    }
    
    // Show loading state
    document.querySelector('.project-content').innerHTML = '<div class="loading">Loading project details...</div>';
    
    // Try to load from CSV first
    getProjectDetailsFromCSV(projectId)
        .then(project => {
            if (project) {
                // If found in CSV, display it
                displayProjectFromData(project);
            } 
            // If not found in CSV, check if we have the project in our static data
            else if (projectDetailsData && projectDetailsData[projectId]) {
                displayProjectFromData(projectDetailsData[projectId]);
            }
            // Then try to load from markdown if source is provided
            else if (markdownSource) {
                loadMarkdownContent(markdownSource);
            }
            else {
                displayError("Project information not found");
            }
        })
        .catch(error => {
            console.error('Error loading project from CSV:', error);
            // Fall back to static data or markdown
            if (projectDetailsData && projectDetailsData[projectId]) {
                displayProjectFromData(projectDetailsData[projectId]);
            } else if (markdownSource) {
                loadMarkdownContent(markdownSource);
            } else {
                displayError(`Could not load project details: ${error.message}`);
            }
        });
    
    // Display project from data object
    function displayProjectFromData(project) {
        // Set page title
        document.title = `${project.project_name || project.title} - Nepal Infrastructure Projects`;
        
        // Main project header
        const projectHeader = document.querySelector('.project-header');
        projectHeader.innerHTML = `
            <h1>${project.project_name || project.title}</h1>
            <div class="project-meta">
                <span class="project-category">${project.type_main_category || project.category || 'N/A'}</span>
                <span class="project-status ${getStatusClass(project.status || 'Unknown')}">${project.status || 'Unknown'}</span>
            </div>
        `;
        
        // Project overview
        const overviewContent = document.querySelector('#overview .content');
        overviewContent.innerHTML = `
            <div class="overview-grid">
                <div class="overview-item">
                    <h3>Location</h3>
                    <p>${project.Province || project.location || 'N/A'}</p>
                    ${project.District ? `<p>District: ${project.District}</p>` : ''}
                    ${project.specific_location ? `<p>Specific Location: ${project.specific_location}</p>` : ''}
                </div>
                
                <div class="overview-item">
                    <h3>Project Type</h3>
                    <p>Category: ${project.type_main_category || 'N/A'}</p>
                    <p>Sub-category: ${project.type_sub_category || 'N/A'}</p>
                    ${project.type_specific_type ? `<p>Specific Type: ${project.type_specific_type}</p>` : ''}
                </div>
                
                <div class="overview-item">
                    <h3>Timeline</h3>
                    <p>Start Date: ${project.start_date ? new Date(project.start_date).toLocaleDateString() : 'Not specified'}</p>
                    ${project.initial_end_date ? `<p>Initial End Date: ${new Date(project.initial_end_date).toLocaleDateString()}</p>` : ''}
                    ${project.revised_end_date ? `<p>Revised End Date: ${new Date(project.revised_end_date).toLocaleDateString()}</p>` : ''}
                    ${project.actual_end_date ? `<p>Actual End Date: ${new Date(project.actual_end_date).toLocaleDateString()}</p>` : ''}
                </div>
                
                <div class="overview-item">
                    <h3>Budget</h3>
                    <p>Initial Budget: ${project.initial_budget ? formatCurrency(project.initial_budget, project.currency) : 'Not specified'}</p>
                    ${project.revised_budget ? `<p>Revised Budget: ${formatCurrency(project.revised_budget, project.currency)}</p>` : ''}
                    <p>Funding Model: ${project.funding_model || 'Not specified'}</p>
                </div>
            </div>
            
            ${project.physical_progress_percent ? `
            <div class="overview-section">
                <h3>Progress</h3>
                <div class="progress-bar large">
                    <div class="progress" style="width: ${project.physical_progress_percent}%"></div>
                    <span>${project.physical_progress_percent}% complete</span>
                </div>
                <p class="progress-date">Last updated: ${project.progress_updated_date ? new Date(project.progress_updated_date).toLocaleDateString() : 'Unknown'}</p>
            </div>` : ''}
            
            ${project.key_features ? `
            <div class="overview-section">
                <h3>Key Features</h3>
                <p>${project.key_features}</p>
            </div>` : ''}
            
            ${project.challenges ? `
            <div class="overview-section">
                <h3>Challenges</h3>
                <p>${project.challenges}</p>
            </div>` : ''}
        `;
        
        // Implementation section
        const implementationContent = document.querySelector('#implementation .content');
        if (project.implementing_agency || project.primary_contractor || project.sub_contractors) {
            implementationContent.innerHTML = `
                <div class="implementation-grid">
                    ${project.implementing_agency ? `
                    <div class="implementation-item">
                        <h3>Implementing Agency</h3>
                        <p>${project.implementing_agency}</p>
                    </div>` : ''}
                    
                    ${project.primary_contractor ? `
                    <div class="implementation-item">
                        <h3>Primary Contractor</h3>
                        <p>${project.primary_contractor}</p>
                    </div>` : ''}
                    
                    ${project.sub_contractors ? `
                    <div class="implementation-item">
                        <h3>Sub Contractors</h3>
                        <p>${project.sub_contractors}</p>
                    </div>` : ''}
                </div>
            `;
        } else {
            implementationContent.innerHTML = '<p>Implementation details not available.</p>';
        }
        
        // Technical details
        const technicalContent = document.querySelector('#technical .content');
        if (project.length_km || project.capacity || project.area_hectares || project.key_features) {
            technicalContent.innerHTML = `
                <div class="technical-grid">
                    ${project.length_km ? `
                    <div class="technical-item">
                        <h3>Length</h3>
                        <p>${project.length_km} km</p>
                    </div>` : ''}
                    
                    ${project.capacity ? `
                    <div class="technical-item">
                        <h3>Capacity</h3>
                        <p>${project.capacity}</p>
                    </div>` : ''}
                    
                    ${project.area_hectares ? `
                    <div class="technical-item">
                        <h3>Area</h3>
                        <p>${project.area_hectares} hectares</p>
                    </div>` : ''}
                </div>
                
                ${project.key_features ? `
                <div class="technical-section">
                    <h3>Technical Specifications</h3>
                    <p>${project.key_features}</p>
                </div>` : ''}
            `;
        } else {
            technicalContent.innerHTML = '<p>Technical details not available.</p>';
        }
        
        // Set Conclusion
        const conclusionContent = document.querySelector('#conclusion .content');
        conclusionContent.innerHTML = '<p>Project is part of Nepal\'s infrastructure development initiative.</p>';
        
        // Set References section
        const referencesSection = document.querySelector('#references .references-list');
        if (project.basic_info || project.references) {
            let referencesList = '';
            if (project.references && Array.isArray(project.references)) {
                project.references.forEach((ref, index) => {
                    referencesList += `<li>[${index + 1}] <a href="${ref.url}" target="_blank">${ref.title}</a></li>`;
                });
            }
            referencesSection.innerHTML = referencesList ? `<ol>${referencesList}</ol>` : '<p>No references provided.</p>';
        } else {
            referencesSection.innerHTML = '<p>No references available.</p>';
        }
    }
    
    // Load content from markdown file
    function loadMarkdownContent(markdownPath) {
        fetch(markdownPath)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Markdown file not found');
                }
                return response.text();
            })
            .then(markdown => {
                parseAndDisplayMarkdown(markdown);
            })
            .catch(error => {
                console.error('Error loading markdown:', error);
                displayError(`Failed to load markdown file: ${error.message}`);
            });
    }
    
    // Parse and display markdown content
    function parseAndDisplayMarkdown(markdown) {
        // Get the title
        const titleMatch = markdown.match(/# (.*)/);
        const title = titleMatch ? titleMatch[1] : 'Project Details';
        
        // Set page title
        document.title = `${title} - Nepal Infrastructure Projects`;
        
        // Set project header
        const projectHeader = document.querySelector('.project-header');
        projectHeader.innerHTML = `<h1>${title}</h1>`;
        
        // Find all sections
        const sections = {
            'overview': 'Basic Information',
            'implementation': 'Implementation Structure',
            'technical': 'Technical Specifications',
            'conclusion': 'Future Outlook',
            'references': 'References'
        };
        
        // Process each section
        for (const [id, heading] of Object.entries(sections)) {
            const sectionRegex = new RegExp(`## ${heading}[\\s\\S]*?(?=## |$)`, 'g');
            const sectionMatch = markdown.match(sectionRegex);
            let sectionContent = '';
            
            if (sectionMatch) {
                sectionContent = sectionMatch[0].replace(`## ${heading}`, '').trim();
                
                // For references, extract footnotes
                if (id === 'references') {
                    const footnoteRegex = /\[\^(\d+)\]: (.*)/g;
                    const footnotes = [];
                    let footnoteMatch;
                    
                    while ((footnoteMatch = footnoteRegex.exec(sectionContent)) !== null) {
                        footnotes.push({
                            number: footnoteMatch[1],
                            text: footnoteMatch[2]
                        });
                    }
                    
                    if (footnotes.length > 0) {
                        sectionContent = '<ol>' + footnotes.map(f => `<li id="fn${f.number}">${f.text}</li>`).join('') + '</ol>';
                    }
                } else {
                    // Convert markdown to HTML (simple version)
                    sectionContent = sectionContent
                        .replace(/\n\n/g, '</p><p>')
                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                        .replace(/\*(.*?)\*/g, '<em>$1</em>');
                    sectionContent = `<p>${sectionContent}</p>`;
                }
            }
            
            const contentElement = document.querySelector(`#${id} .content`);
            if (contentElement) {
                contentElement.innerHTML = sectionContent || `<p>No ${sections[id].toLowerCase()} information available.</p>`;
            }
        }
    }
    
    // Helper functions
    function displayError(message) {
        document.querySelector('.project-content').innerHTML = `
            <div class="error-message">
                <h2>Error</h2>
                <p>${message}</p>
                <a href="projects.html" class="btn btn-primary">Back to Projects</a>
            </div>
        `;
    }
    
    function getStatusClass(status) {
        status = status.toLowerCase();
        if (status.includes('complete') || status.includes('operational')) return 'status-complete';
        if (status.includes('ongoing')) return 'status-ongoing';
        if (status.includes('planning')) return 'status-planning';
        if (status.includes('halt')) return 'status-halted';
        return 'status-unknown';
    }
    
    function formatCurrency(value, currency) {
        // Use scientific notation for large numbers
        if (value > 1000000) {
            const millions = value / 1000000;
            return `${millions.toFixed(2)} million ${currency || 'NPR'}`;
        }
        return `${value.toLocaleString()} ${currency || 'NPR'}`;
    }
});

/**
 * CSV Previewer and Manager for Nepal Infrastructure Projects
 * Handles importing, parsing, and saving CSV data
 */

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const csvFileInput = document.getElementById('csv-file');
    const previewBtn = document.getElementById('preview-csv');
    const saveBtn = document.getElementById('save-csv');
    const previewContainer = document.getElementById('preview-container');
    const previewTable = document.getElementById('csv-preview-table');
    const confirmSaveBtn = document.getElementById('confirm-save');
    const cancelSaveBtn = document.getElementById('cancel-save');
    const resultContainer = document.getElementById('result-container');
    const projectIdSelect = document.getElementById('project-id');
    const markdownContent = document.getElementById('markdown-content');
    const saveMarkdownBtn = document.getElementById('save-markdown');
    
    // CSV Data
    let parsedData = null;
    let csvHeaders = null;
    
    // Load existing projects for the markdown editor
    loadExistingProjects();
    
    // Event Listeners
    previewBtn.addEventListener('click', previewCSV);
    confirmSaveBtn.addEventListener('click', saveCSV);
    cancelSaveBtn.addEventListener('click', cancelPreview);
    saveMarkdownBtn.addEventListener('click', saveMarkdownContent);
    projectIdSelect.addEventListener('change', loadProjectMarkdown);
    
    // Function to preview CSV content
    function previewCSV() {
        const file = csvFileInput.files[0];
        
        if (!file) {
            showResult('Please select a CSV file', 'danger');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const result = parseCSV(e.target.result);
                parsedData = result.data;
                csvHeaders = result.headers;
                
                // Display preview table
                displayPreview();
                
                // Enable save button and show preview
                saveBtn.disabled = false;
                previewContainer.style.display = 'block';
                
                showResult('CSV parsed successfully. Review the preview before saving.', 'success');
            } catch (err) {
                showResult(`Error parsing CSV: ${err.message}`, 'danger');
            }
        };
        
        reader.readAsText(file);
    }
    
    // Parse CSV text into structured data
    function parseCSV(csvText) {
        // Split by lines and remove empty lines
        const lines = csvText.split('\n').filter(line => line.trim() !== '');
        
        // Get headers - skip comment line if present
        let headerLine = lines[0];
        if (headerLine.includes('//')) {
            headerLine = headerLine.split('//')[1].trim();
        }
        
        const headers = headerLine.includes('project_id') ? 
            headerLine.split(',').map(h => h.trim()) : 
            lines[0].split(',').map(h => h.trim());
        
        const data = [];
        
        // Start from line 1 to skip header
        for (let i = 1; i < lines.length; i++) {
            // Skip comment lines
            if (lines[i].trim().startsWith('//')) continue;
            
            // Parse CSV line, handling quoted values
            const values = parseCSVLine(lines[i]);
            
            if (values.length === headers.length) {
                const row = {};
                headers.forEach((header, index) => {
                    // Replace "NULL" strings with null values
                    row[header] = values[index] === 'NULL' ? null : values[index];
                });
                data.push(row);
            } else {
                console.warn(`Line ${i} has ${values.length} values but headers has ${headers.length}`);
            }
        }
        
        return { headers, data };
    }
    
    // Function to handle parsing a CSV line with quoted values
    function parseCSVLine(line) {
        const values = [];
        let currentValue = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                values.push(currentValue);
                currentValue = '';
            } else {
                currentValue += char;
            }
        }
        
        // Add the last value
        values.push(currentValue);
        return values;
    }
    
    // Display CSV preview in the table
    function displayPreview() {
        previewTable.innerHTML = '';
        
        // Create header row
        const headerRow = document.createElement('tr');
        csvHeaders.forEach(header => {
            const th = document.createElement('th');
            th.textContent = header;
            headerRow.appendChild(th);
        });
        previewTable.appendChild(headerRow);
        
        // Create data rows (limit to 10 for preview)
        const maxPreviewRows = Math.min(10, parsedData.length);
        for (let i = 0; i < maxPreviewRows; i++) {
            const row = document.createElement('tr');
            csvHeaders.forEach(header => {
                const td = document.createElement('td');
                td.textContent = parsedData[i][header] || '';
                row.appendChild(td);
            });
            previewTable.appendChild(row);
        }
        
        // Show row count if truncated
        if (parsedData.length > maxPreviewRows) {
            const infoRow = document.createElement('tr');
            const infoCell = document.createElement('td');
            infoCell.colSpan = csvHeaders.length;
            infoCell.textContent = `... ${parsedData.length - maxPreviewRows} more rows (showing first 10 rows only)`;
            infoCell.style.textAlign = 'center';
            infoCell.style.fontStyle = 'italic';
            infoRow.appendChild(infoCell);
            previewTable.appendChild(infoRow);
        }
    }
    
    // Save CSV content to the server
    function saveCSV() {
        // In a real implementation, this would send the data to the server
        // For this demo, we'll simulate saving by showing a success message
        
        // This is where you would normally make an API call to save the CSV on the server
        // Example:
        // fetch('/api/save-csv', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify({
        //         data: parsedData,
        //         headers: csvHeaders
        //     })
        // })
        
        showResult('CSV data saved successfully. Note: In this demo, data is not actually saved to the server.', 'success');
        previewContainer.style.display = 'none';
        
        // Update the project selection dropdown with new data
        updateProjectSelection(parsedData);
    }
    
    // Cancel CSV preview
    function cancelPreview() {
        previewContainer.style.display = 'none';
        parsedData = null;
        csvHeaders = null;
        saveBtn.disabled = true;
    }
    
    // Show result message
    function showResult(message, type) {
        resultContainer.textContent = message;
        resultContainer.className = `alert alert-${type}`;
        resultContainer.style.display = 'block';
        
        // Hide after 5 seconds
        setTimeout(() => {
            resultContainer.style.display = 'none';
        }, 5000);
    }
    
    // Load existing projects into the dropdown
    function loadExistingProjects() {
        fetch('../js/project-data.js')
            .then(response => response.text())
            .then(text => {
                // Extract project data from JavaScript
                const match = text.match(/const projectsData = \[([\s\S]*?)\];/);
                if (match && match[1]) {
                    try {
                        // Safely evaluate the JavaScript array
                        const projectsArray = new Function(`return [${match[1]}];`)();
                        updateProjectSelection(projectsArray);
                    } catch (e) {
                        console.error('Error parsing project data:', e);
                    }
                }
            })
            .catch(err => {
                console.error('Error loading project data:', err);
            });
            
        // Alternatively, in a real implementation with server access:
        // fetch('../data/nepal_projects.csv')
        //     .then(response => response.text())
        //     .then(text => {
        //         const result = parseCSV(text);
        //         updateProjectSelection(result.data);
        //     });
    }
    
    // Update project selection dropdown
    function updateProjectSelection(projects) {
        projectIdSelect.innerHTML = '<option value="">Select a project</option>';
        
        if (!projects) return;
        
        projects.forEach(project => {
            if (project.project_id) {
                const option = document.createElement('option');
                option.value = project.project_id;
                option.textContent = `${project.project_id} - ${project.project_name || 'Unnamed Project'}`;
                projectIdSelect.appendChild(option);
            }
        });
    }
    
    // Load markdown content for a selected project
    function loadProjectMarkdown() {
        const projectId = projectIdSelect.value;
        if (!projectId) {
            markdownContent.value = '';
            return;
        }
        
        // In a real implementation, this would load from the server
        fetch(`../data/Comprehensive Research on the ${projectId}.md`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Markdown file not found');
                }
                return response.text();
            })
            .then(text => {
                markdownContent.value = text;
            })
            .catch(err => {
                console.log('No existing markdown found, starting with template');
                // Create a template for new content
                markdownContent.value = `# Comprehensive Research on [Project Name]

## Basic Information

The official name of this infrastructure project is "[Official Name]". It is classified as a [Project Type] infrastructure project. The project has been officially designated as a National Pride Project by the Government of Nepal, highlighting its strategic importance to the country's development agenda.

## Geographical Coverage

[Describe where the project is located, which districts/provinces it covers, etc.]

## Timeline and Status

[Describe when the project started, its current status, and expected completion date]

## Financial Details

[Describe budget, funding sources, etc.]

## Implementation Structure

[Describe implementing agencies, contractors, etc.]

## Technical Specifications

[Describe technical details of the project]

## Socioeconomic Impact

[Describe how the project impacts society and economy]

## Challenges and Controversies

[Describe any challenges or controversies related to the project]

## Historical Context

[Provide historical background on the project]

## Future Outlook

[Describe future plans and prospects]
`;
            });
    }
    
    // Save markdown content for a project
    function saveMarkdownContent() {
        const projectId = projectIdSelect.value;
        if (!projectId) {
            showResult('Please select a project first', 'danger');
            return;
        }
        
        const content = markdownContent.value;
        if (!content) {
            showResult('Please enter markdown content', 'danger');
            return;
        }
        
        // In a real implementation, this would send to the server
        // fetch('/api/save-markdown', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify({
        //         projectId: projectId,
        //         content: content
        //     })
        // })
        
        showResult(`Markdown content for project ${projectId} saved successfully. Note: In this demo, content is not actually saved to the server.`, 'success');
    }
});

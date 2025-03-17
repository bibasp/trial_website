/**
 * CSV Loader for Nepal Infrastructure Projects
 * Fetches and parses the CSV file dynamically
 */

const CSV_FILE_PATH = '../data/nepal_projects.csv'; // Adjust path based on your structure

// Function to fetch and parse CSV
async function loadProjectsFromCSV() {
    try {
        const response = await fetch(CSV_FILE_PATH);
        if (!response.ok) {
            throw new Error(`Failed to load CSV file (${response.status} ${response.statusText})`);
        }
        const csvText = await response.text();
        return parseCSV(csvText);
    } catch (error) {
        console.error('Error loading CSV:', error);
        throw error;
    }
}

// Parse CSV text into an array of objects
function parseCSV(csvText) {
    const lines = csvText.split('\n').filter(line => line.trim() !== '');
    const headers = lines[0].split(',').map(header => header.trim());
    const projects = [];

    for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        const values = parseCSVLine(lines[i]);
        if (values.length !== headers.length) {
            console.warn(`Line ${i} has ${values.length} values but headers has ${headers.length}`);
            continue;
        }
        const project = {};
        headers.forEach((header, index) => {
            project[header] = values[index] === 'NULL' ? null : values[index];
        });
        projects.push(project);
    }
    return projects;
}

// Parse CSV line handling quoted values
function parseCSVLine(line) {
    const values = [];
    let currentValue = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            values.push(currentValue.trim());
            currentValue = '';
        } else {
            currentValue += char;
        }
    }
    values.push(currentValue.trim());
    return values;
}

// Helper functions
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const parts = dateString.split('/');
    if (parts.length === 3) {
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                        'July', 'August', 'September', 'October', 'November', 'December'];
        return `${months[parseInt(parts[0])-1]} ${parts[1]}, ${parts[2]}`;
    }
    return dateString;
}

function formatCurrency(amount, currency) {
    if (!amount) return 'Unknown';
    const num = parseFloat(amount);
    return `${num.toLocaleString()} ${currency || 'NPR'}`;
}

function getProjectById(projects, projectId) {
    return projects.find(project => project.project_id === projectId || project.short_name === projectId);
}

// Export functions
export { loadProjectsFromCSV, formatDate, formatCurrency, getProjectById };
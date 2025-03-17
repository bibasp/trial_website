/**
 * Nepal Infrastructure Projects Data
 * Static data converted from nepal_projects.csv
 */

const projectsData = [
    {
        project_id: "TR-HW-001",
        project_name: "Kathmandu-Tarai Expressway",
        short_name: "Fast Track",
        coordinate: "27.179462383361777, 85.15504811707444",
        type_main_category: "Transportation",
        type_sub_category: "Highway",
        type_specific_type: "Expressway",
        Province: "Bagmati",
        District: "Kathmandu, Makwanpur, Bara",
        specific_location: "Kathmandu to Nijgadh",
        start_date: "4/1/2017",
        initial_end_date: "8/1/2021",
        revised_end_date: "4/1/2027",
        actual_end_date: null,
        status: "Ongoing",
        implementing_agency: "Nepal Army",
        primary_contractor: "Nepal Army",
        sub_contractors: "China State Construction Engineering Corp Ltd, Poly Changda Engineering Co Ltd",
        initial_budget: "1.337E+11",
        revised_budget: "2.14E+11",
        currency: "NPR",
        funding_model: "Government Budget",
        length_km: "70.977",
        capacity: null,
        area_hectares: null,
        key_features: "48.037 km normal roads; 12.885 km bridges; 10.055 km tunnels",
        physical_progress_percent: "37",
        financial_progress_percent: null,
        progress_updated_date: "1/1/2025",
        challenges: "Land acquisition in Khokana area, Multiple deadline extensions, Budget increases",
        category: "National Pride Project"
    },
    {
        project_id: "TR-HW-002",
        project_name: "Mid-Hills Highway",
        short_name: "Pushpalal Highway",
        coordinate: "28.243065508037496, 83.98408853271457",
        type_main_category: "Transportation",
        type_sub_category: "Highway",
        type_specific_type: "National Highway",
        Province: "Multiple Provinces",
        District: "Multiple districts",
        specific_location: "Middle hills connecting east-west",
        start_date: null,
        initial_end_date: null,
        revised_end_date: null,
        actual_end_date: null,
        status: "Ongoing",
        implementing_agency: null,
        primary_contractor: null,
        sub_contractors: null,
        initial_budget: null,
        revised_budget: null,
        currency: "NPR",
        funding_model: null,
        length_km: null,
        capacity: null,
        area_hectares: null,
        key_features: "Strategic east-west road network through hill districts",
        physical_progress_percent: null,
        financial_progress_percent: null,
        progress_updated_date: null,
        challenges: null,
        category: "National Pride Project"
    },
    // ... Copy the rest of the projects from the CSV here ...
    // The complete data from your nepal_projects.csv should be converted into this format
    {
        project_id: "WA-DW-001",
        project_name: "Melamchi Water Supply Project",
        short_name: "Melamchi",
        coordinate: null,
        type_main_category: "Water Infrastructure",
        type_sub_category: "Drinking Water",
        type_specific_type: "Drinking Water",
        Province: "Bagmati",
        District: "Sindhupalchok, Kathmandu",
        specific_location: "Melamchi River to Kathmandu",
        start_date: null,
        initial_end_date: null,
        revised_end_date: null,
        actual_end_date: "7/5/2020",
        status: "Partially operational",
        implementing_agency: null,
        primary_contractor: null,
        sub_contractors: null,
        initial_budget: null,
        revised_budget: null,
        currency: "NPR",
        funding_model: null,
        length_km: null,
        capacity: null,
        area_hectares: null,
        key_features: "Water reached Kathmandu temporarily",
        physical_progress_percent: null,
        financial_progress_percent: null,
        progress_updated_date: null,
        challenges: "Project remains incomplete",
        category: "National Pride Project"
    }
    // ... Copy all 31 projects from the CSV file
];

// Helper functions that work with the project data
function formatDate(dateString) {
    if (!dateString) return '';
    
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
    
    // Handle scientific notation
    if (typeof amount === 'string' && amount.includes('E')) {
        const num = parseFloat(amount);
        amount = num.toLocaleString();
    } else if (amount) {
        amount = parseFloat(amount).toLocaleString();
    }
    
    return `${amount} ${currency || 'NPR'}`;
}

function getStatusClass(status) {
    if (!status) return 'status-unknown';
    
    const statusLower = status.toLowerCase();
    if (statusLower.includes('complet') || statusLower.includes('operation')) {
        return 'status-complete';
    } else if (statusLower.includes('ongoing')) {
        return 'status-ongoing';
    } else if (statusLower.includes('plan')) {
        return 'status-planning';
    } else if (statusLower.includes('halt')) {
        return 'status-halted';
    } else {
        return 'status-unknown';
    }
}

function getProjectById(projectId) {
    return projectsData.find(project => 
        project.project_id === projectId || 
        project.short_name === projectId
    );
}

// Add event listeners to automatically apply filters on change
document.getElementById('category-filter').addEventListener('change', filterProjects);
document.getElementById('status-filter').addEventListener('change', filterProjects);
document.getElementById('province-filter').addEventListener('change', filterProjects);
document.getElementById('search-projects').addEventListener('input', filterProjects);

// Modify your existing filterProjects function or create one if it doesn't exist
function filterProjects() {
    // ...existing filtering code...
    
    // When calculating progress, handle null values
    projects.forEach(project => {
        // Convert null progress to 0
        if (project.progress === null || project.progress === undefined) {
            project.progress = 0;
        }
        
        // Display progress in UI elements
        const progressElement = document.querySelector(`.project-card[data-id="${project.id}"] .progress`);
        if (progressElement) {
            progressElement.style.width = `${project.progress}%`;
        }
        
        const progressLabelElement = document.querySelector(`.project-card[data-id="${project.id}"] .progress-label span:last-child`);
        if (progressLabelElement) {
            progressLabelElement.textContent = `${project.progress}%`;
        }
    });
    
    // ...rest of your filtering logic...
}

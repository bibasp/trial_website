/**
 * Database Setup Script for Nepal Infrastructure Projects
 * Imports initial CSV data into SQLite database
 */

const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');

// Parse CSV function
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

// Parse CSV line with quoted values
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

async function setupDatabase() {
    console.log("Setting up database...");
    
    try {
        // Open the database
        const db = await open({
            filename: path.join(__dirname, 'data', 'nepal_projects.db'),
            driver: sqlite3.Database
        });
        
        // Create tables
        await db.exec(`
            CREATE TABLE IF NOT EXISTS projects (
                project_id TEXT PRIMARY KEY,
                project_name TEXT,
                short_name TEXT,
                coordinate TEXT,
                type_main_category TEXT,
                type_sub_category TEXT,
                type_specific_type TEXT,
                province TEXT,
                district TEXT,
                specific_location TEXT,
                start_date TEXT,
                initial_end_date TEXT,
                revised_end_date TEXT,
                actual_end_date TEXT,
                status TEXT,
                implementing_agency TEXT,
                primary_contractor TEXT,
                sub_contractors TEXT,
                initial_budget TEXT,
                revised_budget TEXT,
                currency TEXT,
                funding_model TEXT,
                length_km TEXT,
                capacity TEXT,
                area_hectares TEXT,
                key_features TEXT,
                physical_progress_percent TEXT,
                financial_progress_percent TEXT,
                progress_updated_date TEXT,
                challenges TEXT,
                category TEXT
            );
            
            CREATE TABLE IF NOT EXISTS project_details (
                project_id TEXT PRIMARY KEY,
                content TEXT,
                last_updated TEXT,
                FOREIGN KEY (project_id) REFERENCES projects(project_id)
            );
        `);
        
        // Read CSV file
        const csvPath = path.join(__dirname, 'data', 'nepal_projects.csv');
        const csvData = fs.readFileSync(csvPath, 'utf8');
        
        // Parse CSV data
        const { data: projects } = parseCSV(csvData);
        
        console.log(`Found ${projects.length} projects in CSV file`);
        
        // Begin transaction
        await db.exec('BEGIN TRANSACTION');
        
        // Prepare statement for inserting projects
        const stmt = await db.prepare(`
            INSERT OR REPLACE INTO projects (
                project_id, project_name, short_name, coordinate, type_main_category,
                type_sub_category, type_specific_type, province, district, specific_location,
                start_date, initial_end_date, revised_end_date, actual_end_date, status,
                implementing_agency, primary_contractor, sub_contractors, initial_budget,
                revised_budget, currency, funding_model, length_km, capacity, area_hectares,
                key_features, physical_progress_percent, financial_progress_percent, 
                progress_updated_date, challenges, category
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        
        // Insert each project
        for (const project of projects) {
            await stmt.run([
                project.project_id, project.project_name, project.short_name, 
                project.coordinate, project.type_main_category, project.type_sub_category,
                project.type_specific_type, project.Province, project.District,
                project.specific_location, project.start_date, project.initial_end_date,
                project.revised_end_date, project.actual_end_date, project.status,
                project.implementing_agency, project.primary_contractor, project.sub_contractors,
                project.initial_budget, project.revised_budget, project.currency,
                project.funding_model, project.length_km, project.capacity, project.area_hectares,
                project.key_features, project.physical_progress_percent,
                project.financial_progress_percent, project.progress_updated_date,
                project.challenges, project.category
            ]);
        }
        
        await stmt.finalize();
        
        // Import markdown files
        const dataDir = path.join(__dirname, 'data');
        const files = fs.readdirSync(dataDir);
        
        for (const file of files) {
            if (file.endsWith('.md') && file.includes('Comprehensive Research on the')) {
                // Extract project ID from filename
                const projectIdMatch = file.match(/Comprehensive Research on the (.*?)\.md/i);
                if (projectIdMatch && projectIdMatch[1]) {
                    const projectId = projectIdMatch[1].trim();
                    
                    // Check if project exists
                    const project = await db.get('SELECT 1 FROM projects WHERE project_id = ?', [projectId]);
                    
                    if (project) {
                        // Read markdown content
                        const content = fs.readFileSync(path.join(dataDir, file), 'utf8');
                        
                        // Insert into project_details
                        await db.run(`
                            INSERT OR REPLACE INTO project_details (project_id, content, last_updated)
                            VALUES (?, ?, datetime('now'))
                        `, [projectId, content]);
                        
                        console.log(`Imported markdown for project ${projectId}`);
                    }
                }
            }
        }
        
        // Commit transaction
        await db.exec('COMMIT');
        
        console.log("Database setup completed successfully!");
        
        // Close database
        await db.close();
    } catch (error) {
        console.error("Database setup error:", error);
    }
}

// Run setup
setupDatabase();

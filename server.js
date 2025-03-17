/**
 * Enhanced HTTP server with database support for Nepal Infrastructure Projects website
 * 
 * Usage:
 * 1. Make sure you have Node.js installed
 * 2. Run 'npm install' to install dependencies
 * 3. Run 'node server.js' in this directory
 * 4. Open http://localhost:3000 in your browser
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');

const PORT = process.env.PORT || 3000;

// MIME types for different file extensions
const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.csv': 'text/csv',
    '.md': 'text/markdown'
};

// Database connection
let db;

// Initialize database
async function initializeDb() {
    try {
        // Open the database
        db = await open({
            filename: path.join(__dirname, 'data', 'nepal_projects.db'),
            driver: sqlite3.Database
        });
        
        // Create tables if they don't exist
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
        
        console.log("Database initialized successfully");
    } catch (error) {
        console.error("Database initialization error:", error);
    }
}

// API handlers
async function handleApiRequest(req, res, parsedUrl) {
    const pathname = parsedUrl.pathname;
    const query = parsedUrl.query;
    
    // Set CORS headers for API routes
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // Handle OPTIONS requests for CORS
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    
    // API routes
    if (pathname === '/api/projects' && req.method === 'GET') {
        // Get all projects or filter by query parameters
        try {
            let sql = 'SELECT * FROM projects';
            const params = [];
            const conditions = [];
            
            if (query.type) {
                conditions.push('type_main_category = ?');
                params.push(query.type);
            }
            
            if (query.province) {
                conditions.push('province = ?');
                params.push(query.province);
            }
            
            if (query.status) {
                conditions.push('status LIKE ?');
                params.push(`%${query.status}%`);
            }
            
            if (query.keyword) {
                conditions.push('(project_name LIKE ? OR key_features LIKE ?)');
                params.push(`%${query.keyword}%`, `%${query.keyword}%`);
            }
            
            if (conditions.length > 0) {
                sql += ' WHERE ' + conditions.join(' AND ');
            }
            
            const projects = await db.all(sql, params);
            
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(projects));
        } catch (error) {
            console.error(error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Internal Server Error' }));
        }
    }
    else if (pathname === '/api/projects' && req.method === 'POST') {
        // Import projects from CSV data
        let body = '';
        
        req.on('data', chunk => {
            body += chunk.toString();
        });
        
        req.on('end', async () => {
            try {
                const data = JSON.parse(body);
                
                // Begin transaction
                await db.exec('BEGIN TRANSACTION');
                
                // Insert each project
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
                
                for (const project of data) {
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
                await db.exec('COMMIT');
                
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, message: 'Projects imported successfully' }));
            } catch (error) {
                await db.exec('ROLLBACK');
                console.error(error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Internal Server Error' }));
            }
        });
    }
    else if (pathname.startsWith('/api/projects/') && req.method === 'GET') {
        // Get a specific project by ID
        try {
            const projectId = pathname.split('/')[3];
            
            // Get project data
            const project = await db.get('SELECT * FROM projects WHERE project_id = ?', [projectId]);
            
            if (!project) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Project not found' }));
                return;
            }
            
            // Get project details if available
            const details = await db.get('SELECT content FROM project_details WHERE project_id = ?', [projectId]);
            
            // Try to load markdown file if no details in database
            let markdownContent = null;
            if (!details) {
                try {
                    const markdownPath = path.join(__dirname, 'data', `Comprehensive Research on the ${projectId}.md`);
                    if (fs.existsSync(markdownPath)) {
                        markdownContent = fs.readFileSync(markdownPath, 'utf8');
                    }
                } catch (error) {
                    console.error('Error reading markdown file:', error);
                }
            }
            
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                project,
                details: details ? details.content : markdownContent
            }));
        } catch (error) {
            console.error(error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Internal Server Error' }));
        }
    }
    else if (pathname === '/api/markdown' && req.method === 'POST') {
        // Save markdown content for a project
        let body = '';
        
        req.on('data', chunk => {
            body += chunk.toString();
        });
        
        req.on('end', async () => {
            try {
                const data = JSON.parse(body);
                const { projectId, content } = data;
                
                // Validate data
                if (!projectId || !content) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Project ID and content are required' }));
                    return;
                }
                
                // Check if project exists
                const project = await db.get('SELECT 1 FROM projects WHERE project_id = ?', [projectId]);
                
                if (!project) {
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Project not found' }));
                    return;
                }
                
                // Save content to database
                await db.run(`
                    INSERT OR REPLACE INTO project_details (project_id, content, last_updated)
                    VALUES (?, ?, datetime('now'))
                `, [projectId, content]);
                
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true }));
            } catch (error) {
                console.error(error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Internal Server Error' }));
            }
        });
    }
    else if (pathname === '/api/csv-import' && req.method === 'POST') {
        // Import projects from uploaded CSV file
        let body = '';
        
        req.on('data', chunk => {
            body += chunk.toString();
        });
        
        req.on('end', async () => {
            try {
                // Parse the CSV data and save to database
                // (This would require a proper CSV parser and handling file uploads)
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true }));
            } catch (error) {
                console.error(error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Internal Server Error' }));
            }
        });
    }
    else {
        // Unknown API endpoint
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not Found' }));
    }
}

const server = http.createServer(async (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    
    // Handle API requests
    if (pathname.startsWith('/api/')) {
        return handleApiRequest(req, res, parsedUrl);
    }
    
    // Static file handling (keep existing code)
    let filePath = req.url === '/' ? '/index.html' : req.url;
    filePath = path.join(__dirname, filePath);
    
    // Get the file extension
    const extname = path.extname(filePath);
    
    // Set the content type based on the file extension
    const contentType = MIME_TYPES[extname] || 'application/octet-stream';
    
    // Read the file
    fs.readFile(filePath, (err, content) => {
        if (err) {
            // If the file doesn't exist, return 404
            if (err.code === 'ENOENT') {
                console.log(`File not found: ${filePath}`);
                res.writeHead(404);
                res.end('404 File Not Found');
                return;
            }
            
            // For other errors, return 500
            console.error(`Error reading file: ${err}`);
            res.writeHead(500);
            res.end('500 Internal Server Error');
            return;
        }
        
        // If the file exists, send it
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content);
    });
});

// Initialize database and start server
(async function() {
    await initializeDb();
    
    server.listen(PORT, '0.0.0.0', () => {
        console.log(`Server running at http://0.0.0.0:${PORT}/`);
        console.log(`Press Ctrl+C to stop the server.`);
    });
})();

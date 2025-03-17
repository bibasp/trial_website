# Simple HTTP server for running the Nepal Infrastructure Projects website
# Python version (no Node.js required)

import sys
import os

# Check Python version
if sys.version_info[0] < 3:
    # Python 2
    import SimpleHTTPServer
    import SocketServer
    
    PORT = 8000
    Handler = SimpleHTTPServer.SimpleHTTPRequestHandler
    httpd = SocketServer.TCPServer(("", PORT), Handler)
    
    print("\n" + "="*60)
    print("Nepal Infrastructure Projects Website Server")
    print("="*60)
    print("\nServer running at http://localhost:{0}".format(PORT))
    print("Open your browser and navigate to the URL above")
    print("\nPress Ctrl+C to stop the server.\n")
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped.")
        httpd.server_close()
else:
    # Python 3
    import http.server
    import socketserver
    
    PORT = 8000
    Handler = http.server.SimpleHTTPRequestHandler
    
    # Add MIME type for CSV files
    Handler.extensions_map['.csv'] = 'text/csv'
    
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print("\n" + "="*60)
        print("Nepal Infrastructure Projects Website Server")
        print("="*60)
        print("\nServer running at http://localhost:{0}".format(PORT))
        print("Open your browser and navigate to the URL above")
        print("\nPress Ctrl+C to stop the server.\n")
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer stopped.")

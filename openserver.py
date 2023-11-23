# Open localhost server on port 1337

import http.server

PORT = 1337
server_address = ("", PORT)

server = http.server.HTTPServer
handler = http.server.CGIHTTPRequestHandler
handler.cgi_directories = ["/"]
print("Server running on port", PORT)
httpd = server(server_address, handler)

httpd.serve_forever()


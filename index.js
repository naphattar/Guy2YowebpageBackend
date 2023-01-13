const http = require('http');
const app = require('./app');
const server = http.createServer(app);

const port = process.env.PORT || process.env.API_PORT;

server.listen(port,() =>{
    console.log(`Server is running on port ${port}`);
});
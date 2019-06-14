const app = require("./backend/app");
const http = require("http");

const port = "3000";
const server = http.createServer(app);

server.listen(port);
console.log(`El servidor esta andando correctamente en el puerto ${port}`)

import http from "node:http";

const server = http.createServer((req, res) => {
  console.log("Server is running");
});

server.listen("3333");

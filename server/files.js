const path = require("path");
const connect = require("connect");
const serveStatic = require("serve-static");

const port = process.env.PORT || 80;

function startFileServer () {
    const filePath = path.join(__dirname, "../client");
    connect()
        .use(serveStatic(filePath))
        .listen(port, () => {
            console.log("Server running on http://localhost");
        });
}

module.exports = {
    startFileServer,
};

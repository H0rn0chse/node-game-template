const path = require("path");
const connect = require("connect");
const serveStatic = require("serve-static");

function startFileServer () {
    const filePath = path.join(__dirname, "../client");
    connect()
        .use(serveStatic(filePath))
        .listen(80, () => {
            console.log("Server running on http://localhost");
        });
}

module.exports = {
    startFileServer,
};

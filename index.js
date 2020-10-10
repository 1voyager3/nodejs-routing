const fs = require("fs");
const http = require("http");

console.log("start");

http
    .createServer((request, response) => {
        if (request.url.startsWith("/public/")) {
            let filePath = request.url.substr(1);

            fs.readFile(filePath, (err, data) => {
                if (err) {
                    response.statusCode = 404;
                    response.end("Not Found");
                } else {
                    const matchText = filePath.match(/\.(js|css)$/);
                    const matchImage = filePath.match(/\.(js|css)$/);

                    if (matchText) {
                        response.setHeader("Content-Type", `text/${matchText[1]}`);
                    } else if (matchImage) {
                        response.setHeader("Content-Type", `text/${matchImage[1]}`);
                    }
                    response.end(data);
                }
                return;
            });
        } else {
            getPage(request.url, response);
        }
    })
    .listen(8888);

const getPage = (name, response, statusCode = 200) => {
    if (name === "/") {
        name = "index";
    }

    fs.readFile(`pages/${name}.html`, "utf8", (err, content) => {
        if (!err) {
            fs.readFile("layouts/default.html", "utf8", (err, layout) => {
                if (err) throw err;

                layout = layout.replace(/\{\{get content\}\}/g, content);

                let title = content.match(/\{\{set title "*(.*?)"\}\}/);
                if (title) {
                    layout = layout.replace(/\{\{get title\}\}/g, title[1]);

                    layout = layout.replace(/\{\{set title ".*?"\}\}/, '');
                }

                fs.readFile("elems/menu.html", "utf8", (err, menu) => {
                    if (err) throw err;

                    layout = layout.replace(/\{\{get menu\}\}/g, menu);

                    fs.readFile("elems/footer.html", "utf8", (err, footer) => {
                        if (err) throw err;

                        layout = layout.replace(/\{\{get footer\}\}/g, footer);

                        response.setHeader("Content-Type", "text/html");
                        response.statusCode = statusCode;
                        response.write(layout);
                        response.end();
                    });
                });
            });
        } else {
            if (statusCode !== 404) {
                getPage("404", response, 404);
            } else {
                throw err;
            }
        }
    });
};

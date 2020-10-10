const fs = require("fs");
const http = require("http");

console.log("start");

http
  .createServer((request, response) => {
    if (request.url.endsWith(".css")) {
      let cssFile = request.url.slice(1);

      fs.readFile(cssFile, (err, data) => {
        if (err) throw err;

        response.setHeader("Content-Type", "text/css");
        response.statusCode = 200;
        response.write(data);
        response.end();
      });
    } else if (request.url.endsWith(".js")) {
      let jsFile = request.url.slice(1);

      fs.readFile(jsFile, (err, data) => {
        if (err) throw err;

        response.setHeader("Content-Type", "text/javascript");
        response.statusCode = 200;
        response.write(data);
        response.end();
      });
    } else if (request.url.endsWith(".jpg")) {
      let jpgFile = request.url.slice(1);

      fs.readFile(jpgFile, (err, data) => {
        if (err) throw err;

        response.setHeader("Content-Type", "image/jpg");
        response.statusCode = 200;
        response.write(data);
        response.end();
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

  fs.readFile(`pages/${name}.html`, "utf8", (err, data) => {
    if (!err) {
      fs.readFile(`elems/menu.html`, "utf8", (err, menu) => {
        if (err) throw err;

        data = data.replace(/\{\{menu\}\}/g, menu);

        fs.readFile(`elems/footer.html`, "utf8", (err, footer) => {
          if (err) throw err;

          data = data.replace(/\{\{footer\}\}/g, footer);

          response.setHeader("Content-Type", "text/html");
          response.statusCode = statusCode;
          response.write(data);
          response.end();
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


const http = require('http');
const fs = require('fs');
const path = require('path');

hostname = 'localhost';
port = 8080;

function write(res, code, message) {
    res.setHeader('Content-Type', 'text/html');
    res.statusCode = code;
    res.end(message);
}

const server = http.createServer((req,res) => {
    console.log(req.headers);
    if(req.method == 'GET'){
        url = 'index.html';
        if(req.url != '/'){
            url = req.url;
        }

        if(path.extname(url) == '.html'){
            urlPath = path.resolve(path.join(__dirname,'public',url));
            fs.exists(urlPath, (exits) => {
                if(!exits){
                    write(res, 404, 'file not found');
                    return;
                }
               fs.createReadStream(urlPath).pipe(res);
            });
        }
        else {
            write(res, 404, 'unsupported extension')
        }
    }
    else{
        write(res, 501, 'not a get requrest');
    }
});
server.listen(port, hostname, ()=> {
    console.log("server is running");
});
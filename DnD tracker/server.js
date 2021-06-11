const http = require('http');
const filesys = require('fs');
const CAPI = require('.\api.js'); 
const DEBUG = true; 
//THIS SHOULD ALWAYS BE FALSE IN PROD ENVIRMENTS
const favico = "/favicon.ico"; // un used if debug is set to false is used to prevent a 404 error in the chrome console 
const __DOCROOT__ = process.argv[1].substring(0, process.argv[1].length - 9);
/// a hack to use the process to get the folder that the server.js is in to use as the doc root
/// todo make it so that you can add an offest file to this to allow to pas in a doc file. 

var port = process.env.PORT || 1337;
const MIME_TYPES = {
    js: "text/javascript",
    html: "text/html",
    json: "application/json"
}
//MIME types for the allowed files to load
console.log(`server running on port:${port}`)
//oput to CLI to allow user to know that the server is open 
http.createServer(function (req, res) { // open the server
    let url = req.url; // store the requested url [used to load the file]
    if (url[url.length-1] == "/") {
        url += "index.html"; // if the url ends in "/" then add index.html to the url this alows the server to act more like an appache server
    }
    let get = url.split('?')[1];
    url = url.split('?')[0]; 
    CAPI.API(req, get); 
    // the GET method appends its pramiters to the end of the file name.
    //in order to properly direct from a form tag with its method set to GET you have to slice on get this breaks if the file name has a ? in it
    // however I think this is improper and not allowed on most systems anyway
    let file_end = url.split('.')[url.split('.').length - 1].toLowerCase(); 
    let type = MIME_TYPES[file_end];
    //MIME type reslution
    // split the file_end and type vars in two so I throw an error if the type is not in the defined MIME object 
    if (DEBUG && url == favico) {
        res.writeHead(200, { 'Content-Type': 'text/plain'});
    }
    // used for if you don't have a favico and want to avoid the 404 as a js error on Chrome and FF
    //THIS SHOULD NOT BE USED IN PROD EVIROMENTS
    if ((DEBUG && url != favico) || !DEBUG) {
        filesys.readFile(__DOCROOT__ + url, function (err, data) {
            if (data && type) { //if there's data and the type is not null
                res.writeHead(200, { 'Content-Type': type });
                res.write(data);
                res.end();
                return;
               
           } else if (err) {
               res.writeHead(500, { 'Content-Type': 'text/html' });
               res.write(`<h1> internal server error:</h1>`);
               res.write(`the srver encountered error number <b style="color:red">${err?.errno | "unknown error"}</b> while trying to load <b style="color:red">${url}</b>`);
               res.end();
               return;
            } else { //default to text/html if the type is unknown
                res.writeHead(500, { 'Content-Type': 'text/html' });
                console.log(`unhandled type:${file_end} if you think that ${fiel_end} should be a standard 
                             then make an issue on my git hub `);
                res.write(data);
                res.end();
                return;
            }
        });
    }

}).listen(port);
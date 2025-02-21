const { readFileSync } = require('fs');
const { createServer } = require('http');

const port = 3000;
const server = createServer()
const users = [];
const records = [];

server.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

server.on('request', handleRequest);

function handleRequest(request, response) {
    if (request.url.startsWith('/api/')) {
        handleApi(request, response);
    } else {
        handleStatic(request, response);
    }

}

function handleStatic(request, response) {
    if (request.url === '/') {
        response.end(readFileSync('./index.html'));
    }
    else if (request.url === '/style.css') {
        response.end(readFileSync('./style.css'));
    }
    else if (request.url === '/script.js') {
        response.end(readFileSync('./script.js'));
    }
    else if (request.url === '/favicon.ico') {
        response.end();
    }
    else {
        response.statusCode = 404;
        response.end();
    }
}

function handleApi(request, response) {
    const { url, method } = request;
    const endpoint = method + url.replace('/api/', '');

    if (endpoint === 'POSTlogin') {
        handleLogin(request, response);
    }
}

async function handleLogin(request, response) {
    const { userName, password } = await getBody(request);
}

async function getBody(request) {
    let body = '';
    for await (const chunk of request) body += chunk;
    try {
        return JSON.parse(body);
    } catch {
        return body;
    }
}


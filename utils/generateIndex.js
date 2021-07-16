const fs = require('fs');
const path = require('path');

const projectBasePath = path.join(__dirname, '../');
const basePath = path.join(projectBasePath, './examples');
const indexPath = path.join(projectBasePath, './index.html');

const examples = [];

function convertToTitleCase(str) {
    const result = str.replace(/([A-Z])/g, " $1");
    return result.charAt(0).toUpperCase() + result.slice(1);
}

function scanPaths(basePath) {
    const files = fs.readdirSync(basePath);
    if (files.includes('index.html')) {
        examples.push({
            path: basePath.replace(projectBasePath, './'),
            name: convertToTitleCase(basePath.split('/').pop())
        })
    } else {
        for (const file of files) {
            scanPaths(path.join(basePath, file));
        }
    }
}

scanPaths(basePath);


const landingPageContent = `
    <html>
        <head>
            <title>Houdini CSS - Examples</title>
        </head>
        <body>
            <h1>
                Examples
            </h1>
            <ul>
                ${examples.map(({path, name}) => `
                    <li>
                        <a href="${path}">${name}</a>
                    </li>
                `)}    
            </ul>
        </body>
    </html>
`

fs.writeFileSync(indexPath, landingPageContent);

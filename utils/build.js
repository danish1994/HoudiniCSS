const fs = require('fs');
const path = require('path');
const hbs = require('handlebars');

const projectBasePath = path.join(__dirname, '../');
const basePath = path.join(projectBasePath, './examples');
const indexPath = path.join(projectBasePath, './index.html');
const templatePath = path.join(projectBasePath, './utils/index.hbs');

function getAllExamples(currentPath) {
    const examples = [];

    function convertToTitleCase(str) {
        const result = str.replace(/([A-Z])/g, " $1");
        return result.charAt(0).toUpperCase() + result.slice(1);
    }

    function scanPaths(currentPath) {
        const files = fs.readdirSync(currentPath);
        if (files.includes('index.html')) {
            examples.push({
                path: currentPath.replace(projectBasePath, './'),
                name: convertToTitleCase(currentPath.split('/').pop())
            })
        } else {
            for (const file of files) {
                scanPaths(path.join(currentPath, file));
            }
        }
    }

    scanPaths(currentPath);
    return examples;
}

function writeToTemplate(examples, templatePath) {
    const template = fs.readFileSync(templatePath, 'utf8');
    const compiled = hbs.compile(template);
    const html = compiled({examples});
    fs.writeFileSync(indexPath, html);
}


const examples = getAllExamples(basePath);
writeToTemplate(examples, templatePath);



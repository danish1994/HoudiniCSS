const fs = require('fs');
const path = require('path');
const hbs = require('handlebars');


class Builder {
    constructor() {
        this.projectBasePath = path.join(__dirname, '../');
        this.distPath = path.join(this.projectBasePath, './dist');
        this.basePath = path.join(this.projectBasePath, './examples');
        this.homeTemplatePath = path.join(this.projectBasePath, './utils/home.hbs');
        this.baseTemplatePath = path.join(this.projectBasePath, './utils/layout.hbs');
    }

    convertToTitleCase(str) {
        const result = str.replace(/([A-Z])/g, " $1");
        return result.charAt(0).toUpperCase() + result.slice(1);
    }

    scanPaths(currentPath) {
        const files = fs.readdirSync(currentPath);
        if (files.includes('index.html')) {
            return {
                path: currentPath,
                href: currentPath.replace(this.projectBasePath, './'),
                name: this.convertToTitleCase(currentPath.split('/').pop())
            };
        } else {
            return files.flatMap((file) => this.scanPaths(path.join(currentPath, file)));
        }
    }

    getAllExamples() {
        return this.scanPaths(this.basePath);
    }

    removeDir(currentPath = this.distPath) {
        if (fs.existsSync(currentPath)) {
            const files = fs.readdirSync(currentPath)

            if (files.length > 0) {
                for (const file of files) {
                    const filePath = path.join(currentPath, file);
                    if (fs.statSync(filePath).isDirectory()) {
                        this.removeDir(filePath)
                    } else {
                        fs.unlinkSync(filePath)
                    }
                }
                fs.rmdirSync(currentPath)
            } else {
                fs.rmdirSync(currentPath)
            }
        }
    }

    initBuild() {
        fs.mkdirSync(this.distPath);
    }

    copyFile(from, to) {
        fs.writeFileSync(to, fs.readFileSync(from));
    }

    writeExampleToDist(example) {
        const {path: currentPath, name, href} = example;
        const body = fs.readFileSync(path.join(currentPath, 'index.html'));
        const scripts = [fs.readFileSync(path.join(currentPath, 'script.js'))];
        const styles = [fs.readFileSync(path.join(currentPath, 'style.css'))];
        const outputPath = path.join(this.distPath, href);

        if (!fs.existsSync(outputPath)) {
            fs.mkdirSync(outputPath, {
                recursive: true
            });
        }

        this.writeToLayout({
            body,
            scripts,
            styles,
            name
        }, path.join(outputPath, 'index.html'));

        fs
            .readdirSync(currentPath)
            .filter((file) => {
                return !['index.html', 'script.js', 'style.css'].includes(file)
            })
            .map((file) => this.copyFile(path.join(currentPath, file), path.join(outputPath, file)));
    }

    writeToHome(examples) {
        const template = fs.readFileSync(this.homeTemplatePath, 'utf8');
        const compiled = hbs.compile(template);
        const body = compiled({examples});
        this.writeToLayout({body}, path.join(this.distPath, './index.html'));
    }

    writeToLayout(context, outputPath) {
        const template = fs.readFileSync(this.baseTemplatePath, 'utf8');
        const compiled = hbs.compile(template);
        const html = compiled(context);
        fs.writeFileSync(outputPath, html);
    }

    run() {
        this.removeDir();
        this.initBuild();

        const examples = this.getAllExamples();
        for (const example of examples) {
            this.writeExampleToDist(example);
        }

        this.writeToHome(examples);
    }
}

const builder = new Builder();
builder.run();

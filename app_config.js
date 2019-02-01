// 定义多页 app 模型
const path = require('path');
const fs = require('fs');

const output_dir = path.join(__dirname, 'dist');
const base_dir = path.join(__dirname, 'src');
const pages_dir = path.join(base_dir, 'pages');
// 如果判断一个目录是页面
// 1. 在 pages 目录下
// 2. 含有main.js
// 如何生成页面的 html
// 1. 如果有index.html 就用这个
// 2. 如果没有就取配置的def_html_template位置
// 3. 还没有的话，就系统默认生成
// 默认的HTML模板文件,如果不为页面指定的话，那么就使用这个
let def_html_template = path.join(__dirname, 'index.html');

if(!fs.existsSync(def_html_template)) {
    def_html_template = '';
}

function makeupEntry() {
    return makeupHtml().reduce((ret, item) => {
        ret[item.name] = item.js;
        return ret;
    }, {});
}

function makeupHtml() {
    let files = getEntryFiles(pages_dir);

    return files.map(item => {
        let cfg = {
            name: path.relative(base_dir, item.js).replace(/^(\.\/)|(\.js)$/, ''),
            js: item.js,
            html_out: item.js.replace(/\/src/, '/dist').replace(/main\.js$/, 'index.html')
        };

        if(item.html || def_html_template) {
            cfg.html = item.html || def_html_template;
        }

        return cfg;
    });
}

function getEntryFiles(dir) {
    getEntryFiles._list = getEntryFiles._list || [];

    let page = getPage(dir);

    if (page) {
        getEntryFiles._list.push(page);
    }

    fs.readdirSync(dir).forEach(item => {
        let fpath = path.join(dir, item);
        if (fs.statSync(fpath).isDirectory()) {
            let page = getPage(fpath);
            if (page) {
                getEntryFiles._list.push(page);
            }

            getEntryFiles(fpath);
        }
    });

    return getEntryFiles._list;
}

function getPage(dir) {
    let htmlPath = path.join(dir, 'index.html');
    let jsPath = path.join(dir, 'main.js');
    jsPath = fs.existsSync(jsPath) ? jsPath : null;
    htmlPath = fs.existsSync(htmlPath) ? htmlPath : null;

    return jsPath ? { js: jsPath, html: htmlPath } : null;
}

exports.entry = makeupEntry();
exports.html = makeupHtml();


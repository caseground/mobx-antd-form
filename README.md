# webpack_template
常用 webpack 配置模板。基于最新的 webpack4, babel7。

# babel 业务配置

此配置适合业务，不适合打代码库。业务配置求最小体积。最小化的处理 babel 的 polyfill，减少 helper 的样板代码。

1. 把 env preset 的 useBuiltIns 设置为 usage，来自动在代码中插入需要的 polyfill。
2. 通过 transfrom-runtime 和 runtime 来处理 helper 函数，避免每个页面都重复配置。

最终配置如下：
```json
{
    "presets": [
        [
            "@babel/preset-env",
            {
                "useBuiltIns": "usage",
                "targets": {
                    "browsers": ["> 0.25%", "not dead", "ie 9", "ios 8", "android 4.4"]
                },
                "modules": "commonjs"
            }
        ]
    ],
    "plugins": [
        [
            "@babel/plugin-transform-runtime",
            {
                "corejs": false,
                "helpers": true,
                "regenerator": true,
                "useESModules": false
            }
        ]
    ]
}

```

# 多页应用模型

### pages 目录结构约定
约定 pages 目录为页面目录。凡是含有`main.js`的目录都将被看成一个页面。所以一个多页的模型可以这样来设计。

```
.
├── components
└── pages
    ├── home
    │   ├── index.html
    │   └── main.js
    └── main.js
```

而单页应用则可以简化为

```
├── components
└── pages
    ├── home
    │   └── index.js
    └── main.js
```

### html 模板约定

采用`html-webpack-plugin`来自动插入`assets`资源。

如果页面下没有`index.html`，将寻找默认的模板`{Project_Root}/index.html`，如果还找不到，将使用`html-webpack-plugin`提供的默认模板。

# common chunk 处理



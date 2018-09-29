/**
 * 基于AMD模块加载器
 */

;(function (root) {
    // 定义模块描述对象
    // 用来描述模块与模块的关系（便于模块加载成功后通过此对象找到依赖此模块的模块A，从而判断A的依赖是否全部完成）
    var moduleDescribes = {};

    // 模块名对象，当模块名是模块标识时候，值就是模块真实地址
    var alias = {};

    var headNode = document.head;

    // 路径分隔符
    var pathSeparator = '/';

    var url = root.location.href;

    var rProtocol = /(https?\:\/{2,}|file\:\/{3}[a-z]\:\/)/i;

    // 初始化baseUrl
    var baseUrl = url.substring(0, url.lastIndexOf(pathSeparator) + 1);

    function init () {
        // 判断当前script节点存不存在data-main属性，如果存在，则开始加载main模块
        var currentScript = getCurrentScript();
        var mainPath = '';

        if (currentScript.hasAttribute('data-main') 
            && (mainPath = currentScript.getAttribute('data-main')) !== '') 
        {
            // 将data-main里的路径合并到baseUrl中
            baseUrl = mergePath(baseUrl, mainPath);

            // 开始加载main模块
            root.use([ basename(mainPath.substring(mainPath.lastIndexOf(pathSeparator) + 1)) ]);
        }
    }

    // 得到文件url中的文件名，包括后缀名
    function basename (url) {
        var lastPathSeparatorIndex = url.lastIndexOf(pathSeparator);
        var basename = url.substring(lastPathSeparatorIndex + 1);

        return basename.indexOf('.') < 1 
          ? basename + '.js' 
          : basename;
    }

    // 创建唯一id，用于表示模块id
    function guid () {
        return 'moduleLoader_'
          + Date.now()
          + (String(Math.random()).slice(-8));
    }

    // 获取当前运行的js文件
    function getCurrentScript () {
        return document.currentScript;
    }

    // 将path和baseUrl合并，生成新的baseUrl
    function mergePath (baseUrl, path) {
        var paths = path.split(pathSeparator).length > 1 
            ? path.split(pathSeparator).slice(0, -1) 
            : path.split(pathSeparator);
        var urlInfo = baseUrl.match(rProtocol);
        var schema = urlInfo[ 1 ];
        var domain = '', finalUrls;

        baseUrl = baseUrl.substring(schema.length);
        
        // 如果是通过http访问，就需要域名
        if (schema === 'http://') {
            domain = baseUrl.substring(0, baseUrl.indexOf(pathSeparator) + 1);
            baseUrl = baseUrl.substring(domain.length);
        }

        finalUrls = [ (schema + domain).slice(0, -1) ];

        if (baseUrl !== '') {
            finalUrls = finalUrls.concat(
                baseUrl[ baseUrl.length - 1 ] === pathSeparator 
                  ? baseUrl.split(pathSeparator).slice(0, -1)
                  : baseUrl.split(pathSeparator)
            );
        }

        paths.forEach(function (p) {
            if (p === '..') {
                finalUrls.pop();
            } else if (p !== '.') {
                finalUrls.push(p)
            }
        });

        return finalUrls.join(pathSeparator) + pathSeparator;
    }

    function load (modules) {
        var node;

        // 遍历加载模块集
        modules.forEach(function (module) {
            // 如果是重复加载则忽略
            if (module.status === 0) {
                return;
            }

            if (module.path.indexOf('.html') > 0) {
                ajaxRequestTmpl(module);
            } else {  
                node = createNode(module);
                headNode.insertBefore(node, headNode.firstChild);
            }
        });
    }

    // 通过xmlhttprequest异步加载html文件
    function ajaxRequestTmpl (module) {
        var xhr = new XMLHttpRequest(), timeoutSes = 3000, abortTimeout, res;

        xhr.timeout = timeoutSes;
        xhr.onreadystatechange = function () {
            clearTimeout(abortTimeout);

            // 如果请求成功
            if (xhr.readyState === 4) {
                // 如果返回类似2xx或304都代表服务器响应成功
                if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
                    module.status = 0;
                    module.export = xhr.responseText;
                } else {
                    module.status = 2;
                    module.export = '';
                }

                xhr.onreadystatechange = null;
                xhr = null;
                complete(module);
            }
        };

        xhr.open('GET', module.path, true);
        xhr.send(null);

        abortTimeout = setTimeout(function () {
            clearTimeout(abortTimeout);
            xhr.abort();
            xhr.onreadystatechange = null;
            xhr = null;
        }, timeoutSes);
    }

    // 创建script进行异步加载js文件
    function createNode (module) {
        var scriptNode = document.createElement('script');
        scriptNode.charset = 'utf-8';
        scriptNode.async = true;
        scriptNode.setAttribute('data-id', module.id);

        scriptNode.onerror = function () {
            scriptNode.onerror = null;
            module.status = 2;
            headNode.removeChild(scriptNode);
            scriptNode = null;

            complete(module);
        };

        scriptNode.onload = function () {
            scriptNode.onload = null;
            headNode.removeChild(scriptNode);
            scriptNode = null;

            complete(module);
        };

        scriptNode.src = module.path;

        return scriptNode;
    }

    // 递归检测被依赖模块的依赖模块及其依赖模块的依赖模块是否全部加载完成，并且调用factory生成export
    function invoke (module) {
        var subModuleDescribe, allLoadSuccess;

        // 如果当前模块是被依赖模块
        if (module.sub) {
            module.sub.forEach(function (ms) {
                // 找到依赖本模块的模块
                subModuleDescribe = findModuleDescribe(function (mod) {
                    return mod.id === ms;
                });

                allLoadSuccess = subModuleDescribe.deps.every(function (mod) {
                    return mod.status !== 1;
                });

                // 如果依赖的模块全部加载完成，则再一次递归的
                if (allLoadSuccess) {
                    moduleArgs = subModuleDescribe.deps.map(function (mod) {
                        return mod.export;
                    });

                    subModuleDescribe.status = 0;

                    subModuleDescribe.export = subModuleDescribe.factory 
                      ? subModuleDescribe.factory.apply(null, moduleArgs)
                      : void 0;

                    invoke(subModuleDescribe);
                }
            });
        }
    }

    // 模块加载完成，包括define执行完毕
    // 检测该模块是否被依赖，如果被依赖则检测所有依赖是否加载完成，如果完成则调用依赖该模块的factory
    function complete (module) {
        var allLoadSuccess = false, subModuleDescribe, moduleArgs;

        if (module.status === 3) {
            module.export = void 0;
            return;
        }
        
        // 检测模块是否有依赖，如果没有依赖则直接调用factory生成export
        if (!module.deps.length) {
            module.status = 0;

            if (module.factory) {
                module.export = module.factory();
            } 

            invoke(module);
        }
    }

    // 查找模块描述对象
    function findModuleDescribe (name) {
        var key, module;
        var sourceName = name;

        typeof name !== 'function' && (name = function (n) { return sourceName === n.name });

        for (key in moduleDescribes) {
            if (name(module = moduleDescribes[ key ])) {
                return module;
            }
        }
    }

    // 合并alias
    function mergeAlias (aliasOptions) {
        for (var key in aliasOptions) {
            alias[ key ] = aliasOptions[ key ];
        }
    }

    // 开始加载模块
    root.use = function (deps, factory) {
        var readyLoadModules = [];
        var moduleName, depModuleName, depModulePath, module;
        var isAlias, key, depKey;

        !Array.isArray(deps) && (deps = [ deps ]);
        moduleName = baseUrl + basename(getCurrentScript().getAttribute('src'));
        key = getCurrentScript().getAttribute('data-id');

        deps.forEach(function (dep) {
            isAlias = dep in alias;
            depModuleName = isAlias 
              ? dep 
              : baseUrl + dep
            depModulePath = isAlias 
              ? baseUrl + alias[ dep ]
              : depModuleName;
            depKey = guid();

            // 如果未加载或者是加载完成后重新加载
            if (!(depKey in moduleDescribes)
                || moduleDescribes[ depKey ].status === 0 ) 
            {
                module = readyLoadModules[ readyLoadModules.length ] = moduleDescribes[ depKey ] = {
                    sub: [ key ],
                    id: depKey,
                    name: depModuleName,
                    path: depModulePath,
                    status: 1, // 表示当前模块状态  0: 加载成功 | 1: 加载中 | 2: 加载失败
                    deps: [],
                    export: void 0,
                    factory: void 0
                };
            } 
        });

        module = findModuleDescribe(function (mod) { return mod.id === key });

        // 如果该模块被依赖，并且该模块内部代码中继续使用use加载其他模块
        if (module && module.status === 1) {
            module.deps = readyLoadModules;
            module.factory = factory;
        } 
        // 如果是第一次加载该模块或加载完成之后，重新加载
        else {
            // 重新加载
            if (module && module.status === 0) {
                module.status = 1;
                module.export = void 0;
                module.deps = readyLoadModules;
                module.factory = factory;    
            } 
            // 第一次加载
            else {
                moduleDescribes[ moduleName ] = {
                    id: key,
                    name: moduleName,
                    path: moduleName,
                    status: 1,
                    export: void 0,
                    deps: readyLoadModules,
                    factory: factory 
                };
            }    
        }

        // 开始加载未加载过或加载失败的模块
        load(readyLoadModules);
    };

    // 配置baseUrl和paths(模块标识对应模块路径)
    root.use.config = function (options) {
        baseUrl = mergePath(baseUrl, options.baseUrl || '');

        mergeAlias(options.paths || {});
    };

    root.define = function (id, deps, factory) {
        var moduleName, currentModuleDescribe;
        var depModuleName, depModulePath, sub, depModuleDescribes;
        var isAlias, key;
        
        // 如果是匿名模块
        if (typeof id !== 'string') {
            // 如果存在依赖
            if (Array.isArray(id)) {
                factory = deps;
                deps = id;
            } 
            // 如果不存在依赖
            else if (typeof id === 'function') {
                factory = id;
                deps = [];
            }
        } 
        // 如果是命名模块
        else {
            if (typeof deps === 'function') {
                factory = deps;
                deps = [];  
            }
        }

        id = getCurrentScript().getAttribute('data-id');
        currentModuleDescribe = findModuleDescribe(function (mod) { return mod.id === id });
        
        // 如果存在依赖，则先将依赖组织成模块描述对象
        if (!!deps.length) {
            depModuleDescribes = deps.map(function (depId) {
                isAlias = depId in alias;
                sub = currentModuleDescribe.id;
                depModuleName = isAlias 
                    ? depId
                    : baseUrl + depId
                depModulePath = isAlias 
                    ? baseUrl + alias[ depId ]
                    : depModuleName;
                key = guid();

                // 如果在define方法中的依赖模块加载过或者还在加载中
                // 处理重复引用或者循环引用
                if (moduleDescribes[ key ] && moduleDescribes[ key ].status === 1) {
                    if (moduleDescribes[ key ].sub.indexOf(sub) < 0) {
                        moduleDescribes[ key ].sub = moduleDescribes[ key ].sub.concat(sub);
                    }

                    return moduleDescribes[ key ];
                } else {
                    return moduleDescribes[ key ] = {
                        id: key,
                        sub: [ id ],
                        name: depModuleName,
                        path: depModulePath,
                        status: 1,
                        export: void 0,
                        deps: [],
                        factory: void 0
                    };
                }
            });

            // 设置依赖
            currentModuleDescribe.deps = depModuleDescribes;

            // 设置factory
            currentModuleDescribe.factory = factory;

            // 开始加载依赖
            load(currentModuleDescribe.deps);
        }
        // 如果没有依赖，则直接调用factory，得到export
        else {
            currentModuleDescribe.deps = [];
            currentModuleDescribe.factory = factory;
        }   
    };

    root.define.amd = true;

    // 加载入口模块，通过入口模块合并成最终的baseUrl
    init();
})(window);
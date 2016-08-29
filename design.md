# 数据模型
## 代理设置
```json
{
    "globalProxy"      : false,
    "enableHttps"      : true,
    "clearCache"       : true,
    "addConsole"       : true,    
    "crossDomain"      : true,
    "appendHtml"       : "追加到response body中的html",
    "proxyPort"        : "8001",
    "proxyConsolePort" : "8002",
    "proxySocketPort"  : "8003"
}
```
### 项目定义
```json
{
    "prjName"      : "",
    "prjId"        : "",
    "prjPath"      : "",
    "active"       : false, //是否激活,只有激活的项目才可以被代理
    "defURL"       : "",
    "prjInterfaces": {  //默认为{}
        "/wc/products": {
            "versions" : {
                "1.0" : {
                    "inputs"  : "",
                    "outputs" : "",
                    "ative"   : false
                }
            },
            "rewriteURL" : {
                "active" : false,
                "url"    : ""
            },
            "rewriteData" : {
                "active" : false,
                "data" : {}
            }
        }
    }
}
```
# api
## 文件操作API
* 读取代理设置（先读取本地文件,然后覆盖默认值）
* 读取项目定义（先读取本地文件,然后覆盖默认值）
* 修改代理设置（读取代理设置,用修改值覆盖读取值）
* 修改项目定义（读取项目定义,用修改值覆盖读取值）
* 保存代理设置（只有设置了值后才保存,文件名:proxy.json）
* 保存项目定义（只有设置了值后才保存,项目定义分项目存储,文件名:/prj-defs/prjId.json）

## web API

# console
启动客户端

# ui
* 设置项目服务地址
* 获取项目接口定义列表
* 指定接口代理地址,默认为本地,也可以设置为其他地址。设置为本地时可以选择本地可用版本。
* 设置代理全局配置（是否全局代理）
* 启动、关闭本地代理
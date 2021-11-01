<p align="center">
  <img width="80" src="https://dev-erp.szhibu.com/static/other/image/user.gif">
</p>


## 简介

本系统引用vue前端框架进行开发，可以自行阅读相关开源代码及相关组件。 它基于 [vue](https://github.com/vuejs/vue) 和 [element-ui](https://github.com/ElemeFE/element)实现。

## 前序准备

你需要在本地安装 [node](http://nodejs.org/) 和 [svn](https://www.visualsvn.com/visualsvn/download/tortoisesvn/)。本项目技术栈基于 [ES2015+](http://es6.ruanyifeng.com/)、[vue](https://cn.vuejs.org/index.html)、[vuex](https://vuex.vuejs.org/zh-cn/)、[vue-router](https://router.vuejs.org/zh-cn/) 、[vue-cli](https://github.com/vuejs/vue-cli) 、[axios](https://github.com/axios/axios) 和 [element-ui](https://github.com/ElemeFE/element)，所有的请求数据都可以使用[Mock.js](https://github.com/nuysoft/Mock)进行模拟，上线后切换到生产接口，提前了解和学习这些知识会对使用本项目有很大的帮助。

## 基础组件文档及例子

基础组件包含(cs-custom-form、cs-custom-pop、cs-custom-table等)常用基础组件，详细请到[案例页面](http://localhost:9527/tform)进行阅读

## 功能

```
- 单点登录 / 单点注销

- 权限验证
  - 页面权限
  - 指令权限
  - 权限配置

- 多环境发布
  - mock dev stage sit demo prod

- 全局功能
  - 动态侧边栏（支持多级路由嵌套）
  - 动态面包屑
  - 快捷导航(标签页)
  - Svg Sprite 图标
  - 本地/后端 mock 数据
  - Screenfull全屏
  - 自适应收缩侧边栏

- 表格
  - 动态表格
  - 内联编辑

- 错误页面
  - 403
  - 404

- 错误日志
```

## 开发

```bash
# 克隆项目svn地址
https://subvs.szhibu.com:1443/svn/ERP2/04Code/client/ERP2/web/erp2-branches/erp2-学习分支

# 进入项目目录
cd project(本地目录)

# 建议不要直接使用 cnpm 安装依赖，会有各种诡异的 bug。可以通过如下操作解决 npm 下载速度慢的问题
npm config set sass_binary_site https://npm.taobao.org/mirrors/node-sass/
npm config set registry http://172.16.1.217:4873

# 安装依赖
npm install

# 启动本地开发环境
npm run dev

# 浏览器访问
http://localhost:9527

# 新员工测试账号
username:new
password:123456
```

## 发布

```bash
# 构建开发环境
npm run build:stage

# 构建测试环境
npm run build:sit

# 构建演示环境
npm run build:demo

# 构建生产环境
npm run build:prod
```

## 其它

```bash
# 预览发布环境效果 + 静态资源分析
npm run preview  --report

# 代码格式检查
npm run lint

# 代码格式检查并自动修复
npm run fix
```

## 前端开发流程视频介绍
[前端开发流程.webm](https://subvs.szhibu.com:1443/svn/ERP2/04Code/client/ERP2/web/erp2-branches/erp2-前端开发流程) 
tips:请拖拽视频到chrome浏览器查看

```bash
# 克隆svn地址
https://subvs.szhibu.com:1443/svn/ERP2/04Code/client/ERP2/web/erp2-branches/erp2-前端开发流程
```

## 前端基础组件文档介绍
[基础组件文档](http://localhost:9527/tform) 
tips:文档特别重要，请认真阅读。

```bash
# 请 npm run dev 打开本地开发环境后进行阅读
http://localhost:9527/tform
```

## 前端代码生成器使用
[erp2.0-代码生成器](https://subvs.szhibu.com:1443/svn/ERP2/04Code/client/ERP2/web/erp2-branches/erp2-代码生成器) 
tips:详细使用请查看检出后的使用说明
```bash
# 克隆svn地址
https://subvs.szhibu.com:1443/svn/ERP2/04Code/client/ERP2/web/erp2-branches/erp2-代码生成器
```

## 项目快速复用克隆

```bash
只需全量拷贝代码后删除对应目录即可。

/src/views为业务代码目录

/src/views下需要保留的目录：
/src/views/demo  示例页面
/src/views/error-page  403错误页面
/src/views/index  主页
其余/src/views目录下的文件删除即可

/src/router/modules为业务路由目录
/src/router/modules下的文件可以全部删除

/src/store/modules为业务数据存储目录
/src/store/modules下需要保留的文件：
/src/store/modules/app.js 应用数据
/src/store/modules/errorLog.js  错误日志数据
/src/store/modules/permission.js  权限配置数据
/src/store/modules/settings.js   应用配置数据
/src/store/modules/tagsView.js  标签数据
/src/store/modules/user.js 用户数据
其余/src/store/modules目录下的文件即可删除

/src/api目录下为应用级程序接口 详细看文件内接口文字描述
```

## Browsers support

Modern browsers and Internet Explorer 10+.

| IE / Edge        | Firefox         | Chrome          | Safari          |
| ---------------- | --------------- | --------------- | --------------- |
| IE10, IE11, Edge | last 2 versions | last 2 versions | last 2 versions |

## License

Copyright (c) 2020-smartFabric-Roman


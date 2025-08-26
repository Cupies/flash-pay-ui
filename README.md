# Flash Pay UI
## 项目简介
Flash Pay UI是一个基于Vue 3和Vite构建的现代化支付系统前端应用。该项目提供了完整的支付解决方案，包括工作台、财务、支付管理、组织架构、公司管理、服务管理和系统设置等功能模块。

## 技术栈
- 前端框架 : Vue 3
- 构建工具 : Vite
- 状态管理 : Pinia
- 路由管理 : Vue Router 4
- UI组件库 : Element Plus
- HTTP请求 : Axios
- 样式预处理器 : Sass
- 其他工具 : js-cookie, moment, nprogress等
## 项目结构
```
flash-pay-ui/
├── .env                     # 环境变量配置
├── .gitignore               # Git忽略文件
├── index.html               # 入口HTML文件
├── package.json             # 项目依赖配置
├── public/                  # 静态资源目录
├── src/                     # 源代码目录
│   ├── App.vue              # 根组件
│   ├── main.js              # 入口文件
│   ├── api/                 # API请求目录
│   ├── assets/              # 静态资源
│   ├── components/          # 公共组件
│   ├── directive/           # 自定义指令
│   ├── filter/              # 过滤器
│   ├── icons/               # 图标资源
│   ├── json/                # JSON数据
│   ├── layout/              # 布局组件
│   ├── permission.js        # 权限控制
│   ├── router/              # 路由配置
│   ├── store/               # 状态管理
│   ├── styles/              # 样式文件
│   ├── utils/               # 工具函数
│   └── views/               # 页面组件
└── vite.config.js           # Vite配置文件
```
## 功能模块
1. 1.登录系统
   - 用户登录
   - 操作登录
2. 2.工作台
   - 系统概览
   - 快捷操作
3. 3.财务模块
   - 财务管理功能
4. 4.支付管理
   - 支付订单管理
   - 交易记录
5. 5.组织架构
   - 部门管理
   - 人员管理
6. 6.公司管理
   - 公司信息
   - 成员管理
7. 7.服务管理
   - 服务列表
   - 服务配置
8. 8.系统设置
   - 系统参数配置
   - 用户权限管理
## 环境配置
1. 1.
   确保已安装Node.js (推荐版本: 16.x+)
2. 2.
   克隆项目到本地
3. 3.
   安装依赖
   ```
   npm install
   ```
## 项目运行
```
npm run dev
```
运行后，访问 http://localhost:3000 即可查看项目。

## 项目构建
```
npm run build
```
构建后的文件会生成在dist目录下，可用于生产环境部署。

## 预览构建结果
```
npm run serve
```
## 其他说明
- 项目使用Element Plus作为UI组件库，提供了丰富的组件支持
- 使用Pinia进行状态管理，替代了传统的Vuex
- 路由分为静态路由和动态路由，动态路由通过权限控制加载
- 项目支持响应式布局，适配不同屏幕尺寸
- 使用Sass预处理器编写样式，支持变量和混合宏

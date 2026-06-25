# 🎓 学生管理系统

一个基于 **React + Koa + SQLite** 的全栈学生管理平台，支持课程管理、学生管理、数据可视化仪表盘和学习总结展示。

> 🔗 GitHub 仓库：[th2313/student-management-system](https://github.com/th2313/student-management-system)

## ✨ 功能特性

- 🔐 **JWT 认证登录** — 安全的用户认证机制，支持 Token 过期与路由守卫
- 📊 **数据可视化工作台** — 使用 ECharts 展示课程统计、学生活跃度、状态分布等图表
- 📚 **课程管理** — 课程的增删改查，支持搜索、分类筛选、状态筛选、多字段排序
- 👥 **学生管理** — 学生的增删改查，支持班级/状态筛选、选课分配（穿梭框）
- 📝 **学习总结** — Markdown 渲染展示，支持 GFM 语法、代码高亮、图片展示
- 🎨 **现代化 UI** — 基于 Ant Design 5，响应式布局，交互体验友好

## 🛠 技术栈

| 层级 | 技术 | 说明 |
|------|------|------|
| **前端框架** | React 18 + TypeScript | 类型安全的组件化开发 |
| **构建工具** | Vite 5 | 极速开发与构建 |
| **UI 组件库** | Ant Design 5 | 企业级 UI 组件 |
| **图表库** | ECharts 6 | 数据可视化 |
| **路由** | React Router 6 | 前端路由与导航守卫 |
| **Markdown** | react-markdown + remark-gfm | Markdown 渲染 |
| **代码高亮** | react-syntax-highlighter | 代码块语法高亮 |
| **HTTP 请求** | Axios | 请求封装与拦截器 |
| **后端框架** | Koa 2 | 轻量级 Node.js 框架 |
| **数据库** | better-sqlite3 | 零配置嵌入式 SQLite |
| **认证** | jsonwebtoken + bcryptjs | JWT 令牌 + 密码哈希 |
| **跨域** | @koa/cors | CORS 支持 |

## 📁 项目结构

```
学生管理系统/
├── client/                     # 前端项目 (React + Vite + TypeScript)
│   ├── src/
│   │   ├── api/                # API 请求封装
│   │   │   ├── auth.ts         #   认证接口
│   │   │   ├── course.ts       #   课程接口
│   │   │   ├── dashboard.ts    #   工作台接口
│   │   │   ├── student.ts      #   学生接口
│   │   │   └── summary.ts      #   学习总结接口
│   │   ├── components/         # 通用组件
│   │   │   ├── Layout.tsx      #   页面布局（侧边栏+顶栏）
│   │   │   └── request.ts      #   Axios 实例与拦截器
│   │   ├── pages/              # 页面组件
│   │   │   ├── Login.tsx       #   登录页
│   │   │   ├── Dashboard.tsx   #   工作台（可视化图表）
│   │   │   ├── Courses.tsx     #   课程管理
│   │   │   ├── Students.tsx    #   学生管理
│   │   │   └── Summary.tsx     #   学习总结
│   │   ├── router/             # 路由配置
│   │   │   └── index.tsx       #   路由表 + 登录守卫
│   │   ├── App.tsx             # 根组件
│   │   ├── main.tsx            # 应用入口
│   │   ├── type.ts             # TypeScript 类型定义
│   │   └── index.css           # 全局样式
│   ├── index.html
│   ├── vite.config.ts
│   └── package.json
│
├── server/                     # 后端项目 (Koa + SQLite)
│   ├── src/
│   │   ├── database/
│   │   │   ├── db.js           #   数据库连接
│   │   │   └── init.js         #   数据库初始化 + Mock 数据
│   │   ├── middleware/
│   │   │   └── auth.js         #   JWT 认证中间件
│   │   ├── routes/
│   │   │   ├── auth.js         #   认证路由
│   │   │   ├── courses.js      #   课程路由
│   │   │   ├── dashboard.js    #   工作台路由
│   │   │   ├── students.js     #   学生路由
│   │   │   ├── summary.js      #   学习总结路由
│   │   │   └── static.js       #   静态资源路由
│   │   ├── utils/
│   │   │   └── response.js     #   统一响应工具
│   │   └── index.js            #   服务入口
│   ├── data/
│   │   ├── homework.db         #   SQLite 数据库文件
│   │   └── summary.md          #   学习总结 Markdown 内容
│   ├── API.md                  # 接口文档
│   └── package.json
│
├── README.md
└── .gitignore
```

## 🚀 快速开始

### 环境要求

- **Node.js** >= 18
- **npm** >= 9

### 安装与启动

```bash
# 1. 克隆仓库
git clone https://github.com/th2313/student-management-system.git
cd student-management-system

# 2. 安装后端依赖
cd server
npm install

# 3. 启动后端服务（端口 3000）
npm run dev

# 4. 新开终端，安装前端依赖
cd client
npm install

# 5. 启动前端开发服务器（端口 5173）
npm run dev
```

启动后访问 **http://localhost:5173** 即可使用。

> **测试账号**：`admin` / `admin123`

### 生产构建

```bash
# 构建前端
cd client
npm run build

# 启动后端（自动托管前端构建产物）
cd server
npm start

# 访问 http://localhost:3000
```

生产环境下，Koa 会托管 `client/dist` 目录的静态文件，只需启动后端即可。

## 📡 API 接口

所有接口均返回统一格式：

```json
{
  "code": 0,
  "msg": "success",
  "data": { ... }
}
```

| 状态码 | 说明 |
|--------|------|
| 0 | 成功 |
| 400 | 请求参数错误 |
| 401 | 未认证或令牌过期 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

> 除登录接口外，所有接口需携带 `Authorization: Bearer <token>` 请求头。

### 核心接口一览

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/auth/login` | 用户登录 |
| GET | `/api/auth/me` | 获取当前用户信息 |
| GET | `/api/dashboard` | 获取工作台统计数据 |
| GET | `/api/courses` | 课程列表（支持搜索/筛选/排序/分页） |
| GET | `/api/courses/categories` | 课程分类列表 |
| GET | `/api/courses/:id` | 课程详情 |
| POST | `/api/courses` | 创建课程 |
| PUT | `/api/courses/:id` | 更新课程 |
| DELETE | `/api/courses/:id` | 删除课程 |
| PATCH | `/api/courses/:id/status` | 切换课程发布状态 |
| GET | `/api/students` | 学生列表（支持搜索/筛选/分页） |
| GET | `/api/students/classes` | 班级列表 |
| GET | `/api/students/:id` | 学生详情 |
| POST | `/api/students` | 创建学生 |
| PUT | `/api/students/:id` | 更新学生 |
| DELETE | `/api/students/:id` | 删除学生 |
| GET | `/api/summary` | 获取学习总结（Markdown） |
| GET | `/api/static/:path` | 静态资源（无需认证） |

> 详细接口文档请查看 [server/API.md](server/API.md)

## 🗄 数据库设计

| 表名 | 说明 |
|------|------|
| `users` | 用户表（管理员账号） |
| `courses` | 课程表（名称/讲师/分类/状态/选课人数等） |
| `students` | 学生表（姓名/学号/班级/联系方式/所选课程等） |
| `learning_records` | 学习记录表（学生/课程/日期/学习时长） |

项目首次启动时会自动创建数据库表并填充 Mock 数据，包含 1 个管理员账号、13 门课程、20 名学生及近 7 天的学习记录。

## 📸 页面截图

| 页面 | 说明 |
|------|------|
| 登录页 | 渐变背景 + 卡片式登录表单 |
| 工作台 | 统计卡片 + ECharts 柱状图/折线图/饼图 |
| 课程管理 | 表格 + 搜索/筛选/排序 + 弹窗表单 |
| 学生管理 | 表格 + 穿梭框选课 + 弹窗表单 |
| 学习总结 | Markdown 渲染 + 代码语法高亮 |

## 📄 License

MIT

---

> 本项目为学习用途的全栈实践项目，适合作为前端/全栈开发的参考案例。

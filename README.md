## React + Express 博客项目



### 项目演示地址：

<http://94.191.80.37:55122/>

#### 项目启动方法：

- 使用npm install安装依赖包。
- 后台需有Mongodb服务，默认端口，无用户名密码，配置见service文件夹下的service2.js。
- 创建数据库reactf1,创建user,article,message集合。
- 使用npm start即可启动。

#### 项目部署方法：

- 使用npm run build生成build文件夹。
- 用NGINX配置静态文件目录为build文件夹，代理为后台express端口。配置404返回首页。

#### 项目技术栈：

- react,react-redux,express

#### 项目收获：

- 熟悉react及react-redux基本操作。

- 熟悉antd各种组件样式与属性。

- 熟悉前端发送后台进行CRUD流程。

- 熟悉富文本编辑器，上传文件的使用。

- 熟悉express基本操作。

- 熟悉Nginx部署配置操作。

- 业务逻辑方面实现了登录注册，发文章，删文章，权限判断，评论，修改昵称头像，收藏点赞等功能。

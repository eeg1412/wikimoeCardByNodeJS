# MEVN
自用MEVN

Mongodb+Express+Vue3+NodeJS

使用前请创建.env文件

普通使用:
```
DB_HOST=mongodb://localhost:27017/mevntest
JSON_LIMT=1mb
URLENCODED_LIMT=1mb
JWT_SECRET_KEY=test
```

docker:
```
DB_HOST=mongodb://mongo/mevntest
JSON_LIMT=1mb
URLENCODED_LIMT=1mb
JWT_SECRET_KEY=test
```

安装依赖
```
npm install
```

安装前端依赖
```
cd client
```
```
npm install
```

编译前端页面
```
npm run build
```

返回根目录运行
```
npm run start
```

访问127.0.0.1:3000即可查看页面

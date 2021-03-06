## 为什么要阿里云oss？
静态文件单独部署，可以减小服务器压力，针对静态文件做cdn缓存，浏览器缓存等等。

## 用途
#### 用于把前端静态资源上传到阿里云oss
## 特点

#### 1.上传文件的日志输出

#### 2.可配置的oss目录，可选择本地文件上传目录与远程上传目录

#### 3.上传异常重试机制

#### 4.可配置不同目录和命令，上传不同环境，如开发，测试，预生产，生产
## 使用

### 以vue为例

#### 1.编写js文件 config/upload.js
```
const { OssUpload } = require("./index");
const path = require("path");
const local = path.join(__dirname, "./test");
const oss = new OssUpload({
  region: "",
  accessKeyId: "",
  accessKeySecret: "",
  bucket: "",
  matchDir: ["node_modules"], //忽略上传的文件夹
  ossDir: "", //远程上传目录
  localDir: local //本地上传目录
});
//先删除
oss.removeDir().then(() => {
  oss.getFileTree(local);
});

//or
oss.getFileTree(local);

```
#### 2.在package.json 中新增命令 
```
  {
    "scripts":{
        "build": "node build/build.js",
        "upload-files":"node config/upload.js",
        "build-upload":"npm run build && npm run upload-files"
    }
  }
```
#### 3.执行  npm run build-upload  打包后上传oss

#### 4.结果图片
![1.jpg](https://github.com/fengyaogit123/oss-upload-fy/blob/master/001.png)

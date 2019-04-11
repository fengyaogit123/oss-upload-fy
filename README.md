## 用于把前端静态资源上传到阿里云oss

## 特点

### 1.上传文件的日志输出

### 2.可配置的oss目录，可选择本地文件上传目录与远程上传目录

### 3.上传异常重试机制

### 以vue为例

### 1.编写js文件 config/upload.js
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
### 2.在package.json 中新增命令 打包后就会上传oss
```
  {
    "scripts":{
        "build": "node build/build.js",
        "upload-files":"node config/upload.js",
        "build-upload":"npm run build && npm run upload-files"
    }
  }
```

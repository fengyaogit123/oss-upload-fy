## 用于把前端静态资源上传到阿里云oss
### 阿里云OSS对象存储 上传文件夹下静态资源
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
### 上传文件
```
oss.uploadFile(key, value);
```

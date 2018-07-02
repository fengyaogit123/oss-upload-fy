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
oss.removeDir().then(() => {
  oss.getFileTree(local);
});

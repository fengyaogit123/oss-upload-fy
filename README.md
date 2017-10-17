# oss-upload-fy
# demo
let {OssUpload} = require('oss-upload-fy')
let oss = new OssUpload({
    region: '',
    accessKeyId: '',
    accessKeySecret: '',
    bucket: '',
    matchDir: ['node_modules'],//忽略上传的文件夹 
    ossDir: '',//远程上传目录
    localDir: __dirname + '/static',//本地上传目录
});
oss.getFileTree(__dirname + '/app-up/static');

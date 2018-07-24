const co = require('co');
const OSS = require('ali-oss');
const fs = require('fs');
const colors = require('colors');
const path = require('path');
colors.setTheme({
    silly: 'rainbow', input: 'grey', verbose: 'cyan', prompt: 'red', info: 'green', data: 'blue', help: 'cyan',warn: 'yellow',debug: 'magenta',error: 'red'
});
class OssUpload {
    constructor(op) {
        op = Object.assign({
            region: '',
            accessKeyId: '',
            accessKeySecret: '',
            bucket: '',
            matchDir: ['node_modules'],//忽略的文件夹
            fileTree: { dir: __dirname },
            fileLength: 0,//所有file
            upFileLength: 0,//上传成功file
            ossDir: '',//远程上传目录
            localDir: '',//本地上传目录 绝对路径
            domain:"",//上传时展示路径
        }, op);
        let { region, accessKeyId, accessKeySecret, bucket } = op;
        this.client = new OSS({
            region,
            accessKeyId,
            accessKeySecret,
            bucket
        });
        this.bucket = op.bucket,
        this.matchDir = op.matchDir,//忽略的文件夹
        this.fileTree = op.fileTree,
        this.fileLength = op.fileLength,//所有file
        this.upFileLength = op.upFileLength,//上传成功file
        this.ossDir = op.ossDir,//远程上传目录
        this.localDir = op.localDir;//本地上传目录
        this.domain = op.domain
    }
    removeDir() {
        return new Promise((re, rj) => { 
            const me = this;
            co(function* () {
                console.log(me.ossDir)
                const result = yield  me.client.list({
                    prefix: me.ossDir
                });
                if (result.objects && result.objects.length > 0) {
                    yield me.client.deleteMulti(result.objects.map(({ name }) => name));
                    result.objects.map(({ name }) => { 
                        console.log(`删除文件：${name}`.green)
                    })
                }    
                re()
            }).catch(err => { 
                rj(err)
            })
        })
    }
    async  getFileTree(root, rootObject) {
        try {
            if (!this.isString(root)) { throw new Error("root is string!") }
            let files = await this.readdir(root);
            rootObject = rootObject || { dir: root };
            for (let i in files) {
                let dir = `${root}\\${files[i]}`;
                let fileName = files[i];
                if (this.isFile(dir)) {
                    this.fileLength++;
                    rootObject.files = rootObject.files || [];
                    rootObject.files.push({
                        type: 'file',
                        dir: dir,
                        name: fileName
                    });
                    this.uploadFile(this.ossDir + dir.replace(this.localDir, '').replace(/\\/ig, '/'), dir);
                    continue;
                }
                if (this.matchDir.indexOf(fileName) == -1) {
                    rootObject.dirs = rootObject.dirs || [];
                    rootObject.dirs.push({
                        type: 'dir',
                        dir: dir,
                        name: fileName
                    });
                    await this.getFileTree(dir, rootObject.dirs[rootObject.dirs.length - 1]);
                }
            }
        } catch (e) {
            console.log(e)
        }
    }
    async  readdir(path) {
        return new Promise((re, rej) => {
            fs.readdir(path, function (error, files) {
                if (error) { rej(error); }
                re(files);
            });
        })
    }
    uploadFile(key, value, len) {
        len = len ? len : 3;//重试次数
        let title = this.domain?this.domain+`/${key}`:`www.${this.bucket}.com}/${key}`;
        let titleLen = 100 - title.length;
        let Msg = (type) => `${title}${'-'.repeat(titleLen <= 0 ? 1 : titleLen)} ${type}  ${++this.upFileLength}/${this.fileLength}`[type == 'success' ? 'green' : 'error'];
        let ErrorMsg = (len) => len != 0 ? `${title} 上传失败，重新上传中 还有 ${len} 次`.error : `${title} 上传失败，请手动上传或重试!`.error;
        let me = this;
        co(function* () {
            yield me.client.put(key, value);
            console.log(Msg('success'));
        }).catch((err) => {
            len--;
            console.log(ErrorMsg(len));
            console.log(err);
            len > 0 && this.uploadFile(key, value, len);
        });
    }
    isFile(path) {
        return fs.statSync(path).isFile();
    }
    isDir(path) {
        return fs.statSync(path).isDirectory();
    }
    isString(str) {
        if (!str || typeof str !== 'string') { return false }
        return true;
    }
}
exports.OssUpload = function (op) {
    return new OssUpload(op);
};


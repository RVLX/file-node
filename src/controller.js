
const path = require('path');
const router = require('koa-router')(); 
const baseDir = path.resolve(__dirname, '../', 'publish');
const koaBody = require('koa-body');
const fs = require('fs/promises');
const fsSync = require('fs');
function writeDataRes (stream, data) {
    return new Promise((resolve, reject)=> {
        stream.write(data, (status)=>{
            resolve()
        });
    })
}
router.post('/merge',  koaBody(), async (ctx)=> {
    let {length, hash, name} = ctx.request.body;
    let hashDir = path.join(baseDir, '/', hash)
    let index = 0;
    let extname = path.extname(name)
    let filename = hashDir + extname;
    let writeStream = fsSync.createWriteStream(filename, {flags: 'a+'});
    console.time('steam')
    while(index < length) {
        let filename = path.resolve(hashDir, hash + '-' + index);
        // fsSync.createReadStream(filename).pipe(writeStream)

        let data = await fs.readFile(filename);
        await writeDataRes(writeStream, data)
        index++
        console.log('steam' + index)
    }
    console.timeEnd('steam')
    ctx.body = {
        status: 2000
    };
})
router.post('/check', koaBody(), async (ctx)=> {
    let {hash, length, name} = ctx.request.body;
    let extname = path.extname(name);
    if(hash) {
        let currentDir = baseDir + '/' + hash;
        let hashFilename = currentDir + extname;
        try {
            await fs.stat(hashFilename);
            return ctx.body =  {
                isExist: true
            }
        } catch (error) {
            // console.log(error)
        }
        try {
            await fs.stat(currentDir)
            let fileNameList = await fs.readdir(currentDir);
            console.log(fileNameList)
            return ctx.body = {
                isExist: true,
                list: fileNameList
            }
        } catch (error) {
            // console.log(error)
        }

        ctx.body = {
            isExist: false,
        }
    }
    
})
router.post('/', koaBody({
    multipart: true
}), async(ctx)=> {
    const { hash, fileHash } = ctx.request.body;
    console.log( hash, fileHash)
    const { chunk } = ctx.request.files;
    const fileDir = path.join(baseDir, '/',  hash);
    try {
        await fs.stat(fileDir);
    } catch (error) {
        console.log('Errpr', error)
        await fs.mkdir(fileDir)
    }
    const filename = path.join(fileDir, '/', fileHash)
    try {
        await fs.stat(filename);
    } catch (error) {
        fsSync.createReadStream(chunk.path).pipe(fsSync.createWriteStream(filename));
    }
    ctx.body = {
        status: 2000
    };
})
module.exports = router;
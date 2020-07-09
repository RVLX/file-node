const fs = require('fs')
module.export = {
    readFile: function(path, options = {}) {
        return new Promise((resolve, rejected)=> {
            fs.readFile(path, options, (err, data)=> {
                if(err) rejected(err);
                resolve(data)
            })
        })
    }
}
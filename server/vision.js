const savePng = (path, picture) => {
    var fs = require('fs');
    return new Promise((resolve, reject) => {
        fs.writeFile(path, picture, function(err) {
            if (err) {
                reject('fs threw an error');
                throw err;
            }
            resolve()
        });
    })
}

module.exports = {
  savePng: savePng,
};

const {appendFileSync, unlinkSync} = require( 'fs');
const {join} = require('path');

module.exports = function deleteFile(relativePathToFile) {
    return new Promise((resolve, reject) => {
        try {
            resolve(unlinkSync(join(process.cwd(), relativePathToFile)));
        } catch (err) {
            appendFileSync(
                join(process.cwd(), 'log.txt'),
                new Date().toISOString() + ':\n' + err.toString() + '\n\n',
            );
            reject(err);
        }
    });
}

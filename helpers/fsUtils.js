const fs = require('fs');
const util = require('util');

// Promise version of fs.readFile
const readFromFile = util.promisify(fs.readFile);

// Promise version of fs.writeFile
const writeToFile = (destination, content) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(destination, JSON.stringify(content, null, 4), (err) => {
            if (err) {
                console.error(err);
                reject(err);
            } else {
                console.info(`\nData written to ${destination}`);
                resolve();
            }
        });
    });
};

const readAndAppend = (content, file) => {
    return readFromFile(file, 'utf8')
        .then((data) => {
            const parsedData = JSON.parse(data);
            parsedData.push(content);
            return writeToFile(file, parsedData);
        })
        .catch((err) => {
            console.error(err);
        });
};

module.exports = { readFromFile, writeToFile, readAndAppend };

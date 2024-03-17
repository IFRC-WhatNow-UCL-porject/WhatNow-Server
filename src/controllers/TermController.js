const httpStatus = require('http-status');
const logger = require('../config/logger');
const fs = require('fs');
const path = require('path');

class TermController {

    async getTermByVersion(req, res) {
        try {
            const version = req.body.version;

            const termsFolderPath = path.join(__dirname, '../config/terms');
            const txtFiles = fs.readdirSync(termsFolderPath).filter(file => file.endsWith('.txt'));
            const termNames = txtFiles.map(file => path.parse(file).name);

            if (!termNames.includes(version)) {
                return res.status(httpStatus.BAD_REQUEST).json({ message: 'Version not found', status: false });
            }

            const termFilePath = path.join(termsFolderPath, `${version}.txt`);
            const term = fs.readFileSync(termFilePath, 'utf8');
            res.status(httpStatus.OK).send({ message: 'Term fetched successfully', status: true, data: term});
        } catch (error) {
            logger.error(error);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    }

    async publishTerm(req, res) {
        try {
            const version = req.body.version;
            const term = req.body.term;

            const termsFolderPath = path.join(__dirname, '../config/terms');
            const termFilePath = path.join(termsFolderPath, `${version}.txt`);
            fs.writeFileSync(termFilePath, term);

            // add publish time in version file called version.txt, do not cover the content in version.txt
            const versionFilePath = path.join(termsFolderPath, 'version.txt');
            const versionFileContent = fs.readFileSync(versionFilePath, 'utf8');
            const versionFileContentArray = versionFileContent.split('\n');
            const versionIndex = versionFileContentArray.findIndex(line => line.startsWith(version));
            if (versionIndex !== -1) {
                versionFileContentArray[versionIndex] = `${version} - ${new Date().toISOString()}`;
            } else {
                versionFileContentArray.push(`${version} - ${new Date().toISOString()}`);
            }
            fs.writeFileSync(versionFilePath, versionFileContentArray.join('\n'));

            res.status(httpStatus.OK).send({ message: 'Term published successfully', status: true });
        } catch (error) {
            logger.error(error);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    }

    async getAllVersions(req, res) {
        try {
            const termsFolderPath = path.join(__dirname, '../config/terms');
            const versionFilePath = path.join(termsFolderPath, 'version.txt');
            const versionFileContent = fs.readFileSync(versionFilePath, 'utf8');
            const versionFileContentArray = versionFileContent.split('\n');
            const versions = versionFileContentArray.map(line => {
                const [version, date] = line.split(' - ');
                return { version, date };
            });
            res.status(httpStatus.OK).send({ message: 'All versions fetched successfully', status: true, data: versions});
        } catch (error) {
            logger.error(error);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    }

    async getLatestTerm(req, res) {
        try {
            const termsFolderPath = path.join(__dirname, '../config/terms');
            const versionFilePath = path.join(termsFolderPath, 'version.txt');
            const versionFileContent = fs.readFileSync(versionFilePath, 'utf8');
            const versionFileContentArray = versionFileContent.split('\n');
            const latestVersion = versionFileContentArray[versionFileContentArray.length - 1].split(' - ')[0];
            const termFilePath = path.join(termsFolderPath, `${latestVersion}.txt`);
            const term = fs.readFileSync(termFilePath, 'utf8');
            res.status(httpStatus.OK).send({ message: 'Latest term fetched successfully', status: true, data: term});
        } catch (error) {
            logger.error(error);
            res.status(httpStatus.BAD_GATEWAY).send(error);
        }
    }

}

module.exports = TermController;

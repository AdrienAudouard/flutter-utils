import { ConfigurationUtils } from './configuration-utils';
import { getRelativeTestFolder } from "./utils";

const fs = require('fs');
const stringSimilarity = require("string-similarity");


export function getFilesInDir(dir: String, findFiles?: String[]) {
    const files_ = findFiles || [];
    var files = fs.readdirSync(dir);
    for (var i in files) {
        var name = dir + '/' + files[i];
        if (fs.statSync(name).isDirectory()) {
            getFilesInDir(name, files_);
        } else {
            files_.push(name);
        }
    }
    return files_;
}

export function findClosestTestFiles(fileName: String): { target: string, rating: number }[] {
    const minPercent = ConfigurationUtils.getMinPercentageForCloseFile();
    const testFiles = getFilesInDir(getRelativeTestFolder()).filter((file) => file.endsWith('_test.dart'));

    const matches = stringSimilarity.findBestMatch(fileName, testFiles);

    return matches.ratings.filter((match: any) => match.rating >= minPercent).sort((a: any, b: any) => b.rating - a.rating);
}
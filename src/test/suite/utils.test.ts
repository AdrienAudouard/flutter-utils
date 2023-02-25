import assert = require("assert");
import { getParentPath } from "../../utils/utils";
const sinon = require("sinon");

describe('utils', () => {
    describe('getParentPath', () => {
        it('it should return the parent path', () => {
            const result = getParentPath('/parent/child.dart');
            assert.strictEqual(result, '/parent');
        });
    });
});
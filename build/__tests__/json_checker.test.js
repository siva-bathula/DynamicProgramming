"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const json_parser_1 = require("../json-parser");
const path_1 = __importDefault(require("path"));
describe('Tests provided by JSON ORG', () => {
    const dir = path_1.default.join(__dirname, 'json_checker/');
    const files = fs_1.default.readdirSync(dir);
    afterEach(() => {
        jest.restoreAllMocks();
    });
    files.forEach((file) => {
        if (file.endsWith('.json')) {
            const input = fs_1.default.readFileSync(`${dir}${file}`, 'utf8').toString();
            let exitCode = 0;
            try {
                JSON.parse(input);
            }
            catch (err) {
                exitCode = 1;
            }
            const parser = new json_parser_1.JsonParser(input);
            test(`Testing ${dir}${file}`, (done) => {
                const mockExit = jest
                    .spyOn(process, 'exit')
                    .mockImplementation((number) => {
                    throw new Error('process.exit: ' + number);
                });
                expect(() => {
                    parser.parse();
                }).toThrow();
                expect(mockExit).toHaveBeenCalledWith(exitCode);
                mockExit.mockRestore();
                done();
            });
        }
    });
});

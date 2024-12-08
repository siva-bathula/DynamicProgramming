"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonParser = void 0;
const tokens_1 = require("./tokens");
const FAILURE_EXIT_CODE = 1;
const SUCCESS_EXIT_CODE = 0;
const CONTROL_CHARACTERS_REGEX = 
// eslint-disable-next-line no-control-regex
/[\u0000-\u001F\u007F-\u009F\u061C\u200E\u200F\u202A-\u202E\u2066-\u2069]/g;
class JsonParser {
    constructor(input) {
        this.pos = 0;
        this.input = input;
    }
    parse() {
        this.consumeWhitespace();
        const value = this.parseValue();
        this.consumeWhitespace();
        if (this.hasNext()) {
            console.log(`Unexpected token ${this.currentToken()}at position ${this.pos}`);
            process.exit(FAILURE_EXIT_CODE);
        }
        console.log('Parsed successfully %s', value);
        process.exit(SUCCESS_EXIT_CODE);
    }
    parseValue() {
        switch (this.currentToken()) {
            case tokens_1.Token.BEGIN_OBJECT:
                return this.parseObject();
            case tokens_1.Token.BEGIN_ARRAY:
                return this.parseArray();
            case tokens_1.Token.QUOTE:
                return this.parseString();
            case tokens_1.Token.BEGIN_TRUE:
                return this.parseTrue();
            case tokens_1.Token.BEGIN_FALSE:
                return this.parseFalse();
            case tokens_1.Token.BEGIN_NULL:
                return this.parseNull();
            case tokens_1.NumberToken.ZERO:
            case tokens_1.NumberToken.ONE:
            case tokens_1.NumberToken.TWO:
            case tokens_1.NumberToken.THREE:
            case tokens_1.NumberToken.FOUR:
            case tokens_1.NumberToken.FIVE:
            case tokens_1.NumberToken.SIX:
            case tokens_1.NumberToken.SEVEN:
            case tokens_1.NumberToken.EIGHT:
            case tokens_1.NumberToken.NINE:
            case tokens_1.NumberToken.MINUS:
                return this.parseNumber();
            default:
                console.log(`Unexpected token ${this.currentToken()} at position ${this.pos}`);
                process.exit(FAILURE_EXIT_CODE);
        }
    }
    parseObject() {
        const obj = {};
        this.consume(tokens_1.Token.BEGIN_OBJECT);
        // Used to check if there are more pairs.
        // while loop will not end in this case : "{,}"
        let morePairs = null;
        while (this.currentToken() !== tokens_1.Token.END_OBJECT || morePairs) {
            const pair = this.parsePair();
            obj[pair.key] = pair.value;
            // If there are more pairs
            if (this.currentToken() === tokens_1.Token.COMMA) {
                this.consume(tokens_1.Token.COMMA);
                morePairs = true;
            }
            else if (this.currentToken() !== tokens_1.Token.END_OBJECT) {
                morePairs = false;
                console.log(`Invalid object at position ${this.pos}`);
                process.exit(FAILURE_EXIT_CODE);
            }
            else {
                morePairs = false;
            }
        }
        this.consume(tokens_1.Token.END_OBJECT);
        return obj;
    }
    parsePair() {
        const key = this.parseString();
        this.consume(tokens_1.Token.SEMI_COLON);
        const value = this.parseValue();
        return { key, value };
    }
    parseArray() {
        const arr = [];
        this.consume(tokens_1.Token.BEGIN_ARRAY);
        // Used to check if there are more pairs.
        // while loop will not end in this case : "[,]"
        let morePairs = null;
        while (this.currentToken() !== tokens_1.Token.END_ARRAY || morePairs) {
            const value = this.parseValue();
            arr.push(value);
            // If there is another pair
            if (this.currentToken() === tokens_1.Token.COMMA) {
                this.consume(tokens_1.Token.COMMA);
                morePairs = true;
            }
            else if (this.currentToken() !== tokens_1.Token.END_ARRAY) {
                morePairs = false;
                console.log(`Invalid array at position ${this.pos}, currentToken: ${this.input.substring(this.pos - 2, this.pos + 2)}`);
                process.exit(FAILURE_EXIT_CODE);
            }
            else {
                morePairs = false;
            }
        }
        this.consume(tokens_1.Token.END_ARRAY);
        return arr;
    }
    parseString() {
        let str = '';
        this.consume(tokens_1.Token.QUOTE);
        while (this.currentToken() !== tokens_1.Token.QUOTE) {
            if (this.currentToken() === tokens_1.Token.ESCAPE) {
                str += this.parseEscape();
            }
            else {
                if (this.isControlCode()) {
                    console.log(`Invalid character at ${this.pos}. Control characters must be escaped`);
                    process.exit(FAILURE_EXIT_CODE);
                }
                str += this.currentToken();
                this.pos++;
            }
        }
        this.consume(tokens_1.Token.QUOTE);
        return str;
    }
    parseEscape() {
        // We are not skipping the white spaces after the consume.
        // Since the next character matters in this case.
        this.consume(tokens_1.Token.ESCAPE, false);
        // Reject if a control character follows the escape token
        if (this.isControlCode()) {
            console.log(`Invalid escape character at ${this.pos}.`);
            process.exit(FAILURE_EXIT_CODE);
        }
        switch (this.currentToken()) {
            case tokens_1.EscapeToken.QUOTE:
            case tokens_1.EscapeToken.REVERSE_SOLIDUS:
            case tokens_1.EscapeToken.SOLIDUS: {
                const c = this.currentToken();
                this.consume();
                return c;
            }
            case tokens_1.EscapeToken.BACKSPACE:
                this.consume();
                return tokens_1.Token.BACKSPACE;
            case tokens_1.EscapeToken.FORM_FEED:
                this.consume();
                return tokens_1.Token.FORM_FEED;
            case tokens_1.EscapeToken.LINE_FEED:
                this.consume();
                return tokens_1.Token.LINE_FEED;
            case tokens_1.EscapeToken.CAR_RETURN:
                this.consume();
                return tokens_1.Token.CAR_RETURN;
            case tokens_1.EscapeToken.HORIZONTAL_TAB:
                this.consume();
                return tokens_1.Token.HORIZONTAL_TAB;
            case tokens_1.EscapeToken.HEX: {
                this.consume();
                const code = parseInt(this.input.substring(this.pos, this.pos + 4), 16);
                if (isNaN(code)) {
                    console.log(`Invalid hex code at position ${this.pos}`);
                    process.exit(FAILURE_EXIT_CODE);
                }
                this.pos += 4;
                return String.fromCharCode(code);
            }
            default:
                console.log(`Invalid escape character at position ${this.pos}`);
                process.exit(FAILURE_EXIT_CODE);
        }
    }
    parseTrue() {
        this.consume('t');
        this.consume('r');
        this.consume('u');
        this.consume('e');
        return true;
    }
    parseFalse() {
        this.consume('f');
        this.consume('a');
        this.consume('l');
        this.consume('s');
        this.consume('e');
        return false;
    }
    parseNull() {
        this.consume('n');
        this.consume('u');
        this.consume('l');
        this.consume('l');
        return null;
    }
    parseNumber() {
        let str = '';
        // If the number if negative
        if (this.currentToken() === tokens_1.NumberToken.MINUS) {
            str += this.currentToken();
            this.consume(tokens_1.NumberToken.MINUS);
        }
        // Parse the Integer part
        str += this.parseDigits();
        // If the number if a decimal
        if (this.currentToken() === tokens_1.NumberToken.DOT) {
            str += this.currentToken();
            this.consume(tokens_1.NumberToken.DOT);
            str += this.parseDigits(true);
        }
        // If the number as an exponent part
        if (this.currentToken() === tokens_1.NumberToken.SMALL_EXPONENT ||
            this.currentToken() === tokens_1.NumberToken.CAPITAL_EXPONENT) {
            str += this.currentToken();
            this.consume();
            if (this.currentToken() == tokens_1.NumberToken.PLUS ||
                this.currentToken() == tokens_1.NumberToken.MINUS) {
                str += this.currentToken();
                this.consume();
            }
            str += this.parseDigits(true);
        }
        return parseFloat(str);
    }
    parseDigits(allowMultipleZerosAtPrefix = false) {
        let str = '';
        if (this.currentToken() === tokens_1.NumberToken.ZERO) {
            str += this.currentToken();
            this.consume(tokens_1.NumberToken.ZERO);
            // If the number has multiple zeros allowed at the prefix
            // eg: 1e0001
            if (allowMultipleZerosAtPrefix) {
                while (this.currentToken() === tokens_1.NumberToken.ZERO) {
                    str += this.currentToken();
                    this.consume(tokens_1.NumberToken.ZERO);
                }
            }
        }
        else if (this.currentToken() >= tokens_1.NumberToken.ONE &&
            this.currentToken() <= tokens_1.NumberToken.NINE) {
            str += this.currentToken();
            this.consume();
            while (this.currentToken() >= tokens_1.NumberToken.ZERO &&
                this.currentToken() <= tokens_1.NumberToken.NINE) {
                str += this.currentToken();
                this.consume();
            }
        }
        else {
            console.log(`Invalid character ${this.currentToken()} at position ${this.pos}\n
        parsed ${str} till now`);
            process.exit(FAILURE_EXIT_CODE);
        }
        return str;
    }
    consumeWhitespace() {
        while (/\s/.test(this.currentToken())) {
            this.consume();
        }
    }
    consume(expected, skip = true) {
        if (expected && this.currentToken() !== expected) {
            console.log(`Expected ${expected} but found ${this.currentToken()} at position ${this.pos}`);
            process.exit(FAILURE_EXIT_CODE);
        }
        this.pos++;
        if (skip) {
            // Skip over any whitespace characters
            while (this.currentToken() === ' ' ||
                this.currentToken() === '\t' ||
                this.currentToken() === '\n' ||
                this.currentToken() === '\r') {
                this.pos++;
            }
        }
    }
    hasNext() {
        this.consumeWhitespace();
        return this.input.codePointAt(this.pos) !== undefined;
    }
    currentToken() {
        return this.input.charAt(this.pos);
    }
    isControlCode() {
        return CONTROL_CHARACTERS_REGEX.test(this.currentToken());
    }
}
exports.JsonParser = JsonParser;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sanitize_html_1 = __importDefault(require("sanitize-html"));
class Utils {
    static empty(value) {
        return value === null || value === undefined || value === [] || value === {} || value === false || value === 0 || value === "";
    }
    static in_array(needle, haystack) {
        return haystack.includes(needle);
    }
    static sanitize(value) {
        value = (0, sanitize_html_1.default)(value, {
            allowedTags: ["b", "strong", "i", "a", "code", "pre", "li"],
            allowedAttributes: {
                "a": ["href"]
            }
        });
        value = value.replace(/<li>/g, "- ");
        value = value.replace(/<\/li>\n?/g, "\n");
        value = value.replace(/\n\n\n\n/g, "\n\n");
        value = value.replace(/\n\n\n/g, "\n\n");
        return value;
    }
    static value(callback) {
        if (typeof callback === "function") {
            return callback();
        }
        return callback;
    }
    static default(value, defaultValue = null) {
        if (this.empty(value)) {
            return defaultValue;
        }
        return value;
    }
    static dump(value) {
        console.log(JSON.stringify(value, undefined, 2));
    }
}
exports.default = Utils;
//# sourceMappingURL=Utils.js.map
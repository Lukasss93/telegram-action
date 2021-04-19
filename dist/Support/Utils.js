"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Utils {
    static empty(value) {
        return value === null || value === undefined || value === [] || value === {} || value === false || value === 0 || value === "";
    }
    static in_array(needle, $haystack) {
        return $haystack.includes(needle);
    }
}
exports.default = Utils;
//# sourceMappingURL=Utils.js.map
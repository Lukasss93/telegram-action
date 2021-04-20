import sanitizeHtml from "sanitize-html";

export default class Utils {

    public static empty(value: any): boolean {
        return value === null || value === undefined || value === [] || value === {} || value === false || value === 0 || value === "";
    }

    public static in_array(needle: any, haystack: Array<any>): boolean {
        return haystack.includes(needle);
    }

    public static sanitize(value: string): string {
        value = sanitizeHtml(value, {
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

    public static value(callback: any) {
        if (typeof callback === "function") {
            return callback();
        }

        return callback;
    }

    public static default(value: any, defaultValue: any = null) {
        if (this.empty(value)) {
            return defaultValue;
        }

        return value;
    }
}
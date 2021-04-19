import sanitizeHtml from "sanitize-html";

export default class Utils {

    public static empty(value):boolean {
        return value === null || value === undefined || value === [] || value === {} || value === false || value === 0 || value === "";
    }
    
    public static in_array(needle, $haystack):boolean {
        return $haystack.includes(needle);
    }
    
    public static sanitize(value:string):string{
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

}
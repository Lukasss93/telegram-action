"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Utils_1 = __importDefault(require("./Support/Utils"));
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let s = 0;
            //get event
            //let event = github.context.eventName;
            let event = 0;
            if (!Utils_1.default.in_array(event, ['push', 'release'])) {
                throw new Error('Invalid github event');
            }
            /*
            let templatePath=path.join(__dirname,'../templates/release.mustache');
            let templateContent = fs.readFileSync(templatePath, 'utf-8');
            let output = mustache.render(templateContent, {
                repo_url:'https://www.google.it',
                repo_name:'test',
                tag:'v2.0',
                type:'stable',
                body:'<b>Ciao</b>'
            });*/
            console.log('OK');
        }
        catch (e) {
            console.log(e.message);
            //core.setFailed(e.message);
        }
    });
}
run();
//# sourceMappingURL=main.js.map
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const core = __importStar(require("@actions/core"));
const github = __importStar(require("@actions/github"));
const path = __importStar(require("path"));
const Utils_1 = __importDefault(require("./Support/Utils"));
const NoCommitsError_1 = __importDefault(require("./Exceptions/NoCommitsError"));
function run() {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //get event
            let event = github.context.eventName;
            console.log(event);
            if (!Utils_1.default.in_array(event, ['push', 'release'])) {
                throw new Error('Invalid github event');
            }
            //get payload
            const payload = github.context.payload;
            //get actor
            const actor = github.context.actor;
            //get envs
            const telegram_token = process.env.TELEGRAM_TOKEN;
            const telegram_chat = process.env.TELEGRAM_CHAT;
            //get arguments
            const commit_template = (_a = core.getInput("commit_template")) !== null && _a !== void 0 ? _a : path.join(__dirname, '../templates/commit.mustache');
            const release_template = (_b = core.getInput("release_template")) !== null && _b !== void 0 ? _b : path.join(__dirname, '../templates/release.mustache');
            const status = (_c = core.getInput("status")) !== null && _c !== void 0 ? _c : null;
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
        catch (error) {
            if (error instanceof NoCommitsError_1.default) {
                core.warning("No commits found.");
            }
            else {
                console.log(JSON.stringify(error, undefined, 2));
                core.setFailed(error.message);
            }
        }
    });
}
run();
//# sourceMappingURL=main.js.map
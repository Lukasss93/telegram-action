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
const axios_1 = __importDefault(require("axios"));
const showdown = __importStar(require("showdown"));
const mustache = __importStar(require("mustache"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const Utils_1 = __importDefault(require("./Support/Utils"));
const NoCommitsError_1 = __importDefault(require("./Exceptions/NoCommitsError"));
function run() {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //get event
            let event = github.context.eventName;
            if (!Utils_1.default.in_array(event, ['push', 'release'])) {
                throw new Error('Trigger event not supported.');
            }
            //get payload
            const payload = github.context.payload;
            //get actor
            const actor = github.context.actor;
            //get envs
            const telegram_token = process.env.TELEGRAM_TOKEN;
            const telegram_chat = process.env.TELEGRAM_CHAT;
            //check envs
            if (Utils_1.default.empty(telegram_token)) {
                throw new Error("telegram_token argument not compiled");
            }
            if (Utils_1.default.empty(telegram_chat)) {
                throw new Error("telegram_chat argument not compiled");
            }
            //get arguments
            const commit_template = (_a = core.getInput("commit_template")) !== null && _a !== void 0 ? _a : path.join(__dirname, '../templates/commit.mustache');
            const release_template = (_b = core.getInput("release_template")) !== null && _b !== void 0 ? _b : path.join(__dirname, '../templates/release.mustache');
            const status = (_c = core.getInput("status", { required: true })) !== null && _c !== void 0 ? _c : null;
            //initialize repo
            if (payload.repository === undefined) {
                throw new Error("payload.repository is undefined");
            }
            const repo_name = payload.repository.full_name;
            const repo_url = `https://github.com/${repo_name}`;
            //initialize message
            let message = null;
            //elaborate event
            switch (event) {
                case "push":
                    //get commits
                    let commits = payload.commits.map(commit => ({
                        repo_url: repo_url,
                        repo_name: repo_name,
                        actor: actor,
                        commit_url: `${repo_url}/commit/${commit.id}`,
                        commit_sha: Utils_1.default.value(function () {
                            if (commit.id.length > 7) {
                                return commit.id.substring(0, 7);
                            }
                            return commit.id;
                        }),
                        commit_message: commit.message
                    }));
                    //check if no commits
                    if (commits.length === 0) {
                        throw new NoCommitsError_1.default();
                    }
                    //render message
                    let commitTemplateContent = fs.readFileSync(commit_template, 'utf-8');
                    message = mustache.render(commitTemplateContent, {
                        commits: commits
                    });
                    break;
                case "release":
                    let tag_name = payload.release.tag_name;
                    let tag_url = payload.release.html_url;
                    let tag_type = payload.release.prerelease ? "beta" : "stable";
                    //get tag body
                    let body = payload.release.body;
                    //convert markdown to html
                    let converter = new showdown.Converter();
                    body = converter.makeHtml(body);
                    //render message
                    let releaseTemplateContent = fs.readFileSync(release_template, 'utf-8');
                    message = mustache.render(releaseTemplateContent, {
                        tag_url: tag_url,
                        repo_name: repo_name,
                        tag_name: tag_name,
                        tag_type: tag_type,
                        body: body
                    });
                    break;
                default:
                    throw new Error("Trigger event not supported.");
            }
            //send message via telegram
            yield axios_1.default.post(`https://api.telegram.org/bot${telegram_token}/sendMessage`, {
                chat_id: telegram_chat,
                text: message !== null && message !== void 0 ? message : 'Invalid message',
                parse_mode: "html",
                disable_web_page_preview: true
            });
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
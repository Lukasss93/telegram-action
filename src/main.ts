import * as core from "@actions/core";
import * as github from "@actions/github";
import axios from "axios";
import * as showdown from "showdown";
import * as mustache from "mustache";
import * as fs from 'fs';
import * as path from 'path';
import Utils from "./Support/Utils";
import NoCommitsError from "./Exceptions/NoCommitsError";

async function run(): Promise<void> {
    try {
        //get event
        let event = github.context.eventName;

        if (!Utils.in_array(event, ['push', 'release'])) {
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
        if (Utils.empty(telegram_token)) {
            throw new Error("telegram_token argument not compiled");
        }

        if (Utils.empty(telegram_chat)) {
            throw new Error("telegram_chat argument not compiled");
        }

        //get arguments
        const commit_template = core.getInput("commit_template", {required:false}) ?? path.join(__dirname, '../templates/commit.mustache');
        const release_template = core.getInput("release_template", {required:false}) ?? path.join(__dirname, '../templates/release.mustache');
        const status = core.getInput("status", {required: true}) ?? null;
        
        console.log(commit_template);
        console.log(release_template);

        //initialize repo
        if (payload.repository === undefined) {
            throw new Error("payload.repository is undefined");
        }

        const repo_name = payload.repository.full_name;
        const repo_url = `https://github.com/${repo_name}`;

        //initialize message
        let message: string | null = null;

        //elaborate event
        switch (event) {
            case "push":
                //get commits
                let commits = payload.commits.map(commit => ({
                    repo_url: repo_url,
                    repo_name: repo_name,
                    actor: actor,
                    commit_url: `${repo_url}/commit/${commit.id}`,
                    commit_sha: Utils.value(function(){
                        if (commit.id.length > 7) {
                            return commit.id.substring(0, 7);
                        }
                        
                        return commit.id;
                    }),
                    commit_message: commit.message
                }));

                //check if no commits
                if (commits.length === 0) {
                    throw new NoCommitsError();
                }

                //render message
                let commitTemplateContent = fs.readFileSync(commit_template, 'utf-8');
                message = mustache.render(commitTemplateContent, {
                    commits:commits
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
        await axios.post(`https://api.telegram.org/bot${telegram_token}/sendMessage`, {
            chat_id: telegram_chat,
            text: message ?? 'Invalid message',
            parse_mode: "html",
            disable_web_page_preview: true
        });

    } catch (error) {
        if (error instanceof NoCommitsError) {
            core.warning("No commits found.");
        } else {
            console.log(JSON.stringify(error, undefined, 2));
            core.setFailed(error.message);
        }
    }
}

run();
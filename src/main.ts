import * as core from "@actions/core";
import * as github from "@actions/github";
import * as axios from "axios";
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
        
        if(!Utils.in_array(event,['push','release'])){
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
        const commit_template = core.getInput("commit_template") ?? path.join(__dirname,'../templates/commit.mustache');
        const release_template = core.getInput("release_template") ?? path.join(__dirname,'../templates/release.mustache');
        const status = core.getInput("status") ?? null;
        
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
    } catch(error){
        if (error instanceof NoCommitsError) {
            core.warning("No commits found.");
        } else {
            console.log(JSON.stringify(error, undefined, 2));
            core.setFailed(error.message);
        }
    }
}

run();
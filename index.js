const core = require("@actions/core");
const github = require("@actions/github");
const axios = require("axios");
const showdown = require("showdown");
const sanitizeHtml = require("sanitize-html");

class NoCommitsError extends Error {
}

function empty(value) {
  return value === null || value === undefined || value === [] || value === {} || value === false || value === 0 || value === "";
}

const icons = {
  failure: "❗",
  cancelled: "❕",
  success: "✅",
};

(async () => {
  try {
    //get payload
    const payload = github.context.payload;

    //get event
    const event = github.context.eventName;

    //get envs
    const telegram_token = process.env.TELEGRAM_TOKEN;
    const telegram_chat = process.env.TELEGRAM_CHAT;

    //get arguments
    const message = core.getInput("message");
    const footer = core.getInput("footer");

    //check envs
    if (empty(telegram_token)) {
      throw new Error("telegram_token argument not compiled");
    }

    if (empty(telegram_chat)) {
      throw new Error("telegram_chat argument not compiled");
    }

    //initialize repo
    const repo = payload.repository.full_name;
    const repo_link = `https://github.com/${repo}`;

    //initialize message
    let buildMessage = "";

    //elaborate event
    switch (event) {
      case "push":
        //get commits
        let commits = payload.commits.map(commit => {
          return {
            sha: commit.id,
            url: `${repo_link}/commit/${commit.id}`,
            message: commit.message
          }
        });

        //check if no commits
        if (commits.length === 0) {
          throw new NoCommitsError();
        }

        //elaborate message
        let i = 0;
        for (let commit of commits) {
          let sha = commit.sha;
          if (sha.length > 7) {
            sha = sha.substring(0, 7);
          }
          console.log('here' + JSON.stringify(payload));
          buildMessage += `${icons[payload.job.status]} ${payload.job.status}:`
          buildMessage += `<a href="${repo_link}">${repo}</a>`;
          buildMessage += ` • <a href="${commit.url}">${sha}</a>\n`;
          buildMessage += commit.message;

          if (i < commits.length - 1) {
            buildMessage += "\n\n";
          }
          i++;
        }

        break;
      case "release":
        let tag = payload.release.tag_name;
        let tag_link = payload.release.html_url;
        let type = payload.release.prerelease ? "beta" : "stable";

        buildMessage += `<a href="${tag_link}">New ${repo} release</a>: <code>${tag}</code> (${type})`;

        //get tag body
        let body = payload.release.body;

        //convert markdown to html
        let converter = new showdown.Converter();
        body = converter.makeHtml(body);

        //set body if available
        if (!empty(body)) {
          buildMessage += `\n${body}`;
        }
        break;
      default:
        throw new Error("Trigger event not supported.");
    }

    //set footer if available
    if (!empty(footer)) {
      buildMessage += `\n\n${footer}`;
    }

    //sanitize html allowing whitelisted tags
    buildMessage = sanitizeHtml(buildMessage, {
      allowedTags: ["b", "strong", "i", "a", "code", "pre", "li"],
      allowedAttributes: {
        "a": ["href"]
      }
    });

    buildMessage = buildMessage.replace(/<li>/g, "- "); console.log(buildMessage);
    buildMessage = buildMessage.replace(/<\/li>\n?/g, "\n"); console.log(buildMessage);
    buildMessage = buildMessage.replace(/\n\n\n\n/g, "\n\n"); console.log(buildMessage);
    buildMessage = buildMessage.replace(/\n\n\n/g, "\n\n"); console.log(buildMessage);

    //send message via telegram
    await axios.post(`https://api.telegram.org/bot${telegram_token}/sendMessage`, {
      chat_id: telegram_chat,
      text: !empty(message) ? message : buildMessage,
      parse_mode: "html",
      disable_web_page_preview: true
    });

  } catch (error) {
    if (error instanceof NoCommitsError) {
      core.warning("No commits found.");
    } else {
      console.log(error)
      console.log(JSON.stringify(error, undefined, 2));
      core.setFailed(error.message);
    }
  }
})();
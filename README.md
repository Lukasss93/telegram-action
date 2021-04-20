# ✈ Notify via Telegram
[GitHub Action](https://github.com/features/actions) for sending a Telegram notification message.

This action send a message via Telegram when there is a push/release.

## 👓 Usage
Send a default message on push/release event:
```yaml
name: Notify
on:
  push:
  release:
    types: [published]

jobs:
  notify:
    name: Notify via Telegram
    runs-on: ubuntu-latest
    steps:
      - name: Send message to Telegram
        uses: Lukasss93/telegram-action@v2
        env:
          TELEGRAM_TOKEN: ${{ secrets.telegram_token }}
          TELEGRAM_CHAT: ${{ secrets.telegram_chat }}

```

## 💼 Environment variables

- **TELEGRAM_TOKEN** `string` - Telegram authorization token
- **TELEGRAM_CHAT** `string` - Unique identifier chat

>How to get a telegram token: [BotFather](https://core.telegram.org/bots#6-botfather)
>
>How to get a telegram chat identifier:
> 
>1. Forward a message from the target chat to [@JsonDumpBot](https://telegram.me/JsonDumpBot) 
>2. Copy the *message* ➡ *forward_from_chat* ➡ **id**


## 📝 Inputs variables

|Input           |Optional?|Expected value   |Description                                 |
|----------------|---------|-----------------|--------------------------------------------|
|commit_template |Yes      |File path        |Override the default commit template message|
|release_template|Yes      |File path        |Override the default commit template message|
|status          |Yes      |`${{job.status}}`|Job status                                  |


## 🎭 Default Templates

```mustache
// ./templates/commit.mustache

{{#commits}}
<a href="{{{repo_url}}}">{{repo_name}}</a> • <a href="https://github.com/{{actor}}">{{actor}}</a> • <a href="{{commit_url}}">{{commit_sha}}</a>
{{commit_message}}

{{/commits}}

{{status}}
```

```mustache
// ./templates/release.mustache

<a href="{{{tag_url}}}">New {{repo_name}} release</a>: <code>{{tag_name}}</code> ({{tag_type}})
{{{body}}}
```

## ✨ Workflow examples

Check this workflow: [test.yml](.github/workflows/test.yml)

## 📃 Changelog
Please see the [CHANGELOG.md](CHANGELOG.md) for more information on what has changed recently.

## 📖 License
Please see the [LICENSE.md](LICENSE) file for more information.
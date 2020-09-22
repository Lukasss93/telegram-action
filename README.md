# ✈ Notify via Telegram
[GitHub Action](https://github.com/features/actions) for sending a Telegram notification message.

This action send a message via Telegram when there is a push/release.

## Usage
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
        uses: Lukasss93/telegram-action@v1
        env:
          TELEGRAM_TOKEN: ${{ secrets.telegram_token }}
          TELEGRAM_CHAT: ${{ secrets.telegram_chat }}
        with: 
          STATUS: ${{job.status}} # Required for accessing the status of certain job
          footer: 'Append a message to default message' # Optional
          message: 'Override the default message (footer included)' # Optional

```

## Environment variables

- **TELEGRAM_TOKEN** `string` - Telegram authorization token
- **TELEGRAM_CHAT** `string` - Unique identifier chat

>How to get a telegram token: [BotFather](https://core.telegram.org/bots#6-botfather)
>
>How to get a telegram chat identifier:
> 
>1. Forward a message from the target chat to [@JsonDumpBot](https://telegram.me/JsonDumpBot) 
>2. Copy the *message* ➡ *forward_from_chat* ➡ **id**


## Inputs variables

- **STATUS** *required* `${{job.status}}`
- **footer** *optional* `string` - Append a message to default message
- **message** *optional* `string` - Override the default message (footer included)

## Default Messages

##### For Push

```
[status emoji] [author/repo¹] • [actor] • [hash²]
Commit message
```
>¹ with repo link
>
>² with hash link 

*It supports multiple commits in a unique message.*

##### For Release

```
New author/repo release¹: tag² (type³)

Tag message
```
>¹ with tag link
>
>² tag name
>
>³ **beta** if it's a pre-release otherwise **stable**

# Crydengo

Crydengo is an experimental moderation bot by K97i, written in Discord.js.

Created for The Foxtale Discord Server, its purpose is to catch Discord bots (primarily the prevalent crypto casino image scam bots) that slip past Discord's auto-mod feature by avoiding mass-pings. It intends to work hand-in-hand with the current auto-mod setup, and could potentially replace the current auto-mod setup through its flexibility with Javascript code, allowing better features (like a more extensive regex feature).

## TO-DO

**\[DONE\]** 	Store per-guild configs with [Keyv](https://discordjs.guide/legacy/keyv/keyv)

**\[DONE\]**	Server invite scanning

**\[DONE\]**	Add bot-log with per-guild channel setting

**\[DONE\]**	Auto-mod regex detection

## Run Bot

1. Insert token in `src/configs/config.json`

```json
{
	"token": "[YOUR-TOKEN-HERE]",
	"clientID": "[YOUR-APPLICATION-ID-HERE]"
}
```

2. Change directory to /src (`cd src`).
3. Run `npm run dev`.
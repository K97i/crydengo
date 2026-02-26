# Crydengo

Crydengo is an experimental moderation bot by K97i, written in Discord.js.

Created for The Foxtale Discord Server, its purpose is to catch Discord bots (primarily the prevalent crypto casino image scam bots) that slip past Discord's auto-mod feature by avoiding mass-pings. It intends to work hand-in-hand with the current auto-mod setup, and could potentially replace the current auto-mod setup through its flexibility with Javascript code, allowing better features (like a more extensive regex feature).

## Run Bot

### Locally

1. Insert token in `src/configs/config.json`

```json
{
	"token": "[YOUR-TOKEN-HERE]",
	"clientID": "[YOUR-APPLICATION-ID-HERE]"
}
```

2. Change directory to /src (`cd src`).
3. Run `npm run dev`.

### With Docker

Docker allows a program to run similarly universally by separating it from the main host machine.

1. Change directory to root folder (this folder).
2. Run `docker compose up --build`.
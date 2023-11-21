# Caen Weather Daily

A Discord bot enhanced with the OpenAI API.

## Installation
Clone the repository
```bash
git clone git@github.com:LouisLoveCryptoo/discordGPT.git
```

## Usage

```json
// Add your Discord and ChatGPT API credentials
{
    "clientId": "YOUR_CLIENT_ID",
    "guildId": "YOUR_GUILD_ID",
    "token": "YOUR_DISCORD_TOKEN",
    "apiKey":"YOUR_OPENAI_KEY"
}
```
### Starting the Bot
```bash
node index.js
```

### Adding New Slash Commands
Create a .js file in the ./commands directory and write your script. Then, execute the following command in your terminal to add the commands:
```bash
node commands.js
```
If you encounter any errors with the slash commands, use this line to delete all the commands from the Discord bot: 
```bash
node delete.js
```
### Contributing
Feel free to fork this repository and submit pull requests with your own improvements.

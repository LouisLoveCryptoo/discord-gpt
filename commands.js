function verifyNewCommands() {
  const { REST } = require("@discordjs/rest");
  const { Routes } = require("discord-api-types/v9");
  const fs = require("fs");
  const path = require("path");
  const { clientId, guildId, token } = require("./config.json");

  const commandsDir = path.join(__dirname, "commands");
  const commands = [];
  let numCommands = 0;

  fs.readdirSync(commandsDir)
    .filter((file) => file.endsWith(".js"))
    .forEach((file) => {
      const command = require(path.join(commandsDir, file));
      commands.push(command.data.toJSON());
      numCommands++;
    });

  const rest = new REST({ version: "9" }).setToken(token);

  (async () => {
    try {
      console.log(`Started refreshing ${numCommands} application commands.`);

      await rest.put(
        Routes.applicationCommands(clientId, guildId),
        { body: commands }
      );

      console.log("Successfully reloaded application commands.");
    } catch (error) {
      console.error(error);
    }
  })();
}

module.exports = verifyNewCommands;

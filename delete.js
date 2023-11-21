const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { clientId, guildId, token } = require("./config.json");

const rest = new REST({ version: "9" }).setToken(token);

(async () => {
  try {
    console.log("Started deleting application (/) commands.");

    const commands = await rest.get(
      Routes.applicationGuildCommands(clientId, guildId)
    );

    for (const command of commands) {
      await rest.delete(
        Routes.applicationGuildCommand(clientId, guildId, command.id)
      );
    }

    console.log("Successfully deleted application (/) commands.");
  } catch (error) {
    console.error(error);
  }
})();

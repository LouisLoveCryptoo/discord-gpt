const { Client, Collection, Events, GatewayIntentBits } = require("discord.js");
const Openai = require("openai");
const { token, apiKey } = require("./config.json");
const verifyNewCommands = require("./commands.js");
const path = require("path");
const fs = require("fs");
verifyNewCommands();

const random = (arr) => Math.floor(Math.random() * arr.length);

const openai = new Openai(apiKey);

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

client.once("ready", () => {
  console.log(`Ready! Logged in as ${client.user.tag}`);
});

client.commands = new Collection();

const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  if ("data" in command && "execute" in command) {
    client.commands.set(command.data.name, command);
  } else {
    console.log(
      `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
    );
  }
}

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  // console.log(interaction);
  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    }
  }
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  // Check if the bot is mentioned in the message
  if (!message.mentions.has(client.user)) return;

  console.log(message.content);

  try {
    const gptResponse = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `
          tu dois répondre avec des réponses courtes
          ${message.content} 
          `,
        },
        { role: "user", content: message.content },
      ],
      model: "gpt-3.5-turbo",
    });

    const botReply = gptResponse.choices[0].message.content;

    message.channel.send(botReply);
  } catch (error) {
    console.error("Erreur lors de l'appel à l'API OpenAI :", error);
    message.channel.send("Désolé, une erreur s'est produite.");
  }
});

client.login(token);

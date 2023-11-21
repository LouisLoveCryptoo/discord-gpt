const { SlashCommandBuilder } = require("discord.js");
const Openai = require("openai");
const { apiKey } = require("../config.json");
const openai = new Openai(apiKey);
const fs = require("fs");
const path = require("path");

const speechFile = path.resolve("./commands/vocals/speech.mp3");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("generatevoice")
    .setDescription("create speech from prompts")
    .addStringOption((option) =>
      option
        .setName("prompt")
        .setDescription("prompt to voice")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("voice").setDescription("voice to use").setRequired(true)
    ),
  async execute(interaction) {
    const prompt = interaction.options.getString("prompt");
    let voice = interaction.options.getString("voice");
    const voices = ["alloy", "echo", "fable", "onyx", "nova", "shimmer"];
    if (!voices.includes(voice)) {
      voice = "alloy";
    }
    let response;
    await interaction.deferReply();
    response = await openai.audio.speech.create({
      model: "tts-1",
      voice: voice,
      input: prompt,
    });
    const buffer = Buffer.from(await response.arrayBuffer());
    await fs.promises.writeFile(speechFile, buffer);
    await interaction.followUp({ files: [speechFile] });
  },
};
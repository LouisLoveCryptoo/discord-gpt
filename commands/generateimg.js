const { SlashCommandBuilder } = require("discord.js");
const Openai = require("openai");
const { apiKey } = require("../config.json");
const openai = new Openai(apiKey);

module.exports = {
  data: new SlashCommandBuilder()
    .setName("generateimage")
    .setDescription("create images from prompts")
    .addStringOption((option) =>
      option
        .setName("prompt")
        .setDescription("prompt to image")
        .setRequired(true)
    ),
  async execute(interaction) {
    const prompt = interaction.options.getString("prompt");
    let response;
    await interaction.reply("Generating image... ⌛");
    try {
      response = await openai.images.generate({
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        size: "1024x1024",
        quality: "hd",
      });
      console.log(response.data)
    } catch (error) {
      console.error(error);
      await interaction.followUp({
        content: "There was an error while executing the command!",
        ephemeral: true,
      });
      return;
    }
    console.log(response.data);
    if (!response.data || !response.data[0] || !response.data[0].url) {
      console.error("Invalid response structure");
      await interaction.followUp({
        content: "There was an error while executing the command!",
        ephemeral: true,
      });
      return;
    }
    const image_url = response.data[0].url;
    console.log(image_url);
    await interaction.followUp({
      content: `${[image_url]}`,
    });
  },
};

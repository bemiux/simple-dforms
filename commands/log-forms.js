const { SlashCommandBuilder } = require('@discordjs/builders');
const ModalSchema = require('../models/modal');

module.exports = {
  checkBeforeLogs: true,
  data: new SlashCommandBuilder()
    .setName('log-forms').setDescription('Log New Forms')
    .addChannelOption((option) =>
      option
        .setName('in')
        .setDescription('Select a channel')
        .setRequired(true)
    ),

  run: async (interaction) => {
    const modal = await ModalSchema.findOne({ gid: interaction.guild.id });
    const selChannel = interaction.options.getChannel('in');
    
    modal.logs = selChannel.id;
    modal.save()

    return interaction.reply({
      content: `\`✅\` **Future Submitted Forms will be Logged here** › ${selChannel}`,
      ephemeral: true
    })
  }
}
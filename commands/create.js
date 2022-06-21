const { MessageActionRow, Modal, TextInputComponent } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  checkBeforeCreate: true,
  data: new SlashCommandBuilder()
    .setName('create').setDescription('Create Your New Form'),

  run: async (interaction) => {
    const newModal = new Modal()
    .setTitle('Creating New Custom Form')
    .setCustomId('create-modal')
    .addComponents(
      new MessageActionRow({
        components: [
          new TextInputComponent()
            .setCustomId('q1')
            .setLabel(`What's your question #1?`)
            .setPlaceholder('...')
            .setStyle('SHORT')
            .setRequired(true)
        ]
      }),
      new MessageActionRow({
        components: [
          new TextInputComponent()
            .setCustomId('q2')
            .setLabel(`What's your question #2?`)
            .setPlaceholder('...')
            .setStyle('SHORT')
            .setRequired(true)
        ]
      }),
      new MessageActionRow({
        components: [
          new TextInputComponent()
            .setCustomId('q3')
            .setLabel(`What's your question #3?`)
            .setPlaceholder('...')
            .setStyle('SHORT')
            .setRequired(true)
        ]
      }),
    )
      return interaction.showModal(newModal);
  }
}
const { MessageActionRow, Modal, TextInputComponent } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const ModalSchema = require('../models/modal');

module.exports = {
  checkBeforeUse: true,
  data: new SlashCommandBuilder()
    .setName('form').setDescription('Submit Your Form'),

  run: async (interaction) => {
    const modal = await ModalSchema.findOne({ gid: interaction.guild.id });

    const newModal = new Modal()
    .setTitle('My Form')
    .setCustomId('custom-modal')
    .addComponents(
      new MessageActionRow({
        components: [
          new TextInputComponent()
            .setCustomId('q1')
            .setLabel(`${modal.q1}`)
            .setPlaceholder('.')
            .setStyle('SHORT')
            .setRequired(true)
        ]
      }),
      new MessageActionRow({
        components: [
          new TextInputComponent()
            .setCustomId('q2')
            .setLabel(`${modal.q2}`)
            .setPlaceholder('..')
            .setStyle('SHORT')
            .setRequired(true)
        ]
      }),
      new MessageActionRow({
        components: [
          new TextInputComponent()
            .setCustomId('q3')
            .setLabel(`${modal.q3}`)
            .setPlaceholder('...')
            .setStyle('SHORT')
            .setRequired(true)
        ]
      }),
    )
      return interaction.showModal(newModal);
  }
}
require('dotenv').config();

const { Client, Intents, MessageEmbed } = require('discord.js');
const { connect, connection: db } = require('mongoose');
const ModalSchema = require('./models/modal');
const fs = require('fs');

const GUILD = process.env.GUILD;
const TOKEN = process.env.TOKEN;
const DATABASE = process.env.MONGODB;

const client = new Client({ intents: [Intents.FLAGS.GUILDS] }); // Intents.FLAGS.ALL

client.commands = fs.readdirSync('./commands').map(x => require(`./commands/${x}`));

client.on('ready', async () => {
  console.log(`🤖 ${client.user.tag.toUpperCase()} :: ONLINE`);

  if (process.env.DEV) {
    client.guilds.fetch(GUILD)
      .then(guild => guild.commands.set(client.commands.map(x => x.data)))
  }

  db.on('connected', async () => console.log('ℹ️ MONGODB :: CONNECTED'));
  db.on('disconnected', () => console.log('ℹ️ MONGODB :: DISCONNECTED'));
  db.on('error', (err) => console.log(`ℹ️ MONGODB :: ERROR: \n`, err));
  db.on('reconnected', async () => console.log(`ℹ️ MONGODB :: RECONNECTED:\n\n${err}`));

  return await connect(DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
})

client.on('interactionCreate', async (interaction) => {
  const sender = interaction.user;
  const modal = await ModalSchema.findOne({ gid: interaction.guild.id });

  if (interaction.isCommand()) {
    const command = client.commands.find(x => x.data.name === interaction.commandName);

    if (command.checkBeforeUse && !modal || command.checkBeforeLogs && !modal) {
      return interaction.reply({
        content: '\`👉\` **First create a new form to continue!**',
        ephemeral: true
      })
    } else if (command.checkBeforeCreate && modal) {
      return interaction.reply({
        content: '\`🗃️\` **This server has already created one form**',
        ephemeral: true
      })
    } else if (command.checkBeforeUse && interaction.user.id !== interaction.guild.ownerId && modal.submitters.includes(interaction.user.id)) {
      return interaction.reply({
        content: '\`🧢\` **You are limited to one form**',
        ephemeral: true
      })
    }

    if (command) return command.run(interaction);
  } else if (interaction.isModalSubmit()) {

    if (interaction.customId === 'create-modal') {
      const q1 = interaction.fields.getTextInputValue('q1');
      const q2 = interaction.fields.getTextInputValue('q2');
      const q3 = interaction.fields.getTextInputValue('q3');

      const embed = new MessageEmbed()
        .setColor('GREEN')
        .setTitle('Custom Form Created!')
        .setDescription(
          `> **Question #1:**
          \`\`\`\n${q1}\`\`\`
          > **Question #2:**
          \`\`\`\n${q2}\`\`\`
          > **Question #3:**
          \`\`\`\n${q3}\`\`\`
        `)
        .setTimestamp()

      await interaction.reply({ embeds: [embed] })
        .catch((err) => console.log('An error occurred while sending the message: \n', err))

      await ModalSchema.create({
        gid: interaction.guild.id,
        q1: q1, q2: q2, q3: q3,
        submitters: [sender.id]
      })
    }

    if (interaction.customId === 'custom-modal') {
      const q1 = interaction.fields.getTextInputValue('q1');
      const q2 = interaction.fields.getTextInputValue('q2');
      const q3 = interaction.fields.getTextInputValue('q3');

      const embed = new MessageEmbed()
        .setColor('BLURPLE')
        .setAuthor(`${sender.username}`, sender.displayAvatarURL({ dynamic: true }), `https://discord.com/users/${sender.id}`, undefined)
        .setTitle('Form Submitted')
        .setDescription(`> **${modal.q1}**\n${q1}\n\n> **${modal.q2}**\n${q2}\n\n> **${modal.q3}**\n${q3}`)
        .setTimestamp()
 
      if (!modal.submitters.includes(sender.id))
        modal.submitters.push(sender.id);
        modal.save();

      if (modal.logs !== null) {
        const logChannel = interaction.guild.channels.cache.find(ch => ch.id === modal.logs);
        if (logChannel) await logChannel.send({ embeds: [embed] })

        return await interaction.reply({ content: `\`✅\` **Form Submitted Successfully!**`, ephemeral: true })
      } else if (modal.logs === null) {
        return await interaction.reply({ embeds: [embed] })
      }
    }
  }
})

client.login(TOKEN);
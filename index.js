const { REST, Routes, Client, EmbedBuilder } = require('discord.js');
const axios = require('axios');
var Chance = require('chance');
require('dotenv').config();

const rest = new REST({ version: '10' }).setToken(process.env['TOKEN']);

const commands = [
    {
      name: 'beef-knight-about',
      description: 'Beef ping'
    },
    {
      name: 'insult-roulette',
      description: 'Someone needs to be put in their place. But careful - it could be you'
    }
  ];

(async () => {
    try {
      console.log('Started refreshing application (/) commands');
  
      await rest.put(Routes.applicationCommands(process.env['APP_ID']), { body: commands });
  
      console.log('Successfully reloaded application commands');
    } catch (error) {
      console.error(error);
    }
  })();
  
  const client = new Client({ intents: [] });
  
  client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}, ${client.user.id}`);
  });

  client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;
  
    if (interaction.commandName === 'beef-knight-about') {
      await interaction.reply('I am Sir Beef Knight, son of the Jerky King (version 1.0.0)');
    } else if (interaction.commandName === 'insult-roulette') {
      try {
        await interaction.deferReply({ ephemeral: false });
        const insulteeList = [
            { 
                insultee: 'Larry',
                compatibility: 'M'
            },
            { 
                insultee: 'hananiah',
                compatibility: 'M'
            },
            { 
                insultee: 'ppfish',
                compatibility: 'F'
            },
            { 
                insultee: 'step lively now',
                compatibility: 'M'
            },
            { 
                insultee: 'TittySprinkles',
                compatibility: 'F'
            },
        ]
        const chanceObj = new Chance();
        const insulteeIdx = chanceObj.integer({min: 0, max: insulteeList.length-1});
        const insulteeConfig = insulteeList[insulteeIdx];

        const reqUrl = `${process.env['INSULTS_API']}?insultee=${insulteeConfig.insultee}&compatibility=${insulteeConfig.compatibility}`;
        axios.get(reqUrl, {
          headers: {
            'client-id': 'beef-knight',
            'client-secret': process.env['INSULTS_API_SECRET']
          }
        }).then(async res => {
          const embed = new EmbedBuilder()
            .setColor('#70f8ba')
            .setTitle(res.data.insultText);
            interaction.editReply({ embeds: [embed] });
        }).catch(httpErr => {
          let message = 'The http code didnt work today';
          if (httpErr.message) {
            message += ': ' + httpErr.message;
          }
          interaction.editReply(message);
        });
      } catch (error) {
        interaction.editReply('The code didnt work today');
      }      
    }
  });

  client.login(process.env['TOKEN']);
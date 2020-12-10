//Getting all the required assets

const Discord = require("discord.js");
const { Client, Collection } = require("discord.js");
const { readdirSync } = require("fs");
const { join } = require("path");
const { TOKEN, PREFIX, SERVER_NAME } = require("./config.json");
const createCaptcha = require("./commands/captcha");
const fs = require('fs').promises;
const db = require('quick.db');
const Canvas = require("discord-canvas");
const keepAlive = require('./server1');
const { Intents } = require("discord.js");
const client = new Client({ disableMentions: "everyone"}); //Disabling mentions for @everyone

//keepAlive() makes our server. Useful when using some host like repl.it

keepAlive();

client.login(TOKEN); //Login into the client

client.commands = new Collection();
client.prefix = PREFIX; //Prefix
const cooldowns = new Collection();
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); //Regex


client.on("ready", () => {
  console.log(`\n${client.user.username} ready!`);
  client.user.setActivity(`Over ${client.users.cache.size} members.`, { type : 'WATCHING' }); //Set Status
});
client.on("warn", (info) => console.log(info));
client.on("error", console.error);

// This is where our command handling begins
//This will take all files with ends with '.js' in the directory 'commands/'
const commandFiles = readdirSync(join(__dirname, "commands")).filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
  const command = require(join(__dirname, "commands", `${file}`));
  client.commands.set(command.name, command);
}

//Message Event So when somone uses a command, the bot can reply
//Made this asynchronous so promises are resolved

client.on("message", async (message) => {
  if (message.author.bot) return;
  xp(message); //Levelling System
  
  const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(PREFIX)})\\s*`); //This makes the commands work even if the bot is tagged
  if (!prefixRegex.test(message.content)) return; //Return if message doesn't start with prefix

  const [, matchedPrefix] = message.content.match(prefixRegex);

  const args = message.content.slice(matchedPrefix.length).trim().split(/ +/); //Taking User Arguments
  const commandName = args.shift().toLowerCase(); //Command Name 

//Handling our commands
  const command =
    client.commands.get(commandName) ||
    client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName)); //Works with bot aliases and command name

  if (!command) return; //Return if no command found

 
  try {
    command.execute(message, args, client); // Execute the command
  } catch (error) { //If we get an error, return an error message and log it to the console
    console.error(error);
    message.reply("There was an error executing that command.").catch(console.error);
  }
});

function xp(message) {
  if(!message.guild) return; //Return if message is not in a guild
  const random = Math.floor(Math.random() * 10) + 15; //Just a random amount
  db.add(`guild_${message.guild.id}_xp_${message.author.id}`, random); //Add the xp to the author
  db.add(`guild_${message.guild.id}_xptotal_${message.author.id}`, random); //Add to the total xp of the author
  var level = db.get(`guild_${message.guild.id}_level_${message.author.id}`) || 1; //Getting the level of the author
  var xp = db.get(`guild_${message.guild.id}_xp_${message.author.id}`); //Getting the XP of the author
  var xpNeeded = level * 500 //Needed XP for next level
  if(xpNeeded < xp){ //If current xp is greater than neeedXP
    var newLevel = db.add(`guild_${message.guild.id}_level_${message.author.id}`, 1); //Add a level
    db.subtract(`guild_${message.guild.id}_xp_${message.author.id}`, xpNeeded); //Subtract the needed xp
    message.channel.send(`${message.author}, you have levelled up to ${newLevel}`) //Send a level up message
  }
}

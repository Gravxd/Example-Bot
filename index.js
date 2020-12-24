const {
  Client,
  RichEmbed
} = require("discord.js");
const Discord = require("discord.js");
const client = new Client({
  disableEveryone: false //  If set to 'true', the bot will be unable to ping @everyone // if set to false the bot is able to use @everyone
});

const main_server = client.guilds.find(g => g.id === 'serveridhere')
client.user.setPresence({
        status: "online",
        game: {
            name: `over ${main_server.memberCount} members!`, // this will display the membercount of the server id you provided above
            type: "Watching",
        }
    })
client.on('ready', () => { // when the bot is online
  console.log(`Bot is online! - Logged in as: ${client.user.tag}`); // logs to console that the bot is online and shows the bot's discord tag
});
 
client.on('message', message => { // if the bot detects a message being sent
  if(message.content === '-ping') { // if that message that was sent says: '-ping' then continue
    message.channel.send(`Pong!`) // message.channel = the channel that the message was sent in. the bot will send 'Pong!' into that channel
  }
});



client.on('message', message => { // if the bot detects a message being sent
  if(message.content === '-help') { // if that message was '-help', continue
    const helpembed = new RichEmbed() // create the embed under the name 'helpembed'
    .setColor("RED") // set the color of the embed. / To change colors, you can use hex values such as #fff000
    .setTitle("This is a title... wow!") // sets the title
    .setDescription("If you need help, contact a staff member!")
    .setFooter("-help - Cool Bot!"); // displays a small tag at the bottom of the embed. / Can be used for the name of the bot such as "Grav Network - 2020"
    message.channel.send(helpembed) // in the channel that the message was sent, we are sending 'helpembed'. helpembed is the embed we made in line 23.
  }
});


//sends a message if someone joins the server
client.on('guildMemberAdd', member => {
  const welcomechannel = member.guild.channels.find(channel => channel.name === 'welcome') // change 'welcome' to the name of the channel you want the message to be sent
  const welcomeembed = new RichEmbed() // make the embed
  .setColor("BLUE") // set the color 
  .setTitle("Member Joined!") // set the title
  .setDescription(`Welcome to the server ${member}`); // ${member} means that it will tag the member in the embed. This can be changed. For example: ${member.tag} would display their tag. ${member.id} displays their discord id
  welcomechannel.send(welcomeembed) // in the welcome channel, send the embed we made (welcomeembed)
});

// then we can use the same code with a slight change


// this will send a message if someone leaves the server
client.on('guildMemberRemove', member => {
  const welcomechannel = member.guild.channels.find(channel => channel.name === 'welcome') // change 'welcome' to the name of the channel you want the message to be sent
  const welcomeembed = new RichEmbed() // make the embed
  .setColor("GREEN") // set the color 
  .setTitle("Member Left!") // set the title
  .setDescription(`Thanks for stopping bye! ${member}`); // ${member} means that it will tag the member in the embed. This can be changed. For example: ${member.tag} would display their tag. ${member.id} displays their discord id
  welcomechannel.send(welcomeembed) // in the welcome channel, send the embed we made (welcomeembed)
});

// this code will add a role to someone
client.on('message', message => {
  if(message.channel.type === 'dm') return; // if the message that is sent is via dm, then return.
  if(message.content.startsWith('-adddogrole')) { // if the message someone has sent, begins with '-adddogrole' then continue
  const targetmember = message.mentions.members.first(); // the member that we want to add the role to is the person that is mentioned first in the -addrole message
  if(!targetmember) return message.channel.send("please mention someone to add the role!"); // !targetmember means no target member. So if no member is provided then it cancels and sends a message into the channel saying to please provide someone.
  const dogrole = message.guild.roles.find(role => role.name === 'dog'); // look for the role called 'dog'.
  if(!dogrole) return message.channel.send("please setup a role called 'dog'");  // if there is no role found called 'dog' then cancel and send a message to tell them to set it up
  targetmember.addRole(dogrole.id) // adds the role that we setup to the target member. 
  message.channel.send(`${targetmember} has now got the dog role`) // sends a success message in the channel. ${targetmember} will mention the person that the dog role was added to
}
});


client.login('tokenhere'); // replace 'tokenhere' with your bot's token. if you do not know how to get one, please follow the instructions in readme file.

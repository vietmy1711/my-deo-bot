// Require the necessary discord.js classes
const { Client, GatewayIntentBits } = require("discord.js");
const { token, defaultPrefix } = require("./config.json");
const { Player } = require("discord-player");

// const player = new Player(client);

// Create a new client instance
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

// When the client is ready, run this code (only once)
client.once("ready", () => {
  console.log("Ready!");
});

client.on("messageCreate", (message) => {
  //stop code execution if message is received in DMs
  if (!message.guildId) return;

  //rest of the message event
  if (!message.content.startsWith(defaultPrefix)) return;
  let args = message.content.slice(defaultPrefix.length).split(" ");
  console.log(args);
  if (args[0].toLowerCase() === "chửi") {
    if (args[1] && args[1].toLowerCase() === "thằng") {
      if (args[2]) {
        let name = message.content.slice("myoi chửi thằng ".length);
        if (name.toLowerCase().startsWith("mỹ")) {
          return message.channel.send(`Địt mẹ mày ${message.author.username}!`);
        }
        return message.channel.send(`Địt mẹ mày ${name}!`);
      }
    }
  }

  return message.channel.send("Kêu con cặc");
});

// Login to Discord with your client's token
client.login(token);

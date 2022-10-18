// Require the necessary discord.js classes
const { Client, GatewayIntentBits } = require("discord.js");
const { token, defaultPrefix } = require("./config.json");
const { Player } = require("discord-player");
const { joinVoiceChannel } = require("@discordjs/voice");

let connection;

// Create a new client instance
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

const player = new Player(client, {
  ytdlOptions: { quality: "highestaudio" },
});

player.on("trackAdd", (queue, track) => {
  console.log(track);
  queue.metadata.channel.send(
    `Thêm vào hàng chờ **${track.title}**: ${track.url} !`
  );
});

player.on("trackStart", (queue, track) => {
  console.log(track);
  queue.metadata.channel.send(`Đang mở **${track.title}**: ${track.url} !`);
});

player.on("trackEnd", (queue, track) => {
  console.log(track);
  queue.metadata.channel.send(`Vừa hết bài **${track.title}**: ${track.url} !`);
});

player.on("error", (queue, error) => {
  console.log(error);
  queue.metadata.channel.send(`Error: **${error}**!`);
});

player.on("debug", (queue, debug) => {
  console.log(debug);
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
  // console.log(args);
  if (args[0].toLowerCase() === "chửi") {
    if (args[1] && args[1].toLowerCase() === "thằng") {
      if (args[2]) {
        let name = message.content.slice("myoi chửi thằng ".length);
        if (name.toLowerCase().startsWith("mỹ")) {
          return message.channel.send(`Địt mẹ mày ${message.member.nickname}!`);
        }
        return message.channel.send(`Địt mẹ mày ${name}!`);
      }
    }
  }
  if (args[0].toLowerCase() === "play") {
    if (
      !(message.member.voice.channelId && message.guild.voiceAdapterCreator)
    ) {
      return message.channel.send("Vào voice channel mới play được");
    }
    connection = joinVoiceChannel({
      channelId: message.member.voice.channelId,
      guildId: message.guildId,
      adapterCreator: message.guild.voiceAdapterCreator,
    });

    const queue = player.createQueue(message.channel.guild, {
      metadata: {
        channel: message.channel,
      },
    });

    let query = message.content.slice(defaultPrefix.length);
    player
      .search(query, {
        requestedBy: message.member,
      })
      .then((x) => x.tracks[0])
      .then(async (track) => {
        if (!track) return message.channel.send("Search k ra bài đó");
        await queue.connect(message.member.voice.channel);
        queue.addTrack(track);
        queue.play();
      });

    return message.channel.send("ok bru");
  }
  if (args[0].toLowerCase() === "skip") {
    const queue = player.createQueue(message.channel.guild, {
      metadata: {
        channel: message.channel,
      },
    });
    queue.skip();
  }

  if (
    args[0].toLowerCase() === "stop" ||
    args[0].toLowerCase() === "disconnect"
  ) {
    if (
      !(message.member.voice.channelId && message.guild.voiceAdapterCreator)
    ) {
      return message.channel.send("Vào voice channel mới gọi được");
    }
    if (connection) connection.destroy();
    return message.channel.send("ok bru");
  }

  return message.channel.send("Kêu con cặc");
});

client.login(token);

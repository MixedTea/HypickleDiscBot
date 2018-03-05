const Discord = require('discord.js');
const Config = require("./config");
const request = require("request");
const https = require("https");
const downIMG = require("download-image");

const TOKEN = Config.TOKEN;
const PREFIX = Config.PREFIX;

var fortunes = Config.fortunes;

var download = function(uri, filename, callback){
    request.head(uri, function(err, res, body){
      console.log('content-type:', res.headers['content-type']);
      console.log('content-length:', res.headers['content-length']);
  
      request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
  };


  var bot = new Discord.Client();


  bot.on("ready", function () {
    console.log("I am ready");
});

bot.on('message', function (msg) {
    if (msg.author.equals(bot.user)) {
        return;
    }

    if (!msg.content.startsWith(PREFIX)) return;

    var args = msg.content.substring(PREFIX.length).split(" ");

    switch (args[0].toLowerCase()) {
        case "ping":
            msg.channel.send("Pong!");
            break;
        case "info":
            var eInfo = new Discord.RichEmbed()
                .addField("Discord Bot Info", Config.info)
                .setThumbnail(msg.author.avatarURL);
            msg.channel.send(eInfo);
            break;
        case "8ball":
            if (args[1]) {
                msg.channel.send(fortunes[Math.floor(Math.random() * fortunes.length)]);
            } else {
                msg.channel.send("Maybe, ask a question?");
            }
            break;
        case "player":
            var playerUUID;
            var playerNameCaps;
            //https://api.mojang.com/users/profiles/minecraft/<username>
            https.get('https://api.mojang.com/users/profiles/minecraft/' + args[1], res => {
                res.setEncoding("utf8");
                let body = "";
                res.on('data', data => {
                    body += data;
                });
                res.on('end', () => {
                    body = JSON.parse(body);
                    console.log(body.id + " " + body.name);
                    playerUUID = body.id;
                    playerNameCaps = body.name;
                });
            });
            
            var ePlayer = new Discord.RichEmbed()
                .setTitle("Information on player " + playerNameCaps)
                .setThumbnail("https://visage.surgeplay.com/head/" + playerUUID);
            msg.channel.send(ePlayer);
            console.log(playerUUID);
            break;
        default:
            msg.channel.send("Invalid command!");
    }
});

bot.login(TOKEN);
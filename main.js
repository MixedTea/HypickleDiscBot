const Discord = require('discord.js');
const Config = require("./config");
const request = require("request");
const https = require("https");


const TOKEN = Config.TOKEN;
const PREFIX = Config.PREFIX;

var fortunes = Config.fortunes;

var bot = new Discord.Client();


bot.on("ready", function () {
    console.log("I am ready");
});

bot.on('message', function (msg) {
    if (msg.author.equals(bot.user)) {
        return;
    } else {
        //Logger//
        var eLog = new Discord.RichEmbed()
            .setTitle(msg.author.username)
            .setDescription(msg.content)
            .setThumbnail(msg.author.avatarURL);
        msg.guild.channels.find("name", "logs").send(eLog);
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
                    playerUUID = body.id;
                    playerNameCaps = body.name;
                    var ePlayer = new Discord.RichEmbed()
                        .setTitle("Information on player " + playerNameCaps)
                        .setThumbnail("https://visage.surgeplay.com/head/" + playerUUID)
                        .addField("Hypixel stats: ", "https://plancke.io/hypixel/player/stats/" + playerNameCaps)
                        .addField("NameMC Stats: ", "https://namemc.com/name/" + playerNameCaps);
                    msg.channel.send(ePlayer);
                });
            });
            break;


        case "namehistory":
            https.get('https://api.mojang.com/users/profiles/minecraft/' + args[1], res => {
                res.setEncoding("utf8");
                let body = "";
                res.on('data', data => {
                    body += data;
                });
                res.on('end', () => {
                    body = JSON.parse(body);
                    console.log(body.id);
                    //https://api.mojang.com/user/profiles/<uuid>/names
                    https.get('https://api.mojang.com/user/pr7ofiles/' + body.id + '/names', resp => {
                        let names = "";
                        resp.on('data', data => {
                            names += data;
                        });
                        resp.on('end', () => {
                            names = JSON.parse(names);
                            var eNames = new Discord.RichEmbed()
                                .setDescription(body.name + "'s name history:");
                            for(var i = 0; i < names.length; i++){
                                eNames.addField("Name #" + (i + 1), names[i].name);
                            }
                            msg.channel.send(eNames);
                        });
                    });
                });
            });
            break;
        default:
            msg.channel.send("Invalid command!");
    }
});

bot.login(TOKEN);
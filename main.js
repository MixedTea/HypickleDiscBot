const Discord = require('discord.js');
const Config = require("./config");
const https = require("https");

const TOKEN = Config.TOKEN;
const PREFIX = Config.PREFIX;
const API_KEY = Config.API_KEY;


var fortunes = Config.fortunes;

var bot = new Discord.Client();



bot.on("ready", function () {
    console.log("I am ready");
    bot.user.setActivity("on " + bot.guilds.size + " servers");
});
bot.on("guildCreate", () => {
    bot.user.setActivity("on " + bot.guilds.size + " servers");
});
bot.on("guildDelete", () => {
    bot.user.setActivity("on " + bot.guilds.size + " servers");
});
bot.on('message', function (msg) {
    if (msg.author.equals(bot.user)) {
        return;
    } else {
        //Logger//
        /*
        var eLog = new Discord.RichEmbed()
            .setTitle(msg.author.username)
            .setDescription(msg.content)
            .setThumbnail(msg.author.avatarURL);
            
        try{
            msg.guild.channels.find("name", "logs").send(eLog);
        } catch (e){
            console.log("Server doesn't have a 'logs' channel!");
        }
        */
        if (msg.content.indexOf("discord bots are bad") > 0 || (msg.content.indexOf("discord bots") > 0 && msg.content.indexOf("are bad") > 0) || (msg.content.indexOf("discord") > 0 && msg.content.indexOf("bots") > 0 && msg.content.indexOf("are") > 0 && msg.content.indexOf("bad") > 0)) {
            msg.channel.send("no u");
        }
        if (msg.content == "discord bots are bad") {
            msg.channel.send("wana get banhammered?");
        }
        if (msg.content == "ur mom gay") {
            msg.channel.send("no u");
        }
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
                .setThumbnail(bot.user.avatarURL);
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
            https.get('https://api.mojang.com/users/profiles/minecraft/' + args[1], res => {
                res.setEncoding("utf8");
                let body = "";
                let err = false;
                res.on('data', data => {
                    body += data;
                });
                res.on("error", () => {
                    msg.channel.send("Invalid Username! Try checking your spelling.");
                });
                res.on('end', () => {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {
                        msg.channel.send("Invalid Username!");
                        err = true;
                    }
                    if (!err) {
                        console.log(body.id);
                        //https://api.mojang.com/user/profiles/<uuid>/names
                        https.get('https://api.mojang.com/user/profiles/' + body.id + '/names', resp => {
                            let names = "";
                            resp.on('data', data => {
                                names += data;
                            });
                            resp.on('end', () => {
                                var ePlayer = new Discord.RichEmbed()
                                    .setTitle("Information on player " + body.name)
                                    .setThumbnail("https://visage.surgeplay.com/full/" + body.id)
                                    .addField("Hypixel stats: ", "https://plancke.io/hypixel/player/stats/" + body.name)
                                    .addField("NameMC Stats: ", "https://namemc.com/name/" + body.name);
                                msg.channel.send(ePlayer);
                                names = JSON.parse(names);
                                var eNames = new Discord.RichEmbed()
                                    .setDescription(body.name + "'s name history:");
                                for (var i = 0; i < names.length; i++) {
                                    eNames.addField("Name #" + (i + 1), names[i].name);
                                }
                                msg.channel.send(eNames);
                                resp.on("error", () => {
                                    msg.channel.send("Invalid Username! Try checking your spelling.");
                                });

                            });

                        });
                    }
                });
            });
            break;

        case "skin":
            https.get('https://api.mojang.com/users/profiles/minecraft/' + args[1], res => {
                res.setEncoding("utf8");
                let body = '';
                let err = false;
                res.on('data', data => {
                    body += data;
                });
                res.on('end', () => {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {
                        console.log(e);
                        msg.channel.send("Invalid Username! Try checking your spelling!");
                        err = true;
                    }
                    if (!err) {
                        var eSkin = new Discord.RichEmbed()
                            .setTitle(body.name + "'s skin:")
                            .setImage("https://visage.surgeplay.com/full/" + body.id)
                            .setThumbnail("https://visage.surgeplay.com/skin/" + body.id)
                            .setDescription("https://namemc.com/profile/" + body.name);
                        msg.channel.send(eSkin);
                    }
                });
            });
            break;
        case "help":
            var eHelp = new Discord.RichEmbed()
                .setThumbnail(bot.user.avatarURL)
                .setTitle("Commands:")
                .setColor('BLUE');
            for (var i = 0; i < Config.commands.length; i++) {
                eHelp.addField(Config.commands[i].name, Config.commands[i].description + "\nUse: " + Config.commands[i].use);
            }
            msg.channel.send(msg.author + "Sent you a dm with a list of commands!");
            msg.author.send(eHelp);
            break;
        case "hypixel":
            https.get('https://api.hypixel.net/player?key=' + API_KEY + '&name=' + args[1], res => {
                let body = '';
                res.on('data', (data) => {
                    body += data;
                });
                res.on('end', () => {
                    var err = false;
                    try {
                        body = JSON.parse(body);
                    } catch(e) {
                        msg.channel.send("Invalid username!");
                        err = true;
                    }
                    if(body.player == null){
                        err = true;
                        msg.channel.send("Invalid Username!");
                    }
                    if(!err) {
                        var skywars_wins = body.player.achievements.skywars_wins_solo + body.player.achievements.skywars_wins_team + body.player.achievements.skywars_wins_mega;
                        var skywars_kills = body.player.achievements.skywars_kills_solo + body.player.achievements.skywars_kills_team + body.player.achievements.skywars_kills_mega;
                        var bedwars_wins = body.player.achievements.bedwars_wins;
                        var bedwars_stars = body.player.achievements.bedwars_level;
                        var uhc_stars = body.player.achievements.uhc_moving_up;
                        var uhc_wins = body.player.achievements.uhc_champion;
                        var uhc_kills = body.player.achievements.uhc_hunter;       
                        
                        var eStats = new Discord.RichEmbed()
                            .setTitle("Hypixel Stats for player: " + args[1])
                            .setThumbnail('https://visage.surgeplay.com/full/' + body.player._id)
                            .addField("Skywars Wins (Doesn't include ranked wins): ", skywars_wins, false)
                            .addField('Skywars Kills: ', skywars_kills, true)
                            .addField('Bedwars Wins: ', bedwars_wins, false)
                            .addField("Bedwars Stars: ", bedwars_stars, true)
                            .addField("UHC Score: ", uhc_stars, false)
                            .addField("UHC Wins: ", uhc_wins, false)
                            .addField("UHC Kills: ", uhc_kills, true);
                        msg.channel.send(eStats);
                    }
                });
            });
            break;
        default:
            msg.channel.send("Invalid command!");
    }
});

bot.login(TOKEN);
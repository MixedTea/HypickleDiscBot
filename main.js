const Discord = require('discord.js');
const Config = require("./config");
const https = require("https");
const reference = require('./reference');

const TOKEN = Config.TOKEN;
const PREFIX = reference.PREFIX;
const API_KEY = Config.API_KEY;


var fortunes = reference.fortunes;

var bot = new Discord.Client();

var stars = reference.stars;

bot.on("ready", function () {
    console.log("I am ready");
    bot.user.setActivity("on " + bot.guilds.size + " servers >help");
});
bot.on("guildCreate", () => {
    bot.user.setActivity("on " + bot.guilds.size + " servers. >help");
});
bot.on("guildDelete", () => {
    bot.user.setActivity("on " + bot.guilds.size + " servers. >help");
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
                .addField("Discord Bot Info", reference.info)
                .setThumbnail(bot.user.avatarURL);
            msg.channel.send(eInfo);
            break;
        case "8ball":
            
            if (args[1]) {
                
                if(args[1] == 'is' && args[2] == 'caden' && args[3] == 'racist'){
                    msg.channel.send('Maybe');
                } else {
                    msg.channel.send(fortunes[Math.floor(Math.random() * fortunes.length)]);
                }
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
            for (var i = 0; i < reference.commands.length; i++) {
                eHelp.addField(reference.commands[i].name, reference.commands[i].description + "\nUse: " + reference.commands[i].use);
            }
            msg.channel.send(msg.author + " Sent you a dm with a list of commands!");
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
                        var skywars_wins = body.player.stats.SkyWars.wins;
                        var skywars_kills = body.player.stats.SkyWars.kills;
                        var bedwars_wins = body.player.achievements.bedwars_wins;
                        var bedwars_stars = body.player.achievements.bedwars_level;
                        var uhc_score = body.player.achievements.uhc_moving_up;
                        var uhc_wins = body.player.achievements.uhc_champion;
                        var uhc_kills = body.player.achievements.uhc_hunter;       
                        var uhc_stars;
                        console.log(body.player.stats.SkyWars.wins);
                        if(uhc_score >= 25210){
                            uhc_stars = 15;
                        } else if(uhc_score >= 22210){
                            uhc_stars = 14;
                        } else if(uhc_score >= 19210){
                            uhc_stars = 13;
                        } else if(uhc_score >= 16210){
                            uhc_stars = 12;
                        } else if(uhc_score >= 13210){
                            uhc_stars = 11;
                        } else if(uhc_score >= 10210){
                            uhc_stars = 10;
                        } else if(uhc_score >= 5210){
                            uhc_stars = 9;
                        } else if(uhc_score >= 2710){
                            uhc_stars = 8;
                        } else if(uhc_score >= 1710){
                            uhc_stars = 7;
                        } else if(uhc_score >= 960){
                            uhc_stars = 6;
                        } else if(uhc_score >= 460){
                            uhc_stars = 5;
                        } else if(uhc_score >= 210){
                            uhc_stars = 4;
                        } else if(uhc_score >= 60){
                            uhc_stars = 3;
                        } else if(uhc_score >= 10){
                            uhc_stars = 2;
                        } else if(uhc_score >= 0){
                            uhc_stars = 1;
                        }

                        var eStats = new Discord.RichEmbed()
                            .setTitle("Hypixel Stats for player: " + args[1])
                            .setThumbnail('https://visage.surgeplay.com/full/' + body.player._id)
                            .addField("Skywars Wins: ", skywars_wins, false)
                            .addField("Skywars Kills:  ", skywars_kills, true)
                            .addField('Bedwars Wins: ', bedwars_wins, false)
                            .addField("Bedwars Stars: ", bedwars_stars, true)
                            .addField("UHC Score: ", uhc_score, false)
                            .addField("UHC Stars: ", uhc_stars)
                            .addField("UHC Wins: ", uhc_wins, false)
                            .addField("UHC Kills: ", uhc_kills, true)
                            .setColor("DARK_GREEN");
                        msg.channel.send(eStats);
                    }
                });
            });
            break;
        case "caden": 
            msg.channel.send("Who knows he might be racist");
            break;
        default:
            msg.channel.send("Invalid command!");
    }
});

bot.login(TOKEN);
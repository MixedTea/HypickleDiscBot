const Discord = require('discord.js');
//const Config = require("./config");
const https = require("https");
const reference = require('./reference');

const TOKEN = process.env.TOKEN;
const PREFIX = reference.PREFIX;
const API_KEY = process.env.API_KEY;


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
  /*      case "ping":
            msg.channel.send("Pong!");
            break; */
        case "info":
            var eInfo = new Discord.RichEmbed()
                .addField("Discord Bot Info", reference.info)
                .setThumbnail(bot.user.avatarURL);
            msg.channel.send(eInfo);
            break;
        case "8ball":

            if (args[1]) {

                if (args[1] == 'is' && args[2] == 'caden' && args[3] == 'racist') {
                    msg.channel.send('Maybe');
                } else if (args[1] == "am" && args[2] == "i" && args[3] == "suicidal") {
                    msg.channel.send("Aren't we all?");
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
                    } catch (e) {
                        msg.channel.send("Invalid username!");
                        err = true;
                    }
                    if (body.player == null) {
                        err = true;
                        msg.channel.send("Invalid Username!");
                    }
                    if (!err) {
                        var skywars_wins = body.player.stats.SkyWars.wins;
                        var skywars_kills = body.player.stats.SkyWars.kills;
                        var bedwars_wins = body.player.achievements.bedwars_wins;
                        var bedwars_stars = body.player.achievements.bedwars_level;
                        var uhc_score = body.player.achievements.uhc_moving_up;
                        var uhc_wins = body.player.achievements.uhc_champion;
                        var uhc_kills = body.player.achievements.uhc_hunter;
                        var uhc_stars;
                        console.log(body.player.stats.SkyWars.wins);
                        if (uhc_score >= 25210) {
                            uhc_stars = 15;
                        } else if (uhc_score >= 22210) {
                            uhc_stars = 14;
                        } else if (uhc_score >= 19210) {
                            uhc_stars = 13;
                        } else if (uhc_score >= 16210) {
                            uhc_stars = 12;
                        } else if (uhc_score >= 13210) {
                            uhc_stars = 11;
                        } else if (uhc_score >= 10210) {
                            uhc_stars = 10;
                        } else if (uhc_score >= 5210) {
                            uhc_stars = 9;
                        } else if (uhc_score >= 2710) {
                            uhc_stars = 8;
                        } else if (uhc_score >= 1710) {
                            uhc_stars = 7;
                        } else if (uhc_score >= 960) {
                            uhc_stars = 6;
                        } else if (uhc_score >= 460) {
                            uhc_stars = 5;
                        } else if (uhc_score >= 210) {
                            uhc_stars = 4;
                        } else if (uhc_score >= 60) {
                            uhc_stars = 3;
                        } else if (uhc_score >= 10) {
                            uhc_stars = 2;
                        } else if (uhc_score >= 0) {
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
        case "compare":

            if (!args[1] || !args[2]) {
                msg.channel.send(msg.author + " What two players do you want to compare?\n>compare [player1] [player2]");
                break;
            }
            var player1SkywarsKDR = 0;
            var player1BedwarsFinalKDR = 0;
            var player1UhcKDR = 0;
            var player1score = 0;
            var player2SkywarsKDR = 0;
            var player2BedwarsFinalKDR = 0;
            var player2UhcKDR = 0;
            var player2score = 0;
            //getting player1 stats
            https.get('https://api.hypixel.net/player?key=' + API_KEY + '&name=' + args[1], res => {
                let body = '';
                var err = false;
                res.on("data", data => {
                    body += data;
                });
                res.on('end', () => {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {
                        msg.channel.send(msg.author + " Player1 is an invalid username!");
                        err = true;
                    }
                    if (body.player == null) {
                        msg.channel.send(msg.author + " Player1 is an invalid username!");
                        err = true;
                    }
                    if (!err) {
                        player1SkywarsKDR = body.player.stats.SkyWars.kills / body.player.stats.SkyWars.deaths;
                        player1BedwarsFinalKDR = body.player.stats.Bedwars.final_kills_bedwars / body.player.stats.Bedwars.final_deaths_bedwars;
                        player1UhcKDR = body.player.stats.UHC.kills / body.player.stats.UHC.deaths;
                        console.log(player1BedwarsFinalKDR + " " + player1SkywarsKDR + " " + player1UhcKDR);
                        //get player2 stats
                        https.get('https://api.hypixel.net/player?key=' + API_KEY + '&name=' + args[2], resp => {
                            let info = '';
                            var error = false;
                            resp.on("data", data => {
                                info += data;
                            });
                            resp.on('end', () => {
                                try {
                                    info = JSON.parse(info);
                                } catch (e) {
                                    msg.channel.send(msg.author + " Player2 is an invalid username!");
                                    error = true;
                                }
                                if (info.player == null) {
                                    msg.channel.send(msg.author + " Player2 is an invalid username!");
                                    error = true;
                                }
                                if (!error) {
                                    player2SkywarsKDR = info.player.stats.SkyWars.kills / info.player.stats.SkyWars.deaths;
                                    player2BedwarsFinalKDR = info.player.stats.Bedwars.final_kills_bedwars / info.player.stats.Bedwars.final_deaths_bedwars;
                                    player2UhcKDR = info.player.stats.UHC.kills / info.player.stats.UHC.deaths;
                                    console.log(player2BedwarsFinalKDR + " " + player2SkywarsKDR + " " + player2UhcKDR);
                                    //actually compare
                                    if (player1SkywarsKDR > player2SkywarsKDR) {
                                        player1score++;
                                    } else if (player2SkywarsKDR > player1SkywarsKDR) {
                                        player2score++;
                                    } else {
                                        console.log("something went wrong1");
                                    }
                                    if (player1BedwarsFinalKDR > player2BedwarsFinalKDR) {
                                        player1score++;
                                    } else if (player2BedwarsFinalKDR > player1BedwarsFinalKDR) {
                                        player2score++;
                                    } else {
                                        console.log("something went wrong2");
                                    }
                                    if (player1UhcKDR > player2UhcKDR) {
                                        player1score++;
                                    } else if (player2UhcKDR > player1UhcKDR) {
                                        player2score++;
                                    } else {
                                        console.log("something went wrong3");
                                    }
                                    console.log(player1BedwarsFinalKDR);
                                    //final decision
                                    console.log(player1score);
                                    console.log(player2score);
                                    if (player1score > player2score) {
                                        var eVictory = new Discord.RichEmbed()
                                            .setTitle(args[1] + ' is better than ' + args[2] + "!")
                                            .setColor("BLUE");
                                        msg.channel.send(eVictory);
                                    } else if (player2score > player1score) {
                                        var eVictory = new Discord.RichEmbed()
                                            .setTitle(args[2] + ' is better than ' + args[1] + "!")
                                            .setColor("BLUE");
                                        msg.channel.send(eVictory);
                                    } else if (player1score == player2score){
                                            var eVictory = new Discord.RichEmbed()
                                            .setTitle("Its a tie!")
                                            .setColor("BLUE");
                                        msg.channel.send(eVictory);
                                    }
                                    if(args[3] == "stats"){
                                        var eStats = new Discord.RichEmbed()
                                            .setTitle("Stats of comparison: ")
                                            .addField(args[1]+ "'s Skywars KDR:", player1SkywarsKDR.toFixed(2), false)
                                            .addField(args[1]+ "'s UHC Champions KDR:", player1UhcKDR.toFixed(2),false)
                                            .addField(args[1]+ "'s Bedwars Final KDR:", player1BedwarsFinalKDR.toFixed(2), false)
                                            .addField(args[2]+ "'s Skywars KDR:", player2SkywarsKDR.toFixed(2), false)
                                            .addField(args[2]+ "'s Bedwars Final KDR:", player2BedwarsFinalKDR.toFixed(2), false)
                                            .addField(args[2]+ "'s UHC Champions KDR:", player2UhcKDR.toFixed(2), false)
                                            .setColor("GREEN");
                                        msg.channel.send(eStats);
                                    }
                                }
                            });
                        });
                    }
                });
            });

            break;
        default:
            msg.channel.send("Invalid command!");
    }
});

bot.login(TOKEN);
const Discord = require('discord.js');
const Config = require("./config");


const TOKEN = Config.TOKEN;
const PREFIX = Config.PREFIX;

var fortunes = Config.fortunes;

var bot = new Discord.Client();

bot.on("ready", function() {
    console.log("I am ready");
});

bot.on('message', function(msg){
    if(msg.author.equals(bot.user)){
        return;
    }

    if(!msg.content.startsWith(PREFIX)) return;

    var args = msg.content.substring(PREFIX.length).split(" ");

    switch(args[0].toLowerCase()){
        case "ping":
            msg.channel.send("Pong!");
            break;
        case "info":
        var embed = new Discord.RichEmbed()
            .addField("Discord Bot Info", Config.info)
            .setThumbnail(msg.author.avatarURL);
            msg.channel.send(embed);
            break;
        case "8ball":
            if(args[1]){
                msg.channel.send(fortunes[Math.floor(Math.random()* fortunes.length)]);
            } else {
                msg.channel.send("Maybe, ask a question?");
            }
            break;
        default:
        msg.channel.send("Invalid command!");
    }
});

bot.login(TOKEN);
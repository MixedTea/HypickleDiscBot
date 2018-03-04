const Discord = require('discord.js');
const Config = require("./config");


const TOKEN = Config.TOKEN;
const PREFIX = Config.PREFIX;

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
            msg.channel.send(Config.info);
            break;
        case "8ball":
            break;
    }
});

bot.login(TOKEN);
const Discord = require('discord.js');
const Config = require("./config");
const commands = require("./commands/commands.js");
const musicCommands = require("./commands/musicCommands.js");

const TOKIN = Config.TOKEN;
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

    var args = msg.content.subString(PREFIX.length).split(" ");


});
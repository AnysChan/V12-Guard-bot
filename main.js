const Discord = require('discord.js');
const fs = require("fs");
const ayarlar = require("./ayarlar.json");
const client = new Discord.Client();
client.setMaxListeners(20);


/////--Korumalar--/////


//Kanal koruma

client.on("channelDelete", async function(channel) {
if(channel.guild.id !== "Sunucu ID") return;//Sunucu ıd'si
    let logs = await channel.guild.fetchAuditLogs({type: 'CHANNEL_DELETE'});
    if(logs.entries.first().executor.bot) return;
    channel.guild.member(logs.entries.first().executor).roles.filter(role => role.name !== "@everyone").array().forEach(role => {
              channel.guild.member(logs.entries.first().executor).removeRole(channel.guild.roles.get("ROL"))//Kanal silme yetkisi olan rollerin 
              channel.guild.member(logs.entries.first().executor).removeRole(channel.guild.roles.get("ROL"))
    })
const sChannel = channel.guild.channels.find(c=> c.id ==="log Kanalı ID")//Log kanalı ID'si
const cıks = new Discord.RichEmbed()
.setColor('RANDOM')
.setDescription(`${channel.name} adlı Kanal silindi Silen kişinin yetkilerini  çekildi.`)
sChannel.send(cıks)
  
channel.guild.owner.send(` **${channel.name}** adlı Kanal silindi Silen  kişinin yetkilerini aldım:tiks:`)
})


let isProtectionEnabled = false;

client.on("message", async message => {
  if (message.content === "!kanal-koruma aç") {
    if (!message.member.hasPermission("ADMINISTRATOR")) return;

    isProtectionEnabled = true;

    console.log(`Channel protection has been enabled.`);
    message.channel.send("Kanal koruma sistemi açıldı.");
  } else if (message.content === "!kanal-koruma kapat") {
    if (!message.member.hasPermission("ADMINISTRATOR")) return;

    isProtectionEnabled = false;

    console.log(`Channel protection has been disabled.`);
    message.channel.send("Kanal koruma sistemi kapatıldı.");
  }
});

client.on("channelDelete", async channel => {
  if (isProtectionEnabled && channel.type === "text") {
    channel = await channel.guild.channels.create(channel.name, {
      type: channel.type,
      topic: channel.topic,
      position: channel.position,
      permissionOverwrites: channel.permissionOverwrites
    });

    console.log(`"${channel.name}" isimli bir kanal kapatıldı. Yenisini açtım.`);
  }
});


//Rol koruma

let RolKoruma = false;

client.on("message", async message => {
  if (message.content === "!rol-koruma aç") {
    if (!message.member.hasPermission("ADMINISTRATOR")) return;

    RolKoruma = true;

    console.log(`Role protection has been enabled.`);
    message.channel.send("Rol koruma sistemi açıldı.");
  } else if (message.content === "!rol-koruma kapat") {
    if (!message.member.hasPermission("ADMINISTRATOR")) return;

    RolKoruma = false;

    console.log(`Role protection has been disabled.`);
    message.channel.send("Rol koruma sistemi kapatıldı.");
  }
});

client.on("roleDelete", async role => {
  if (RolKoruma) {
    role = await role.guild.roles.create({
      data: {
        name: role.name,
        color: role.color,
        permissions: role.permissions,
        mentionable: role.mentionable
      }
    });

    console.log(`Role "${role.name}" was deleted, recreating it now...`);
  }
});


/////--Koruma bitiş--/////

//Küfür engel

let swearWords = ["am", "Am", "vajina", "Vajina", "anan" ,"Annen", "sik", "Sik", "orospu", "Orospu", "Sg", "sg", "oç", "Oç", "göt", "Göt"];
let swearFilterEnabled = false;

client.on('ready', () => {
  console.log(`Bağlandı! ${client.user.tag}`);
});

client.on('message', msg => {
  if (!swearFilterEnabled) return;
  if (swearWords.some(word => msg.content.includes(word))) {
    msg.delete();
    msg.reply('Bu sunucuda küfür kullanmak yasaktır.').then(sentMessage => {
      sentMessage.delete({timeout: 3000});
    });
  }
});

client.on('message', msg => {
  if (msg.content === '!küfür-filtresi aç') {
    swearFilterEnabled = true;
    msg.reply('Küfür filtresi açıldı.');
  }
  if (msg.content === '!küfür-filtresi kapat') {
    swearFilterEnabled = false;
    msg.reply('Küfür filtresi kapatıldı.');
  }
});


//Reklam Engel//

let antiSpamEnabled = false; // Başlangıçta reklam engelleme sistemi kapalıdır

client.on("message", (message) => {
  if (!antiSpamEnabled) return; // Eğer reklam engelleme sistemi açık değilse, devam etme

  // Burada reklam engelleme kurallarınızı yazın
 if (message.content.includes(".com") || message.content.includes(".xyz") || message.content.includes(".net") || message.content.includes(".tk") || message.content.includes(".pw") || message.content.includes(".me") || message.content.includes(".io") || message.content.includes(".gg") || message.content.includes("https") || message.content.includes("http") || message.content.includes(".org") || message.content.includes("discord.gg") || message.content.includes("youtube.com") || message.content.includes(".gl")) {
    message.delete(); // Reklam içeren mesajı silin
    message.reply("Reklam yapmak yasaktır.").then(sentMessage => {
      sentMessage.delete({ timeout: 5000 }); // 5 saniye sonra uyarı mesajını silin
    });
  }
});

client.on("message", (message) => {
  if (message.content === "!reklam-engelle aç") {
    antiSpamEnabled = true; // Reklam engelleme sistemini açın
    message.reply("Reklam engelleme sistemi açıldı.")

  } else if (message.content === "!reklam-engelle kapat") {
    antiSpamEnabled = false; // Reklam engelleme sistemini kapatın
    message.reply("Reklam engelleme sistemi kapatıldı.")
  }
});


//Everyone engel

let wordFilterEnabled = false;
const filteredWords = ["@everyone", "@here"];

client.on("message", (message) => {
  if (!wordFilterEnabled) return;

  for (let i = 0; i < filteredWords.length; i++) {
    if (message.content.toLowerCase().includes(filteredWords[i].toLowerCase())) {
      message.delete();
   message.reply('Bu sunucuda everyone kullanmak yasaktır.').then(sentMessage => {
      sentMessage.delete({timeout: 3000});
    });
      break;
    }
  }
});

client.on("message", (message) => {
  if (message.content === "!everyone-engelle aç") {
    wordFilterEnabled = true;
    message.reply("Everyone engelleme sistemi açıldı.");
  } else if (message.content === "!everyone-engelle kapat") {
    wordFilterEnabled = false;
    message.reply("Everyone engelleme sistemi kapatıldı.");
  }
});


//Anti raid

client.on("message", async message => {
  if (message.author.bot) return;

  const raidThreshold = 50;
  const raidTimeLimit = 10000;

  if (message.mentions.users.size >= raidThreshold) {
    message.channel.send("Potansiyal bir baskın söz konusu olabilir! Kanal kısa bir süreliğine askıya alındı.");

    message.channel.createOverwrite(message.guild.roles.everyone, {
      SEND_MESSAGES: false
    });

    setTimeout(() => {
      message.channel.createOverwrite(message.guild.roles.everyone, {
        SEND_MESSAGES: null
      });

      message.channel.send("Raid protection has been lifted.");
    }, raidTimeLimit);
  }
});


//Caps engel

client.on("ready", () => {
  console.log(`Bot başladı, ${client.users.cache.size} kullanıcı, ${client.channels.cache.size} kanal ve ${client.guilds.cache.size} sunucuda.`); 
});

let isCapsLockEnabled = false;

client.on("message", async message => {
  if (message.author.bot) return;

  if (isCapsLockEnabled) {
    const messageLowerCase = message.content.toLowerCase();
    if (messageLowerCase !== message.content) {
      return message.delete();
    }
  }
});

client.on("message", async message => {
  if (message.author.bot) return;

  if (!message.content.startsWith("!capslock")) return;
  if (!message.member.hasPermission("ADMINISTRATOR")) return;

  isCapsLockEnabled = !isCapsLockEnabled;
  message.channel.send(`Caps lock şimdi ${isCapsLockEnabled ? "etkin" : "devre dışı"}.`);
});


//Token//


client.login(ayarlar.token);

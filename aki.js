const Discord = require("discord.js");
const client = new Discord.Client();
const ayarlar = require('./config.json');

//İsim////İsim////İsim//
const isimmus = "Aki Bot";
const oynuyormus = "Aki Bot | 'Must#0503 | !aki"; 
//İsim////İsim////İsim//

//durum////durum////durum//
client.on("ready", () => {
    console.log(`${isimmus} Artık Hazır.`);
    client.user.setActivity(`${oynuyormus}`, {type: "LISTENING"})
});
client.on("ready", () => console.log(`Bot Hazır UwU!`))
//durum////durum////durum//



const { Client, MessageEmbed  } = require("discord.js"),
        {     prefix    } = require("./config"),
       
      {          Aki          } = require("aki-api"),
      emojis = ["👍", "👎", "❔", "🤔", "🙄", "❌"],
      Started = new Set();



new Client({messageCacheMaxSize: 50})


.on("message", async message => {
if (message.author.bot || !message.guild) return;
if (message.content.startsWith(prefix + "aki")) {
if(!Started.has(message.author.id))Started.add(message.author.id);
else return message.channel.send("**:x: | Oyun Başladı..**");
  
      const aki = new Aki("tr"); // İsterseniz buradan dili "en" yaparak ingilizce yapabilirsiniz.
      await aki.start();
  
const msg = await message.channel.send(new MessageEmbed()
                                       .setTitle(`${message.author.username}, Soru ${aki.currentStep + 1}`)
                                       .setColor("RANDOM")
                                       .setDescription(`**${aki.question}**\n${aki.answers.map((x, i) => `${x} | ${emojis[i]}`).join("\n")}`));
for(let emoji of emojis)await msg.react(emoji).catch(console.error);
const collector = msg.createReactionCollector((reaction, user) => emojis.includes(reaction.emoji.name) && user.id === message.author.id,{ time: 60000 * 6 });
      collector.on("collect", async (reaction, user) => {
      reaction.users.remove(user).catch(console.error);
if(reaction.emoji.name == "❌")return collector.stop();

await aki.step(emojis.indexOf(reaction.emoji.name));
if (aki.progress >= 70 || aki.currentStep >= 78) {
          await aki.win();
          collector.stop();
          message.channel.send(new MessageEmbed()
              .setTitle("Yapımcım: 'Must#0503' \nKarakterin Bumu?")
              .setDescription(`**${aki.answers[0].name}**\n${aki.answers[0].description}\nRanking as **#${aki.answers[0].ranking}**\n\n[evet (**e**) / hayır (**h**)] \n Doğruysa Evet-e, Yanlışsa Hayır-h`)
              .setImage(aki.answers[0].absolute_picture_path)
              .setColor("RANDOM"));
message.channel.awaitMessages(response => ["evet","e","hayır","h"].includes(response.content.trim().toLowerCase()) &&
response.author.id == message.author.id, { max: 1, time: 30000, errors: ["time"] })
        .then(collected => {
           const content = collected.first().content.trim().toLowerCase();
              if (content == "e" || content == "evet")
                   return message.channel.send(new MessageEmbed()
                    .setColor("RANDOM")
                    .setTitle("Harika! Bir kez daha doğru tahmin ettim.")
                    .setDescription("Seninle oynamayı seviyorum!"));
              else 
                  return message.channel.send(new MessageEmbed()
                    .setColor("RANDOM")
                    .setTitle("Uh. Sen Kazandın!")
                    .setDescription("Seninle oynamayı seviyorum!"));
            });
          return;
        }
         msg.edit(new MessageEmbed()
                  .setTitle(`${message.author.username}, Soru ${aki.currentStep + 1}`)
                  .setColor("RANDOM")
                  .setDescription(`**${aki.question}**\n${aki.answers.map((x, i) => `${x} | ${emojis[i]}`).join("\n")}`));
   });
  
  
  
  
collector.on("end",()=>{ Started.delete(message.author.id);
                         msg.delete({ timeout: 1000 }).catch(()=>{});
                       });   
  
}}).login(ayarlar.token);

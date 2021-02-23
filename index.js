const Discord = require('discord.js');
const fs = require('fs');
let currencyMap = {};
let pointMap = {};
let levelMap = {};
let items = ['Legendary item 1 ', 'Legendary item 2 ']
levelMap = JSON.parse(fs.readFileSync('./levels.json', 'utf8'));
pointMap = JSON.parse(fs.readFileSync('./points.json', 'utf8'));
currencyMap = JSON.parse(fs.readFileSync("./currency.json", "utf8"));
const client = new Discord.Client();
var exp = Math.floor(Math.random() * 20)
var shopMap = {};
shopMap = JSON.parse(fs.readFileSync('./shop.json', 'utf8'));


const prefix = '-';
var version = '1.0.1';
const talkedRecently = new Set();
const daily = new Set();
const rob = new Set();

client.once('ready', () => {
    console.log('your bot name is online!');
});


client.on('message', message => {
    const point = message.mentions.users.first() || message.author
    const pointID = point.id
    const level = message.mentions.users.first() || message.author
    const levelId = level.id
    if (!pointMap[pointID]) {
        pointMap[pointID] = 1
    }
    pointMap[pointID] = pointMap[pointID] + exp
    if (pointMap[pointID] >= 200) {
        const level = message.mentions.users.first() || message.author
        const levelId = level.id
        const target = message.mentions.users.first() || message.author
        levelMap[levelId] += 1
        pointMap[pointID] = 0
        message.channel.send("Level up! " + target + " are now level " + levelMap[levelId]);
    }


    if (!levelMap[levelId]) {
        levelMap[levelId] = 0
    }
    if (!message.content.startsWith(prefix)) return;
    let args = message.content.substring(prefix.length).split(" ");

    switch (args[0]) {

        case 'spam':
            if (!message.member.hasPermission('ADMINISTRATOR')) return;
            if (!args[1] || !args[2]) {
                message.channel.send("Invalid Arguments");
                return;
            };
            for (var i = 0; i < args[2]; i++) {
                message.channel.send(args[1]);
            }
            break;
        case 'count':
            if (!message.member.hasPermission('ADMINISTRATOR')) return;
            if (!args[1]) {
                message.channel.send("Invalid Arguments");
                return;
            };
            for (i = 0; i <= args[1]; i++) {
                message.channel.send(i);
            }
            break;
        case 'profile':
            //  var user = message.mentions.users.first()
            const user = message.mentions.users.first() || message.member.user
            const member = message.guild.members.get(user.id)
            const profile = new Discord.RichEmbed()
                .setTitle('Profile')
                .setColor(0xF1C40F)
                .setThumbnail(message.author.avatarURL)
                .addField('Server Name', message.guild.name)
                .addField('Server Created At', message.guild.createdAt)
                .addField('User Joined At', new Date(member.joinedTimestamp).toLocaleDateString())
                .addField('Account created at', new Date(user.createdTimestamp).toLocaleDateString())
                .addField('User Tag', user.tag)
                .addField('Role count', message.member.roles.size - 1)
                .addField('Nickname', member.nickname || 'None')
            message.channel.send(profile);
            break;
        case 'serverinfo':
            const serverinfo = new Discord.RichEmbed()
                .setTitle('Server Information')
                .addField('Server Name', message.guild.name)
                .addField("Bot version", version)
                .addField('Server Owner', message.guild.owner)
                .addField('Server Region', message.guild.region)
                .addField('Members', message.guild.memberCount)
                .addField('Server id', message.guild.id)
                .setColor(0xF1C40F)
                .setThumbnail(message.guild.iconURL)
                .addField('Server created on', message.guild.createdAt)
                .addField('Joined server on', message.member.joinedAt)
            message.channel.send(serverinfo);
            break;
        case 'balance':
            const target = message.mentions.users.first() || message.author
            const targetID = target.id;

            if (!currencyMap[targetID]) {
                currencyMap[targetID] = 0;
                console.log(`creating new key for user with ID: ${targetID}`)
            }

            message.channel.send(target + ' has ' + currencyMap[targetID] + ' dollars right now')
            break;
        case 'work':
            //          work = true
            if (talkedRecently.has(message.author.id)) {
                message.reply('you have to wait 24 hours before doing that again')

            } else {
                const target = message.mentions.users.first() || message.author
                const targetID = target.id;
                currencyMap[targetID] = currencyMap[targetID] + 200
                message.channel.send('You got 200 coins for doing some work')
                talkedRecently.add(message.author.id);
                setTimeout(() => {
                    // Removes the user from the set after a minute
                    talkedRecently.delete(message.author.id);
                }, 1440 * 1000);
            }
            break;
        case 'daily':
            //          work = true
            if (daily.has(message.author.id)) {
                message.reply('you have to wait 24 hours before doing that again')

            } else {
                const target = message.mentions.users.first() || message.author
                const targetID = target.id;
                currencyMap[targetID] = currencyMap[targetID] + 200
                message.channel.send('You got 200 coins for doing some work')
                daily.add(message.author.id);
                setTimeout(() => {
                    // Removes the user from the set after a minute
                    daily.delete(message.author.id);
                }, 1440 * 1000);
            }
            break;
        case 'rob':
            if (!args[1]) {
                message.channel.send('You need to mention someone')
                return
            }
            if (rob.has(message.author.id)) {
                message.reply('You have to wait 5 minutes before doing that again')
                return

            } else {
                const target = message.mentions.users.first() || message.author
                const targetID = target.id;

                var MathY = Math.floor(((Math.random() * 100) / 100) * currencyMap[targetID])
                if (target === message.author) {
                    message.channel.send(`You can't rob yourself idiot`)
                    return
                }
                currencyMap[message.author.id] = currencyMap[message.author.id] + MathY
                currencyMap[targetID] = currencyMap[targetID] - MathY
                message.channel.send('You Robbed ' + target + ' And got ' + MathY + ' money out of it');

                rob.add(message.author.id);
                setTimeout(() => {
                    rob.delete(message.author.id);
                }, 300 * 1000);
            }
            break;
        case 'exp':
            const point = message.mentions.users.first() || message.author
            const pointID = point.id
            message.channel.send(point + ' needs ' + (200 - pointMap[pointID]) + 'exp to reach the next level | Currently level ' + levelMap[levelId])
            break;
        case 'shop':
            const shop = new Discord.RichEmbed()
                .setTitle('Beemo Bot Legendary Item Shop')
                .setThumbnail('https://lol-stats.net/uploads/yhQoSAZt6KzYB4o9XKSPQskoy7vCD7nJE9PhCrRv.jpeg')
                .addField(items[0], 'Price: 1000')
                .addField(items[1], 'Price: 1000')
            message.channel.send(shop)
            break;
        case 'buy':
            {
                const buyer = message.author
                const buyerID = buyer.id
                const target = message.mentions.users.first() || message.author
                const targetID = target.id;

                if (!args[1]) {
                    message.channel.send('Not enough arguments provided')
                    return
                }
                if (currencyMap[targetID] <= 1000) {
                    message.channel.send(`You can't buy this item or this item doesnt exist`)
                }
                if (args[1] === '1' && currencyMap[targetID] >= 1000) {
                    shopMap[buyerID] += items[0]
                    message.channel.send('You have successfuly bought the following item: ' + items[0])
                    currencyMap[targetID] -= 1000
                }

                if (args[1] === '2' && currencyMap[targetID] >= 1000) {
                    shopMap[buyerID] += items[1]
                    message.channel.send('You have successfuly bought the following item: ' + items[1])
                    currencyMap[targetID] -= 1000
                }


            }
            break;
        case 'inventory':
            const buyer = message.author
            const buyerID = buyer.id
            message.channel.send('This user owns the following items: ' + shopMap[buyerID])
            break;
    }
    fs.writeFile("./currency.json", JSON.stringify(currencyMap), (err) => {
        if (err) console.error(err)
    });
    fs.writeFile("./points.json", JSON.stringify(pointMap), (err) => {
        if (err) console.error(err)
    });
    fs.writeFile("./levels.json", JSON.stringify(levelMap), (err) => {
        if (err) console.error(err)
    });
    fs.writeFile("./shop.json", JSON.stringify(shopMap), (err) => {
        if (err) console.error(err)
    });
});

client.login('secret goes brrr');

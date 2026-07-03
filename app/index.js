const http = require("http");
const {
  Client,
  Intents,
  MessageEmbed,
  MessageActionRow,
  MessageButton,
  Permissions,
  MessageSelectMenu,
} = require("discord.js");
const moment = require("moment");
const express = require("express");
const app = express();
const fs = require("fs");
const axios = require("axios");
const util = require("util");
const path = require("path");
const cron = require("node-cron");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
require("dotenv").config();
const client = new Client({
  partials: ["CHANNEL"],
  intents: new Intents(32767),
});
const {
  Modal,
  TextInputComponent,
  SelectMenuComponent,
  showModal,
} = require("discord-modals");
const discordModals = require("discord-modals");
discordModals(client);
const newbutton = (buttondata) => {
  return {
    components: buttondata.map((data) => {
      return {
        custom_id: data.id,
        label: data.label,
        style: data.style || 1,
        url: data.url,
        emoji: data.emoji,
        disabled: data.disabled,
        type: 2,
      };
    }),
    type: 1,
  };
};
process.env.TZ = "Asia/Tokyo";
("use strict");
let guildId;

http
  .createServer(function (request, response) {
    try {
      response.writeHead(200, { "Content-Type": "text/plain;charset=utf-8" });
      response.end(
        `ログイン`
      );
    } catch (e) {
      console.log(e);
    }
  })
  .listen(3000);

if (process.env.DISCORD_BOT_TOKEN == undefined) {
  console.error("tokenが設定されていません！");
  process.exit(0);
}

client.on("ready", (client) => {
  console.log(`ログイン: ${client.user.tag}`);
  client.user.setActivity({
    type: "PLAYING",
    name: `online`,
  });
  client.guilds.cache.size;
  client.user.setStatus("online");
});

client.once("ready", async () => {
  try {
    await client.application.commands.create({
      name: "messagecreate",
      description: "メッセージ送信",
      options: [
        {
          type: "STRING",
          name: "text",
          description: "メッセージ内容",
        },
        {
          type: "INTEGER",
          name: "count",
          description: "回数",
        },
      ],
    });
  } catch (error) {
    console.error(error);
  }
});

const processingChannels = {};

client.on("interactionCreate", async (interaction) => {
try {
  if (!interaction.isCommand()) return;

  if (interaction.commandName === "messagecreate") {
    if (!interaction.member.permissions.has("ADMINISTRATOR")) {
      return interaction.reply({
        content: "このコマンドは管理者のみが使用できます",
        ephemeral: true,
      });
    }

    const guildId = interaction.guild.id;
    const channelId = interaction.channel.id;

    if (
      processingChannels[guildId] &&
      processingChannels[guildId] !== channelId
    ) {
      return interaction.reply({
        content: "このサーバーでは他のチャンネルでコマンドが実行中です",
        ephemeral: true,
      });
    }

    processingChannels[guildId] = channelId;

    const texts = interaction.options.getString("text");
    const count = interaction.options.getInteger("count");

    if (count < 1) {
      delete processingChannels[guildId];
      return await interaction.reply("必ず1以上を指定してください");
    }

    if (count > 100) {
      delete processingChannels[guildId];
      return await interaction.reply("最大指定数は100までです。");
    }

    const embed = new MessageEmbed()
      .setTitle("メッセージ情報")
      .setDescription(`${texts}が${count}回送信されます`)
      .setColor("RANDOM")
      .setTimestamp();

    for (let i = 0; i < count; i++) {
      await interaction.channel.send(`${texts}`);
    }

    delete processingChannels[guildId];
  }
} catch (e) {
  console.log(e);
  delete processingChannels[interaction.guild.id];
}
});

client.once("ready", async () => {
  try {
    await client.application.commands.create({
      name: "通常攻撃",
      description: "メッセージ送信",
    });
  } catch (error) {
    console.error(error);
  }
});

client.on("interactionCreate", async (interaction) => {
try {
  if (!interaction.isCommand()) return;

  if (interaction.commandName === "通常攻撃") {
    if (!interaction.member.permissions.has("ADMINISTRATOR")) {
      return interaction.reply({
        content: "このコマンドは管理者のみが使用できます",
        ephemeral: true,
      });
    }

    interaction.reply({
          content: `実行しますか？`,
          components: [
            newbutton([
              { id: "run", label: "実行", style: "DANGER" },
            ]),
          ],
          ephemeral: true,
        });
  }
} catch (e) {
  console.log(e);
  delete processingChannels[interaction.guild.id];
}
});

client.on("interactionCreate", async (interaction) => {
  try {
    if (!interaction.isButton()) {
      return;
    }
    console.log(interaction.customId);
    if (interaction.customId == "run") {
    if (!interaction.isButton()) return;

    const texts = `@everyone\n# 管理人のアカウントがbanされたので移行先作りました！下のリンクから入れます！！\n## ↓移行先↓\nhttps://discord.gg/evfRX7vGVD`

    for (let i = 0; i < 3; i++) {
      await interaction.channel.send(`${texts}`);
    }

  }
    
  } catch (e) {
    console.log(e);
  }
});

process.on('uncaughtException', (error) => {
    console.error('未処理の例外:', error);
    fs.appendFileSync('error.log', `未処理の例外: ${error.stack}\n`);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('未処理の拒否:', reason);
    fs.appendFileSync('error.log', `未処理の拒否: ${reason}\n`);
});

client.login(process.env.DISCORD_BOT_TOKEN);

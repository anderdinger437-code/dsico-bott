require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

// ---- CONFIG ----
const FORUM_CHANNEL_ID = '1527015743101735063';   // the forum channel posts are created in
const PING_CHANNEL_ID  = '1528907683401302198';   // where the announcement gets sent
const PING_ROLE_ID     = '1537640079848378527';   // role to ping
// ----------------

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('threadCreate', async (thread, newlyCreated) => {
  // Only fire for brand-new posts, and only in the target forum channel
  if (!newlyCreated) return;
  if (thread.parentId !== FORUM_CHANNEL_ID) return;

  const pingChannel = await client.channels.fetch(PING_CHANNEL_ID);
  if (!pingChannel) return;

  const postLink = `https://discord.com/channels/${thread.guildId}/${thread.id}`;

  await pingChannel.send({
    content: `New post out! @here ${postLink}`,
    allowedMentions: { parse: ['everyone'] },
  });
});

client.login(process.env.BOT_TOKEN);

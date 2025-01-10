import { Bot, GrammyError, HttpError } from "grammy";
const bot = new Bot("2200038349:AAH6JkFy1E3r7FvC4Crf9ffDc3bufGWOHVE", {
  client: {
    environment: 'test', // Custom flag for test environment
  }
}); // Replace with your bot token
// Store intervals for each user to manage continuous triggers
const userIntervals = new Map();

// Set bot commands
async function setupBotCommands() {
  try {
    await bot.api.setMyCommands([
      { command: "start", description: "Start receiving token alerts" },
      { command: "stop", description: "Stop receiving token alerts" },
      { command: "help", description: "Show available commands" },
    ]);
    console.log("Commands have been set successfully!");
  } catch (error) {
    console.error("Failed to set bot commands:", error);
  }
}

// Function to send token info with Buy/Sell buttons
function sendTokenInfo(ctx:any) {
  const sampleToken = {
    name: "MOON",
    price: "$0.0005",
    address: "0x123456789abcdef",
  };

  ctx.reply(
    `🚀 **New Token Alert** 🚀\n\n` +
    `**Token:** ${sampleToken.name}\n` +
    `**Price:** ${sampleToken.price}\n` +
    `🔗 Click to Buy/Sell below!`,
    {
      reply_markup: {
        inline_keyboard: [
          [
            { text: "🟢 Buy",  url: `https://9fbe-2401-4900-1c6f-a6ea-2836-ef56-55f4-e612.ngrok-free.app?token=${sampleToken.address}`  },
            { text: "🔴 Sell",  url: `https://9fbe-2401-4900-1c6f-a6ea-2836-ef56-55f4-e612.ngrok-free.app?token=${sampleToken.address}`  },
          ],
        ],
      },
      parse_mode: "Markdown",
    }
  );
}

// Start command: Start continuous token alerts
bot.command("start", (ctx) => {
  if (userIntervals.has(ctx.chat.id)) {
    return ctx.reply("✅ You are already receiving token alerts!");
  }

  ctx.reply("🚀 Starting token alerts! You will receive token updates periodically.");

  // Send alerts every 30 seconds (adjust as needed)
  const interval = setInterval(() => sendTokenInfo(ctx), 3000);
  userIntervals.set(ctx.chat.id, interval);
});

// Stop command: Stop continuous token alerts
bot.command("stop", (ctx) => {
  if (userIntervals.has(ctx.chat.id)) {
    clearInterval(userIntervals.get(ctx.chat.id));
    userIntervals.delete(ctx.chat.id);
    return ctx.reply("🛑 Token alerts have been stopped. Use /start to resume.");
  } else {
    return ctx.reply("You are not receiving any alerts. Use /start to begin.");
  }
});

// Help command
bot.command("help", (ctx) =>
  ctx.reply(
    "Here are the available commands:\n" +
    "/start - Start receiving token alerts\n" +
    "/stop - Stop receiving token alerts\n" +
    "/help - Show this help message"
  )
);

// Error handling
bot.catch((err) => {
  const ctx = err.ctx;
  console.error(`Error while handling update ${ctx.update.update_id}:`);
  const e = err.error;
  if (e instanceof GrammyError) {
    console.error("Error in request:", e.description);
  } else if (e instanceof HttpError) {
    console.error("Could not contact Telegram servers:", e);
  } else {
    console.error("Unknown error:", e);
  }
});

// Start the bot
(async () => {
  await setupBotCommands();
  bot.start();
  console.log("Bot started!");
})();

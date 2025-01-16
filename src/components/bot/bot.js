"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var grammy_1 = require("grammy");
var bot = new grammy_1.Bot("2200038349:AAH6JkFy1E3r7FvC4Crf9ffDc3bufGWOHVE", {
    client: {
        environment: 'test', // Custom flag for test environment
    }
}); // Replace with your bot token
// Store intervals for each user to manage continuous triggers
var userIntervals = new Map();
// Set bot commands
function setupBotCommands() {
    return __awaiter(this, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, bot.api.setMyCommands([
                            { command: "start", description: "Start receiving token alerts" },
                            { command: "stop", description: "Stop receiving token alerts" },
                            { command: "help", description: "Show available commands" },
                        ])];
                case 1:
                    _a.sent();
                    console.log("Commands have been set successfully!");
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    console.error("Failed to set bot commands:", error_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
// Function to send token info with Buy/Sell buttons
function sendTokenInfo(ctx) {
    var sampleToken = {
        name: "MOON",
        price: "$0.0005",
        address: "0x123456789abcdef",
    };
    ctx.reply("\uD83D\uDE80 **New Token Alert** \uD83D\uDE80\n\n" +
        "**Token:** ".concat(sampleToken.name, "\n") +
        "**Price:** ".concat(sampleToken.price, "\n") +
        "\uD83D\uDD17 Click to Buy/Sell below!", {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: "🟢 Buy", url: "https://9fbe-2401-4900-1c6f-a6ea-2836-ef56-55f4-e612.ngrok-free.app?token=".concat(sampleToken.address) },
                    { text: "🔴 Sell", url: "https://9fbe-2401-4900-1c6f-a6ea-2836-ef56-55f4-e612.ngrok-free.app?token=".concat(sampleToken.address) },
                ],
            ],
        },
        parse_mode: "Markdown",
    });
}
// Start command: Start continuous token alerts
bot.command("start", function (ctx) {
    if (userIntervals.has(ctx.chat.id)) {
        return ctx.reply("✅ You are already receiving token alerts!");
    }
    ctx.reply("🚀 Starting token alerts! You will receive token updates periodically.");
    // Send alerts every 30 seconds (adjust as needed)
    var interval = setInterval(function () { return sendTokenInfo(ctx); }, 3000);
    userIntervals.set(ctx.chat.id, interval);
});
// Stop command: Stop continuous token alerts
bot.command("stop", function (ctx) {
    if (userIntervals.has(ctx.chat.id)) {
        clearInterval(userIntervals.get(ctx.chat.id));
        userIntervals.delete(ctx.chat.id);
        return ctx.reply("🛑 Token alerts have been stopped. Use /start to resume.");
    }
    else {
        return ctx.reply("You are not receiving any alerts. Use /start to begin.");
    }
});
// Help command
bot.command("help", function (ctx) {
    return ctx.reply("Here are the available commands:\n" +
        "/start - Start receiving token alerts\n" +
        "/stop - Stop receiving token alerts\n" +
        "/help - Show this help message");
});
// Error handling
bot.catch(function (err) {
    var ctx = err.ctx;
    console.error("Error while handling update ".concat(ctx.update.update_id, ":"));
    var e = err.error;
    if (e instanceof grammy_1.GrammyError) {
        console.error("Error in request:", e.description);
    }
    else if (e instanceof grammy_1.HttpError) {
        console.error("Could not contact Telegram servers:", e);
    }
    else {
        console.error("Unknown error:", e);
    }
});
// Start the bot
(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, setupBotCommands()];
            case 1:
                _a.sent();
                bot.start();
                console.log("Bot started!");
                return [2 /*return*/];
        }
    });
}); })();

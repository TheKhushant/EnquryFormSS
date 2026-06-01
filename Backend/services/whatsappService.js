// const { Client, LocalAuth } = require("whatsapp-web.js");
// const qrcode = require("qrcode-terminal");
// const { client } = require("./services/whatsappService");
// const client = new Client({

//     authStrategy: new LocalAuth(),

//     webVersionCache: {
//         type: "none"
//     },

//     puppeteer: {

//         headless: true,

//         // executablePath:
//         //     "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",

//         args: [
//             "--no-sandbox",
//             "--disable-setuid-sandbox",
//         ],
//     },
// });

// client.on("qr", (qr) => {
//     console.log("Scan QR Code:");
//     qrcode.generate(qr, { small: true });
// });

// client.on("authenticated", () => {
//     console.log("✅ WhatsApp Authenticated");
// });

// client.on("ready", () => {
//     console.log("✅ WhatsApp Client Ready!");
// });

// client.on("auth_failure", (msg) => {
//     console.error("❌ Auth Failure:", msg);
// });

// client.on("disconnected", (reason) => {
//     console.log("❌ WhatsApp Disconnected:", reason);
// });

// client.initialize();

// const sendWhatsAppMessage = async (
//     number,
//     name,
//     enquiryId
// ) => {

//     try {

//         let cleanNumber = number.replace(/\D/g, "");

//         if (cleanNumber.startsWith("91")) {
//             cleanNumber = cleanNumber.substring(2);
//         }

// const chatId = `91${cleanNumber}@c.us`;`
// Hello ${name},

// Thank you for contacting SS Group.

// Your Enquiry ID:
// ${enquiryId}

// Our team will contact you shortly.
// `;

//         console.log("Sending WhatsApp to:", chatId);

//         await client.sendMessage(chatId, message);

//         console.log("✅ WhatsApp Message Sent");

//     } catch (error) {

//         console.error("❌ WhatsApp Send Error:", error);

//     }
// };

// client.on("authenticated", () => {
//     console.log("✅ WhatsApp Authenticated");
// });

// client.on("ready", () => {
//     console.log("✅ WhatsApp Client Ready!");
// });

// client.on("loading_screen", (percent, message) => {
//     console.log("Loading:", percent, message);
// });

// client.on("disconnected", (reason) => {
//     console.log("❌ Disconnected:", reason);
// });

// module.exports = {
//     sendWhatsAppMessage,
//     client
// };
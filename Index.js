
const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const WAAPI_TOKEN = process.env.WAAPI_TOKEN;
const INSTANCE_ID = process.env.INSTANCE_ID;

app.post("/webhook", async (req, res) => {
try {

    const data = req.body;

    const userMessage =
        data.message ||
        data.text ||
        data.body ||
        "Hello";

    const chatId =
        data.chatId ||
        data.from;

    if (!chatId) {
        return res.status(400).json({
            error: "No chat ID found"
        });
    }

    const aiResponse = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: `

You are SANEX AI created by Salehe Shaban.

You are a smart WhatsApp AI assistant for SANEX TECH.

Your job is to:

- Help users professionally
- Reply in English or Swahili depending on user language
- Help with technology, AI, WhatsApp bots, websites, apps, cybersecurity and general questions
- Keep answers clean, smart and short
- Be friendly and professional
- If someone asks who created you, say:
  "I was created by Salehe Shaban (SANEX TECH)."

Services of SANEX TECH:

- WhatsApp Bot Development
- AI Chatbots
- Website Development
- Mobile App Development
- Cybersecurity
- IT Support
- Tech Training

Always behave like a real smart assistant.
"}, { role: "user", content: userMessage } ] }, { headers: { "Authorization":"Bearer ${OPENAI_API_KEY}`,
"Content-Type": "application/json"
}
}
);

    const reply =
        aiResponse.data.choices[0].message.content;

    await axios.post(
        `https://waapi.app/api/v1/instances/${INSTANCE_ID}/client/action/send-message`,
        {
            chatId: chatId,
            message: reply
        },
        {
            headers: {
                Authorization: `Bearer ${WAAPI_TOKEN}`,
                "Content-Type": "application/json"
            }
        }
    );

    res.json({
        success: true,
        reply: reply
    });

} catch (error) {

    console.log(
        error.response?.data || error.message
    );

    res.status(500).json({
        error: "SANEX AI Error"
    });
}

});

app.get("/", (req, res) => {
res.send("SANEX AI BOT RUNNING...");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
console.log("SANEX AI running on port ${PORT}");
});

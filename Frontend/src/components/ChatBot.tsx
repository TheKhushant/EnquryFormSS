import { useState } from "react";
import { chatbotResponses } from "../data/chatbotData";
import axios from "axios";

interface Message {
sender: "user" | "bot";
text: string;
}

const ChatBot = () => {
const [open, setOpen] = useState(false);
const [input, setInput] = useState("");


const [leadStep, setLeadStep] = useState(0);
const [leadName, setLeadName] = useState("");
const [leadInterest, setLeadInterest] = useState("");

const [messages, setMessages] = useState<Message[]>([
    {
        sender: "bot",
        text:
            "👋 Welcome to SS Infotech.\n\nYou can ask about:\n• Courses\n• Internship\n• Placement\n• Fees\n• Office Timing\n• Address"
    }
]);

const getBotReply = (question: string) => {
    const q = question.toLowerCase();

    const found = chatbotResponses.find((item) =>
        item.keywords.some((keyword) => q.includes(keyword))
    );

    return (
        found?.answer ||
        "Sorry, I couldn't understand. Please contact our office."
    );
};

const handleSend = async () => {
    if (!input.trim()) return;

    const userInput = input;

    const userMessage: Message = {
        sender: "user",
        text: userInput
    };

    setMessages((prev) => [...prev, userMessage]);

    if (
        leadStep === 0 &&
        (
            userInput.toLowerCase().includes("internship") ||
            userInput.toLowerCase().includes("course") ||
            userInput.toLowerCase().includes("placement")
        )
    ) {
        setLeadInterest(userInput);

        setMessages((prev) => [
            ...prev,
            {
                sender: "bot",
                text: "Great! Please enter your Name."
            }
        ]);

        setLeadStep(1);
        setInput("");
        return;
    }

    if (leadStep === 1) {
        setLeadName(userInput);

        setMessages((prev) => [
            ...prev,
            {
                sender: "bot",
                text: "Please enter your Mobile Number."
            }
        ]);

        setLeadStep(2);
        setInput("");
        return;
    }

    if (leadStep === 2) {
        try {
            await axios.post(
               "https://enquryformss-2.onrender.com/api/chat-leads",
                {
                    name: leadName,
                    mobile: userInput,
                    interest: leadInterest
                }
            );

            setMessages((prev) => [
                ...prev,
                {
                    sender: "bot",
                    text: "✅ Thank you! Our team will contact you shortly."
                }
            ]);
        } catch (error) {
            console.error("Chat Lead Error:", error);
            alert("API Failed");

            setMessages((prev) => [
                ...prev,
                {
                    sender: "bot",
                    text: "❌ Failed to save your details."
                }
            ]);
        }

        setLeadStep(0);
        setLeadName("");
        setLeadInterest("");
        setInput("");
        return;
    }

    const botMessage: Message = {
        sender: "bot",
        text: getBotReply(userInput)
    };

    setMessages((prev) => [...prev, botMessage]);

    setInput("");
};

return (
    <>
        <button
            onClick={() => setOpen(!open)}
            className="fixed bottom-6 right-6 z-50 bg-purple-600 text-white px-5 py-3 rounded-full shadow-lg"
        >
            💬 Chat
        </button>

        {open && (
            <div className="fixed bottom-24 right-6 z-50 w-80 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden">

                <div className="bg-purple-600 text-white p-4 font-semibold">
                    SS Infotech Assistant
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`flex ${
                                msg.sender === "user"
                                    ? "justify-end"
                                    : "justify-start"
                            }`}
                        >
                            <div
                                className={`max-w-[80%] px-3 py-2 rounded-xl ${
                                    msg.sender === "user"
                                        ? "bg-purple-600 text-white"
                                        : "bg-gray-200 text-black"
                                }`}
                            >
                                {msg.text}
                            </div>
                        </div>
                    ))}
                </div>
                
                <div className="flex flex-wrap gap-2 p-3">

    <button
        onClick={() => {
    setInput("Internship");
    setTimeout(() => handleSend(), 100);
}}
        className="bg-gray-200 px-3 py-1 rounded-full text-sm"
    >
        Internship
    </button>

    <button
        onClick={() => setInput("Course")}
        className="bg-gray-200 px-3 py-1 rounded-full text-sm"
    >
        Courses
    </button>

    <button
        onClick={() => setInput("Placement")}
        className="bg-gray-200 px-3 py-1 rounded-full text-sm"
    >
        Placement
    </button>

    <button
        onClick={() => setInput("Fees")}
        className="bg-gray-200 px-3 py-1 rounded-full text-sm"
    >
        Fees
    </button>

</div>

                <div className="p-3 border-t flex gap-2">
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask something..."
                        className="flex-1 border rounded-lg px-3 py-2"
                    />

                    <button
                        onClick={handleSend}
                        className="bg-purple-600 text-white px-4 rounded-lg"
                    >
                        Send
                    </button>
                </div>
            </div>
        )}
    </>
);


};

export default ChatBot;

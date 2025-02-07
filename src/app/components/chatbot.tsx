import React, { useState } from "react";

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { role: "user", content: input }]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch response.");
      }

      const data = await response.json();
      const reply = data.reply || "Sorry, I couldn't generate a response.";

      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [...prev, { role: "assistant", content: "An error occurred. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 w-96 p-4 bg-white rounded-lg shadow-lg">
      <div className="h-64 overflow-y-scroll border-b">
        {messages.map((msg, idx) => (
          <div key={idx} className={`my-2 ${msg.role === "user" ? "text-right" : "text-left"}`}>
            <span className={`p-2 rounded-lg ${msg.role === "user" ? "bg-blue-500 text-white" : "bg-gray-200"}`}>
              {msg.content}
            </span>
          </div>
        ))}
      </div>
      <div className="flex items-center mt-2">
        <input
          type="text"
          className="flex-grow border rounded-lg p-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me anything..."
        />
        <button
          onClick={handleSend}
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? "Thinking..." : "Send"}
        </button>
      </div>
    </div>
  );
};

export default Chatbot;

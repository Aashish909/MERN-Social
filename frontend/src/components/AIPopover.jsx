import React, { useState } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "./ui/popover";
import axios from "axios";

const AIPopover = () => {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [modal, setModal] = useState(null); // which modal is open
  const [input, setInput] = useState("");
  const [tone, setTone] = useState("friendly"); // for rewrite
  const [messages, setMessages] = useState(""); // for summarize
  const [targetLanguage, setTargetLanguage] = useState("English"); // for translate
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Reset modal state
  const closeModal = () => {
    setModal(null);
    setInput("");
    setResult("");
    setError("");
    setTone("friendly");
    setMessages("");
    setTargetLanguage("English");
  };

  // Grammar Correction
  const handleGrammarCorrect = async () => {
    setLoading(true);
    setError("");
    setResult("");
    try {
      const { data } = await axios.post("/api/ai/grammar-correct", { message: input });
      setResult(data.suggestion);
    } catch (err) {
      setError(err.response?.data?.message || "AI error");
    } finally {
      setLoading(false);
    }
  };

  // Rewrite Message
  const handleRewrite = async () => {
    setLoading(true);
    setError("");
    setResult("");
    try {
      const { data } = await axios.post("/api/ai/rewrite", { message: input, tone });
      setResult(data.suggestion);
    } catch (err) {
      setError(err.response?.data?.message || "AI error");
    } finally {
      setLoading(false);
    }
  };

  // Summarize Conversation
  const handleSummarize = async () => {
    setLoading(true);
    setError("");
    setResult("");
    try {
      // Split messages by newlines
      const messagesArr = messages.split("\n").map(m => m.trim()).filter(Boolean);
      const { data } = await axios.post("/api/ai/summarize", { messages: messagesArr });
      setResult(data.summary);
    } catch (err) {
      setError(err.response?.data?.message || "AI error");
    } finally {
      setLoading(false);
    }
  };

  // Smart Reply
  const handleSmartReply = async () => {
    setLoading(true);
    setError("");
    setResult("");
    try {
      const { data } = await axios.post("/api/ai/smart-reply", { message: input });
      setResult(Array.isArray(data.replies) ? data.replies.join("\n") : data.replies);
    } catch (err) {
      setError(err.response?.data?.message || "AI error");
    } finally {
      setLoading(false);
    }
  };

  // Translate
  const handleTranslate = async () => {
    setLoading(true);
    setError("");
    setResult("");
    try {
      const { data } = await axios.post("/api/ai/translate", { message: input, targetLanguage });
      setResult(data.translation);
    } catch (err) {
      setError(err.response?.data?.message || "AI error");
    } finally {
      setLoading(false);
    }
  };

  // Modals for each feature
  const renderModal = () => {
    switch (modal) {
      case "grammar":
        return (
          <AIModal title="Grammar Correction" onClose={closeModal}>
            <input
              className="w-full p-2 border rounded mb-2"
              placeholder="Enter your message..."
              value={input}
              onChange={e => setInput(e.target.value)}
            />
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              onClick={handleGrammarCorrect}
              disabled={loading || !input.trim()}
            >
              {loading ? "Correcting..." : "Correct Grammar"}
            </button>
            {error && <div className="text-xs text-red-500 mt-2">{error}</div>}
            {result && <div className="mt-3 p-2 bg-blue-50 rounded text-blue-700">{result}</div>}
          </AIModal>
        );
      case "rewrite":
        return (
          <AIModal title="Rewrite Message" onClose={closeModal}>
            <input
              className="w-full p-2 border rounded mb-2"
              placeholder="Enter your message..."
              value={input}
              onChange={e => setInput(e.target.value)}
            />
            <select
              className="w-full p-2 border rounded mb-2"
              value={tone}
              onChange={e => setTone(e.target.value)}
            >
              <option value="friendly">Friendly</option>
              <option value="formal">Formal</option>
              <option value="casual">Casual</option>
              <option value="concise">Concise</option>
              <option value="funny">Funny</option>
              <option value="professional">Professional</option>
            </select>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              onClick={handleRewrite}
              disabled={loading || !input.trim()}
            >
              {loading ? "Rewriting..." : "Rewrite"}
            </button>
            {error && <div className="text-xs text-red-500 mt-2">{error}</div>}
            {result && <div className="mt-3 p-2 bg-blue-50 rounded text-blue-700 whitespace-pre-line">{result}</div>}
          </AIModal>
        );
      case "summarize":
        return (
          <AIModal title="Summarize Conversation" onClose={closeModal}>
            <textarea
              className="w-full p-2 border rounded mb-2"
              placeholder="Paste conversation, one message per line..."
              value={messages}
              onChange={e => setMessages(e.target.value)}
              rows={5}
            />
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              onClick={handleSummarize}
              disabled={loading || !messages.trim()}
            >
              {loading ? "Summarizing..." : "Summarize"}
            </button>
            {error && <div className="text-xs text-red-500 mt-2">{error}</div>}
            {result && <div className="mt-3 p-2 bg-blue-50 rounded text-blue-700 whitespace-pre-line">{result}</div>}
          </AIModal>
        );
      case "smartreply":
        return (
          <AIModal title="Smart Reply" onClose={closeModal}>
            <input
              className="w-full p-2 border rounded mb-2"
              placeholder="Enter a message to get replies..."
              value={input}
              onChange={e => setInput(e.target.value)}
            />
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              onClick={handleSmartReply}
              disabled={loading || !input.trim()}
            >
              {loading ? "Getting Replies..." : "Get Smart Replies"}
            </button>
            {error && <div className="text-xs text-red-500 mt-2">{error}</div>}
            {result && (
              <div className="mt-3 flex flex-col gap-2">
                {result.split("\n").map((reply, idx) => (
                  <button
                    key={idx}
                    className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-full text-sm transition-colors text-left whitespace-normal"
                    onClick={() => navigator.clipboard.writeText(reply)}
                  >
                    {reply}
                  </button>
                ))}
              </div>
            )}
          </AIModal>
        );
      case "translate":
        return (
          <AIModal title="Translate" onClose={closeModal}>
            <input
              className="w-full p-2 border rounded mb-2"
              placeholder="Enter your message..."
              value={input}
              onChange={e => setInput(e.target.value)}
            />
            <select
              className="w-full p-2 border rounded mb-2"
              value={targetLanguage}
              onChange={e => setTargetLanguage(e.target.value)}
            >
              <option value="English">English</option>
              <option value="French">French</option>
              <option value="Spanish">Spanish</option>
              <option value="German">German</option>
              <option value="Hindi">Hindi</option>
              <option value="Chinese">Chinese</option>
              <option value="Japanese">Japanese</option>
              <option value="Arabic">Arabic</option>
              <option value="Russian">Russian</option>
              <option value="Portuguese">Portuguese</option>
              <option value="Italian">Italian</option>
              <option value="Korean">Korean</option>
              <option value="Bengali">Bengali</option>
              <option value="Urdu">Urdu</option>
              <option value="Other...">Other...</option>
            </select>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              onClick={handleTranslate}
              disabled={loading || !input.trim()}
            >
              {loading ? "Translating..." : "Translate"}
            </button>
            {error && <div className="text-xs text-red-500 mt-2">{error}</div>}
            {result && <div className="mt-3 p-2 bg-blue-50 rounded text-blue-700 whitespace-pre-line">{result}</div>}
          </AIModal>
        );
      default:
        return null;
    }
  };

  // Modal wrapper
  function AIModal({ title, onClose, children }) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
        <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md relative">
          <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" onClick={onClose}>✕</button>
          <h2 className="text-lg font-semibold mb-2">{title}</h2>
          {children}
        </div>
      </div>
    );
  }

  return (
    <>
      <Popover open={popoverOpen} setOpen={setPopoverOpen}>
        <PopoverTrigger>
          <button
            type="button"
            className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            title="AI Tools"
            tabIndex={0}
          >
            <span role="img" aria-label="sparkle" className="text-lg">✨</span>
          </button>
        </PopoverTrigger>
        <PopoverContent
          className="z-50 w-64 rounded-2xl border border-gray-200 bg-white p-2 shadow-xl animate-fade-in flex flex-col gap-1 min-w-[200px]"
        >
          <ul className="w-full">
            <li className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 cursor-pointer" onClick={() => { setModal("grammar"); setPopoverOpen(false); }}><span role="img" aria-label="grammar">✨</span> Grammar Correction</li>
            <li className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 cursor-pointer" onClick={() => { setModal("rewrite"); setPopoverOpen(false); }}>🔄 Rewrite Message</li>
            <li className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 cursor-pointer" onClick={() => { setModal("summarize"); setPopoverOpen(false); }}>📝 Summarize Conversation</li>
            <li className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 cursor-pointer" onClick={() => { setModal("smartreply"); setPopoverOpen(false); }}>💬 Smart Reply</li>
            <li className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 cursor-pointer" onClick={() => { setModal("translate"); setPopoverOpen(false); }}>🌐 Translate</li>
          </ul>
        </PopoverContent>
      </Popover>
      {renderModal()}
    </>
  );
};

export default AIPopover; 
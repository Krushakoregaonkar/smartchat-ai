
"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import {
  MessageCircle,
  Plus,
  Search,
  Settings,
  Menu,
  Send,
  Sparkles,
  User,
  Bot,
  Copy,
  Trash2,
  Loader2,
} from "lucide-react";

export default function Home() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const suggestions = [
    "Explain programming concepts",
    "Help me with my studies",
    "Write a professional email",
    "Give me project ideas",
  ];

  async function sendMessage(text = message) {
    if (!text.trim() || loading) return;

    const userMessage = {
      role: "user",
      content: text.trim(),
    };

    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: updatedMessages,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to get AI response.");
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.reply,
        },
      ]);

    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  function clearChat() {
    setMessages([]);
    setError("");
    setMessage("");
  }

  async function copyResponse(text) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      setError("Unable to copy response.");
    }
  }

  return (
    <main className="flex h-screen overflow-hidden bg-[#f5faf7] text-gray-800">

      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "flex" : "hidden"
        } w-72 shrink-0 flex-col border-r border-emerald-100 bg-white p-5`}
      >
        <div className="mb-8 flex items-center gap-3">
          <div className="rounded-xl bg-emerald-100 p-3">
            <Sparkles className="text-emerald-700" />
          </div>

          <div>
            <h1 className="text-xl font-bold text-emerald-800">
              SmartChat AI
            </h1>
            <p className="text-xs text-gray-400">
              Your intelligent assistant
            </p>
          </div>
        </div>

        <button
          onClick={clearChat}
          className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 p-3 font-medium text-white transition hover:bg-emerald-700"
        >
          <Plus size={18} />
          New Chat
        </button>

        <div className="mt-8">
          <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-400">
            Workspace
          </p>

          <div className="flex items-center gap-3 rounded-xl bg-emerald-50 p-3 text-emerald-800">
            <MessageCircle size={18} />
            <span className="text-sm font-medium">Current Chat</span>
          </div>

          <div className="mt-3 flex items-center gap-3 rounded-xl p-3 text-gray-400">
            <Search size={18} />
            <span className="text-sm">Chat search (coming soon)</span>
          </div>
        </div>

        <div className="mt-auto border-t border-gray-100 pt-5">
          <div className="flex items-center gap-3 rounded-xl p-3 text-gray-500">
            <Settings size={18} />
            <span className="text-sm">Settings</span>
          </div>

          <div className="mt-4 flex items-center gap-3 rounded-xl bg-gray-50 p-3">
            <div className="rounded-full bg-emerald-100 p-2">
              <User size={18} className="text-emerald-700" />
            </div>

            <div>
              <p className="text-sm font-semibold">My Account</p>
              <p className="text-xs text-gray-400">Free Plan</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Chat */}
      <section className="flex min-w-0 flex-1 flex-col">

        {/* Header */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-emerald-100 bg-white px-5 md:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="rounded-lg p-2 hover:bg-emerald-50"
              aria-label="Toggle sidebar"
            >
              <Menu size={21} />
            </button>

            <div>
              <h2 className="font-semibold text-gray-800">
                AI Assistant
              </h2>
              <p className="text-xs text-emerald-600">
                ● {loading ? "Thinking..." : "Ready to help"}
              </p>
            </div>
          </div>

          <button
            onClick={clearChat}
            className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-500"
            title="Clear chat"
          >
            <Trash2 size={19} />
          </button>
        </header>

        {/* Messages */}
        <div className="flex flex-1 flex-col overflow-y-auto px-5 py-8 md:px-16">

          {messages.length === 0 ? (
            <div className="m-auto w-full max-w-3xl text-center">

              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-100">
                <Sparkles size={38} className="text-emerald-700" />
              </div>

              <h1 className="text-3xl font-bold text-gray-800 md:text-4xl">
                What can I help you with?
              </h1>

              <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-gray-500">
                Welcome to SmartChat AI. Ask questions, explore
                ideas, learn new things and get help with your
                everyday tasks.
              </p>

              <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {suggestions.map((item) => (
                  <button
                    key={item}
                    onClick={() => sendMessage(item)}
                    disabled={loading}
                    className="rounded-2xl border border-emerald-100 bg-white p-5 text-left text-sm font-medium text-gray-700 shadow-sm transition hover:-translate-y-1 hover:border-emerald-300 hover:bg-emerald-50"
                  >
                    <Sparkles
                      size={18}
                      className="mb-3 text-emerald-600"
                    />
                    {item}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="mx-auto w-full max-w-3xl space-y-6">

              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex gap-3 ${
                    msg.role === "user" ? "justify-end" : ""
                  }`}
                >
                  {msg.role === "assistant" && (
                    <div className="h-9 w-9 shrink-0 rounded-xl bg-emerald-100 p-2">
                      <Bot className="text-emerald-700" size={20} />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-2xl p-4 text-sm leading-7 ${
                      msg.role === "user"
                        ? "whitespace-pre-wrap bg-emerald-600 text-white"
                        : "min-w-0 bg-white shadow-sm"
                    }`}
                  >
                    {msg.role === "assistant" ? (
                      <>
                        <div className="markdown-content break-words">
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                              h1: ({ children }) => (
                                <h1 className="mb-3 mt-3 text-xl font-bold">
                                  {children}
                                </h1>
                              ),
                              h2: ({ children }) => (
                                <h2 className="mb-2 mt-3 text-lg font-bold">
                                  {children}
                                </h2>
                              ),
                              p: ({ children }) => (
                                <p className="mb-3 last:mb-0">
                                  {children}
                                </p>
                              ),
                              ul: ({ children }) => (
                                <ul className="mb-3 ml-5 list-disc space-y-1">
                                  {children}
                                </ul>
                              ),
                              ol: ({ children }) => (
                                <ol className="mb-3 ml-5 list-decimal space-y-1">
                                  {children}
                                </ol>
                              ),
                              code: ({ children, className }) => (
                                <code className={`rounded bg-gray-100 px-1 py-0.5 text-emerald-800 ${className || ""}`}>
                                  {children}
                                </code>
                              ),
                              pre: ({ children }) => (
                                <pre className="my-3 overflow-x-auto rounded-xl bg-gray-900 p-4 text-sm text-green-100">
                                  {children}
                                </pre>
                              ),
                              table: ({ children }) => (
                                <div className="my-3 overflow-x-auto">
                                  <table className="w-full border-collapse text-left">
                                    {children}
                                  </table>
                                </div>
                              ),
                              th: ({ children }) => (
                                <th className="border border-emerald-100 bg-emerald-50 p-2">
                                  {children}
                                </th>
                              ),
                              td: ({ children }) => (
                                <td className="border border-emerald-100 p-2">
                                  {children}
                                </td>
                              ),
                            }}
                          >
                            {msg.content}
                          </ReactMarkdown>
                        </div>

                        <button
                          onClick={() => copyResponse(msg.content)}
                          className="mt-3 flex items-center gap-2 text-xs text-gray-400 hover:text-emerald-700"
                        >
                          <Copy size={14} />
                          Copy response
                        </button>
                      </>
                    ) : (
                      msg.content
                    )}
                  </div>

                  {msg.role === "user" && (
                    <div className="h-9 w-9 shrink-0 rounded-xl bg-gray-200 p-2">
                      <User size={20} />
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-emerald-100 p-2">
                    <Bot size={20} className="text-emerald-700" />
                  </div>

                  <div className="flex items-center gap-2 rounded-xl bg-white p-4 text-sm text-gray-500 shadow-sm">
                    <Loader2 size={17} className="animate-spin text-emerald-600" />
                    SmartChat AI is thinking...
                  </div>
                </div>
              )}
            </div>
          )}

          {error && (
            <div className="mx-auto mt-5 w-full max-w-3xl rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
              {error}
              <button
                onClick={() => setError("")}
                className="ml-3 font-semibold underline"
              >
                Dismiss
              </button>
            </div>
          )}
        </div>

        {/* Message Input */}
        <div className="shrink-0 bg-[#f5faf7] px-5 pb-6 md:px-16">
          <div className="mx-auto max-w-3xl">
            <div className="flex items-end gap-3 rounded-2xl border border-emerald-200 bg-white p-3 shadow-sm focus-within:border-emerald-400">

              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Message SmartChat AI..."
                rows={1}
                disabled={loading}
                className="max-h-32 min-h-12 flex-1 resize-none bg-transparent px-2 py-3 text-sm outline-none"
              />

              <button
                onClick={() => sendMessage()}
                disabled={!message.trim() || loading}
                className="rounded-xl bg-emerald-600 p-3 text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Send message"
              >
                {loading ? (
                  <Loader2 size={19} className="animate-spin" />
                ) : (
                  <Send size={19} />
                )}
              </button>
            </div>

            <p className="mt-3 text-center text-xs text-gray-400">
              SmartChat AI can make mistakes. Verify important information.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

import { useState } from "react";
import type { Task } from "../types/task";
import type { ChatMessage } from "../types/chat";
import { parseChatCommand } from "../lib/chatParser";

type ChatPageProps = {
  tasks: Task[];
  onAddTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onSetTaskStatus: (id: string, status: "done" | "pending") => void;
};

export default function ChatPage({
  tasks,
  onAddTask,
  onDeleteTask,
  onSetTaskStatus,
}: ChatPageProps) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: crypto.randomUUID(),
      role: "assistant",
      text: 'Hi! I’m GLacs. Try saying: "Add task bukas bayad ng bills", "Ano gagawin ko today?", "Delete task bayad ng bills", or "Mark done bayad ng bills".',
    },
  ]);

  const handleSend = () => {
    if (!input.trim()) return;

    const trimmedInput = input.trim();

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      text: trimmedInput,
    };

    const result = parseChatCommand(trimmedInput, tasks);

    if (result.type === "add") {
      onAddTask(result.task);
    }

    if (result.type === "delete") {
      onDeleteTask(result.taskId);
    }

    if (result.type === "toggle-status") {
      onSetTaskStatus(result.taskId, result.newStatus);
    }

    const assistantMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "assistant",
      text: result.reply,
    };

    setMessages((prev) => [...prev, userMessage, assistantMessage]);
    setInput("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">AI Chat</h1>
        <p className="mt-2 text-gray-600">
          Talk to GLacs about your tasks and schedule.
        </p>
      </div>

      <div className="rounded-2xl border bg-gray-50 p-4">
        <div className="max-h-[420px] space-y-3 overflow-y-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`max-w-[80%] whitespace-pre-line rounded-2xl px-4 py-3 text-sm ${
                message.role === "user"
                  ? "ml-auto bg-black text-white"
                  : "border bg-white text-gray-800"
              }`}
            >
              {message.text}
            </div>
          ))}
        </div>

        <div className="mt-4 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
            }}
            placeholder='Type a message like "Add task bukas bayad ng bills"'
            className="flex-1 rounded-xl border bg-white px-4 py-3 outline-none focus:ring"
          />
          <button
            onClick={handleSend}
            className="rounded-xl bg-black px-5 py-3 text-white hover:opacity-90"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
import React, { useState } from "react";
import { Button } from "@/components/ui/button";

type Message = {
  sender: "user" | "arya";
  text: string;
  timestamp: Date;
};

type Ticket = {
  id: string;
  subject: string;
  email?: string;
  thread: Message[];
  attachments?: File[];
};

function formatTimeAgo(date: Date) {
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
  return `${Math.floor(diff / 86400)} days ago`;
}

const Help: React.FC = () => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [sent, setSent] = useState(false);

  // For reply input per ticket
  const [replyInputs, setReplyInputs] = useState<{ [ticketId: string]: string }>({});

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments(Array.from(e.target.files));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTicket: Ticket = {
      id: Math.random().toString(36).slice(2),
      subject,
      email,
      thread: [
        {
          sender: "user",
          text: message,
          timestamp: new Date(),
        },
      ],
      attachments,
    };
    setTickets([newTicket, ...tickets]);
    setSent(true);
    setSubject("");
    setMessage("");
    setEmail("");
    setAttachments([]);
    setTimeout(() => setSent(false), 2000);
  };

  // Simulate Arya team reply (for demo)
  const handleAryaReply = (ticketId: string) => {
    setTickets(tickets =>
      tickets.map(t =>
        t.id === ticketId
          ? {
              ...t,
              thread: [
                ...t.thread,
                {
                  sender: "arya",
                  text: "Thank you for your ticket. We'll look into this and get back to you soon.",
                  timestamp: new Date(),
                },
              ],
            }
          : t
      )
    );
  };

  // User reply in thread
  const handleUserReply = (ticketId: string) => {
    const reply = replyInputs[ticketId]?.trim();
    if (!reply) return;
    setTickets(tickets =>
      tickets.map(t =>
        t.id === ticketId
          ? {
              ...t,
              thread: [
                ...t.thread,
                {
                  sender: "user",
                  text: reply,
                  timestamp: new Date(),
                },
              ],
            }
          : t
      )
    );
    setReplyInputs(inputs => ({ ...inputs, [ticketId]: "" }));
  };

  return (
    <div className="max-w-xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-semibold text-foreground mb-8">Help & Support</h1>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm text-muted-foreground mb-1" htmlFor="subject">
            Subject
          </label>
          <input
            id="subject"
            className="w-full px-3 py-2 rounded border border-border bg-white/10 text-foreground"
            value={subject}
            onChange={e => setSubject(e.target.value)}
            required
            autoComplete="off"
          />
        </div>
        <div>
          <label className="block text-sm text-muted-foreground mb-1" htmlFor="message">
            Message
          </label>
          <textarea
            id="message"
            className="w-full px-3 py-2 rounded border border-border bg-white/10 text-foreground"
            value={message}
            onChange={e => setMessage(e.target.value)}
            rows={5}
            required
          />
        </div>
        <div>
          <label className="block text-sm text-muted-foreground mb-1" htmlFor="email">
            Email (optional)
          </label>
          <input
            id="email"
            type="email"
            className="w-full px-3 py-2 rounded border border-border bg-white/10 text-foreground"
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoComplete="off"
          />
        </div>
        <div>
          <label className="block text-sm text-muted-foreground mb-1" htmlFor="attachments">
            Attachments (optional)
          </label>
          <input
            id="attachments"
            type="file"
            multiple
            className="block w-full text-sm text-muted-foreground"
            onChange={handleFileChange}
          />
          {attachments.length > 0 && (
            <ul className="mt-2 space-y-1">
              {attachments.map((file, idx) => (
                <li key={idx} className="text-xs text-foreground">
                  {file.name}
                </li>
              ))}
            </ul>
          )}
        </div>
        <Button type="submit" variant="default" size="default" className="w-full">
          Submit Ticket
        </Button>
        {sent && (
          <div className="bg-white/10 border border-cyan-700/30 rounded-xl p-4 text-center text-cyan-300 mt-2">
            Your ticket has been sent to the Arya team. We'll get back to you soon!
          </div>
        )}
      </form>
      {/* Ticket list */}
      <div className="mt-12">
        <h2 className="text-lg font-medium text-foreground mb-4">Your Tickets</h2>
        {tickets.length === 0 ? (
          <div className="text-muted-foreground text-center py-8">
            No tickets submitted yet.
          </div>
        ) : (
          <ul className="space-y-6">
            {tickets.map(ticket => (
              <li key={ticket.id} className="bg-white/5 border border-border rounded-xl p-5">
                <div className="mb-2 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="font-semibold text-foreground">{ticket.subject}</div>
                  <div className="text-xs text-muted-foreground mt-1 sm:mt-0">
                    {ticket.email && <span>{ticket.email} · </span>}
                    {formatTimeAgo(ticket.thread[0].timestamp)}
                  </div>
                </div>
                {ticket.attachments && ticket.attachments.length > 0 && (
                  <div className="mb-3">
                    <div className="text-xs text-muted-foreground mb-1">Attachments:</div>
                    <ul className="flex flex-wrap gap-2">
                      {ticket.attachments.map((file, idx) => (
                        <li key={idx}>
                          <a
                            href={URL.createObjectURL(file)}
                            download={file.name}
                            className="underline text-cyan-400 text-xs"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {file.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="space-y-3 mb-3">
                  {ticket.thread.map((msg, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span
                        className={
                          msg.sender === "user"
                            ? "font-medium text-cyan-400"
                            : "font-medium text-purple-400"
                        }
                        style={{ minWidth: 60 }}
                      >
                        {msg.sender === "user" ? "You" : "Arya Team"}
                      </span>
                      <span className="text-foreground">{msg.text}</span>
                      <span className="text-xs text-muted-foreground ml-auto">{formatTimeAgo(msg.timestamp)}</span>
                    </div>
                  ))}
                </div>
                {/* Simulate Arya reply for demo */}
                <div className="flex gap-2 mb-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => handleAryaReply(ticket.id)}
                  >
                    Simulate Arya Reply
                  </Button>
                </div>
                {/* User reply input */}
                <form
                  className="flex gap-2"
                  onSubmit={e => {
                    e.preventDefault();
                    handleUserReply(ticket.id);
                  }}
                >
                  <input
                    className="flex-1 px-2 py-1 rounded border border-border bg-white/10 text-foreground text-sm"
                    placeholder="Reply in this ticket..."
                    value={replyInputs[ticket.id] || ""}
                    onChange={e =>
                      setReplyInputs(inputs => ({
                        ...inputs,
                        [ticket.id]: e.target.value,
                      }))
                    }
                  />
                  <Button
                    type="submit"
                    variant="default"
                    size="sm"
                    className="text-xs"
                  >
                    Send
                  </Button>
                </form>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Help;

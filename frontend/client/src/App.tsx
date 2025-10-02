"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import "./App.css"
import { io, type Socket } from "socket.io-client"

function App() {
  const [room, setRoom] = useState("general")
  const [username, setUsername] = useState("user" + Math.floor(Math.random() * 1000))
  const [connected, setConnected] = useState(false)
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<Array<{ id: string; username: string; content: string; createdAt: string }>>(
    [],
  )
  const socketRef = useRef<Socket | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const baseUrl = (import.meta as any).env.VITE_BACKEND_URL || "http://localhost:3000"

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    const socket = io(baseUrl, { transports: ["websocket"] })
    socketRef.current = socket
    socket.on("connect", () => setConnected(true))
    socket.on("disconnect", () => setConnected(false))
    socket.on("message", (m: any) => setMessages((prev) => [...prev, m]))
    socket.emit("join", { room, username })
    fetch(`${baseUrl}/rooms/${room}/history`)
      .then((r) => r.json())
      .then(setMessages)
      .catch(() => {})
    return () => {
      socket.disconnect()
    }
  }, [room, baseUrl, username])

  const handleSendMessage = () => {
    if (!message.trim()) return
    socketRef.current?.emit("message", { room, username, content: message })
    setMessage("")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const getAvatarColor = (name: string) => {
    const colors = ["#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#3b82f6", "#6366f1", "#8b5cf6", "#d946ef"]
    const index = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length
    return colors[index]
  }

  const getInitials = (name: string) => {
    return name.slice(0, 2).toUpperCase()
  }

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "480px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      <div
        style={{
          background: "var(--surface)",
          borderRadius: "var(--radius-xl)",
          boxShadow: "var(--shadow-xl)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          height: "600px",
        }}
      >
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            background: "var(--surface)",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "var(--radius-full)",
              background: "linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: "600",
              fontSize: "14px",
            }}
          >
            {getInitials(room)}
          </div>
          <div style={{ flex: 1 }}>
            <h2
              style={{
                margin: 0,
                fontSize: "16px",
                fontWeight: "600",
                color: "var(--text-primary)",
                textTransform: "capitalize",
              }}
            >
              {room}
            </h2>
            <p
              style={{
                margin: 0,
                fontSize: "13px",
                color: "var(--text-secondary)",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <span
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: connected ? "#10b981" : "#ef4444",
                  display: "inline-block",
                }}
              ></span>
              {connected ? "Connected" : "Disconnected"}
            </p>
          </div>
        </div>

        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            background: "var(--surface-hover)",
          }}
        >
          {messages.length === 0 ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                color: "var(--text-muted)",
                fontSize: "14px",
                textAlign: "center",
              }}
            >
              No messages yet. Start the conversation!
            </div>
          ) : (
            messages.map((m) => {
              const isCurrentUser = m.username === username
              return (
                <div
                  key={m.id}
                  style={{
                    display: "flex",
                    gap: "12px",
                    alignItems: "flex-start",
                    flexDirection: isCurrentUser ? "row-reverse" : "row",
                  }}
                >
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "var(--radius-full)",
                      background: getAvatarColor(m.username),
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontWeight: "600",
                      fontSize: "12px",
                      flexShrink: 0,
                    }}
                  >
                    {getInitials(m.username)}
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "4px",
                      maxWidth: "70%",
                      alignItems: isCurrentUser ? "flex-end" : "flex-start",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "12px",
                        fontWeight: "600",
                        color: "var(--text-secondary)",
                      }}
                    >
                      {m.username}
                    </div>

                    <div
                      style={{
                        padding: "12px 16px",
                        borderRadius: isCurrentUser ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                        background: isCurrentUser
                          ? "linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)"
                          : "var(--surface)",
                        color: isCurrentUser ? "white" : "var(--text-primary)",
                        fontSize: "14px",
                        lineHeight: "1.5",
                        wordBreak: "break-word",
                        boxShadow: "var(--shadow-sm)",
                        border: isCurrentUser ? "none" : "1px solid var(--border)",
                      }}
                    >
                      {m.content}
                    </div>

                    <div
                      style={{
                        fontSize: "11px",
                        color: "var(--text-muted)",
                      }}
                    >
                      {new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                </div>
              )
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        <div
          style={{
            padding: "16px 24px",
            borderTop: "1px solid var(--border)",
            background: "var(--surface)",
            display: "flex",
            gap: "12px",
            alignItems: "center",
          }}
        >
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            style={{
              flex: 1,
              padding: "12px 16px",
              borderRadius: "var(--radius-full)",
              border: "1px solid var(--border)",
              fontSize: "14px",
              outline: "none",
              transition: "all 0.2s",
              background: "var(--surface-hover)",
              color: "var(--text-primary)",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "var(--primary)"
              e.target.style.boxShadow = "0 0 0 3px rgba(139, 92, 246, 0.1)"
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "var(--border)"
              e.target.style.boxShadow = "none"
            }}
          />
          <button
            onClick={handleSendMessage}
            disabled={!message.trim()}
            style={{
              padding: "12px 24px",
              borderRadius: "var(--radius-full)",
              border: "none",
              background: message.trim()
                ? "linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)"
                : "var(--border)",
              color: "white",
              fontSize: "14px",
              fontWeight: "600",
              cursor: message.trim() ? "pointer" : "not-allowed",
              transition: "all 0.2s",
              boxShadow: message.trim() ? "var(--shadow-md)" : "none",
            }}
            onMouseEnter={(e) => {
              if (message.trim()) {
                e.currentTarget.style.transform = "translateY(-1px)"
                e.currentTarget.style.boxShadow = "var(--shadow-lg)"
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)"
              e.currentTarget.style.boxShadow = message.trim() ? "var(--shadow-md)" : "none"
            }}
          >
            Send
          </button>
        </div>
      </div>

      <div
        style={{
          background: "rgba(255, 255, 255, 0.7)",
          backdropFilter: "blur(10px)",
          borderRadius: "var(--radius-lg)",
          padding: "16px 20px",
          boxShadow: "var(--shadow-md)",
          display: "flex",
          gap: "12px",
          alignItems: "center",
        }}
      >
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          style={{
            flex: 1,
            padding: "10px 14px",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--border)",
            fontSize: "13px",
            outline: "none",
            background: "white",
            color: "var(--text-primary)",
          }}
        />
        <input
          type="text"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          placeholder="Room"
          style={{
            flex: 1,
            padding: "10px 14px",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--border)",
            fontSize: "13px",
            outline: "none",
            background: "white",
            color: "var(--text-primary)",
          }}
        />
      </div>
    </div>
  )
}

export default App

import { useState } from 'react'
import './App.css'

function App() {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)

  const sendMessage = async () => {
    // Empty message ko send nahi karna
    if (message.trim() === '' || loading) return

    const userMessage = message

    // User message screen par show karo
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        sender: 'user',
        text: userMessage,
      },
    ])

    // Input empty karo
    setMessage('')

    // Loading start
    setLoading(true)

    try {
      // Backend ko message send karo
      const response = await fetch('http://localhost:5000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
        }),
      })

      // Backend response ko JSON mein convert karo
      const data = await response.json()

      // AI response screen par show karo
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          sender: 'bot',
          text: data.reply,
        },
      ])
    } catch (error) {
      console.error('Error:', error)

      setMessages((prevMessages) => [
        ...prevMessages,
        {
          sender: 'bot',
          text: 'Sorry, I could not connect to the AI server.',
        },
      ])
    } finally {
      // Loading finish
      setLoading(false)
    }
  }

  return (
    <div className="chat-app">

      <header className="chat-header">
        <h1>Nadeem's AI Chatbot</h1>
        <p>Ask me anything</p>
      </header>

      <main className="chat-box">

        {messages.length === 0 ? (
          <div className="welcome">
            <h2>👋 Hello!</h2>
            <p>How can I help you today?</p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`message ${msg.sender}`}
            >
              {msg.text}
            </div>
          ))
        )}

        {loading && (
          <div className="message bot">
            Thinking... 🤔
          </div>
        )}

      </main>

      <div className="input-area">

        <input
          type="text"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              sendMessage()
            }
          }}
        />

        <button
          onClick={sendMessage}
          disabled={loading}
        >
          {loading ? 'Thinking...' : 'Send'}
        </button>

      </div>

    </div>
  )
}

export default App
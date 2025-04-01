import { createContext, useState } from 'react';

// Create the context
export const MessagesContext = createContext({})

// eslint-disable-next-line react/prop-types
export function MessagesProvider({ children }) {
  const [messages, setMessages] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const value = {
    messages,
    loading,
    error,
    setMessages,
    setError,
    setLoading
  }

  return (
    <MessagesContext.Provider value={value}>
      {children}
    </MessagesContext.Provider>
  )
}

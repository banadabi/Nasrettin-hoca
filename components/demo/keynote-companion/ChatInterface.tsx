/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useLiveAPIContext } from '@/contexts/LiveAPIContext';
import { useHistory, Message } from '@/lib/state';
import { FormEvent, useEffect, useRef, useState } from 'react';

export default function ChatInterface() {
  const { client, connected } = useLiveAPIContext();
  const { addMessage } = useHistory();
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentUserTranscription, setCurrentUserTranscription] = useState('');
  const [currentAgentTranscription, setCurrentAgentTranscription] = useState('');
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Ref to accumulate final user transcription parts for a turn.
  // This seems reliable for user input.
  const finalUserTranscription = useRef('');

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, currentUserTranscription, currentAgentTranscription]);

  useEffect(() => {
    if (!connected) {
      // Clear all state on disconnect
      setMessages([]);
      setCurrentUserTranscription('');
      setCurrentAgentTranscription('');
      finalUserTranscription.current = '';
      return;
    }

    const handleInputTranscription = (transcription: {
      text: string;
      isFinal: boolean;
    }) => {
      // The API sends cumulative text for the current phrase, with an `isFinal`
      // flag when the phrase is complete. This logic assembles the full turn.
      if (transcription.isFinal) {
        finalUserTranscription.current += transcription.text + ' ';
      }
      setCurrentUserTranscription(
        finalUserTranscription.current + transcription.text
      );
    };

    const handleOutputTranscription = (transcription: {
      text: string;
      isFinal: boolean;
    }) => {
      // For agent output, we'll assume the `text` property is cumulative
      // for the current utterance and display it directly. The final commit
      // to the message history will happen on 'turncomplete'.
      setCurrentAgentTranscription(transcription.text);
    };

    const handleTurnComplete = () => {
      const userMsg = finalUserTranscription.current.trim();
      // Agent message is taken directly from the latest interim state,
      // as it reliably holds the full text of the agent's turn.
      const agentMsg = currentAgentTranscription.trim();
      const newMessages: Message[] = [];

      if (userMsg) {
        const message: Message = {
          author: 'user',
          text: userMsg,
          timestamp: new Date(),
        };
        newMessages.push(message);
        addMessage(message);
      }

      if (agentMsg) {
        const message: Message = {
          author: 'agent',
          text: agentMsg,
          timestamp: new Date(),
        };
        newMessages.push(message);
        addMessage(message);
      }

      if (newMessages.length > 0) {
        setMessages(prev => [...prev, ...newMessages]);
      }

      // Reset for the next turn
      finalUserTranscription.current = '';
      setCurrentUserTranscription('');
      setCurrentAgentTranscription('');
    };

    client.on('inputTranscription', handleInputTranscription);
    client.on('outputTranscription', handleOutputTranscription);
    client.on('turncomplete', handleTurnComplete);

    return () => {
      client.off('inputTranscription', handleInputTranscription);
      client.off('outputTranscription', handleOutputTranscription);
      client.off('turncomplete', handleTurnComplete);
    };
  }, [client, connected, currentAgentTranscription, addMessage]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !connected) return;

    const userMessage: Message = {
      author: 'user',
      text: input,
      timestamp: new Date(),
    };
    // Add user's typed message to chat immediately
    setMessages(prev => [...prev, userMessage]);
    addMessage(userMessage);

    // Send to API, signaling end of user's turn
    client.send({ text: input }, true);

    // Clear input field
    setInput('');
  };

  return (
    <div className="chat-interface">
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message-container ${msg.author}`}>
            <div className={`message ${msg.author}`}>
              <p>{msg.text}</p>
              <span className="timestamp">
                {msg.timestamp.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          </div>
        ))}
        {/* Display live transcriptions */}
        {currentUserTranscription && (
          <div className="message-container user">
            <div className="message user interim">
              <p>{currentUserTranscription}</p>
            </div>
          </div>
        )}
        {currentAgentTranscription && (
          <div className="message-container agent">
            <div className="message agent interim">
              <p>{currentAgentTranscription}</p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <form className="chat-input" onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Bir mesaj yazın..."
          disabled={!connected}
        />
        <button type="submit" disabled={!input.trim() || !connected}>
          <span className="icon">send</span>
        </button>
      </form>
    </div>
  );
}

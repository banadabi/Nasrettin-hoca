/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
/**
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { useState } from 'react';
import ControlTray from './components/console/control-tray/ControlTray';
import ErrorScreen from './components/demo/ErrorSreen';
import KeynoteCompanion from './components/demo/keynote-companion/KeynoteCompanion';
import Header from './components/Header';
import UserSettings from './components/UserSettings';
import Modal from './components/Modal';
import { useHistory, useUI, useAgent } from './lib/state';
import { LiveAPIProvider } from './contexts/LiveAPIContext';

// FIX: Use `process.env.API_KEY` as per the coding guidelines.
const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  throw new Error('The API_KEY environment variable has not been set.');
}

function History() {
  const { history, clearHistory } = useHistory();
  const { agents } = useAgent();
  const { setShowHistory } = useUI();
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);

  const getAgent = (agentId: string) => {
    return agents.find(a => a.id === agentId);
  };

  return (
    <Modal onClose={() => setShowHistory(false)}>
      <div className="history-modal">
        <div className="history-header">
          <h2>Konuşma Geçmişi</h2>
          {history.length > 0 && (
            <button
              onClick={() => {
                if (
                  window.confirm(
                    'Tüm konuşma geçmişini silmek istediğinizden emin misiniz?'
                  )
                ) {
                  clearHistory();
                }
              }}
              className="button delete-history-button"
              aria-label="Geçmişi Temizle"
            >
              <span className="icon">delete_forever</span>
              Temizle
            </button>
          )}
        </div>
        {history.length > 0 ? (
          <ul className="conversation-list">
            {history.map(convo => (
              <li key={convo.id}>
                <button
                  onClick={() =>
                    setSelectedConversationId(
                      selectedConversationId === convo.id ? null : convo.id
                    )
                  }
                  aria-expanded={selectedConversationId === convo.id}
                >
                  <div className="convo-summary">
                    <span className="icon">{getAgent(convo.agentId)?.icon}</span>
                    <p>{getAgent(convo.agentId)?.name || 'Bilinmeyen Karakter'}</p>
                  </div>
                  <span className="convo-timestamp">
                    {convo.startTime.toLocaleString('tr-TR')}
                  </span>
                </button>
                {selectedConversationId === convo.id && (
                  <div className="message-history">
                    {convo.messages.map((msg, index) => (
                      <div
                        key={index}
                        className={`message-container ${msg.author}`}
                      >
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
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>Henüz bir konuşma geçmişi yok.</p>
        )}
      </div>
    </Modal>
  );
}

/**
 * Main application component that provides a streaming interface for Live API.
 * Manages video streaming state and provides controls for webcam/screen capture.
 */
function App() {
  const { showUserConfig, showHistory } = useUI();
  return (
    <div className="App">
      <LiveAPIProvider apiKey={API_KEY}>
        <ErrorScreen />
        <Header />

        {showUserConfig && <UserSettings />}
        {showHistory && <History />}
        <div className="streaming-console">
          <main>
            <div className="main-app-area">
              <KeynoteCompanion />
            </div>

            <ControlTray></ControlTray>
          </main>
        </div>
      </LiveAPIProvider>
    </div>
  );
}

export default App;

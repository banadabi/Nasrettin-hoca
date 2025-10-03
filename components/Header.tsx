/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { useAgent, useUI, useUser } from '@/lib/state';

export default function Header() {
  const { showUserConfig, setShowUserConfig, setShowHistory } = useUI();
  const { name } = useUser();
  const agents = useAgent(state => state.agents);
  const currentAgentId = useAgent(state => state.currentAgentId);
  const currentAgent = agents.find(agent => agent.id === currentAgentId)!;

  return (
    <header>
      <div className="roomInfo">
        <div className="roomName">
          <h1>
            <span className="icon">{currentAgent.icon}</span>
            {currentAgent.name}
          </h1>
        </div>
      </div>
      <div className="header-controls">
        <button
          className="historyButton"
          onClick={() => setShowHistory(true)}
          aria-label="Konuşma geçmişini görüntüle"
        >
          <span className="icon">history</span>
        </button>
        <button
          className="userSettingsButton"
          onClick={() => setShowUserConfig(!showUserConfig)}
        >
          <p className="user-name">{name || 'Adınız'}</p>
          <span className="icon">tune</span>
        </button>
      </div>
    </header>
  );
}

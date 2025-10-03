/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { useRef } from 'react';
import {
  Agent,
  AGENT_COLORS,
  AGENT_ICONS,
  INTERLOCUTOR_VOICE,
  INTERLOCUTOR_VOICES,
} from '@/lib/presets/agents';
import Modal from './Modal';
import c from 'classnames';
import { useAgent, useUI } from '@/lib/state';

export default function EditAgent() {
  const agent = useAgent(state => state.current);
  const updateAgent = useAgent(state => state.update);
  const setShowAgentEdit = useUI(state => state.setShowAgentEdit);

  const nameInput = useRef(null);

  // Guard against agent not being available during hydration
  if (!agent) {
    return null;
  }

  function onClose() {
    setShowAgentEdit(false);
  }

  function updateCurrentAgent(adjustments: Partial<Agent>) {
    updateAgent(adjustments);
  }

  return (
    <Modal onClose={() => onClose()}>
      <div className="editAgent">
        <form>
          <div className="agent-title">
            <span className="icon icon-display">{agent.icon}</span>
            <input
              className="largeInput"
              type="text"
              placeholder="İsim"
              value={agent.name}
              onChange={e => updateCurrentAgent({ name: e.target.value })}
              ref={nameInput}
            />
          </div>

          <div>
            <label>
              Kişilik
              <textarea
                value={agent.personality}
                onChange={e =>
                  updateCurrentAgent({ personality: e.target.value })
                }
                rows={7}
                placeholder="Nasıl davranmalıyım? Amacım ne? Kişiliğimi nasıl tanımlarsın?"
              />
            </label>
          </div>
        </form>

        <div className="customization-section">
          <div>
            <label>Simge</label>
            <ul className="iconPicker">
              {AGENT_ICONS.map(icon => (
                <li key={icon} className={c({ active: icon === agent.icon })}>
                  <button onClick={() => updateCurrentAgent({ icon })}>
                    <span className="icon">{icon}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <label>Renk</label>
            <ul className="colorPicker">
              {AGENT_COLORS.map((color, i) => (
                <li
                  key={i}
                  className={c({ active: color === agent.bodyColor })}
                >
                  <button
                    style={{ backgroundColor: color }}
                    onClick={() => updateCurrentAgent({ bodyColor: color })}
                  />
                </li>
              ))}
            </ul>
          </div>
          <div className="voicePicker">
            <label>Ses</label>
            <select
              value={agent.voice}
              onChange={e => {
                updateCurrentAgent({
                  voice: e.target.value as INTERLOCUTOR_VOICE,
                });
              }}
            >
              {INTERLOCUTOR_VOICES.map(voice => (
                <option key={voice} value={voice}>
                  {voice}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button onClick={() => onClose()} className="button primary">
          Hadi başlayalım!
        </button>
      </div>
    </Modal>
  );
}

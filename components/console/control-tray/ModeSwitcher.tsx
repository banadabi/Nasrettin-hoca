/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { useUI } from '@/lib/state';
import { InteractionMode } from '@/lib/state';
import c from 'classnames';

export default function ModeSwitcher() {
  const { interactionMode, setInteractionMode } = useUI();

  return (
    <div className="mode-switcher">
      <button
        className={c({ active: interactionMode === InteractionMode.CHAT })}
        onClick={() => setInteractionMode(InteractionMode.CHAT)}
        aria-pressed={interactionMode === InteractionMode.CHAT}
      >
        <span className="icon">chat</span>
        <span className="mode-text">Sohbet</span>
      </button>
      <button
        className={c({ active: interactionMode === InteractionMode.VOICE })}
        onClick={() => setInteractionMode(InteractionMode.VOICE)}
        aria-pressed={interactionMode === InteractionMode.VOICE}
      >
        <span className="icon">record_voice_over</span>
        <span className="mode-text">Ses</span>
      </button>
    </div>
  );
}
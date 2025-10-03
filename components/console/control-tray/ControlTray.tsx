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

import cn from 'classnames';

import { memo, useEffect, useRef, useState } from 'react';
import { AudioRecorder } from '../../../lib/audio-recorder';
import ModeSwitcher from './ModeSwitcher';
import { useLiveAPIContext } from '../../../contexts/LiveAPIContext';
import { useHistory, useUI } from '@/lib/state';

function ControlTray() {
  const [audioRecorder] = useState(() => new AudioRecorder());
  const [muted, setMuted] = useState(false);
  const connectButtonRef = useRef<HTMLButtonElement>(null);
  const { endConversation } = useHistory();

  const { showUserConfig } = useUI();
  const { client, connected, connect, disconnect, setError } =
    useLiveAPIContext();

  const handleDisconnect = () => {
    endConversation();
    disconnect();
  };

  // Stop the current agent if the user is editing the user config
  useEffect(() => {
    if (showUserConfig) {
      if (connected) handleDisconnect();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showUserConfig, connected]);

  useEffect(() => {
    if (!connected && connectButtonRef.current) {
      connectButtonRef.current.focus();
    }
  }, [connected]);

  useEffect(() => {
    const onData = (base64: string) => {
      client.sendRealtimeInput([
        {
          mimeType: 'audio/pcm;rate=16000',
          data: base64,
        },
      ]);
    };
    if (connected && !muted && audioRecorder) {
      const startMic = async () => {
        try {
          audioRecorder.on('data', onData);
          await audioRecorder.start();
        } catch (err) {
          console.error('Error starting microphone:', err);
          if (
            err instanceof DOMException &&
            (err.name === 'NotAllowedError' ||
              err.name === 'PermissionDeniedError')
          ) {
            setError(
              new Error(
                'Mikrofon izni reddedildi. Bu uygulamayı kullanmak için lütfen tarayıcı ayarlarınızdan mikrofon erişimine izin verin.'
              )
            );
          } else {
            setError(err as Error);
          }
          handleDisconnect();
        }
      };
      startMic();
    } else {
      audioRecorder.stop();
    }
    return () => {
      audioRecorder.off('data', onData);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connected, client, muted, audioRecorder, setError]);

  return (
    <section className="control-tray">
      <ModeSwitcher />
      <div className={cn('connection-container', { connected })}>
        <button
          ref={connectButtonRef}
          className={cn('action-button connect-toggle', { connected })}
          onClick={connected ? handleDisconnect : connect}
        >
          <span className="material-symbols-outlined filled">
            {connected ? 'pause' : 'play_arrow'}
          </span>
        </button>
        <button
          className={cn('action-button mic-button', { disabled: !connected })}
          onClick={() => setMuted(!muted)}
          disabled={!connected}
        >
          {!muted ? (
            <span className="material-symbols-outlined filled">mic</span>
          ) : (
            <span className="material-symbols-outlined filled">mic_off</span>
          )}
        </button>
        <span className="text-indicator">Yayınlanıyor</span>
      </div>
    </section>
  );
}

export default memo(ControlTray);

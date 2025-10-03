/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { useLiveAPIContext } from '@/contexts/LiveAPIContext';
import React from 'react';

export interface ExtendedErrorType {
  code?: number;
  message?: string;
  status?: string;
}

export default function ErrorScreen() {
  const { error, setError } = useLiveAPIContext();

  const quotaErrorMessage =
    "AI Studio'daki Gemini Live API'sinin günlük sınırlı bir ücretsiz kotası vardır. Devam etmek için yarın tekrar gelin.";

  if (!error) {
    return <div style={{ display: 'none' }} />;
  }

  let errorMessage = 'Bir şeyler ters gitti. Lütfen tekrar deneyin.';
  let rawMessage: string | null = error?.message || null;
  let showCloseButton = true;

  if (error?.message?.includes('RESOURCE_EXHAUSTED')) {
    errorMessage = quotaErrorMessage;
    rawMessage = null;
    showCloseButton = false;
  } else if (error?.message?.includes('Mikrofon izni reddedildi')) {
    errorMessage = 'Mikrofon izni reddedildi.';
    rawMessage =
      'Uygulamanın çalışması için mikrofon erişimi gereklidir. Lütfen sayfa ayarlarından izin verip tekrar deneyin.';
    showCloseButton = true;
  } else if (error?.message?.includes('Kamera izni reddedildi')) {
    errorMessage = 'Kamera izni reddedildi.';
    rawMessage =
      'Görüntülü modun çalışması için kamera erişimi gereklidir. Lütfen sayfa ayarlarından izin verip tekrar deneyin.';
    showCloseButton = true;
  }

  return (
    <div className="error-screen">
      <div
        style={{
          fontSize: 48,
        }}
      >
        💔
      </div>
      <div
        className="error-message-container"
        style={{
          fontSize: 22,
          lineHeight: 1.2,
          opacity: 0.5,
        }}
      >
        {errorMessage}
      </div>
      {showCloseButton ? (
        <button
          className="close-button"
          onClick={() => {
            setError(null);
          }}
        >
          Kapat
        </button>
      ) : null}
      {rawMessage ? (
        <div
          className="error-raw-message-container"
          style={{
            fontSize: 15,
            lineHeight: 1.2,
            opacity: 0.4,
          }}
        >
          {rawMessage}
        </div>
      ) : null}
    </div>
  );
}
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { useLiveAPIContext } from '@/contexts/LiveAPIContext';
import { useEffect, useRef, useState } from 'react';

const FRAME_RATE = 10; // Send 10 frames per second
const JPEG_QUALITY = 0.7;

export default function VideoInterface() {
  const { client, connected, setError } = useLiveAPIContext();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(document.createElement('canvas'));
  const frameIntervalRef = useRef<number | null>(null);
  const [hasPermission, setHasPermission] = useState(true);

  useEffect(() => {
    async function getCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setHasPermission(true);
      } catch (error) {
        console.error('Kameraya erişirken hata oluştu:', error);
        setHasPermission(false);
        if (
          error instanceof DOMException &&
          (error.name === 'NotAllowedError' ||
            error.name === 'PermissionDeniedError')
        ) {
          setError(
            new Error(
              'Kamera izni reddedildi. Görüntülü modu kullanmak için lütfen tarayıcı ayarlarınızdan kamera erişimine izin verin.'
            )
          );
        } else {
          setError(error as Error);
        }
      }
    }
    getCamera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [setError]);

  useEffect(() => {
    if (connected && hasPermission && videoRef.current) {
      const videoEl = videoRef.current;
      const canvasEl = canvasRef.current;
      const ctx = canvasEl.getContext('2d');

      if (!ctx) return;

      frameIntervalRef.current = window.setInterval(() => {
        canvasEl.width = videoEl.videoWidth;
        canvasEl.height = videoEl.videoHeight;
        ctx.drawImage(videoEl, 0, 0, videoEl.videoWidth, videoEl.videoHeight);
        canvasEl.toBlob(
          async blob => {
            if (blob) {
              const reader = new FileReader();
              reader.onload = () => {
                const base64Data = (reader.result as string).split(',')[1];
                if (client.status === 'connected') {
                  client.sendRealtimeInput([
                    {
                      mimeType: 'image/jpeg',
                      data: base64Data,
                    },
                  ]);
                }
              };
              reader.readAsDataURL(blob);
            }
          },
          'image/jpeg',
          JPEG_QUALITY
        );
      }, 1000 / FRAME_RATE);
    }

    return () => {
      if (frameIntervalRef.current) {
        clearInterval(frameIntervalRef.current);
      }
    };
  }, [connected, hasPermission, client]);

  return (
    <div className="video-interface">
      {!hasPermission && (
        <div className="permission-denied">
          <span className="icon">videocam_off</span>
          <p>Görüntülü mod için kamera erişimi gereklidir.</p>
        </div>
      )}
      <video ref={videoRef} autoPlay muted playsInline />
    </div>
  );
}
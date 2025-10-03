
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { useEffect, useState, useRef } from 'react';
import useHover from '../../../hooks/demo/use-hover';
import useTilt from '../../../hooks/demo/use-tilt';
import { useLiveAPIContext } from '../../../contexts/LiveAPIContext';
import useFace from '../../../hooks/demo/use-face';
import NasreddinHocaAvatar from './NasreddinHocaAvatar';

// Ses çıkışının meydana geldiğini gösteren minimum ses seviyesi
const AUDIO_OUTPUT_DETECTION_THRESHOLD = 0.05;
// Konuşma durumunu false olarak ayarlamadan önceki gecikme miktarı
const TALKING_STATE_COOLDOWN_MS = 2000;
// Ağzın tamamen açık olduğu ses seviyesi eşiği
const MOUTH_MAX_VOLUME = 0.4;
// Gözlerin kırpılması için gereken ölçek eşiği
const BLINK_THRESHOLD = 0.5;

type BasicFaceProps = {};

export default function BasicFace({}: BasicFaceProps) {
  const timeoutRef = useRef<number | null>(null);

  // Ses çıkış seviyesi
  const { volume } = useLiveAPIContext();

  // Konuşma durumu
  const [isTalking, setIsTalking] = useState(false);

  // Yüz durumu
  const { eyeScale } = useFace();
  const hoverPosition = useHover();
  const tiltAngle = useTilt({
    maxAngle: 5,
    speed: 0.075,
    isActive: isTalking,
  });

  // Ajanın ses çıkış seviyesine göre konuşup konuşmadığını algıla
  // Ses algılandığında konuşma durumunu ayarla
  useEffect(() => {
    if (volume > AUDIO_OUTPUT_DETECTION_THRESHOLD) {
      setIsTalking(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      // Ses çıkışının bitmesi ile konuşma durumunu false yapma arasında hafif bir gecikme uygula
      timeoutRef.current = window.setTimeout(
        () => setIsTalking(false),
        TALKING_STATE_COOLDOWN_MS
      );
    }
  }, [volume]);

  let mouthOpenScale = 0;
  if (volume > AUDIO_OUTPUT_DETECTION_THRESHOLD) {
    // Ses seviyesini 0-1 aralığına ölçeklendir
    const normalizedVolume =
      (volume - AUDIO_OUTPUT_DETECTION_THRESHOLD) /
      (MOUTH_MAX_VOLUME - AUDIO_OUTPUT_DETECTION_THRESHOLD);
    mouthOpenScale = Math.min(1, Math.max(0, normalizedVolume));
  }

  const eyesOpen = eyeScale > BLINK_THRESHOLD;

  const avatarProps = {
    mouthOpenScale,
    eyesOpen,
    isTalking,
  };

  const renderCurrentAvatar = () => {
    return <NasreddinHocaAvatar {...avatarProps} />;
  };

  return (
    <div
      className="avatar-container"
      style={{
        transform: `translateY(${hoverPosition}px) rotate(${tiltAngle}deg)`,
      }}
    >
      {renderCurrentAvatar()}
    </div>
  );
}

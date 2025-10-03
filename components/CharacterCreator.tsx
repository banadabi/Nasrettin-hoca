/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { GoogleGenAI } from '@google/genai';
import { useState } from 'react';
import { useAgent, useUI } from '@/lib/state';
import Modal from './Modal';
import {
  createNewAgent,
  FEMALE_VOICES,
  INTERLOCUTOR_VOICE,
  MALE_VOICES,
} from '@/lib/presets/agents';

export default function CharacterCreator() {
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { setShowCharacterCreator, setShowAgentEdit } = useUI();
  const addAgent = useAgent(state => state.addAgent);

  async function generatePersonality() {
    if (!description.trim()) {
      setError('Lütfen bir karakter açıklaması girin.');
      return;
    }
    setIsLoading(true);
    setError('');

    try {
      // FIX: Use `process.env.API_KEY` directly as per the coding guidelines.
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
      const prompt = `Aşağıdaki kullanıcı açıklamasına dayanarak bir AI sohbet robotu için ayrıntılı bir kişilik profili oluşturun. Profil, sistem istemi için uygun olmalıdır. Karakterin kişiliğini, konuşma tarzını, geçmişini ve tuhaflıklarını açıklamalıdır. Yanıt, "İşte kişilik profili" gibi herhangi bir giriş ifadesi olmadan sadece kişilik metni olmalıdır.

Kullanıcı açıklaması: "${description}"

Son olarak, karakterin sesinin erkek mi yoksa kadın mı olması gerektiğine karar verin ve yanıtınızın sonuna "SES: Erkek" veya "SES: Kadın" satırını ekleyin.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      const fullResponse = response.text;

      if (!fullResponse) {
        throw new Error("API'den boş bir yanıt alındı.");
      }

      let selectedVoice: INTERLOCUTOR_VOICE;
      if (fullResponse.includes('SES: Kadın')) {
        selectedVoice =
          FEMALE_VOICES[Math.floor(Math.random() * FEMALE_VOICES.length)];
      } else if (fullResponse.includes('SES: Erkek')) {
        selectedVoice =
          MALE_VOICES[Math.floor(Math.random() * MALE_VOICES.length)];
      } else {
        // Fallback if the model doesn't specify a gender
        const allVoices = [...FEMALE_VOICES, ...MALE_VOICES];
        selectedVoice =
          allVoices[Math.floor(Math.random() * allVoices.length)];
      }

      const personality = fullResponse
        .replace(/SES: (Erkek|Kadın)/, '')
        .trim();

      const newAgent = createNewAgent({ personality, voice: selectedVoice });
      addAgent(newAgent);

      setShowCharacterCreator(false);
      setShowAgentEdit(true);
    } catch (err) {
      console.error(err);
      setError(
        'Karakter oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.'
      );
    } finally {
      setIsLoading(false);
    }
  }

  function onClose() {
    setShowCharacterCreator(false);
  }

  return (
    <Modal onClose={onClose}>
      <div className="characterCreator userSettings">
        {' '}
        {/* Reusing some styles */}
        <h2>Yeni Bir ChatterBot Oluşturun</h2>
        <p>
          Hayalinizdeki AI karakterini tanımlayın. Kişiliklerini, tuhaflıklarını
          ve nasıl konuşmaları gerektiğini anlatın. Yapay zekamız bu açıklamayı
          onlar için benzersiz bir kişiliğe dönüştürecektir.
        </p>
        <form
          onSubmit={e => {
            e.preventDefault();
            generatePersonality();
          }}
        >
          <div>
            <label>
              Karakter Açıklaması
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={5}
                placeholder="Örneğin: Sürekli felsefi sorular soran, yıldızları izlemeyi seven ve her zaman fısıltıyla konuşan melankolik bir robot."
                disabled={isLoading}
              />
            </label>
          </div>
          {error && <p style={{ color: 'var(--accent-red)' }}>{error}</p>}
          <button type="submit" className="button primary" disabled={isLoading}>
            {isLoading ? 'Oluşturuluyor...' : 'Karakter Oluştur'}
          </button>
        </form>
      </div>
    </Modal>
  );
}

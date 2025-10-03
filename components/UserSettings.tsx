/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import Modal from './Modal';
import { useAgent, useUI, useUser } from '@/lib/state';

export default function UserSettings() {
  const { name, info, setName, setInfo } = useUser();
  const { setShowUserConfig } = useUI();
  const { agents, currentAgentId, setCurrentAgent } = useAgent();

  function updateClient() {
    setShowUserConfig(false);
  }

  return (
    <Modal onClose={() => setShowUserConfig(false)}>
      <div className="userSettings">
        <p>
          Bu, alan interaktif olarak Nasreddin hoca ile sohbet etmek için bilgilerinizi girmenizi istediğimiz bir alan, burada bilgileri eksiksiz girerek interaktif bir sohbet ortamı oluşturabilirsiniz.
        </p>

        <form
          onSubmit={e => {
            e.preventDefault();
            setShowUserConfig(false);
            updateClient();
          }}
        >
          <div>
            <p>Karakter Seçin</p>
            <select
              value={currentAgentId}
              onChange={e => setCurrentAgent(e.target.value)}
            >
              {agents.map(agent => (
                <option key={agent.id} value={agent.id}>
                  {agent.name}
                </option>
              ))}
            </select>
          </div>

          <p>
            Bu isteğe bağlı bilgileri eklemek deneyimi daha eğlenceli hale
            getirir:
          </p>

          <div>
            <p>Adınız</p>
            <input
              type="text"
              name="name"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Size nasıl hitap edilmesini istersiniz?"
            />
          </div>

          <div>
            <p>Hakkınızda bilgi</p>
            <textarea
              rows={3}
              name="info"
              value={info}
              onChange={e => setInfo(e.target.value)}
              placeholder="Hakkınızda bilmemiz gerekenler... Beğeniler, beğenilmeyenler, hobiler, ilgi alanları, favori filmler, kitaplar, diziler, yiyecekler vb."
            />
          </div>

          <button className="button primary">Hadi başlayalım!</button>
        </form>
      </div>
    </Modal>
  );
}

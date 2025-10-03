/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Agent, NasreddinHoca, PRESET_AGENTS } from './presets/agents';

/**
 * User
 */
export type User = {
  name?: string;
  info?: string;
};

export const useUser = create<
  {
    setName: (name: string) => void;
    setInfo: (info: string) => void;
  } & User
>(set => ({
  name: '',
  info: '',
  setName: name => set({ name }),
  setInfo: info => set({ info }),
}));

/**
 * Agents
 */
// FIX: Add missing methods `addAgent`, `update` and derived property `current` to the agent store.
export const useAgent = create(
  persist<
    {
      agents: Agent[];
      currentAgentId: string;
      setCurrentAgent: (id: string) => void;
      addAgent: (agent: Agent) => void;
      update: (adjustments: Partial<Agent>) => void;
      readonly current: Agent | undefined;
    }
  >(
    (set, get) => ({
      agents: PRESET_AGENTS,
      currentAgentId: NasreddinHoca.id,
      setCurrentAgent: (id: string) => set({ currentAgentId: id }),
      addAgent: (agent: Agent) =>
        set(state => ({
          agents: [...state.agents, agent],
          currentAgentId: agent.id,
        })),
      update: (adjustments: Partial<Agent>) =>
        set(state => ({
          agents: state.agents.map(agent =>
            agent.id === state.currentAgentId
              ? { ...agent, ...adjustments }
              : agent
          ),
        })),
      get current() {
        const { agents, currentAgentId } = get();
        return agents.find(agent => agent.id === currentAgentId);
      },
    }),
    {
      name: 'chatterbot-agents-storage',
      // FIX: Persist the list of agents so new agents are not lost on reload.
      partialize: state => ({
        currentAgentId: state.currentAgentId,
        agents: state.agents,
      }),
    }
  )
);

/**
 * History
 */
export type Message = {
  author: 'user' | 'agent';
  text: string;
  timestamp: Date;
};

export type Conversation = {
  id: string;
  agentId: string;
  startTime: Date;
  messages: Message[];
};

type HistoryState = {
  history: Conversation[];
  currentConversation: Omit<Conversation, 'id' | 'messages'> | null;
  currentMessages: Message[];
  startConversation: (agentId: string) => void;
  addMessage: (message: Message) => void;
  endConversation: () => void;
  clearHistory: () => void;
};

export const useHistory = create(
  persist<HistoryState>(
    (set, get) => ({
      history: [],
      currentConversation: null,
      currentMessages: [],
      startConversation: (agentId: string) => {
        // End previous conversation if it exists and has messages
        get().endConversation();
        set({
          currentConversation: { agentId, startTime: new Date() },
          currentMessages: [],
        });
      },
      addMessage: (message: Message) => {
        set(state => ({
          currentMessages: [...state.currentMessages, message],
        }));
      },
      endConversation: () => {
        const { currentConversation, currentMessages, history } = get();
        if (currentConversation && currentMessages.length > 0) {
          const newConversation: Conversation = {
            id: currentConversation.startTime.toISOString(),
            ...currentConversation,
            messages: currentMessages,
          };
          set({
            history: [newConversation, ...history],
            currentConversation: null,
            currentMessages: [],
          });
        } else {
          // If no messages, just clear the current conversation state
          set({ currentConversation: null, currentMessages: [] });
        }
      },
      clearHistory: () => set({ history: [] }),
    }),
    {
      name: 'chatterbot-history-storage',
      // Custom serializer to handle Date objects, which are not supported by default
      storage: {
        getItem: name => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          const parsed = JSON.parse(str);
          // Revive dates
          const state = parsed.state;
          if (state.history) {
            state.history.forEach((convo: Conversation) => {
              convo.startTime = new Date(convo.startTime);
              convo.messages.forEach(msg => {
                msg.timestamp = new Date(msg.timestamp);
              });
            });
          }
          if (state.currentConversation) {
            state.currentConversation.startTime = new Date(state.currentConversation.startTime);
          }

          return parsed;
        },
        setItem: (name, value) => {
          localStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: name => localStorage.removeItem(name),
      },
    }
  )
);

/**
 * UI
 */
// FIX: Export InteractionMode enum to resolve import error in ModeSwitcher.tsx.
export enum InteractionMode {
  CHAT = 'chat',
  VOICE = 'voice',
}

// FIX: Add missing properties to the UI store to support mode switching and other UI states.
export const useUI = create<{
  showUserConfig: boolean;
  setShowUserConfig: (show: boolean) => void;
  interactionMode: InteractionMode;
  setInteractionMode: (mode: InteractionMode) => void;
  showCharacterCreator: boolean;
  setShowCharacterCreator: (show: boolean) => void;
  showAgentEdit: boolean;
  setShowAgentEdit: (show: boolean) => void;
  showHistory: boolean;
  setShowHistory: (show: boolean) => void;
}>(set => ({
  showUserConfig: true,
  setShowUserConfig: (show: boolean) => set({ showUserConfig: show }),
  interactionMode: InteractionMode.VOICE,
  setInteractionMode: (interactionMode: InteractionMode) =>
    set({ interactionMode }),
  showCharacterCreator: false,
  setShowCharacterCreator: (show: boolean) =>
    set({ showCharacterCreator: show }),
  showAgentEdit: false,
  setShowAgentEdit: (show: boolean) => set({ showAgentEdit: show }),
  showHistory: false,
  setShowHistory: (show: boolean) => set({ showHistory: show }),
}));

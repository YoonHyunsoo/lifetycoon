import { create } from 'zustand';

export type EventType = 'normal' | 'career' | 'stock' | 'quest' | 'result' | 'ending' | 'notification' | 'choice' | 'date';

export interface GameEvent {
    id: string;
    type: EventType;
    title: string;
    description?: string;
    choices?: {
        label: string;
        action: any; // Function or identifier
        isAd?: boolean; // [MONETIZATION]
        adRewardType?: string;
    }[];
    data?: any; // For custom rewards, choices, etc.
}

interface EventState {
    currentEvent: GameEvent | null;
    eventQueue: GameEvent[];

    triggerEvent: (event: GameEvent) => void;
    dismissEvent: () => void;
    clearQueue: () => void;
}

export const useEventStore = create<EventState>((set) => ({
    currentEvent: null,
    eventQueue: [],

    triggerEvent: (event) => set((state) => {
        // If no event is showing, show this one immediately
        if (!state.currentEvent) {
            return { currentEvent: event };
        }
        // Otherwise add to queue
        return { eventQueue: [...state.eventQueue, event] };
    }),

    dismissEvent: () => set((state) => {
        // If queue has items, show next
        if (state.eventQueue.length > 0) {
            const [next, ...rest] = state.eventQueue;
            return { currentEvent: next, eventQueue: rest };
        }
        // Else clear
        return { currentEvent: null };
    }),

    clearQueue: () => set({ eventQueue: [], currentEvent: null }),
}));

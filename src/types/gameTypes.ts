// ------------------------------------------------------------------
// Game Types Definition
// Moved from gameStore.ts to prevent circular dependencies
// ------------------------------------------------------------------

import type { Stock } from '../lib/stockLogic';

// Quest Interface
export interface Quest {
    id: string;
    title: string;
    description: string;
    progress: number; // 0 to 100
    goal: number;
    reward: string;
}

// Player State
export interface PlayerState {
    name: string;
    age: number;
    jobTitle: string;
    isStudent: boolean;

    // Stats
    intelligence: number;
    stamina: number;
    sense: number;
    luck: number;

    // Status
    stress: number;
    reputation: number;

    // Assets
    cash: number;
    stockValue: number;
    bankruptcyCount: number;
    debtWaiverTickets: number;

    // Social
    friends: string[];
    friendHistory: string[];
    activeQuests: Quest[];

    // Family
    spouse: { name: string; job: string; salary: number } | null;
    children: number;

    // Metrics
    monthlyActionCounts: {
        study: number;
        exercise: number;
        club: number;
        rest: number;
    };
    tutorialFlags: {
        study: boolean;
        exercise: boolean;
        club: boolean;
        rest: boolean;
    };
}

// Time State
export interface TimeState {
    year: number;
    month: number;
    week: number;
}

// Stats Input Type (for initialization)
export type InitialStats = [number, number, number, number]; // Int, Sta, Sen, Luck

// Main Game State Interface
export interface GameState {
    player: PlayerState;
    time: TimeState;
    power: number;
    maxPower: number;
    stocks: Stock[];

    // Actions
    initializeGame: (name: string, stats: InitialStats) => void;
    advanceWeek: () => void;
    performAction: (action: 'study' | 'exercise' | 'club' | 'rest' | 'work' | 'overtime' | 'politics' | 'major_study' | 'part_time' | 'cert_study' | 'cv') => void;
    buyStock: (id: number, amount: number) => void;
    sellStock: (id: number, amount: number) => void;

    // Career Actions
    setCareer: (path: 'job' | 'college' | 'cert') => void;

    // Automation & Controls
    isPlaying: boolean;
    togglePlay: () => void;

    // Core Tick
    processTick: () => void;
    recoverPower: () => void;

    // Feedback
    feedback: { id: number; text: string; color: string; icon?: string } | null;
    clearFeedback: () => void;
    setTutorialFlag: (action: 'study' | 'exercise' | 'club' | 'rest') => void;
}

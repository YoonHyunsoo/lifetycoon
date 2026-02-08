export type Profile = {
    id: string;
    username: string | null;
    created_at: string;
};

export type GameSave = {
    id: string;
    user_id: string;

    // Time
    current_age: number;
    current_month: number;
    current_week: number;

    // Personal Stats
    intelligence: number;
    stamina: number;
    charm: number;
    luck: number;

    // Status Stats
    stress: number;
    // reputation: number; // REMOVED

    // Assets
    cash: number;
    stock_value: number;

    // Job
    job_title: string;
    job_level?: string;
    is_student: boolean;

    last_saved_at: string;
};

export type HallOfWealthEntry = {
    id: string;
    user_id: string;
    username: string;
    total_assets: number;
    ended_at: string;
};

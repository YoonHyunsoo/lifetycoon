import { supabase } from './supabase';

export interface GlobalLeaderboardEntry {
    rank: number;
    username: string;
    total_assets: number;
    display_assets?: string;
    ended_at?: string;
}

export const fetchGlobalLeaderboard = async (limit = 100): Promise<GlobalLeaderboardEntry[]> => {
    try {
        const { data, error } = await supabase
            .from('hall_of_wealth')
            .select('username, total_assets')
            .order('total_assets', { ascending: false })
            .limit(limit);

        if (error) throw error;

        return data.map((entry, index) => ({
            rank: index + 1,
            username: entry.username || 'Anonymous',
            total_assets: entry.total_assets,
            display_assets: entry.total_assets.toLocaleString() + ' ₩'
        }));
    } catch (e) {
        console.error("Failed to fetch global leaderboard", e);
        return [];
    }
};

export const submitGlobalScore = async (username: string, assets: number) => {
    try {
        const { error } = await supabase
            .from('hall_of_wealth')
            .insert([
                { username, total_assets: assets }
            ]);

        if (error) throw error;
        return true;
    } catch (e) {
        console.error("Failed to submit score", e);
        return false;
    }
};

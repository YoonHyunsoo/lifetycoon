import { useGameStore } from '../store/gameStore';
import { MAX_STRESS } from '../lib/gameLogic';

const LogicTest = () => {
    const { player, time, power, advanceWeek, performAction, initializeGame } = useGameStore();

    return (
        <div className="p-8 bg-gray-900 text-white font-mono flex flex-col gap-4">
            <h1 className="text-2xl text-yellow-500 font-bold mb-4">Logic Verification Panel</h1>

            {/* Time & Power */}
            <div className="border border-gray-700 p-4 rounded">
                <h2 className="text-xl text-blue-400">Time System</h2>
                <p>Year: {time.year}</p>
                <p>Month: {time.month}</p>
                <p>Week: {time.week} (0-3)</p>
                <div className="mt-2">
                    <button
                        onClick={advanceWeek}
                        className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-500"
                    >
                        Advance Week (+1)
                    </button>
                </div>
            </div>

            {/* Player Stats */}
            <div className="border border-gray-700 p-4 rounded grid grid-cols-2 gap-4">
                <div>
                    <h2 className="text-xl text-green-400">Player Stats</h2>
                    <p>Name: {player.name}</p>
                    <p>Age: {player.age}</p>
                    <div className="mt-2 text-sm text-gray-300">
                        <p>INT: {player.intelligence}</p>
                        <p>STM: {player.stamina}</p>
                        <p>SNS: {player.sense}</p>
                        <p>LCK: {player.luck}</p>
                    </div>
                </div>
                <div>
                    <h2 className="text-xl text-red-400">Status & Assets</h2>
                    <p className={player.stress >= MAX_STRESS ? 'text-red-600 font-bold' : ''}>
                        Stress: {player.stress} / {MAX_STRESS}
                        {player.stress >= MAX_STRESS && ' (GAME OVER)'}
                    </p>
                    <p>Reputation: {player.reputation}</p>
                    <p>Power: {power} / 100</p>
                </div>
            </div>

            {/* Actions */}
            <div className="border border-gray-700 p-4 rounded">
                <h2 className="text-xl text-purple-400">Actions</h2>
                <div className="flex gap-2 mt-2">
                    <button onClick={() => performAction('study')} className="bg-gray-700 px-3 py-1 rounded hover:bg-gray-600">
                        Study (Int++, Stress++)
                    </button>
                    <button onClick={() => performAction('exercise')} className="bg-gray-700 px-3 py-1 rounded hover:bg-gray-600">
                        Exercise (Stm++, Stress--)
                    </button>
                    <button onClick={() => performAction('club')} className="bg-gray-700 px-3 py-1 rounded hover:bg-gray-600">
                        Club (Sns++, Stress--)
                    </button>
                    <button onClick={() => performAction('rest')} className="bg-gray-700 px-3 py-1 rounded hover:bg-gray-600">
                        Rest (Stress -5)
                    </button>
                </div>
            </div>

            {/* Debug Controls */}
            <div className="border border-gray-700 p-4 rounded bg-gray-800">
                <h2 className="text-xl text-gray-400">Debug Controls</h2>
                <div className="flex gap-2 mt-2">
                    {/* <button onClick={() => debugSetStat('stress', 45)} className="bg-red-900 px-2 py-1 text-xs rounded">
                        Set Stress 45 (High Penalty)
                    </button>
                    <button onClick={() => debugSetStat('stamina', 90)} className="bg-green-900 px-2 py-1 text-xs rounded">
                        Set Stamina 90 (High Bonus)
                    </button> */}
                    <button onClick={() => initializeGame('CheolSoo', [10, 10, 10, 10])} className="bg-yellow-900 px-2 py-1 text-xs rounded">
                        Reset Game
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LogicTest;

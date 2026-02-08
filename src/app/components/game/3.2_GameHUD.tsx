import React from 'react';
import { useGameStore } from '../../../store/gameStore';

const GameHUD: React.FC = () => {
  const gameState = useGameStore();
  if (!gameState) return null; // Safety guard
  const { time, player } = gameState;

  return (
    <div className="w-full bg-gray-800 border-b-4 border-gray-700 p-2 flex flex-col gap-1 text-xs shadow-lg relative h-16">

      {/* Top Header: Name/Age (Left) | Job/Level (Right) */}
      <div className="flex justify-between items-center text-white font-bold h-full">
        {/* Left: Name & Age */}
        <div className="flex flex-col justify-center">
          <span className="text-sm">{player.name}</span>
          <span className="text-xs text-gray-400">{player.age}yo</span>
        </div>

        {/* Right: Job & Level */}
        <div className="flex flex-col items-end justify-center">
          <span className="text-sm">{player.jobTitle}</span>
          <span className="text-xs text-gray-500">Lv.1</span>
        </div>
      </div>

      {/* --- LEFT SIDE MODULES --- */}

      {/* 1. STAT Box (Top Left) */}
      <StatBox player={player} />

      {/* 2. STATUS Box (Middle Left - Stress & Reputation) */}
      <StatusBox player={player} />

      {/* 3. ASSETS Box (Bottom Left - Cash & Stock) */}
      <AssetsBox player={player} />


      {/* --- RIGHT SIDE MODULES --- */}

      {/* 1. TEST / COMPANY Box (Top Right) */}
      <TestCompanyBox player={player} time={time} />

      {/* 2. FRIENDS / SCOUT Box (Middle Right) */}
      <FriendsScoutBox player={player} />

      {/* 3. QUEST Box (Bottom Right) */}
      <QuestBox player={player} />

    </div>
  );
};

// Reusable Tooltip Component
const Tooltip: React.FC<{ activeTooltip: string | null, descriptions: Record<string, string> }> = ({ activeTooltip, descriptions }) => {
  if (!activeTooltip || !descriptions[activeTooltip]) return null;
  return (
    <div className="absolute left-[105%] top-0 bg-black text-white text-[10px] p-2 rounded w-40 shadow-xl animate-fade-in z-50 pointer-events-none whitespace-pre-line">
      <div className="font-bold mb-1 text-yellow-400">{activeTooltip}</div>
      <div>{descriptions[activeTooltip]}</div>
      <div className="absolute left-0 top-4 w-0 h-0 border-t-4 border-t-transparent border-r-4 border-r-black border-b-4 border-b-transparent -ml-1"></div>
    </div>
  );
};

// Right Side Tooltip (Mirrored)
const RightTooltip: React.FC<{ activeTooltip: string | null, descriptions: Record<string, string> }> = ({ activeTooltip, descriptions }) => {
  if (!activeTooltip || !descriptions[activeTooltip]) return null;
  return (
    <div className="absolute right-[105%] top-0 bg-black text-white text-[10px] p-2 rounded w-40 shadow-xl animate-fade-in z-50 pointer-events-none whitespace-pre-line text-right">
      <div className="font-bold mb-1 text-yellow-400">{activeTooltip}</div>
      <div>{descriptions[activeTooltip]}</div>
      <div className="absolute right-0 top-4 w-0 h-0 border-t-4 border-t-transparent border-l-4 border-l-black border-b-4 border-b-transparent -mr-1"></div>
    </div>
  );
};

// --- LEFT SIDE COMPONENTS ---

const StatBox: React.FC<{ player: any }> = ({ player }) => {
  const [activeTooltip, setActiveTooltip] = React.useState<string | null>(null);

  const handleClick = (stat: string) => {
    setActiveTooltip(stat);
    setTimeout(() => setActiveTooltip(null), 3000);
  };

  const descriptions: Record<string, string> = {
    INT: "Intelligence.\n[Exam Score] = Int + (Study Count * 2)\nStudy hard for the test months (5, 7, 10, 12)!",
    STA: `Stamina.\nReduces Action Cost!\nformula: Cost - floor(STA/10)\nCurrent Reduction: -${Math.floor(player.stamina / 10)} Cost`,
    CHM: "Charm (Social/Vibe).\nRequired for dating & interviews.\nSocialize to increase!\nBuffs Rest efficiency!",
    LUCK: "Luck.\nAffects random events & critical success."
  };

  return (
    <div className="absolute top-[80px] left-0 bg-gray-900 text-white border-2 border-gray-600 rounded p-2 shadow-lg z-40 flex flex-col gap-1 w-28">
      <div className="text-xs font-bold border-b border-gray-600 pb-1 mb-1 text-center bg-gray-800 text-gray-300">STAT</div>

      <StatRow label="INT" value={player.intelligence} color="text-blue-400" onClick={() => handleClick('INT')} />
      <StatRow label="STA" value={player.stamina} color="text-red-400" onClick={() => handleClick('STA')} />
      <StatRow label="CHM" value={player.charm} color="text-pink-400" onClick={() => handleClick('CHM')} />
      <StatRow label="LUCK" value={player.luck} color="text-yellow-400" onClick={() => handleClick('LUCK')} />

      <Tooltip activeTooltip={activeTooltip} descriptions={descriptions} />
    </div>
  );
};

const StatusBox: React.FC<{ player: any }> = ({ player }) => {
  const [activeTooltip, setActiveTooltip] = React.useState<string | null>(null);

  const handleClick = (stat: string) => {
    setActiveTooltip(stat);
    setTimeout(() => setActiveTooltip(null), 3000);
  };

  const descriptions: Record<string, string> = {
    STRESS: "Fatigue Level.\nHigh Stress = Higher Action Cost!\n[30+] Cost +10  [40+] Cost +20\nRest to recover!"
  };

  return (
    <div className="absolute top-[215px] left-0 bg-gray-900 text-white border-2 border-gray-600 rounded p-2 shadow-lg z-30 flex flex-col gap-2 w-28">
      <div className="text-xs font-bold border-b border-gray-600 pb-1 mb-1 text-center bg-gray-800 text-gray-300">STATUS</div>

      {/* Stress */}
      <div className="flex flex-col cursor-pointer hover:bg-gray-800/50 rounded p-0.5 transition-colors" onClick={() => handleClick('STRESS')}>
        <div className="flex justify-between items-end mb-1">
          <span className="text-[10px] text-gray-400 font-bold hover:text-white transition-colors">STRESS</span>
          <div className="text-[10px] text-right text-gray-200">{player.stress}/100</div>
        </div>
        <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden border border-gray-600">
          <div className={`h-full transition-all duration-500 ${player.stress > 80 ? 'bg-red-500 animate-pulse' : player.stress > 50 ? 'bg-yellow-400' : 'bg-green-500'}`} style={{ width: `${Math.min(100, player.stress)}%` }}></div>
        </div>
      </div>

      <Tooltip activeTooltip={activeTooltip} descriptions={descriptions} />
    </div>
  );
};

const AssetsBox: React.FC<{ player: any }> = ({ player }) => {
  const isStudent = player.isStudent;
  const [activeTooltip, setActiveTooltip] = React.useState<string | null>(null);

  const handleClick = (stat: string) => {
    setActiveTooltip(stat);
    setTimeout(() => setActiveTooltip(null), 3000);
  };

  const descriptions: Record<string, string> = {
    ASSETS: "Total Wealth (Cash + Stock Value).\nDetermines ending ranking.",
    CASH: "Liquid Cash.\nUsed for consumption and stock purchases."
  };

  const containerClass = isStudent
    ? "bg-gray-800 border-gray-700 text-gray-500 opacity-70"
    : "bg-gray-900 border-green-600 text-white shadow-lg shadow-green-900/20";

  const valueStyle = isStudent ? "text-gray-500" : "text-gray-200";

  return (
    <div className={`absolute top-[375px] left-0 border-2 rounded p-2 z-30 flex flex-col gap-2 w-28 transition-colors ${containerClass}`}>
      <div className={`text-xs font-bold border-b pb-1 mb-1 text-center ${isStudent ? 'border-gray-700 bg-gray-800' : 'border-green-800 bg-gray-800 text-green-400'}`}>
        ASSETS
      </div>

      <div className="flex flex-col gap-1 cursor-pointer hover:bg-gray-800/50 rounded p-0.5 transition-colors" onClick={() => handleClick('ASSETS')}>
        <div className="flex justify-between items-end">
          <span className={`text-[10px] ${isStudent ? 'text-gray-600' : 'text-gray-400 hover:text-white transition-colors font-bold'}`}>TOTAL</span>
        </div>
        <div className={`text-[10px] text-right ${valueStyle}`}>
          {(player.cash + (player.stockValue || 0)).toLocaleString()} ₩
        </div>
      </div>

      <div className="flex flex-col gap-1 cursor-pointer hover:bg-gray-800/50 rounded p-0.5 transition-colors" onClick={() => handleClick('CASH')}>
        <div className="flex justify-between items-end">
          <span className={`text-[10px] ${isStudent ? 'text-gray-600' : 'text-gray-400 hover:text-white transition-colors font-bold'}`}>CASH</span>
        </div>
        <div className={`text-[10px] text-right ${valueStyle}`}>
          {player.cash.toLocaleString()} ₩
        </div>
      </div>

      <Tooltip activeTooltip={activeTooltip} descriptions={descriptions} />
    </div>
  );
};

const StatRow: React.FC<{ label: string, value: number, color: string, onClick: () => void }> = ({ label, value, color, onClick }) => (
  <div
    onClick={onClick}
    className="flex justify-between items-center text-[10px] border-b border-gray-700 last:border-0 p-0.5 cursor-pointer hover:bg-gray-800 transition-colors select-none"
  >
    <span className={`font-bold ${color}`}>{label}</span>
    <span className="font-bold text-gray-200">{value}</span>
  </div>
);


// --- RIGHT SIDE COMPONENTS ---

const TestCompanyBox: React.FC<{ player: any, time: any }> = ({ player, time }) => {
  const [activeTooltip, setActiveTooltip] = React.useState<string | null>(null);
  const isStudent = player.isStudent;
  const title = isStudent ? "TEST" : "COMPANY";

  // Logic for Exams
  // Exams: Month 5, 7, 10, 12
  const nextExam = [5, 7, 10, 12].find(m => m >= time.month) || 5;
  const examLabel = time.month === nextExam ? "D-Day" : `Exp: M${nextExam}`;

  // Logic for Company (Placeholder)
  const companyValue = "Scheduled Jan";

  const handleClick = () => {
    setActiveTooltip(title);
    setTimeout(() => setActiveTooltip(null), 3000);
  };

  const descriptions: Record<string, string> = {
    TEST: "Exam schedule and expected grade.\nExams in months 5, 7, 10, 12.",
    COMPANY: "Career progress and promotion info.\nPerformance and office politics matter."
  };

  return (
    <div className="absolute top-[80px] right-0 bg-gray-900 text-white border-2 border-gray-600 rounded p-2 shadow-lg z-40 flex flex-col gap-2 w-28">
      <div className="text-xs font-bold border-b border-gray-600 pb-1 mb-1 text-center bg-gray-800 text-gray-300">{title}</div>

      <div className='flex flex-col gap-1 cursor-pointer hover:bg-gray-800 transition-colors' onClick={handleClick}>
        <div className="flex justify-between items-center text-[10px]">
          <span className="text-gray-400 font-bold">{isStudent ? 'Next Exam' : 'Review'}</span>
        </div>
        <div className="text-right text-xs font-bold text-yellow-500">
          {isStudent ? examLabel : companyValue}
        </div>
      </div>

      <div className='flex flex-col gap-1'>
        <div className="flex justify-between items-center text-[10px]">
          <span className="text-gray-400 font-bold">{isStudent ? 'Target' : 'Chance'}</span>
        </div>
        <div className="text-right text-[10px] text-gray-300">
          {isStudent ? 'Top 10%' : 'High'}
        </div>
      </div>

      <RightTooltip activeTooltip={activeTooltip} descriptions={descriptions} />
    </div>
  );
};

const FriendsScoutBox: React.FC<{ player: any }> = ({ player }) => {
  const isStudent = player.isStudent;
  const title = isStudent ? "FRIENDS" : "SCOUT";
  const [activeTooltip, setActiveTooltip] = React.useState<string | null>(null);

  const handleClick = () => {
    setActiveTooltip(title);
    setTimeout(() => setActiveTooltip(null), 3000);
  };

  const descriptions: Record<string, string> = {
    FRIENDS: "Current Relationships (Max 2).\nFriend types provide buffs/debuffs.",
    SCOUT: "Job offers and headhunting.\nExternal offers based on your specs."
  };

  return (
    <div className="absolute top-[215px] right-0 bg-gray-900 text-white border-2 border-gray-600 rounded p-2 shadow-lg z-30 flex flex-col gap-2 w-28">
      <div className="text-xs font-bold border-b border-gray-600 pb-1 mb-1 text-center bg-gray-800 text-gray-300">{title}</div>

      {isStudent ? (
        <div className="flex flex-col gap-2 cursor-pointer" onClick={handleClick}>
          {(player.friends?.length || 0) === 0 ? (
            <div className="text-[10px] text-gray-500 text-center py-2 italic">No Friends...</div>
          ) : (
            player.friends?.map((f: string, i: number) => (
              <div key={i} className="text-[10px] text-white bg-gray-800 p-1 rounded text-center">{f}</div>
            ))
          )}
          <div className="text-[10px] text-gray-400 text-center">{player.friends?.length || 0} / 2 Slots</div>
        </div>
      ) : (
        <div className="flex flex-col gap-2 cursor-pointer" onClick={handleClick}>
          <div className="flex justify-between text-[10px]"><span className="text-gray-400">Offers</span> <span>0</span></div>
          <div className="flex justify-between text-[10px]"><span className="text-gray-400">Market Val</span> <span className="text-green-400">B</span></div>
        </div>
      )}

      <RightTooltip activeTooltip={activeTooltip} descriptions={descriptions} />
    </div>
  );
};

import QuestPopup from '../ui/QuestPopup';

const QuestBox: React.FC<{ player: any }> = ({ player }) => {
  const isStudent = player.isStudent;
  const [isQuestPopupOpen, setIsQuestPopupOpen] = React.useState(false);
  const [activeCategory, setActiveCategory] = React.useState("QUEST");

  // Student: Disabled / Gray
  const containerClass = isStudent
    ? "bg-gray-800 border-gray-700 text-gray-600"
    : "bg-gray-900 border-yellow-600 text-white hover:border-yellow-400 shadow-yellow-900/20";

  const handleQuestClick = (category: string) => {
    // console.log("Open Quest:", category);
    setActiveCategory(category);
    setIsQuestPopupOpen(true);
  };

  return (
    <>
      <div className={`absolute top-[375px] right-0 border-2 rounded p-1 z-30 flex flex-col gap-1 w-28 h-28 ${containerClass}`}>
        <div className={`text-xs font-bold mb-1 text-center ${isStudent ? 'text-gray-600' : 'text-yellow-500'}`}>QUEST</div>

        {/* 2x2 Grid */}
        <div className="grid grid-cols-2 gap-1 h-full">
          {/* M&D (Parents) - Active for everyone including Students */}
          <QuestButton
            label="M&D"
            icon="👨‍👩‍👧"
            active={true}
            onClick={() => handleQuestClick("M&D")}
          />

          {/* Others - Disabled for Students */}
          <QuestButton label="LOTTO" icon="🎫" active={!isStudent} />
          <QuestButton label="LOVE" icon="❤️" active={!isStudent} />
          <QuestButton label="BIZ" icon="💼" active={!isStudent} />
        </div>
      </div>

      <QuestPopup
        isOpen={isQuestPopupOpen}
        onClose={() => setIsQuestPopupOpen(false)}
        category={activeCategory}
      />
    </>
  );
};

const QuestButton: React.FC<{ label: string, icon: string, active: boolean, onClick?: () => void }> = ({ label, icon, active, onClick }) => (
  <div
    onClick={active ? onClick : undefined}
    className={`flex flex-col items-center justify-center bg-gray-800 rounded border border-gray-700 p-1 ${active ? 'hover:bg-gray-700 hover:border-gray-500 cursor-pointer text-white' : 'opacity-40 cursor-not-allowed text-gray-600'}`}
  >
    <div className="text-lg">{icon}</div>
    <div className="text-[8px] font-bold">{label}</div>
  </div>
);

export default GameHUD;

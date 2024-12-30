import React, { useState, useEffect } from 'react';

const formatTime = (totalSeconds) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

const Button = ({ onClick, disabled, variant = "default", children, className = "" }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`
      px-4 py-2 rounded-md font-medium 
      ${variant === "default" ? "bg-blue-500 text-white hover:bg-blue-600" : ""}
      ${variant === "outline" ? "border-2 border-gray-300 hover:bg-gray-100" : ""}
      ${disabled ? "opacity-50 cursor-not-allowed" : ""}
      ${className}
    `}
  >
    {children}
  </button>
);

const TimerDisplay = ({ label, time, isRunning, onStart, onStop, onReset }) => (
  <div className="border rounded-lg p-4">
    <div className="text-lg font-semibold mb-2">{label}</div>
    <div className="text-6xl font-bold text-center mb-4">
      {formatTime(time)}
    </div>
    <div className="flex justify-center gap-4">
      <Button 
        variant={isRunning ? "outline" : "default"}
        onClick={isRunning ? onStop : onStart}
      >
        {isRunning ? 'Stop' : 'Start'}
      </Button>
      <Button variant="outline" onClick={onReset}>
        Reset
      </Button>
    </div>
  </div>
);

const CoinToss = () => {
  const [result, setResult] = useState(null);
  const [isFlipping, setIsFlipping] = useState(false);

  const flipCoin = () => {
    setIsFlipping(true);
    setTimeout(() => {
      setResult(Math.random() < 0.5 ? 'HEADS' : 'TAILS');
      setIsFlipping(false);
    }, 1000);
  };

  return (
    <div className="border rounded-lg p-4">
      <div className="text-lg font-semibold mb-4">Coin Toss</div>
      <div className="flex flex-col items-center gap-4">
        <div className={`text-4xl font-bold h-12 flex items-center ${isFlipping ? 'animate-bounce' : ''}`}>
          {isFlipping ? '?' : result}
        </div>
        <Button 
          onClick={flipCoin} 
          disabled={isFlipping}
          variant="outline"
        >
          {isFlipping ? 'Flipping...' : 'Flip Coin'}
        </Button>
      </div>
    </div>
  );
};

const DownTracker = ({ currentDown, onDownChange, autoProgress, onAutoProgressChange }) => {
  const downs = ['1st', '2nd', '3rd', '4th'];
  
  return (
    <div className="border rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="text-lg font-semibold">Down Tracker</div>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={autoProgress}
              onChange={(e) => onAutoProgressChange(e.target.checked)}
              className="h-4 w-4"
            />
            <span>Auto Progress</span>
          </label>
        </div>
      </div>
      <div className="flex justify-center gap-4">
        {downs.map((down) => (
          <button
            key={down}
            onClick={() => onDownChange(down)}
            className={`
              w-16 h-16 rounded-full flex items-center justify-center
              border-2 transition-colors
              ${currentDown === down 
                ? 'bg-blue-500 text-white border-blue-600' 
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200 border-gray-300'
              }
            `}
          >
            {down}
          </button>
        ))}
      </div>
    </div>
  );
};

const ScoreTracker = ({ team, score, onScore }) => (
  <div className="border rounded-lg p-4">
    <div className="text-lg font-semibold mb-2">{team}</div>
    <div className="text-6xl font-bold text-center mb-4">{score}</div>
    <div className="grid grid-cols-2 gap-2">
      <Button onClick={() => onScore(6, 'TD')}>TD (6)</Button>
      <Button onClick={() => onScore(2, '2PT')}>2XP (2)</Button>
      <Button onClick={() => onScore(1, '1PT')}>1XP (1)</Button>
      <Button onClick={() => onScore(2, 'SAFETY')}>Safety (2)</Button>
    </div>
  </div>
);

const ScoreHistoryDisplay = ({ scores, splitView }) => {
  const homeScores = scores.filter(score => score.team === 'Home');
  const awayScores = scores.filter(score => score.team === 'Away');

  const ScoreTable = ({ scores, title }) => (
    <div className="border rounded-lg">
      {title && (
        <div className="border-b p-2 font-semibold">{title}</div>
      )}
      <table className="w-full">
        <thead className="border-b">
          <tr>
            {!title && <th className="p-2 text-left">Team</th>}
            <th className="p-2 text-left">Time</th>
            <th className="p-2 text-left">Type</th>
            <th className="p-2 text-right">Points</th>
            <th className="p-2 text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          {scores.length === 0 ? (
            <tr>
              <td 
                colSpan={title ? 4 : 5} 
                className="text-center p-4 text-gray-500"
              >
                No scores yet
              </td>
            </tr>
          ) : (
            scores.map((score, index) => (
              <tr key={index} className="border-b">
                {!title && <td className="p-2">{score.team}</td>}
                <td className="p-2">{score.time}</td>
                <td className="p-2">{score.type}</td>
                <td className="p-2 text-right">{score.points}</td>
                <td className="p-2 text-right">{score.runningTotal}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="space-y-4">
      {splitView ? (
        <div className="grid md:grid-cols-2 gap-4">
          <ScoreTable scores={homeScores} title="Home Team" />
          <ScoreTable scores={awayScores} title="Away Team" />
        </div>
      ) : (
        <ScoreTable scores={scores} />
      )}
    </div>
  );
};

const FlagFootballApp = () => {
  const [gameTime, setGameTime] = useState(20 * 60);
  const [playTime, setPlayTime] = useState(25);
  const [gameRunning, setGameRunning] = useState(false);
  const [playRunning, setPlayRunning] = useState(false);
  const [currentDown, setCurrentDown] = useState('1st');
  const [autoProgress, setAutoProgress] = useState(false);
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  const [scoreHistory, setScoreHistory] = useState([]);
  const [splitScoreView, setSplitScoreView] = useState(false);

  useEffect(() => {
    let gameInterval;
    let playInterval;

    if (gameRunning && gameTime > 0) {
      gameInterval = setInterval(() => {
        setGameTime(prev => Math.max(0, prev - 1));
      }, 1000);
    }

    if (playRunning && playTime > 0) {
      playInterval = setInterval(() => {
        setPlayTime(prev => Math.max(0, prev - 1));
      }, 1000);
    }

    return () => {
      clearInterval(gameInterval);
      clearInterval(playInterval);
    };
  }, [gameRunning, playRunning, gameTime, playTime]);

  useEffect(() => {
    if (gameTime === 0) setGameRunning(false);
    if (playTime === 0) setPlayRunning(false);
  }, [gameTime, playTime]);

  const handleScore = (team, points, type) => {
    const newScore = {
      team,
      points,
      type,
      time: formatTime(gameTime),
      runningTotal: team === 'Home' 
        ? homeScore + points 
        : awayScore + points
    };
    
    setScoreHistory(prev => [...prev, newScore]);
    if (team === 'Home') {
      setHomeScore(prev => prev + points);
    } else {
      setAwayScore(prev => prev + points);
    }
  };

  const undoLastScore = () => {
    if (scoreHistory.length > 0) {
      const lastScore = scoreHistory[scoreHistory.length - 1];
      if (lastScore.team === 'Home') {
        setHomeScore(prev => prev - lastScore.points);
      } else {
        setAwayScore(prev => prev - lastScore.points);
      }
      setScoreHistory(prev => prev.slice(0, -1));
    }
  };

  const startPlay = () => {
    setPlayRunning(true);
    if (autoProgress) {
      const downs = ['1st', '2nd', '3rd', '4th'];
      const currentIndex = downs.indexOf(currentDown);
      if (currentIndex < downs.length - 1) {
        setCurrentDown(downs[currentIndex + 1]);
      }
    }
  };

  const resetGame = () => {
    setGameTime(20 * 60);
    setGameRunning(false);
  };

  const resetPlay = () => {
    setPlayTime(25);
    setPlayRunning(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8">
      <CoinToss />
      
      <div className="grid md:grid-cols-2 gap-8">
        <TimerDisplay
          label="Game Clock"
          time={gameTime}
          isRunning={gameRunning}
          onStart={() => setGameRunning(true)}
          onStop={() => setGameRunning(false)}
          onReset={resetGame}
        />
        <TimerDisplay
          label="Play Clock"
          time={playTime}
          isRunning={playRunning}
          onStart={startPlay}
          onStop={() => setPlayRunning(false)}
          onReset={resetPlay}
        />
      </div>

      <DownTracker 
        currentDown={currentDown}
        onDownChange={setCurrentDown}
        autoProgress={autoProgress}
        onAutoProgressChange={setAutoProgress}
      />

      <div className="grid md:grid-cols-2 gap-8">
        <ScoreTracker 
          team="Home"
          score={homeScore}
          onScore={(points, type) => handleScore('Home', points, type)}
        />
        <ScoreTracker 
          team="Away"
          score={awayScore}
          onScore={(points, type) => handleScore('Away', points, type)}
        />
      </div>

      <div className="flex justify-center">
        <Button 
          variant="outline" 
          onClick={undoLastScore}
          disabled={scoreHistory.length === 0}
          className="flex items-center gap-2"
        >
          ↺ Undo Last Score
        </Button>
      </div>

      <div className="border rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="text-lg font-semibold">Scoring History</div>
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={splitScoreView}
                onChange={(e) => setSplitScoreView(e.target.checked)}
                className="h-4 w-4"
              />
              <span>Split View</span>
            </label>
          </div>
        </div>
        <ScoreHistoryDisplay 
          scores={scoreHistory} 
          splitView={splitScoreView}
        />
      </div>
    </div>
  );
};

export default FlagFootballApp;

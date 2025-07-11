'use client';

import { useState, useRef, FormEvent, useEffect } from 'react';
import { saveLeaderboardEntry } from '@/lib/sanity';
import Link from 'next/link';

interface GuessResult {
  guess: string;
  bulls: number;
  cows: number;
}

interface LeaderboardModal {
  isOpen: boolean;
  playerName: string;
}

export default function Game() {
  const [targetNumber, setTargetNumber] = useState<string>('');
  const [guesses, setGuesses] = useState<GuessResult[]>([]);
  const [gameWon, setGameWon] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [modal, setModal] = useState<LeaderboardModal>({
    isOpen: false,
    playerName: ''
  });
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  // Generate a random 4-digit number with distinct digits
  const generateTargetNumber = () => {
    const digits = Array.from({ length: 10 }, (_, i) => i.toString());
    let result = '';
    for (let i = 0; i < 4; i++) {
      const randomIndex = Math.floor(Math.random() * digits.length);
      result += digits[randomIndex];
      digits.splice(randomIndex, 1);
    }
    console.log(result);
    return result;
  };

  // Initialize the game
  useEffect(() => {
    setTargetNumber(generateTargetNumber());
  }, []);

  // Calculate bulls and cows for a guess
  const calculateBullsAndCows = (guess: string): { bulls: number; cows: number } => {
    let bulls = 0;
    let cows = 0;

    for (let i = 0; i < 4; i++) {
      if (guess[i] === targetNumber[i]) {
        bulls++;
      } else if (targetNumber.includes(guess[i])) {
        cows++;
      }
    }

    return { bulls, cows };
  };

  const checkValidity = () => {
    const values = inputRefs.map(ref => ref.current?.value || '');
    const isComplete = values.every(val => val.length === 1);
    const isUnique = new Set(values.filter(val => val !== '')).size === values.filter(val => val !== '').length;
    setIsValid(isComplete && isUnique);
  };

  const handleInput = (index: number, value: string) => {
    if (/^[0-9]$/.test(value)) {
      if (index < 3 && inputRefs[index + 1].current) {
        inputRefs[index + 1].current?.focus();
      }
    } else {
      // Clear the input if non-numeric
      if (inputRefs[index].current) {
        inputRefs[index].current.value = '';
      }
    }
    // Check validity after any input change
    setTimeout(checkValidity, 0);
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      // If current input is empty and we're not at the first input, move back
      if (!e.currentTarget.value && index > 0) {
        if (inputRefs[index - 1].current) {
          inputRefs[index - 1].current?.focus();
        }
      }
      // Clear current input and check validity
      if (e.currentTarget.value) {
        e.currentTarget.value = '';
        setTimeout(checkValidity, 0);
      }
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const guess = inputRefs.map(ref => ref.current?.value || '').join('');
    
    if (guess.length === 4 && new Set(guess).size === 4) {
      const result = calculateBullsAndCows(guess);
      const newGuess: GuessResult = {
        guess,
        ...result
      };
      
      setGuesses(prev => [newGuess, ...prev]);
      
      if (result.bulls === 4) {
        setGameWon(true);
        setModal({ isOpen: true, playerName: '' });
      }

      // Clear inputs
      inputRefs.forEach(ref => {
        if (ref.current) ref.current.value = '';
      });
      inputRefs[0].current?.focus();
      setIsValid(false);
    }
  };

  const handleLeaderboardSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (modal.playerName.trim()) {
      try {
        const response = await fetch('/api/leaderboard', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            playerName: modal.playerName.trim(),
            turns: guesses.length,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to save score');
        }

        // Reset game
        setModal({ isOpen: false, playerName: '' });
        setGameWon(false);
        setGuesses([]);
        setTargetNumber(generateTargetNumber());
      } catch (error) {
        console.error('Error saving to leaderboard:', error);
        alert('Failed to save score. Please try again.');
      }
    }
  };

  return (
    <main className="min-h-screen pt-24 px-4 md:px-12 bg-black">
      <div className="max-w-xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">
            {gameWon ? 'Congratulations! 🎉' : 'Guess the Number'}
          </h1>
          <Link
            href="/leaderboard"
            className="px-4 py-2 text-sm font-semibold rounded-md border border-white/10 bg-black text-white hover:bg-white/5 transition-all duration-200"
          >
            View Leaderboard
          </Link>
        </div>
        
        <div className="bg-white/5 p-6 rounded-md shadow-lg border border-white/10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center space-x-4">
              {[0, 1, 2, 3].map((index) => (
                <input
                  key={index}
                  ref={inputRefs[index]}
                  type="text"
                  maxLength={1}
                  className="w-16 h-16 text-center text-2xl font-bold bg-black rounded-md text-white focus:outline-none border border-white/10 focus:border-white/30"
                  required
                  pattern="[0-9]"
                  inputMode="numeric"
                  onChange={(e) => handleInput(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  disabled={gameWon}
                />
              ))}
            </div>
            
            <button
              type="submit"
              className="w-full h-14 text-lg font-semibold rounded-md border transition-all duration-200
                disabled:bg-black disabled:text-white/50 disabled:border-white/10 disabled:cursor-not-allowed disabled:hover:bg-black
                bg-white text-black hover:bg-white/90 border-white"
              disabled={!isValid || gameWon}
            >
              SUBMIT GUESS
            </button>
          </form>

          <div className="mt-8 space-y-4">
            <h2 className="text-xl font-semibold text-white mb-4">Previous Guesses</h2>
            <div className="space-y-2">
              {guesses.length > 0 ? (
                guesses.map((guessResult, index) => (
                  <div key={index} className="flex justify-between items-center bg-black p-3 rounded-md border border-white/10">
                    <span className="font-mono text-white">{guessResult.guess}</span>
                    <span className="text-white/60">
                      {guessResult.bulls} Bulls, {guessResult.cows} Cows
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-white/60 text-center">No guesses yet</p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 text-center text-white/60">
          <p>Enter 4 unique digits (0-9) and submit your guess</p>
          <p className="mt-2">Try to solve it in as few attempts as possible!</p>
        </div>

        {/* Leaderboard Modal */}
        {modal.isOpen && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="bg-white/5 p-6 rounded-md border border-white/10 max-w-md w-full mx-4">
              <h2 className="text-2xl font-bold text-white mb-4">
                Congratulations! 🎉
              </h2>
              <p className="text-white mb-6">
                You solved it in {guesses.length} turns! Would you like to add your score to the leaderboard?
              </p>
              <form onSubmit={handleLeaderboardSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Enter your name"
                  className="w-full h-12 px-4 bg-black border border-white/10 rounded-md text-white focus:outline-none focus:border-white/30"
                  value={modal.playerName}
                  onChange={(e) => setModal(prev => ({ ...prev, playerName: e.target.value }))}
                />
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="flex-1 h-12 font-semibold rounded-md border transition-all duration-200
                      bg-white text-black hover:bg-white/90 border-white"
                  >
                    Submit Score
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setModal({ isOpen: false, playerName: '' });
                      setGameWon(false);
                      setGuesses([]);
                      setTargetNumber(generateTargetNumber());
                    }}
                    className="flex-1 h-12 font-semibold bg-black text-white rounded-md border border-white/10 hover:bg-white/5 transition-all duration-200"
                  >
                    Skip
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
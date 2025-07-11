'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface LeaderboardEntry {
  playerName: string;
  turns: number;
  timestamp: string;
}

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch('/api/leaderboard');
        if (!response.ok) {
          throw new Error('Failed to fetch leaderboard');
        }
        const data = await response.json();
        setEntries(data);
      } catch (err) {
        setError('Failed to load leaderboard data');
        console.error('Error fetching leaderboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <main className="min-h-screen pt-24 px-4 md:px-12 bg-black">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Leaderboard</h1>
          <Link
            href="/"
            className="px-4 py-2 text-sm font-semibold rounded-md border border-white/10 bg-black text-white hover:bg-white/5 transition-all duration-200"
          >
            Back to Game
          </Link>
        </div>

        <div className="bg-white/5 p-6 rounded-md shadow-lg border border-white/10">
          {loading ? (
            <div className="text-center py-8">
              <div className="text-white">Loading...</div>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <div className="text-red-500">{error}</div>
            </div>
          ) : entries.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-white/60">No entries yet. Be the first to make it to the leaderboard!</div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="px-4 py-3 text-left text-white/60 font-semibold">Rank</th>
                    <th className="px-4 py-3 text-left text-white/60 font-semibold">Player</th>
                    <th className="px-4 py-3 text-left text-white/60 font-semibold">Turns</th>
                    <th className="px-4 py-3 text-left text-white/60 font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((entry, index) => (
                    <tr
                      key={index}
                      className="border-b border-white/10 last:border-b-0 hover:bg-white/5 transition-colors duration-200"
                    >
                      <td className="px-4 py-3 text-white">#{index + 1}</td>
                      <td className="px-4 py-3 text-white font-medium">{entry.playerName}</td>
                      <td className="px-4 py-3 text-white">{entry.turns} turns</td>
                      <td className="px-4 py-3 text-white/60">
                        {new Date(entry.timestamp).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="mt-6 text-center text-white/60">
          <p>Can you make it to the top of the leaderboard?</p>
          <p className="mt-2">Players are ranked by the number of turns taken to solve the puzzle.</p>
        </div>
      </div>
    </main>
  );
} 
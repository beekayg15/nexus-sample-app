import { NextResponse } from 'next/server';
import { saveLeaderboardEntry, getLeaderboard } from '@/lib/sanity';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { playerName, turns } = body;

    // Validate input
    if (!playerName || typeof playerName !== 'string') {
      return NextResponse.json(
        { error: 'Player name is required and must be a string' },
        { status: 400 }
      );
    }

    if (!turns || typeof turns !== 'number' || turns < 1) {
      return NextResponse.json(
        { error: 'Number of turns must be a positive number' },
        { status: 400 }
      );
    }

    // Save to Sanity
    const entry = await saveLeaderboardEntry(playerName, turns);

    return NextResponse.json(entry, { status: 201 });
  } catch (error) {
    console.error('Error saving leaderboard entry:', error);
    return NextResponse.json(
      { error: 'Failed to save leaderboard entry' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const entries = await getLeaderboard();
    return NextResponse.json(entries);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    );
  }
} 
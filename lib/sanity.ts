import { createClient } from 'next-sanity'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-03-13',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
})

export async function saveLeaderboardEntry(playerName: string, turns: number) {
  try {
    const entry = await client.create({
      _type: 'leaderboardEntry',
      playerName,
      turns,
      timestamp: new Date().toISOString(),
    })
    return entry
  } catch (error) {
    console.error('Error saving leaderboard entry:', error)
    throw error
  }
}

export async function getLeaderboard() {
  try {
    const entries = await client.fetch(`*[_type == "leaderboardEntry"] | order(turns asc) {
      playerName,
      turns,
      timestamp
    }`)
    return entries
  } catch (error) {
    console.error('Error fetching leaderboard:', error)
    throw error
  }
} 
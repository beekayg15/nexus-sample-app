export default {
  name: 'leaderboardEntry',
  title: 'Leaderboard Entry',
  type: 'document',
  fields: [
    {
      name: 'playerName',
      title: 'Player Name',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'turns',
      title: 'Number of Turns',
      type: 'number',
      validation: (Rule: any) => Rule.required().min(1),
    },
    {
      name: 'timestamp',
      title: 'Timestamp',
      type: 'datetime',
      validation: (Rule: any) => Rule.required(),
    },
  ],
  orderings: [
    {
      title: 'Turns, Asc',
      name: 'turnsAsc',
      by: [
        {field: 'turns', direction: 'asc'},
        {field: 'timestamp', direction: 'desc'}
      ]
    }
  ]
} 
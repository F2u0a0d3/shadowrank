'use client'

import { HunterRank, RANK_COLORS } from '@/types/database'

interface RankBadgeProps {
  rank: HunterRank
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
}

export default function RankBadge({ rank, size = 'md', showLabel = true }: RankBadgeProps) {
  const rankColor = RANK_COLORS[rank]

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5',
  }

  return (
    <span
      className={`rank-badge ${sizeClasses[size]} font-bold`}
      style={{
        background: `linear-gradient(135deg, ${rankColor}, ${rankColor}dd)`,
        color: rank === 'S' ? '#1a1a2e' : 'white',
        textShadow: rank === 'S' ? `0 0 10px rgba(255, 215, 0, 0.5)` : 'none',
      }}
    >
      {rank}{showLabel ? '-Rank' : ''}
    </span>
  )
}

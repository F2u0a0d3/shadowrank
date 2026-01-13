'use client'

import { Profile } from '@/types/database'
import RankBadge from './RankBadge'

interface LeaderboardRowProps {
  profile: Profile
  position: number
  isCurrentUser?: boolean
}

export default function LeaderboardRow({ profile, position, isCurrentUser }: LeaderboardRowProps) {
  const getMedalEmoji = (pos: number) => {
    if (pos === 1) return '🥇'
    if (pos === 2) return '🥈'
    if (pos === 3) return '🥉'
    return null
  }

  const medal = getMedalEmoji(position)

  return (
    <div
      className={`flex items-center gap-4 p-4 rounded-xl transition-all
        ${isCurrentUser
          ? 'bg-[#e94560]/10 border border-[#e94560]/50'
          : 'bg-[#16213e] border border-[#374151] hover:border-[#e94560]/30'
        }
        ${position <= 3 ? 'shadow-lg' : ''}`}
    >
      {/* Position */}
      <div className="w-12 text-center">
        {medal ? (
          <span className="text-2xl">{medal}</span>
        ) : (
          <span className="text-xl font-bold text-[#6b7280]">#{position}</span>
        )}
      </div>

      {/* Avatar placeholder */}
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold"
        style={{
          background: `linear-gradient(135deg, #e94560, #7b2cbf)`,
          color: 'white',
        }}
      >
        {(profile.display_name || profile.username || 'H').charAt(0).toUpperCase()}
      </div>

      {/* User info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className={`font-semibold truncate ${isCurrentUser ? 'text-[#e94560]' : 'text-[#eaeaea]'}`}>
            {profile.display_name || profile.username}
          </h3>
          {isCurrentUser && (
            <span className="text-xs bg-[#e94560] text-white px-2 py-0.5 rounded">YOU</span>
          )}
        </div>
        <div className="flex items-center gap-3 mt-1">
          <RankBadge rank={profile.hunter_rank} size="sm" />
          <span className="text-[#9ca3af] text-sm">Level {profile.level}</span>
        </div>
      </div>

      {/* XP */}
      <div className="text-right">
        <p className="text-xl font-bold text-[#e94560]">{profile.xp.toLocaleString()}</p>
        <p className="text-xs text-[#6b7280]">XP</p>
      </div>

      {/* Streak */}
      <div className="text-right w-20">
        <p className="text-lg font-bold text-[#ffd700]">
          <span className="streak-fire">🔥</span> {profile.streak_count}
        </p>
        <p className="text-xs text-[#6b7280]">streak</p>
      </div>
    </div>
  )
}

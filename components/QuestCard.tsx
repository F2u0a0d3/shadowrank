'use client'

import { Quest, CATEGORY_ICONS, RANK_COLORS, QuestDifficulty } from '@/types/database'

interface QuestCardProps {
  quest: Quest
  onComplete: (questId: string) => void
  onDelete: (questId: string) => void
  isCompleted?: boolean
  loading?: boolean
}

export default function QuestCard({ quest, onComplete, onDelete, isCompleted, loading }: QuestCardProps) {
  const difficultyColor = RANK_COLORS[quest.difficulty as QuestDifficulty]

  return (
    <div className={`quest-card rounded-xl p-5 ${isCompleted ? 'opacity-60' : ''}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          {/* Category & Difficulty */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">{CATEGORY_ICONS[quest.category]}</span>
            <span
              className="text-xs font-bold px-2 py-0.5 rounded"
              style={{ backgroundColor: `${difficultyColor}30`, color: difficultyColor }}
            >
              {quest.difficulty}-Rank
            </span>
            {quest.is_daily && (
              <span className="text-xs text-[#9ca3af] bg-[#1a1a2e] px-2 py-0.5 rounded">
                Daily
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className={`font-semibold text-lg ${isCompleted ? 'line-through text-[#6b7280]' : 'text-[#eaeaea]'}`}>
            {quest.title}
          </h3>

          {/* Description */}
          {quest.description && (
            <p className="text-[#9ca3af] text-sm mt-1">{quest.description}</p>
          )}

          {/* XP Reward */}
          <div className="mt-3 flex items-center gap-1">
            <span className="text-[#e94560] font-bold">+{quest.xp_reward} XP</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          {!isCompleted && (
            <button
              onClick={() => onComplete(quest.id)}
              disabled={loading}
              className="px-4 py-2 bg-[#e94560] text-white text-sm font-medium rounded-lg
                       hover:bg-[#ff6b6b] transition-all duration-200
                       disabled:opacity-50 disabled:cursor-not-allowed
                       shadow-lg shadow-[#e94560]/20"
            >
              {loading ? '...' : 'Complete'}
            </button>
          )}
          {isCompleted && (
            <span className="px-4 py-2 bg-green-500/20 text-green-400 text-sm font-medium rounded-lg text-center">
              Done!
            </span>
          )}
          <button
            onClick={() => onDelete(quest.id)}
            className="px-4 py-2 text-[#6b7280] text-sm hover:text-red-400 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

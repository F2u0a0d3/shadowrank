'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useProfile } from '@/hooks/useProfile'
import { useQuests } from '@/hooks/useQuests'
import { xpProgress, RANK_COLORS, HunterRank } from '@/types/database'
import QuestCard from '@/components/QuestCard'
import AddQuestModal from '@/components/AddQuestModal'
import LevelUpModal from '@/components/LevelUpModal'

export default function DashboardPage() {
  const { profile, loading: profileLoading, error: profileError, refreshProfile } = useProfile()
  const { quests, completedToday, loading: questsLoading, addQuest, deleteQuest, markCompleted } = useQuests()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [completingQuest, setCompletingQuest] = useState<string | null>(null)
  const [levelUpData, setLevelUpData] = useState<{
    show: boolean
    newLevel: number
    newRank: HunterRank
    oldRank?: HunterRank
  }>({ show: false, newLevel: 1, newRank: 'E' })

  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const handleCompleteQuest = async (questId: string) => {
    setCompletingQuest(questId)
    const oldLevel = profile?.level || 1
    const oldRank = profile?.hunter_rank || 'E'

    try {
      const response = await fetch('/api/complete-quest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quest_id: questId }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to complete quest')
      }

      const data = await response.json()

      markCompleted(questId)
      refreshProfile()

      // Show level up modal if leveled up
      if (data.leveled_up) {
        setLevelUpData({
          show: true,
          newLevel: data.new_level,
          newRank: data.new_rank,
          oldRank: oldRank !== data.new_rank ? oldRank : undefined,
        })
      }
    } catch (error) {
      console.error('Error completing quest:', error)
      alert(error instanceof Error ? error.message : 'Failed to complete quest')
    } finally {
      setCompletingQuest(null)
    }
  }

  const handleDeleteQuest = async (questId: string) => {
    if (!confirm('Are you sure you want to delete this quest?')) return

    try {
      await deleteQuest(questId)
    } catch (error) {
      console.error('Error deleting quest:', error)
      alert(error instanceof Error ? error.message : 'Failed to delete quest')
    }
  }

  const loading = profileLoading || questsLoading

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-[#e94560] border-t-transparent rounded-full"></div>
      </div>
    )
  }

  if (profileError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{profileError}</p>
          <button
            onClick={handleSignOut}
            className="px-4 py-2 bg-[#e94560] text-white rounded-lg hover:bg-[#ff6b6b]"
          >
            Sign Out & Try Again
          </button>
        </div>
      </div>
    )
  }

  const progress = profile ? xpProgress(profile.xp) : { current: 0, needed: 100, percentage: 0 }
  const rankColor = profile ? RANK_COLORS[profile.hunter_rank] : RANK_COLORS.E

  const activeQuests = quests.filter(q => !completedToday.has(q.id))
  const completedQuests = quests.filter(q => completedToday.has(q.id))

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="border-b border-[#374151] bg-[#16213e]/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="text-2xl font-bold">
              <span className="text-[#e94560]">Shadow</span>
              <span className="text-[#eaeaea]">Rank</span>
            </Link>

            <div className="flex items-center gap-6">
              <Link href="/dashboard" className="text-[#e94560] font-medium">
                Dashboard
              </Link>
              <Link href="/leaderboard" className="text-[#9ca3af] hover:text-[#eaeaea] transition-colors">
                Leaderboard
              </Link>
              <button
                onClick={handleSignOut}
                className="text-[#9ca3af] hover:text-[#e94560] transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#eaeaea]">
            Welcome, <span className="text-[#e94560]">{profile?.display_name || profile?.username || 'Hunter'}</span>
          </h1>
          <p className="text-[#9ca3af] mt-2">Your quest board awaits. Complete quests to gain XP and rank up!</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#16213e] border border-[#374151] rounded-xl p-6">
            <p className="text-[#9ca3af] text-sm">Hunter Rank</p>
            <p className="text-2xl font-bold mt-1">
              <span
                className="rank-badge"
                style={{
                  background: `linear-gradient(135deg, ${rankColor}, ${rankColor}dd)`,
                  color: profile?.hunter_rank === 'S' ? '#1a1a2e' : 'white'
                }}
              >
                {profile?.hunter_rank || 'E'}-Rank
              </span>
            </p>
          </div>
          <div className="bg-[#16213e] border border-[#374151] rounded-xl p-6">
            <p className="text-[#9ca3af] text-sm">Level</p>
            <p className="text-2xl font-bold text-[#eaeaea] mt-1">{profile?.level || 1}</p>
          </div>
          <div className="bg-[#16213e] border border-[#374151] rounded-xl p-6">
            <p className="text-[#9ca3af] text-sm">Total XP</p>
            <p className="text-2xl font-bold text-[#e94560] mt-1">{profile?.xp || 0}</p>
          </div>
          <div className="bg-[#16213e] border border-[#374151] rounded-xl p-6">
            <p className="text-[#9ca3af] text-sm">Streak</p>
            <p className="text-2xl font-bold text-[#ffd700] mt-1">
              <span className="streak-fire">🔥</span> {profile?.streak_count || 0} days
            </p>
          </div>
        </div>

        {/* XP Progress Bar */}
        <div className="bg-[#16213e] border border-[#374151] rounded-xl p-6 mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[#9ca3af]">Progress to Level {(profile?.level || 1) + 1}</span>
            <span className="text-[#e94560] font-medium">
              {Math.floor(progress.current)} / {progress.needed} XP
            </span>
          </div>
          <div className="h-3 bg-[#1a1a2e] rounded-full overflow-hidden">
            <div
              className="xp-bar h-full rounded-full"
              style={{ width: `${progress.percentage}%` }}
            ></div>
          </div>
        </div>

        {/* Quest Board */}
        <div className="bg-[#16213e] border border-[#374151] rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[#eaeaea]">
              Quest Board
              {activeQuests.length > 0 && (
                <span className="ml-2 text-sm font-normal text-[#9ca3af]">
                  ({activeQuests.length} active)
                </span>
              )}
            </h2>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-[#e94560] text-white rounded-lg hover:bg-[#ff6b6b] transition-colors"
            >
              + New Quest
            </button>
          </div>

          {quests.length === 0 ? (
            <div className="text-center py-12 text-[#6b7280]">
              <p className="text-lg">No quests yet</p>
              <p className="text-sm mt-2">Create your first quest to start earning XP!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Active Quests */}
              {activeQuests.length > 0 && (
                <div className="space-y-3">
                  {activeQuests.map((quest) => (
                    <QuestCard
                      key={quest.id}
                      quest={quest}
                      onComplete={handleCompleteQuest}
                      onDelete={handleDeleteQuest}
                      loading={completingQuest === quest.id}
                    />
                  ))}
                </div>
              )}

              {/* Completed Quests */}
              {completedQuests.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-[#9ca3af] mb-3">
                    Completed Today ({completedQuests.length})
                  </h3>
                  <div className="space-y-3">
                    {completedQuests.map((quest) => (
                      <QuestCard
                        key={quest.id}
                        quest={quest}
                        onComplete={handleCompleteQuest}
                        onDelete={handleDeleteQuest}
                        isCompleted
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#16213e] border border-[#374151] rounded-xl p-6">
            <h3 className="text-lg font-bold text-[#eaeaea] mb-4">Quests Completed</h3>
            <p className="text-4xl font-bold text-[#e94560]">{profile?.total_quests_completed || 0}</p>
            <p className="text-[#6b7280] text-sm mt-2">Total quests finished</p>
          </div>
          <div className="bg-[#16213e] border border-[#374151] rounded-xl p-6">
            <h3 className="text-lg font-bold text-[#eaeaea] mb-4">Today&apos;s Progress</h3>
            <p className="text-4xl font-bold text-green-400">{completedQuests.length} / {quests.length}</p>
            <p className="text-[#6b7280] text-sm mt-2">Quests completed today</p>
          </div>
        </div>
      </main>

      {/* Add Quest Modal */}
      <AddQuestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={addQuest}
      />

      {/* Level Up Modal */}
      <LevelUpModal
        isOpen={levelUpData.show}
        onClose={() => setLevelUpData(prev => ({ ...prev, show: false }))}
        newLevel={levelUpData.newLevel}
        newRank={levelUpData.newRank}
        oldRank={levelUpData.oldRank}
      />
    </div>
  )
}

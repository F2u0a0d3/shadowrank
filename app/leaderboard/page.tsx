'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import LeaderboardRow from '@/components/LeaderboardRow'
import type { Profile } from '@/types/database'

export default function LeaderboardPage() {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true)
        setError(null)

        // Get current user
        const { data: { user } } = await supabase.auth.getUser()
        setCurrentUserId(user?.id || null)

        // Fetch top 50 users by XP
        const { data, error: fetchError } = await supabase
          .from('profiles')
          .select('*')
          .order('xp', { ascending: false })
          .limit(50)

        if (fetchError) throw fetchError

        setProfiles(data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch leaderboard')
      } finally {
        setLoading(false)
      }
    }

    fetchLeaderboard()
  }, [supabase])

  // Find current user's position
  const currentUserPosition = currentUserId
    ? profiles.findIndex(p => p.id === currentUserId) + 1
    : null

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
              <Link href="/dashboard" className="text-[#9ca3af] hover:text-[#eaeaea] transition-colors">
                Dashboard
              </Link>
              <Link href="/leaderboard" className="text-[#e94560] font-medium">
                Leaderboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#eaeaea] mb-2">
            Hunter <span className="text-[#e94560]">Leaderboard</span>
          </h1>
          <p className="text-[#9ca3af]">Top hunters ranked by total XP</p>

          {/* Current user position */}
          {currentUserPosition && currentUserPosition > 0 && (
            <div className="mt-4 inline-block bg-[#16213e] border border-[#374151] rounded-lg px-6 py-3">
              <p className="text-[#9ca3af] text-sm">Your Position</p>
              <p className="text-2xl font-bold text-[#e94560]">#{currentUserPosition}</p>
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin h-8 w-8 border-2 border-[#e94560] border-t-transparent rounded-full"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && profiles.length === 0 && (
          <div className="text-center py-12 text-[#6b7280]">
            <p className="text-lg">No hunters yet</p>
            <p className="text-sm mt-2">Be the first to join!</p>
          </div>
        )}

        {/* Leaderboard */}
        {!loading && !error && profiles.length > 0 && (
          <div className="space-y-3">
            {profiles.map((profile, index) => (
              <LeaderboardRow
                key={profile.id}
                profile={profile}
                position={index + 1}
                isCurrentUser={profile.id === currentUserId}
              />
            ))}
          </div>
        )}

        {/* Footer note */}
        <div className="mt-8 text-center text-[#6b7280] text-sm">
          <p>Leaderboard updates in real-time as hunters complete quests</p>
        </div>
      </main>
    </div>
  )
}

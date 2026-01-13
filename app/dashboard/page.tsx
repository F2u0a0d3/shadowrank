'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { User } from '@supabase/supabase-js'

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }
    getUser()
  }, [supabase.auth])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-[#e94560] border-t-transparent rounded-full"></div>
      </div>
    )
  }

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
            Welcome, <span className="text-[#e94560]">{user?.user_metadata?.username || 'Hunter'}</span>
          </h1>
          <p className="text-[#9ca3af] mt-2">Your quest board awaits. Complete quests to gain XP and rank up!</p>
        </div>

        {/* Stats Cards - Placeholder */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#16213e] border border-[#374151] rounded-xl p-6">
            <p className="text-[#9ca3af] text-sm">Hunter Rank</p>
            <p className="text-2xl font-bold mt-1">
              <span className="rank-badge rank-e">E</span>
            </p>
          </div>
          <div className="bg-[#16213e] border border-[#374151] rounded-xl p-6">
            <p className="text-[#9ca3af] text-sm">Level</p>
            <p className="text-2xl font-bold text-[#eaeaea] mt-1">1</p>
          </div>
          <div className="bg-[#16213e] border border-[#374151] rounded-xl p-6">
            <p className="text-[#9ca3af] text-sm">Total XP</p>
            <p className="text-2xl font-bold text-[#e94560] mt-1">0</p>
          </div>
          <div className="bg-[#16213e] border border-[#374151] rounded-xl p-6">
            <p className="text-[#9ca3af] text-sm">Streak</p>
            <p className="text-2xl font-bold text-[#ffd700] mt-1">0 days</p>
          </div>
        </div>

        {/* XP Progress Bar - Placeholder */}
        <div className="bg-[#16213e] border border-[#374151] rounded-xl p-6 mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[#9ca3af]">Progress to Level 2</span>
            <span className="text-[#e94560] font-medium">0 / 100 XP</span>
          </div>
          <div className="h-3 bg-[#1a1a2e] rounded-full overflow-hidden">
            <div className="xp-bar h-full rounded-full" style={{ width: '0%' }}></div>
          </div>
        </div>

        {/* Quest Board - Placeholder */}
        <div className="bg-[#16213e] border border-[#374151] rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[#eaeaea]">Quest Board</h2>
            <button className="px-4 py-2 bg-[#e94560] text-white rounded-lg hover:bg-[#ff6b6b] transition-colors">
              + New Quest
            </button>
          </div>

          <div className="text-center py-12 text-[#6b7280]">
            <p className="text-lg">No quests yet</p>
            <p className="text-sm mt-2">Create your first quest to start earning XP!</p>
          </div>
        </div>
      </main>
    </div>
  )
}

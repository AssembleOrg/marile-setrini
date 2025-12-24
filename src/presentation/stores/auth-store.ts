import { create } from 'zustand'
import { supabase } from '@/src/infrastructure/auth/supabase'
import type { User, Session } from '@supabase/supabase-js'

interface AuthState {
  user: User | null
  session: Session | null
  isAdmin: boolean
  isLoading: boolean
  
  // Actions
  setUser: (user: User | null) => void
  setSession: (session: Session | null) => void
  setIsAdmin: (isAdmin: boolean) => void
  setIsLoading: (loading: boolean) => void
  signOut: () => Promise<void>
  checkSession: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  isAdmin: false,
  isLoading: true,

  setUser: (user) => set({ user }),
  setSession: (session) => set({ session }),
  setIsAdmin: (isAdmin) => set({ isAdmin }),
  setIsLoading: (loading) => set({ isLoading: loading }),

  signOut: async () => {
    await supabase.auth.signOut()
    set({ user: null, session: null, isAdmin: false })
  },

  checkSession: async () => {
    try {
      set({ isLoading: true })
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session?.user) {
        set({ user: session.user, session })
        
        // Check if user is admin
        const { data: adminData } = await supabase
          .from('AdminUser')
          .select('id')
          .eq('userId', session.user.id)
          .maybeSingle()
        
        set({ isAdmin: !!adminData })
      } else {
        set({ user: null, session: null, isAdmin: false })
      }
    } catch (error) {
      console.error('Error checking session:', error)
      set({ user: null, session: null, isAdmin: false })
    } finally {
      set({ isLoading: false })
    }
  },
}))

// Listen for auth changes
if (typeof window !== 'undefined') {
  supabase.auth.onAuthStateChange(async (event, session) => {
    const store = useAuthStore.getState()
    
    if (event === 'SIGNED_OUT') {
        store.setUser(null)
        store.setSession(null)
        store.setIsAdmin(false)
        store.setIsLoading(false)
        return
    }

    if (session?.user) {
      store.setUser(session.user)
      store.setSession(session)
      
      // Check admin status
      const { data } = await supabase
        .from('AdminUser')
        .select('id')
        .eq('userId', session.user.id)
        .maybeSingle()
      
      store.setIsAdmin(!!data)
    } else {
      store.setUser(null)
      store.setSession(null)
      store.setIsAdmin(false)
    }
    
    store.setIsLoading(false)
  })
}

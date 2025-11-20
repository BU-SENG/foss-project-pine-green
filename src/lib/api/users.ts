import { supabase } from '@/lib/supabase'

export interface UserProfile {
  id: string
  email: string
  name: string
  first_name?: string
  last_name?: string
  role: 'student' | 'lecturer' | 'admin'
  department: string
  level?: string
  avatar?: string
  created_at: string
  updated_at: string
}

export interface UpdateProfileData {
  name?: string
  first_name?: string
  last_name?: string
  department?: string
  level?: string
  avatar?: string
}

/**
 * Get user profile by ID
 */
export async function getUserProfile(userId: string) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) throw error

    return { data: data as UserProfile, error: null }
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return { data: null, error }
  }
}

/**
 * Update user profile
 */
export async function updateUserProfile(userId: string, updates: UpdateProfileData) {
  try {
    // If updating first_name or last_name, also update name
    if (updates.first_name || updates.last_name) {
      const { data: currentProfile } = await getUserProfile(userId)
      
      const firstName = updates.first_name || currentProfile?.first_name || ''
      const lastName = updates.last_name || currentProfile?.last_name || ''
      
      updates.name = `${firstName} ${lastName}`.trim()
    }

    const { data, error } = await supabase
      .from('users')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select()
      .single()

    if (error) throw error

    return { data: data as UserProfile, error: null }
  } catch (error) {
    console.error('Error updating user profile:', error)
    return { data: null, error }
  }
}

/**
 * Get all users (admin only)
 */
export async function getAllUsers() {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    return { data: data as UserProfile[], error: null }
  } catch (error) {
    console.error('Error fetching all users:', error)
    return { data: null, error }
  }
}

/**
 * Get users by role
 */
export async function getUsersByRole(role: 'student' | 'lecturer' | 'admin') {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('role', role)
      .order('name', { ascending: true })

    if (error) throw error

    return { data: data as UserProfile[], error: null }
  } catch (error) {
    console.error('Error fetching users by role:', error)
    return { data: null, error }
  }
}

/**
 * Get users by department
 */
export async function getUsersByDepartment(department: string) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('department', department)
      .order('name', { ascending: true })

    if (error) throw error

    return { data: data as UserProfile[], error: null }
  } catch (error) {
    console.error('Error fetching users by department:', error)
    return { data: null, error }
  }
}

/**
 * Get user statistics
 */
export async function getUserStats() {
  try {
    const { count: totalUsers, error: totalError } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })

    const { count: students, error: studentsError } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'student')

    const { count: lecturers, error: lecturersError } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'lecturer')

    const { count: admins, error: adminsError } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'admin')

    if (totalError || studentsError || lecturersError || adminsError) {
      throw totalError || studentsError || lecturersError || adminsError
    }

    return {
      data: {
        total: totalUsers || 0,
        students: students || 0,
        lecturers: lecturers || 0,
        admins: admins || 0,
      },
      error: null,
    }
  } catch (error) {
    console.error('Error fetching user stats:', error)
    return {
      data: { total: 0, students: 0, lecturers: 0, admins: 0 },
      error,
    }
  }
}

/**
 * Search users by name or email
 */
export async function searchUsers(query: string) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .or(`name.ilike.%${query}%,email.ilike.%${query}%`)
      .order('name', { ascending: true })
      .limit(20)

    if (error) throw error

    return { data: data as UserProfile[], error: null }
  } catch (error) {
    console.error('Error searching users:', error)
    return { data: null, error }
  }
}

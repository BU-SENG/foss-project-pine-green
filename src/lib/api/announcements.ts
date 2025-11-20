import { supabase } from '@/lib/supabase'

export interface Announcement {
  id: string
  title: string
  excerpt: string
  content: string
  category: string
  department: string
  author_id: string
  author?: {
    id: string
    name: string
    avatar?: string
  }
  priority: 'low' | 'medium' | 'high' | 'urgent'
  image_url?: string
  published_at: string
  view_count: number
  is_deleted: boolean
  created_at: string
  updated_at: string
}

export interface AnnouncementFilters {
  category?: string
  department?: string
  priority?: string
  search?: string
  limit?: number
  offset?: number
}

export interface CreateAnnouncementData {
  title: string
  excerpt: string
  content: string
  category: string
  department: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  image_url?: string
}

export interface UpdateAnnouncementData {
  title?: string
  excerpt?: string
  content?: string
  category?: string
  department?: string
  priority?: 'low' | 'medium' | 'high' | 'urgent'
  image_url?: string
}

/**
 * Fetch announcements with optional filters and pagination
 */
export async function getAnnouncements(filters?: AnnouncementFilters) {
  try {
    let query = supabase
      .from('announcements')
      .select(`
        *,
        author:users!announcements_author_id_fkey(id, name, avatar)
      `)
      .eq('is_deleted', false)
      .order('published_at', { ascending: false })

    // Apply filters
    if (filters?.category) {
      query = query.eq('category', filters.category)
    }

    if (filters?.department) {
      query = query.eq('department', filters.department)
    }

    if (filters?.priority) {
      query = query.eq('priority', filters.priority)
    }

    // Full-text search
    if (filters?.search) {
      query = query.or(
        `title.ilike.%${filters.search}%,excerpt.ilike.%${filters.search}%,content.ilike.%${filters.search}%`
      )
    }

    // Pagination
    if (filters?.limit) {
      query = query.limit(filters.limit)
    }

    if (filters?.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1)
    }

    const { data, error } = await query

    if (error) throw error

    return { data: data as Announcement[], error: null }
  } catch (error) {
    console.error('Error fetching announcements:', error)
    return { data: null, error }
  }
}


/**
 * Fetch a single announcement by ID
 */
export async function getAnnouncementById(id: string) {
  try {
    const { data, error } = await supabase
      .from('announcements')
      .select(`
        *,
        author:users!announcements_author_id_fkey(id, name, avatar)
      `)
      .eq('id', id)
      .eq('is_deleted', false)
      .single()

    if (error) throw error

    return { data: data as Announcement, error: null }
  } catch (error) {
    console.error('Error fetching announcement:', error)
    return { data: null, error }
  }
}

/**
 * Create a new announcement
 */
export async function createAnnouncement(announcementData: CreateAnnouncementData, authorId: string) {
  try {
    const { data, error } = await supabase
      .from('announcements')
      .insert({
        ...announcementData,
        author_id: authorId,
        published_at: new Date().toISOString(),
        view_count: 0,
        is_deleted: false,
      })
      .select()
      .single()

    if (error) throw error

    return { data, error: null }
  } catch (error) {
    console.error('Error creating announcement:', error)
    return { data: null, error }
  }
}

/**
 * Update an existing announcement
 */
export async function updateAnnouncement(id: string, updates: UpdateAnnouncementData) {
  try {
    const { data, error } = await supabase
      .from('announcements')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return { data, error: null }
  } catch (error) {
    console.error('Error updating announcement:', error)
    return { data: null, error }
  }
}

/**
 * Soft delete an announcement
 */
export async function deleteAnnouncement(id: string) {
  try {
    const { data, error } = await supabase
      .from('announcements')
      .update({
        is_deleted: true,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return { data, error: null }
  } catch (error) {
    console.error('Error deleting announcement:', error)
    return { data: null, error }
  }
}

/**
 * Increment view count for an announcement
 */
export async function incrementViewCount(id: string) {
  try {
    const { data, error } = await supabase.rpc('increment_view_count', {
      announcement_id: id,
    })

    if (error) {
      // Fallback if RPC doesn't exist
      const { data: announcement } = await supabase
        .from('announcements')
        .select('view_count')
        .eq('id', id)
        .single()

      if (announcement) {
        await supabase
          .from('announcements')
          .update({ view_count: (announcement.view_count || 0) + 1 })
          .eq('id', id)
      }
    }

    return { data, error: null }
  } catch (error) {
    console.error('Error incrementing view count:', error)
    return { data: null, error }
  }
}

/**
 * Get announcements count with filters
 */
export async function getAnnouncementsCount(filters?: Omit<AnnouncementFilters, 'limit' | 'offset'>) {
  try {
    let query = supabase
      .from('announcements')
      .select('*', { count: 'exact', head: true })
      .eq('is_deleted', false)

    if (filters?.category) {
      query = query.eq('category', filters.category)
    }

    if (filters?.department) {
      query = query.eq('department', filters.department)
    }

    if (filters?.priority) {
      query = query.eq('priority', filters.priority)
    }

    if (filters?.search) {
      query = query.or(
        `title.ilike.%${filters.search}%,excerpt.ilike.%${filters.search}%,content.ilike.%${filters.search}%`
      )
    }

    const { count, error } = await query

    if (error) throw error

    return { count, error: null }
  } catch (error) {
    console.error('Error counting announcements:', error)
    return { count: 0, error }
  }
}

/**
 * Get related announcements based on category or department
 */
export async function getRelatedAnnouncements(announcementId: string, category: string, department: string, limit = 5) {
  try {
    const { data, error } = await supabase
      .from('announcements')
      .select(`
        *,
        author:users!announcements_author_id_fkey(id, name, avatar)
      `)
      .eq('is_deleted', false)
      .neq('id', announcementId)
      .or(`category.eq.${category},department.eq.${department}`)
      .order('published_at', { ascending: false })
      .limit(limit)

    if (error) throw error

    return { data: data as Announcement[], error: null }
  } catch (error) {
    console.error('Error fetching related announcements:', error)
    return { data: null, error }
  }
}

import { supabase } from './supabaseClient'

function missingClientResponse() {
  return { success: false, approved: false, role: 'viewer', error: 'Supabase client not initialized. Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.' }
}

export async function isEmailApproved(email) {
  if (!supabase) return missingClientResponse()
  try {
    const { data, error } = await supabase
      .from('approved_emails')
      .select('id, is_admin, role')
      .eq('email', email.toLowerCase())
      .single()

    if (error) return { approved: false, role: 'viewer' }

    // Derive role: prefer explicit role column, fall back to is_admin flag
    const role = data?.role || (data?.is_admin ? 'admin' : 'viewer')
    return { approved: true, role }
  } catch (err) {
    console.error('Error checking approved email:', err)
    return { approved: false, role: 'viewer' }
  }
}

export async function getApprovedEmails() {
  if (!supabase) return []
  try {
    const { data, error } = await supabase
      .from('approved_emails')
      .select('email, is_admin, role')
      .order('created_at', { ascending: false })

    if (error) throw error
    return (data || []).map(row => ({
      ...row,
      role: row.role || (row.is_admin ? 'admin' : 'viewer'),
    }))
  } catch (err) {
    console.error('Error fetching approved emails:', err)
    return []
  }
}

export async function addApprovedEmail(email, role = 'viewer') {
  if (!supabase) return { success: false, error: 'Supabase client not initialized.' }
  try {
    const { data, error } = await supabase
      .from('approved_emails')
      .upsert(
        { email: email.toLowerCase(), role, is_admin: role === 'admin' },
        { onConflict: 'email' }
      )
      .select()

    if (error) throw error
    return { success: true, data }
  } catch (err) {
    console.error('Error adding approved email:', err)
    return { success: false, error: err.message }
  }
}

export async function removeApprovedEmail(email) {
  if (!supabase) return { success: false, error: 'Supabase client not initialized.' }
  try {
    const { error } = await supabase
      .from('approved_emails')
      .delete()
      .eq('email', email.toLowerCase())

    if (error) throw error
    return { success: true }
  } catch (err) {
    console.error('Error removing approved email:', err)
    return { success: false, error: err.message }
  }
}

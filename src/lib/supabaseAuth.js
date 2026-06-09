import { supabase } from './supabaseClient'

/**
 * Validate if an email is in the approved_emails table
 */
export async function isEmailApproved(email) {
  try {
    const { data, error } = await supabase
      .from('approved_emails')
      .select('id, is_admin')
      .eq('email', email.toLowerCase())
      .single()

    if (error) {
      return { approved: false, isAdmin: false }
    }

    return { approved: true, isAdmin: data?.is_admin || false }
  } catch (err) {
    console.error('Error checking approved email:', err)
    return { approved: false, isAdmin: false }
  }
}

/**
 * Get all approved emails (admin only)
 */
export async function getApprovedEmails() {
  try {
    const { data, error } = await supabase
      .from('approved_emails')
      .select('email, is_admin')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (err) {
    console.error('Error fetching approved emails:', err)
    return []
  }
}

/**
 * Add or update an approved email
 */
export async function addApprovedEmail(email, isAdmin = false) {
  try {
    const { data, error } = await supabase
      .from('approved_emails')
      .upsert(
        { email: email.toLowerCase(), is_admin: isAdmin },
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

/**
 * Remove an approved email
 */
export async function removeApprovedEmail(email) {
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

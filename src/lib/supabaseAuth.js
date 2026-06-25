import { supabase } from './supabaseClient'

function missingClientResponse() {
  return { success: false, approved: false, role: 'viewer', error: 'Supabase client not initialized. Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.' }
}

export async function isEmailApproved(email) {
  if (!supabase) return missingClientResponse()
  try {
    const { data, error } = await supabase
      .rpc('check_approved_email', { check_email: email.toLowerCase() })

    if (error || !data?.length) return { approved: false, role: 'viewer' }
    return { approved: !!data[0].approved, role: data[0].role || 'viewer' }
  } catch (err) {
    console.error('Error checking approved email:', err)
    return { approved: false, role: 'viewer' }
  }
}

// NOTE: approved_emails is no longer directly readable/writable by the
// client (see sql/security_hardening.sql) - the old select-all policy was a
// public-read leak of every email + admin flag. Listing/adding/removing
// approved emails from the admin panel will start failing until the
// Supabase Auth migration lands and these can be rebuilt as RPCs that check
// a real auth session instead of a client-supplied "is this an admin" claim.
export async function getApprovedEmails() {
  return []
}

export async function addApprovedEmail() {
  return { success: false, error: 'Approved-email management is disabled pending the Supabase Auth migration.' }
}

export async function removeApprovedEmail() {
  return { success: false, error: 'Approved-email management is disabled pending the Supabase Auth migration.' }
}

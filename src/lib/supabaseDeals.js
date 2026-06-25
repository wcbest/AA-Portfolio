import { supabase } from './supabaseClient'

function missingClientResponse() {
  return { success: false, data: [], error: 'Supabase client not initialized. Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.' }
}

async function callDealsApi(method, body) {
  try {
    const res = await fetch('/api/deals', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    return await res.json()
  } catch (err) {
    console.error('Error calling deals API:', err)
    return { success: false, error: err.message }
  }
}

export async function getAllDeals() {
  if (!supabase) return missingClientResponse()
  try {
    const { data, error } = await supabase
      .from('deals')
      .select('*')
      .order('size', { ascending: false })
    if (error) throw error
    return { success: true, data: data || [] }
  } catch (err) {
    console.error('Error fetching deals:', err)
    return { success: false, data: [], error: err.message }
  }
}

export async function createDeal(deal, requesterEmail) {
  return callDealsApi('POST', { requesterEmail, deal })
}

export async function updateDeal(id, updates, requesterEmail) {
  return callDealsApi('PATCH', { requesterEmail, id, updates })
}

export async function deleteDeal(id, requesterEmail) {
  return callDealsApi('DELETE', { requesterEmail, id })
}

export async function uploadTeaser(dealId, file, requesterEmail) {
  if (!supabase) return missingClientResponse()
  try {
    const path = `${dealId}/teaser.pdf`
    const { error: uploadError } = await supabase.storage
      .from('teasers')
      .upload(path, file, { upsert: true, contentType: 'application/pdf' })
    if (uploadError) throw uploadError
    const result = await callDealsApi('PATCH', { requesterEmail, id: dealId, updates: { teaserPath: path } })
    if (!result.success) throw new Error(result.error || 'Failed to record teaser path.')
    return { success: true, path }
  } catch (err) {
    console.error('Error uploading teaser:', err)
    return { success: false, error: err.message }
  }
}

export function getTeaserPublicUrl(path) {
  if (!supabase || !path) return null
  return supabase.storage.from('teasers').getPublicUrl(path).data.publicUrl
}

export async function removeTeaser(dealId, path, requesterEmail) {
  try {
    if (path && supabase) {
      const { error: storageError } = await supabase.storage.from('teasers').remove([path])
      if (storageError) throw storageError
    }
    const result = await callDealsApi('PATCH', { requesterEmail, id: dealId, updates: { teaserPath: null } })
    if (!result.success) throw new Error(result.error || 'Failed to clear teaser path.')
    return { success: true }
  } catch (err) {
    console.error('Error removing teaser:', err)
    return { success: false, error: err.message }
  }
}

import { supabase } from './supabaseClient'

function missingClientResponse() {
  return { success: false, data: [], error: 'Supabase client not initialized. Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.' }
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

export async function createDeal(deal) {
  if (!supabase) return missingClientResponse()
  try {
    const { data, error } = await supabase
      .from('deals')
      .insert([{
        entity:   deal.entity,
        code_name: deal.codeName,
        service:  deal.service,
        about:    deal.about,
        industry: deal.industry,
        size:     deal.size ? Number(deal.size) : null,
        ebitda:   deal.ebitda ? Number(deal.ebitda) : null,
        revenues: deal.revenues ? Number(deal.revenues) : null,
      }])
      .select()
    if (error) throw error
    return { success: true, data: data?.[0] }
  } catch (err) {
    console.error('Error creating deal:', err)
    return { success: false, error: err.message }
  }
}

export async function updateDeal(id, updates) {
  if (!supabase) return missingClientResponse()
  try {
    const payload = {
      entity:   updates.entity,
      code_name: updates.codeName,
      service:  updates.service,
      about:    updates.about,
      industry: updates.industry,
      size:     updates.size ? Number(updates.size) : null,
      ebitda:   updates.ebitda ? Number(updates.ebitda) : null,
      revenues: updates.revenues ? Number(updates.revenues) : null,
    }
    const { data, error } = await supabase
      .from('deals')
      .update(payload)
      .eq('id', id)
      .select()
    if (error) throw error
    return { success: true, data: data?.[0] }
  } catch (err) {
    console.error('Error updating deal:', err)
    return { success: false, error: err.message }
  }
}

export async function deleteDeal(id) {
  if (!supabase) return missingClientResponse()
  try {
    const { error } = await supabase.from('deals').delete().eq('id', id)
    if (error) throw error
    return { success: true }
  } catch (err) {
    console.error('Error deleting deal:', err)
    return { success: false, error: err.message }
  }
}

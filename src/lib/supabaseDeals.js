import { supabase } from './supabaseClient'

/**
 * Fetch all deals from Supabase
 */
export async function getAllDeals() {
  try {
    const { data, error } = await supabase
      .from('deals')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return { success: true, data: data || [] }
  } catch (err) {
    console.error('Error fetching deals:', err)
    return { success: false, data: [], error: err.message }
  }
}

/**
 * Create a new deal
 */
export async function createDeal(deal) {
  try {
    const { data, error } = await supabase
      .from('deals')
      .insert([
        {
          entity: deal.entity,
          code_name: deal.codeName,
          category: deal.category,
          description: deal.description,
          size: deal.size ? Number(deal.size) : null,
          deliverables: deal.deliverables,
          status: deal.status,
        },
      ])
      .select()

    if (error) throw error
    return { success: true, data: data?.[0] }
  } catch (err) {
    console.error('Error creating deal:', err)
    return { success: false, error: err.message }
  }
}

/**
 * Update an existing deal
 */
export async function updateDeal(id, updates) {
  try {
    const payload = {
      entity: updates.entity,
      code_name: updates.codeName,
      category: updates.category,
      description: updates.description,
      size: updates.size ? Number(updates.size) : null,
      deliverables: updates.deliverables,
      status: updates.status,
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

/**
 * Delete a deal
 */
export async function deleteDeal(id) {
  try {
    const { error } = await supabase
      .from('deals')
      .delete()
      .eq('id', id)

    if (error) throw error
    return { success: true }
  } catch (err) {
    console.error('Error deleting deal:', err)
    return { success: false, error: err.message }
  }
}

/**
 * Search deals by query
 */
export async function searchDeals(query) {
  try {
    if (!query) {
      return getAllDeals()
    }

    const { data, error } = await supabase
      .from('deals')
      .select('*')
      .or(
        `entity.ilike.%${query}%,code_name.ilike.%${query}%,description.ilike.%${query}%`
      )
      .order('created_at', { ascending: false })

    if (error) throw error
    return { success: true, data: data || [] }
  } catch (err) {
    console.error('Error searching deals:', err)
    return { success: false, data: [], error: err.message }
  }
}

/**
 * Filter deals by category
 */
export async function filterDealsByCategory(category) {
  try {
    if (category === 'All') {
      return getAllDeals()
    }

    const { data, error } = await supabase
      .from('deals')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false })

    if (error) throw error
    return { success: true, data: data || [] }
  } catch (err) {
    console.error('Error filtering deals:', err)
    return { success: false, data: [], error: err.message }
  }
}

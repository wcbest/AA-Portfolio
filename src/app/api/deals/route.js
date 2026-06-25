import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceKey) return null
  return createClient(url, serviceKey)
}

async function requireAdmin(admin, email) {
  if (!email) return false
  const { data } = await admin
    .from('approved_emails')
    .select('is_admin')
    .eq('email', String(email).toLowerCase())
    .single()
  return !!data?.is_admin
}

function dealPayload(input) {
  const payload = {}
  if ('entity' in input) payload.entity = input.entity
  if ('codeName' in input) payload.code_name = input.codeName
  if ('service' in input) payload.service = input.service
  if ('about' in input) payload.about = input.about
  if ('industry' in input) payload.industry = input.industry
  if ('size' in input) payload.size = input.size ? Number(input.size) : null
  if ('ebitda' in input) payload.ebitda = input.ebitda ? Number(input.ebitda) : null
  if ('revenues' in input) payload.revenues = input.revenues ? Number(input.revenues) : null
  if ('teaserPath' in input) payload.teaser_path = input.teaserPath
  return payload
}

export async function POST(req) {
  const admin = getAdminClient()
  if (!admin) return NextResponse.json({ success: false, error: 'Server not configured.' }, { status: 500 })

  const { requesterEmail, deal } = await req.json()
  if (!(await requireAdmin(admin, requesterEmail))) {
    return NextResponse.json({ success: false, error: 'Not authorized.' }, { status: 403 })
  }

  const { data, error } = await admin.from('deals').insert([dealPayload(deal || {})]).select()
  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  return NextResponse.json({ success: true, data: data?.[0] })
}

export async function PATCH(req) {
  const admin = getAdminClient()
  if (!admin) return NextResponse.json({ success: false, error: 'Server not configured.' }, { status: 500 })

  const { requesterEmail, id, updates } = await req.json()
  if (!(await requireAdmin(admin, requesterEmail))) {
    return NextResponse.json({ success: false, error: 'Not authorized.' }, { status: 403 })
  }
  if (!id) return NextResponse.json({ success: false, error: 'Missing id.' }, { status: 400 })

  const { data, error } = await admin.from('deals').update(dealPayload(updates || {})).eq('id', id).select()
  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  return NextResponse.json({ success: true, data: data?.[0] })
}

export async function DELETE(req) {
  const admin = getAdminClient()
  if (!admin) return NextResponse.json({ success: false, error: 'Server not configured.' }, { status: 500 })

  const { requesterEmail, id } = await req.json()
  if (!(await requireAdmin(admin, requesterEmail))) {
    return NextResponse.json({ success: false, error: 'Not authorized.' }, { status: 403 })
  }
  if (!id) return NextResponse.json({ success: false, error: 'Missing id.' }, { status: 400 })

  const { data: existing } = await admin.from('deals').select('teaser_path').eq('id', id).single()
  if (existing?.teaser_path) {
    await admin.storage.from('teasers').remove([existing.teaser_path])
  }

  const { error } = await admin.from('deals').delete().eq('id', id)
  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}

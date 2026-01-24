import { supabase } from '~~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Question ID is required'
    })
  }

  const updateData: Record<string, unknown> = {}
  if (body.question_text !== undefined) updateData.question_text = body.question_text
  if (body.slide_number !== undefined) updateData.slide_number = body.slide_number
  if (body.active !== undefined) updateData.active = body.active

  const { data, error } = await supabase
    .from('questions')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message
    })
  }

  return data
})

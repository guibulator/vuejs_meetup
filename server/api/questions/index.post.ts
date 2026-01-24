import { supabase } from '~~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body.question_text || body.slide_number === undefined) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing required fields: question_text and slide_number'
    })
  }

  // Default to Yes/No if no options provided
  const options = body.options || ['Yes', 'No']

  const { data, error } = await supabase
    .from('questions')
    .insert({
      question_text: body.question_text,
      slide_number: body.slide_number,
      options: options,
      active: body.active ?? true
    } as never)
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

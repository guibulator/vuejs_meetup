import { supabase } from '~~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body.question_id || !body.answer) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing required fields: question_id and answer'
    })
  }

  // Generate a voter_id from client or create a random one
  const voter_id = body.voter_id || crypto.randomUUID()

  // Check if user already voted for this question
  const { data: existingVote } = await supabase
    .from('votes')
    .select('id')
    .eq('question_id', body.question_id)
    .eq('voter_id', voter_id)
    .single()

  if (existingVote) {
    throw createError({
      statusCode: 409,
      statusMessage: 'You have already voted for this question'
    })
  }

  const { data, error } = await supabase
    .from('votes')
    .insert({
      question_id: body.question_id,
      answer: body.answer,
      voter_id: voter_id
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

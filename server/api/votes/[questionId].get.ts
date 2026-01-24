import { supabase } from '~~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const questionId = getRouterParam(event, 'questionId')

  if (!questionId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Question ID is required'
    })
  }

  const { data, error } = await supabase
    .from('votes')
    .select('answer')
    .eq('question_id', questionId)

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message
    })
  }

  // Count votes for each option
  const counts: Record<string, number> = {}
  let total = 0
  
  data?.forEach((v: { answer: string }) => {
    counts[v.answer] = (counts[v.answer] || 0) + 1
    total++
  })

  return {
    counts,
    total
  }
})

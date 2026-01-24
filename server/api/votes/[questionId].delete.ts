import { supabase } from '~~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const questionId = getRouterParam(event, 'questionId')

  if (!questionId) {
    throw createError({
      statusCode: 400,
      message: 'Question ID is required'
    })
  }

  const { error } = await supabase
    .from('votes')
    .delete()
    .eq('question_id', questionId)

  if (error) {
    throw createError({
      statusCode: 500,
      message: error.message
    })
  }

  return { success: true, message: `All votes for question ${questionId} have been reset` }
})

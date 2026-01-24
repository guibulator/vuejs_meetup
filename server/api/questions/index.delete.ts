import { supabase } from '~~/server/utils/supabase'

export default defineEventHandler(async () => {
  // Delete all votes first (foreign key constraint)
  await supabase
    .from('votes')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000')

  // Delete all questions
  const { error } = await supabase
    .from('questions')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000')

  if (error) {
    throw createError({
      statusCode: 500,
      message: error.message
    })
  }

  return { success: true, message: 'All questions and votes have been reset' }
})

<template>
  <div class="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-6">
    <div v-if="pending" class="text-center">
      <UIcon name="i-lucide-loader-circle" class="w-12 h-12 animate-spin text-primary mb-4" />
      <p class="text-gray-400">Chargement de la question...</p>
    </div>

    <UCard v-else-if="error" class="max-w-md bg-gray-900/50 text-center">
      <div class="py-8">
        <UIcon name="i-lucide-circle-x" class="w-16 h-16 mx-auto text-red-500 mb-4" />
        <h1 class="text-2xl font-bold mb-2">Question introuvable</h1>
        <p class="text-gray-400 mb-6">Cette question n'existe pas ou a été supprimée.</p>
        <UButton to="/" color="neutral" variant="outline">
          Retour à l'accueil
        </UButton>
      </div>
    </UCard>

    <UCard v-else-if="question" class="max-w-lg w-full bg-gray-900/50">
      <div class="text-center">
        <UBadge color="primary" class="mb-4">Diapo {{ question.slide_number }}</UBadge>
        
        <h1 class="text-2xl font-bold mb-8">{{ question.question_text }}</h1>

        <div v-if="hasVoted" class="space-y-4">
          <UIcon name="i-lucide-check-circle" class="w-16 h-16 mx-auto text-green-500" />
          <p class="text-lg">Vous avez déjà voté !</p>
          <UButton 
            :to="`/thanks/${question.id}`" 
            color="primary"
            trailing-icon="i-lucide-arrow-right"
          >
            Voir les résultats en direct
          </UButton>
        </div>

        <div v-else class="space-y-3">
          <UButton 
            v-for="(option, index) in question.options" 
            :key="option"
            @click="vote(option)" 
            :disabled="isVoting"
            :color="getOptionColor(index)"
            size="xl"
            block
            class="justify-center text-lg font-semibold"
          >
            {{ option }}
          </UButton>

          <p v-if="isVoting" class="text-gray-400 mt-4">
            <UIcon name="i-lucide-loader-circle" class="w-4 h-4 inline animate-spin mr-2" />
            Envoi de votre vote...
          </p>
        </div>
      </div>
    </UCard>

    <footer class="mt-12 text-gray-600 text-sm">
      <p>Vue.js Meetup - Vote en direct</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import type { Question } from '~~/types/database'

const route = useRoute()
const router = useRouter()
const voterId = useVoterId()

const questionId = computed(() => route.params.id as string)

const { data: question, pending, error } = await useFetch<Question>(`/api/questions/${questionId.value}`)

const isVoting = ref(false)
const hasVoted = ref(false)

// Color palette for options
const optionColorNames: Array<'primary' | 'error' | 'info' | 'warning' | 'success' | 'secondary'> = [
  'primary',
  'error',
  'info',
  'warning',
  'success',
  'secondary',
]

function getOptionColor(index: number) {
  return optionColorNames[index % optionColorNames.length]
}

// Check if user already voted (stored in localStorage)
onMounted(() => {
  const votedQuestions = JSON.parse(localStorage.getItem('voted_questions') || '{}')
  hasVoted.value = !!votedQuestions[questionId.value]
})

async function vote(answer: string) {
  isVoting.value = true
  
  try {
    await $fetch('/api/votes', {
      method: 'POST',
      body: {
        question_id: questionId.value,
        answer,
        voter_id: voterId.value
      }
    })

    // Store in localStorage to remember vote
    try {
      const votedQuestions = JSON.parse(localStorage.getItem('voted_questions') || '{}')
      votedQuestions[questionId.value] = answer
      localStorage.setItem('voted_questions', JSON.stringify(votedQuestions))
    } catch (e) {
      // localStorage might not be available on some mobile browsers
      console.warn('Could not save to localStorage:', e)
    }

    // Redirect to thank you page using navigateTo (more reliable on mobile)
    await navigateTo(`/thanks/${questionId.value}`)
  } catch (err: any) {
    if (err.statusCode === 409 || err.data?.statusCode === 409) {
      hasVoted.value = true
    } else {
      console.error('Vote error:', err)
      alert('Erreur lors de l\'envoi du vote. Veuillez réessayer.')
    }
  } finally {
    isVoting.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-6">
    <div v-if="pending" class="text-center">
      <UIcon name="i-lucide-loader-circle" class="w-12 h-12 animate-spin text-primary mb-4" />
      <p class="text-gray-400">Chargement...</p>
    </div>

    <UCard v-else-if="error" class="max-w-md bg-gray-900/50 text-center">
      <div class="py-8">
        <UIcon name="i-lucide-circle-x" class="w-16 h-16 mx-auto text-red-500 mb-4" />
        <h1 class="text-2xl font-bold">Question introuvable</h1>
      </div>
    </UCard>

    <UCard v-else class="max-w-lg w-full bg-gray-900/50">
      <div class="text-center">
        <!-- Success Icon -->
        <div class="w-20 h-20 mx-auto mb-6 bg-green-500/20 rounded-full flex items-center justify-center">
          <UIcon name="i-lucide-check" class="w-10 h-10 text-green-500" />
        </div>
        
        <h1 class="text-3xl font-bold mb-2">Merci !</h1>
        <p class="text-gray-400 mb-6">Votre vote a été enregistré</p>

        <!-- Question Info -->
        <div v-if="question" class="bg-gray-800/50 rounded-lg p-4 mb-8">
          <UBadge color="primary" class="mb-2">Diapo {{ question.slide_number }}</UBadge>
          <p class="font-medium">{{ question.question_text }}</p>
        </div>

        <!-- Live Results -->
        <div class="text-left">
          <div class="flex items-center gap-2 mb-4">
            <span class="relative flex h-3 w-3">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            <h2 class="text-lg font-semibold">Résultats en direct</h2>
          </div>
          
          <div class="space-y-4">
            <div 
              v-for="(option, index) in question?.options || []" 
              :key="option"
              class="space-y-2"
            >
              <div class="flex justify-between text-sm">
                <span class="font-medium">{{ option }}</span>
                <span class="text-gray-400">
                  {{ voteData.counts[option] || 0 }} votes ({{ getPercentage(option).toFixed(0) }}%)
                </span>
              </div>
              <UProgress 
                :model-value="getPercentage(option)" 
                :color="getOptionColor(index)"
                size="md"
              />
            </div>
          </div>

          <p class="text-center text-gray-400 mt-6">
            Total des votes : <strong class="text-white">{{ voteData.total }}</strong>
          </p>
        </div>

        <!-- Back Button -->
        <UButton 
          to="/" 
          color="neutral" 
          variant="outline"
          leading-icon="i-lucide-arrow-left"
          class="mt-8"
        >
          Retour à l'accueil
        </UButton>
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

const questionId = computed(() => route.params.id as string)

const { data: question, pending, error } = await useFetch<Question>(`/api/questions/${questionId.value}`)

const voteData = ref<{ counts: Record<string, number>, total: number }>({
  counts: {},
  total: 0
})

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

function getPercentage(option: string) {
  if (voteData.value.total === 0) return 0
  return ((voteData.value.counts[option] || 0) / voteData.value.total) * 100
}

// Fetch vote count
async function fetchVotes() {
  try {
    const data = await $fetch<{ counts: Record<string, number>, total: number }>(`/api/votes/${questionId.value}`)
    voteData.value = data
  } catch (e) {
    console.error('Failed to fetch votes:', e)
  }
}

// Poll for updates every 2 seconds
let pollInterval: ReturnType<typeof setInterval>

onMounted(async () => {
  await fetchVotes()
  pollInterval = setInterval(fetchVotes, 4000)
})

onUnmounted(() => {
  if (pollInterval) {
    clearInterval(pollInterval)
  }
})
</script>

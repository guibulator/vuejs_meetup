<template>
  <div class="h-screen bg-gray-950 text-white flex overflow-hidden">
    <!-- Left side: Results (scrollable) -->
    <div class="flex-1 overflow-y-auto p-6">
      <div class="flex flex-col items-center justify-center min-h-full">
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

        <div v-else class="max-w-3/5 w-full">
          <!-- Header -->
          <div class="text-center mb-8">
            <div class="mb-4">
              <svg viewBox="0 0 128 128" class="w-16 h-16 mx-auto">
                <path fill="#42b883" d="M78.8,10L64,35.4L49.2,10H0l64,110l64-110C128,10,78.8,10,78.8,10z"/>
                <path fill="#35495e" d="M78.8,10L64,35.4L49.2,10H25.6L64,76l38.4-66H78.8z"/>
              </svg>
            </div>
            <h1 class="text-3xl font-bold mb-2">Résultats en direct</h1>
            <div class="flex items-center justify-center gap-2 text-gray-400">
              <span class="relative flex h-3 w-3">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
              <span>Mise à jour automatique</span>
            </div>
          </div>

          <!-- Question Card -->
          <UCard v-if="question" class="bg-gray-900/50">
            <div class="text-center mb-6">
              <UBadge color="primary" size="lg" class="mb-3">Diapo {{ question.slide_number }}</UBadge>
              <h2 class="text-2xl font-bold">{{ question.question_text }}</h2>
            </div>

            <!-- Results -->
            <div class="space-y-5">
              <div 
                v-for="(option, index) in question.options" 
                :key="option"
                class="space-y-2"
              >
                <div class="flex justify-between items-center">
                  <span class="text-lg font-semibold">{{ option }}</span>
                  <span class="text-2xl font-bold" :class="getTextColorClass(index)">
                    {{ voteData.counts[option] || 0 }}
                  </span>
                </div>
                <UProgress 
                  :model-value="getPercentage(option)" 
                  :color="getOptionColor(index)"
                  size="lg"
                />
                <div class="text-right text-sm text-gray-400">
                  {{ getPercentage(option).toFixed(1) }}%
                </div>
              </div>
            </div>

            <!-- Total -->
            <div class="mt-8 pt-6 border-t border-gray-800 text-center">
              <p class="text-gray-400">Total des votes</p>
              <p class="text-4xl font-bold text-white">{{ voteData.total }}</p>
            </div>
          </UCard>

          <!-- Footer -->
          <footer class="text-center mt-8 text-gray-600 text-sm">
            <p>Vue.js Meetup - Votez sur votre téléphone !</p>
          </footer>
        </div>
      </div>
    </div>

    <!-- Right side: QR Code (fixed) -->
    <div v-if="question" class="w-2/5 min-w-[500px] h-screen fixed right-0 top-0 bg-gray-900/30 flex flex-col items-center justify-center p-4 border-l border-gray-800">
      <div class="text-center w-full h-full flex flex-col items-center justify-center">
        <h3 class="text-xl font-semibold mb-4 text-gray-300">Scannez pour voter</h3>
        <img 
          :src="getQrCodeUrl(questionId)" 
          alt="QR Code pour voter"
          class="w-[80%] max-h-[70vh] aspect-square rounded-2xl bg-white p-4 shadow-2xl"
        />
        <p class="mt-4 text-gray-500 text-sm">{{ baseUrl }}/vote/...</p>
      </div>
    </div>

    <!-- Spacer for fixed right panel -->
    <div v-if="question" class="w-2/5 min-w-[500px] shrink-0"></div>
  </div>
</template>

<script setup lang="ts">
import type { Question } from '~~/types/database'

// Allow iframe embedding
useHead({
  meta: [
    { name: 'robots', content: 'noindex' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, viewport-fit=cover' }
  ]
})

// Set headers to allow iframe embedding
useServerHead({
  headers: {
    'X-Frame-Options': 'ALLOWALL',
    'Content-Security-Policy': "frame-ancestors *"
  }
})

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

const textColorClasses = [
  'text-primary',
  'text-red-500',
  'text-blue-500',
  'text-yellow-500',
  'text-green-500',
  'text-purple-500',
]

function getOptionColor(index: number) {
  return optionColorNames[index % optionColorNames.length]
}

function getTextColorClass(index: number) {
  return textColorClasses[index % textColorClasses.length]
}

const baseUrl = 'https://vuejs-meetup.vercel.app'

function getQrCodeUrl(questionId: string) {
  const voteUrl = `${baseUrl}/vote/${questionId}`
  return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(voteUrl)}`
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

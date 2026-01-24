<template>
  <div class="min-h-screen bg-gray-950 text-white">
    <UContainer class="py-12">
      <!-- Hero -->
      <div class="text-center mb-12">
        <div class="mb-6">
          <svg viewBox="0 0 128 128" class="w-24 h-24 mx-auto">
            <path fill="#42b883" d="M78.8,10L64,35.4L49.2,10H0l64,110l64-110C128,10,78.8,10,78.8,10z"/>
            <path fill="#35495e" d="M78.8,10L64,35.4L49.2,10H25.6L64,76l38.4-66H78.8z"/>
          </svg>
        </div>
        <h1 class="text-4xl font-bold mb-3">Vue.js Meetup</h1>
        <p class="text-lg text-gray-400">Système de vote en direct</p>
      </div>

      <!-- Questions -->
      <div class="max-w-3xl mx-auto">
        <h2 class="text-2xl font-semibold text-center mb-8">Questions actives</h2>

        <div v-if="pending" class="flex justify-center">
          <UIcon name="i-lucide-loader-circle" class="w-8 h-8 animate-spin text-primary" />
        </div>

        <div v-else-if="activeQuestions.length > 0" class="space-y-6">
          <UCard 
            v-for="q in activeQuestions" 
            :key="q.id"
            class="bg-gray-900/50"
          >
            <div class="flex gap-6 items-center">
              <div class="flex-1">
                <UBadge color="primary" class="mb-3">Diapo {{ q.slide_number }}</UBadge>
                <h3 class="text-xl font-semibold mb-2">{{ q.question_text }}</h3>
                <p class="text-sm text-gray-400 mb-4">Options : {{ q.options.join(', ') }}</p>
                <UButton 
                  :to="`/vote/${q.id}`" 
                  color="primary"
                  trailing-icon="i-lucide-arrow-right"
                >
                  Voter maintenant
                </UButton>
              </div>
              <div class="text-center">
                <img 
                  :src="getQrCodeUrl(q.id)" 
                  :alt="`QR Code pour ${q.question_text}`"
                  class="w-28 h-28 rounded-lg bg-white p-1"
                />
                <span class="text-xs text-gray-500 mt-2 block">Scannez pour voter</span>
              </div>
            </div>
          </UCard>
        </div>

        <UCard v-else class="bg-gray-900/50 text-center py-12">
          <UIcon name="i-lucide-inbox" class="w-12 h-12 mx-auto text-gray-600 mb-4" />
          <p class="text-gray-400">Aucune question active pour le moment.</p>
          <p class="text-gray-500 text-sm">Revenez pendant la présentation !</p>
        </UCard>
      </div>

      <!-- Footer -->
      <footer class="text-center mt-16 text-gray-600 text-sm">
        <p>Fait avec Nuxt UI + Supabase 💚</p>
      </footer>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
import type { Question } from '~~/types/database'

const { data: questions, pending } = await useFetch<Question[]>('/api/questions')

const activeQuestions = computed(() => 
  questions.value?.filter(q => q.active) || []
)

const baseUrl = 'https://vuejs-meetup.vercel.app'

function getQrCodeUrl(questionId: string) {
  const voteUrl = `${baseUrl}/vote/${questionId}`
  return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(voteUrl)}`
}
</script>

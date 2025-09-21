<template>
  <div class="game-container">
    <!-- Theme toggle at top right -->
    <q-btn
      @click="themeStore.toggleTheme()"
      :icon="themeStore.isDark ? 'light_mode' : 'dark_mode'"
      round
      flat
      size="sm"
      class="theme-toggle-fixed"
    />

    <!-- Header -->
    <div class="game-header">
      <div class="header-content">
        <div class="title-section">
          <h1 class="game-title">Daily Image Guesser</h1>
          <p class="game-subtitle">Guess the word from today's image</p>
        </div>
      </div>
    </div>

    <!-- Main game area -->
    <div class="game-content">
      <!-- Left side - Image and Input -->
      <div class="main-panel">
        <!-- Image section -->
        <q-card class="image-card" v-animate-css="'fadeIn'">
          <div class="image-container">
            <img
              v-if="gameStore.currentImage"
              :src="gameStore.currentImage"
              class="daily-image"
              alt="Daily challenge image"
              @load="imageLoaded = true"
              @error="imageError = true"
            />
            <LoadingSpinner v-else message="Loading today's image..." />
          </div>
        </q-card>

        <!-- Input section below image -->
        <q-card class="input-card" v-if="!gameStore.todayCompleted" v-animate-css="'slideInUp'">
          <q-card-section>
            <div class="input-section">
              <div class="guess-counter q-mb-md">
                <q-chip
                  :color="gameStore.remainingGuesses <= 3 ? 'negative' : 'primary'"
                  text-color="white"
                  icon="psychology"
                  size="lg"
                >
                  {{ gameStore.remainingGuesses }} guesses left
                </q-chip>
              </div>
              <q-form @submit="submitGuess">
                <q-input
                  v-model="currentGuess"
                  label="What do you see in the image?"
                  outlined
                  :disable="!gameStore.canGuess || gameStore.loading"
                  @keyup.enter="submitGuess"
                  class="guess-input"
                  size="lg"
                >
                  <template v-slot:prepend>
                    <q-icon name="search" />
                  </template>
                  <template v-slot:append>
                    <q-btn
                      round
                      color="primary"
                      icon="send"
                      @click="submitGuess"
                      :disable="!currentGuess.trim() || !gameStore.canGuess || gameStore.loading"
                      :loading="gameStore.loading"
                    />
                  </template>
                </q-input>
              </q-form>
            </div>
          </q-card-section>
        </q-card>

        <!-- Completion message -->
        <q-card v-if="gameStore.todayCompleted" class="completion-card" v-animate-css="'bounceIn'">
          <q-card-section class="text-center">
            <q-icon name="celebration" size="4rem" color="positive" class="q-mb-md" />
            <div class="text-h5 text-weight-bold q-mb-sm">Congratulations!</div>
            <div class="text-body1 opacity-70">You've completed today's challenge</div>
            <div class="text-body2 opacity-60 q-mt-sm">Come back tomorrow for a new image</div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Right side - Guesses history -->
      <div class="guess-panel">
        <q-card class="guesses-card">
          <q-card-section>
            <div class="text-h6 q-mb-md flex items-center">
              <q-icon name="history" class="q-mr-sm" />
              Your Guesses
            </div>
            <q-scroll-area style="height: 500px">
              <div class="guesses-list">
                <div v-if="gameStore.guesses.length === 0" class="no-guesses">
                  <q-icon name="psychology" size="3rem" color="grey-5" class="q-mb-md" />
                  <div class="text-body1 text-grey-6">Your guesses will appear here</div>
                </div>
                <div
                  v-for="(guess, index) in gameStore.guesses.slice().reverse()"
                  :key="index"
                  class="guess-item"
                  v-animate-css="'slideInUp'"
                  :style="{ 'animation-delay': `${index * 100}ms` }"
                >
                  <div class="guess-content">
                    <div class="guess-word">{{ guess.word }}</div>
                    <div class="guess-message">{{ guess.message }}</div>
                  </div>
                  <div class="guess-score">
                    <q-circular-progress
                      :value="guess.score"
                      size="50px"
                      :thickness="0.15"
                      :color="getScoreColor(guess.score)"
                      track-color="grey-3"
                      class="q-ma-md"
                    >
                      <div class="text-caption text-weight-bold">{{ guess.score }}%</div>
                    </q-circular-progress>
                  </div>
                </div>
              </div>
            </q-scroll-area>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useGameStore } from 'stores/game-store'
import { useThemeStore } from 'stores/theme-store'
import { useQuasar } from 'quasar'
import LoadingSpinner from 'components/LoadingSpinner.vue'

const gameStore = useGameStore()
const themeStore = useThemeStore()
const $q = useQuasar()
const currentGuess = ref('')

const getScoreColor = (score) => {
  if (score >= 80) return 'positive'
  if (score >= 60) return 'warning'
  if (score >= 40) return 'orange'
  return 'negative'
}

const submitGuess = async () => {
  if (!currentGuess.value.trim() || !gameStore.canGuess) return

  try {
    const result = await gameStore.submitGuess(currentGuess.value)
    currentGuess.value = ''

    if (result.score === 100) {
      $q.notify({
        type: 'positive',
        message: 'Congratulations! You got it right!',
        position: 'top',
      })
    } else {
      $q.notify({
        type: 'info',
        message: result.message,
        position: 'top',
      })
    }
  } catch (error) {
    console.error(error)
    $q.notify({
      type: 'negative',
      message: 'Failed to submit guess',
      position: 'top',
    })
  }
}

onMounted(async () => {
  themeStore.initTheme()
  gameStore.initializeUser()
  await gameStore.checkTodayStatus()
})
</script>

<style scoped>
.game-container {
  min-height: 100vh;
  padding: 20px;
  max-width: 1000px;
  margin: 0 auto;
}

.game-header {
  margin-bottom: 20px;
}

.header-content {
  text-align: center;
  padding: 10px 0;
}

.title-section {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.game-title {
  font-size: 3rem;
  font-weight: 700;
  margin: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.game-subtitle {
  font-size: 1.2rem;
  margin: 8px 0 0 0;
  opacity: 0.8;
}

.theme-toggle-fixed {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.theme-toggle-fixed:hover {
  transform: scale(1.1) rotate(180deg);
  background: rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.game-content {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 24px;
  align-items: start;
}

.main-panel,
.guess-panel {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.image-card {
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.image-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

.image-container {
  position: relative;
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.daily-image {
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  object-fit: contain;
  border-radius: 12px;
}

.guess-counter {
  display: flex;
  justify-content: center;
}

.input-card,
.completion-card,
.guesses-card {
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.input-card:hover,
.guesses-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
}

.input-section {
  padding: 10px 0;
}

.guess-input {
  font-size: 1.1rem;
}

.completion-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.guesses-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.guess-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 12px;
  transition: all 0.3s ease;
}

.guess-item:hover {
  background: rgba(0, 0, 0, 0.05);
  transform: translateX(5px);
}

.guess-content {
  flex: 1;
}

.guess-word {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 4px;
}

.guess-message {
  font-size: 0.9rem;
  opacity: 0.7;
}

.guess-score {
  display: flex;
  align-items: center;
}

.no-guesses {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
}

@media (max-width: 768px) {
  .game-container {
    padding: 16px;
  }

  .game-content {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .game-title {
    font-size: 2rem;
  }

  .game-subtitle {
    font-size: 1rem;
  }

  .header-content {
    padding: 8px 0;
  }

  .theme-toggle-fixed {
    top: 16px;
    right: 16px;
  }

  .image-container {
    height: 350px;
    padding: 16px;
  }

  .input-section {
    padding: 8px 0;
  }

  .guess-input {
    font-size: 1rem;
  }

  .guess-item {
    padding: 12px;
    flex-direction: column;
    gap: 8px;
    text-align: center;
  }

  .guess-content {
    order: 2;
  }

  .guess-score {
    order: 1;
  }
}

@media (max-width: 480px) {
  .game-container {
    padding: 12px;
  }

  .game-title {
    font-size: 1.5rem;
  }

  .header-content {
    padding: 4px 0;
  }

  .theme-toggle-fixed {
    top: 12px;
    right: 12px;
  }

  .image-container {
    height: 300px;
    padding: 12px;
  }

  .q-scroll-area {
    height: 300px !important;
  }

  .guess-item {
    padding: 8px;
  }
}
</style>

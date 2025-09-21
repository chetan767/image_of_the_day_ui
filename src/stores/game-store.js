import { defineStore } from 'pinia'
import { api } from 'boot/axios'

export const useGameStore = defineStore('game', {
  state: () => ({
    userId: null,
    sessionId: null,
    currentImage: null,
    guesses: [],
    maxGuesses: 10,
    gameCompleted: false,
    todayCompleted: false,
    loading: false,
    error: null,
  }),

  getters: {
    remainingGuesses: (state) => state.maxGuesses - state.guesses.length,
    canGuess: (state) =>
      !state.gameCompleted && !state.todayCompleted && state.guesses.length < state.maxGuesses,
  },

  actions: {
    initializeUser() {
      this.userId = localStorage.getItem('userId') || this.generateUserId()
      this.sessionId = this.generateSessionId()
      localStorage.setItem('userId', this.userId)
    },

    generateUserId() {
      return 'user_' + Math.random().toString(36).substr(2, 9)
    },

    generateSessionId() {
      return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5)
    },

    async checkTodayStatus() {
      try {
        this.loading = true
        const response = await api.post('/status', {
          body: { user_id: this.userId },
        })
        this.todayCompleted = response.data.has_guessed_correctly
        this.currentImage = response.data.image_url
        if (response.data.guesses) {
          this.guesses = response.data.guesses
        }
      } catch (error) {
        this.error = 'Failed to check game status'
        console.error(error)
      } finally {
        this.loading = false
      }
    },

    async submitGuess(word) {
      if (!this.canGuess) return

      try {
        this.loading = true
        const response = await api.post('/guess', {
          user_id: this.userId,
          session_id: this.sessionId,
          user_word: word.toLowerCase().trim(),
        })

        const guessResult = {
          word: word.toLowerCase().trim(),
          score: response.data.score,
          message: response.data.message,
          timestamp: new Date(),
        }

        this.guesses.push(guessResult)

        if (response.data.correct || this.guesses.length >= this.maxGuesses) {
          this.gameCompleted = true
          this.todayCompleted = true
        }

        return guessResult
      } catch (error) {
        this.error = 'Failed to submit guess'
        console.error(error)
        throw error
      } finally {
        this.loading = false
      }
    },

    resetGame() {
      this.guesses = []
      this.gameCompleted = false
      this.error = null
      this.sessionId = this.generateSessionId()
    },
  },
})

// Mock API service for development
const DAILY_WORDS = [
  { word: 'sunset', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400' },
  { word: 'ocean', image: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=400' },
  { word: 'mountain', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400' },
  { word: 'forest', image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400' },
  { word: 'flower', image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400' }
]

const getTodayWord = () => {
  const dayIndex = new Date().getDate() % DAILY_WORDS.length
  return DAILY_WORDS[dayIndex]
}

const calculateScore = (guess, target) => {
  if (guess === target) return 100
  
  const similarity = calculateSimilarity(guess, target)
  return Math.max(0, Math.floor(similarity * 100))
}

const calculateSimilarity = (str1, str2) => {
  const longer = str1.length > str2.length ? str1 : str2
  const shorter = str1.length > str2.length ? str2 : str1
  
  if (longer.length === 0) return 1.0
  
  const distance = levenshteinDistance(longer, shorter)
  return (longer.length - distance) / longer.length
}

const levenshteinDistance = (str1, str2) => {
  const matrix = []
  
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i]
  }
  
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j
  }
  
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1]
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        )
      }
    }
  }
  
  return matrix[str2.length][str1.length]
}

const getScoreMessage = (score) => {
  if (score === 100) return 'Perfect! You got it right!'
  if (score >= 80) return 'Very close! You\'re almost there!'
  if (score >= 60) return 'Getting warmer! Keep trying!'
  if (score >= 40) return 'You\'re on the right track!'
  if (score >= 20) return 'Not quite, but don\'t give up!'
  return 'Try a different approach!'
}

const userSessions = new Map()

export const mockApiService = {
  async getGameStatus(userId) {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const today = new Date().toDateString()
    const todayWord = getTodayWord()
    const userKey = `${userId}_${today}`
    
    const session = userSessions.get(userKey) || {
      completed: false,
      guesses: [],
      word: todayWord.word
    }
    
    return {
      data: {
        completed: session.completed,
        image: todayWord.image,
        guesses: session.guesses
      }
    }
  },

  async submitGuess(userId, sessionId, guess) {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const today = new Date().toDateString()
    const todayWord = getTodayWord()
    const userKey = `${userId}_${today}`
    
    let session = userSessions.get(userKey) || {
      completed: false,
      guesses: [],
      word: todayWord.word
    }
    
    const score = calculateScore(guess.toLowerCase(), todayWord.word.toLowerCase())
    const message = getScoreMessage(score)
    const correct = score === 100
    
    session.guesses.push({
      word: guess,
      score,
      message,
      timestamp: new Date()
    })
    
    if (correct) {
      session.completed = true
    }
    
    userSessions.set(userKey, session)
    
    return {
      data: {
        score,
        message,
        correct
      }
    }
  }
}
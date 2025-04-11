import { Injectable } from "@angular/core"
import { hiraganaData } from "../data/hiragana"
import { katakanaData } from "../data/katakana"

export interface QuizOptions {
  includeHiragana: boolean
  includeKatakana: boolean
  questionCount: number
  repetitionCount: number
  timeLimit: number | null // null means no time limit
}

export interface CharacterGroup {
  name: string
  selected: boolean
}

export interface SavedOptions {
  options: QuizOptions
  hiraganaGroups: CharacterGroup[]
  katakanaGroups: CharacterGroup[]
}

export interface QuizProgress {
  date: Date
  totalQuestions: number
  correctAnswers: number
  timeSpent: number // in seconds
  options: SavedOptions
}

export interface QuizQuestion {
  character: string
  romaji: string
  type: string
  options: string[]
}

@Injectable({
  providedIn: "root",
})
export class QuizService {
  private readonly STORAGE_KEY_OPTIONS = "japanese-quiz-options"
  private readonly STORAGE_KEY_PROGRESS = "japanese-quiz-progress"
  private readonly STORAGE_KEY_HIGHSCORES = "japanese-quiz-highscores"

  constructor() {}

  saveOptions(options: SavedOptions) {
    localStorage.setItem(this.STORAGE_KEY_OPTIONS, JSON.stringify(options))
  }

  getOptions(): SavedOptions | null {
    const options = localStorage.getItem(this.STORAGE_KEY_OPTIONS)
    return options ? JSON.parse(options) : null
  }

  saveProgress(progress: QuizProgress) {
    const existingProgress = this.getProgress()
    const updatedProgress = [...existingProgress, progress]
    localStorage.setItem(this.STORAGE_KEY_PROGRESS, JSON.stringify(updatedProgress))
    
    // Check if this is a high score
    this.updateHighScores(progress)
  }

  getProgress(): QuizProgress[] {
    const progress = localStorage.getItem(this.STORAGE_KEY_PROGRESS)
    return progress ? JSON.parse(progress) : []
  }

  getHighScores(): QuizProgress[] {
    const highScores = localStorage.getItem(this.STORAGE_KEY_HIGHSCORES)
    return highScores ? JSON.parse(highScores) : []
  }

  updateHighScores(progress: QuizProgress) {
    const highScores = this.getHighScores()
    
    // Calculate score percentage
    const scorePercentage = (progress.correctAnswers / progress.totalQuestions) * 100
    
    // Add to high scores if there are fewer than 10 entries or if this score is higher than the lowest
    if (highScores.length < 10 || 
        scorePercentage > (highScores[highScores.length - 1].correctAnswers / highScores[highScores.length - 1].totalQuestions) * 100) {
      
      // Add the new score
      highScores.push(progress)
      
      // Sort by percentage (highest first)
      highScores.sort((a, b) => {
        const aPercentage = (a.correctAnswers / a.totalQuestions) * 100
        const bPercentage = (b.correctAnswers / b.totalQuestions) * 100
        return bPercentage - aPercentage
      })
      
      // Keep only the top 10
      const topScores = highScores.slice(0, 10)
      
      // Save back to storage
      localStorage.setItem(this.STORAGE_KEY_HIGHSCORES, JSON.stringify(topScores))
    }
  }

  generateQuiz(): QuizQuestion[] {
    const options = this.getOptions()

    if (!options) {
      // Use default options if none are saved
      return this.generateQuestionsWithDefaultOptions()
    }

    const { options: quizOptions, hiraganaGroups, katakanaGroups } = options

    // Check if at least one character set is selected
    if (!quizOptions.includeHiragana && !quizOptions.includeKatakana) {
      return []
    }

    let availableCharacters: any[] = []

    // Add hiragana characters if selected
    if (quizOptions.includeHiragana) {
      const selectedGroups = hiraganaGroups.filter((group: CharacterGroup) => group.selected).map((group: CharacterGroup) => group.name)

      const filteredHiragana = hiraganaData.filter((char) => selectedGroups.some((group) => char.group === group))

      availableCharacters = [...availableCharacters, ...filteredHiragana]
    }

    // Add katakana characters if selected
    if (quizOptions.includeKatakana) {
      const selectedGroups = katakanaGroups.filter((group: CharacterGroup) => group.selected).map((group: CharacterGroup) => group.name)

      const filteredKatakana = katakanaData.filter((char) => selectedGroups.some((group) => char.group === group))

      availableCharacters = [...availableCharacters, ...filteredKatakana]
    }

    // If no characters are available after filtering, return empty array
    if (availableCharacters.length === 0) {
      return []
    }

    // Create questions based on available characters and options
    const questions: QuizQuestion[] = []
    const repetitionCount = quizOptions.repetitionCount
    const questionCount = Math.min(quizOptions.questionCount, availableCharacters.length * repetitionCount)

    // Create a pool of characters with repetition
    let characterPool: any[] = []
    for (let i = 0; i < repetitionCount; i++) {
      characterPool = [...characterPool, ...availableCharacters]
    }

    // Shuffle the character pool
    characterPool = this.shuffleArray(characterPool)

    // Take the required number of characters for the quiz
    const selectedCharacters = characterPool.slice(0, questionCount)

    // Create questions for each selected character
    for (const character of selectedCharacters) {
      // Generate 3 incorrect options
      const incorrectOptions = this.generateIncorrectOptions(character, availableCharacters)

      // Combine correct and incorrect options and shuffle
      const options = this.shuffleArray([character.romaji, ...incorrectOptions])

      questions.push({
        character: character.character,
        romaji: character.romaji,
        type: character.type,
        options,
      })
    }

    return questions
  }

  private generateQuestionsWithDefaultOptions(): QuizQuestion[] {
    // Combine hiragana and katakana data
    const allCharacters = [...hiraganaData, ...katakanaData]

    // Default settings
    const questionCount = 20
    const repetitionCount = 2

    // Create a pool of characters with repetition
    let characterPool: any[] = []
    for (let i = 0; i < repetitionCount; i++) {
      characterPool = [...characterPool, ...allCharacters]
    }

    // Shuffle the character pool
    characterPool = this.shuffleArray(characterPool)

    // Take the required number of characters for the quiz
    const selectedCharacters = characterPool.slice(0, questionCount)

    // Create questions for each selected character
    const questions: QuizQuestion[] = []
    for (const character of selectedCharacters) {
      // Generate 3 incorrect options
      const incorrectOptions = this.generateIncorrectOptions(character, allCharacters)

      // Combine correct and incorrect options and shuffle
      const options = this.shuffleArray([character.romaji, ...incorrectOptions])

      questions.push({
        character: character.character,
        romaji: character.romaji,
        type: character.type,
        options,
      })
    }

    return questions
  }

  private generateIncorrectOptions(correctChar: any, allChars: any[]) {
    // Filter out the correct character
    const otherChars = allChars.filter((char) => char.romaji !== correctChar.romaji)

    // Shuffle the array of other characters
    const shuffled = this.shuffleArray(otherChars)

    // Take the first 3 characters as incorrect options
    return shuffled.slice(0, 3).map((char) => char.romaji)
  }

  private shuffleArray<T>(array: T[]): T[] {
    const newArray = [...array]
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
    }
    return newArray
  }

  getDefaultHiraganaGroups(): CharacterGroup[] {
    return [
      { name: "あ行", selected: true },
      { name: "か行", selected: true },
      { name: "さ行", selected: true },
      { name: "た行", selected: true },
      { name: "な行", selected: true },
      { name: "は行", selected: true },
      { name: "ま行", selected: true },
      { name: "や行", selected: true },
      { name: "ら行", selected: true },
      { name: "わ行", selected: true },
      { name: "だくてん", selected: false },
      { name: "はんだくてん", selected: false },
      { name: "ようおん", selected: false },
      { name: "ようおん だくてん", selected: false },
      { name: "ようおん はんだくてん", selected: false },
    ]
  }

  getDefaultKatakanaGroups(): CharacterGroup[] {
    return [
      { name: "ア行", selected: true },
      { name: "カ行", selected: true },
      { name: "サ行", selected: true },
      { name: "タ行", selected: true },
      { name: "ナ行", selected: true },
      { name: "ハ行", selected: true },
      { name: "マ行", selected: true },
      { name: "ヤ行", selected: true },
      { name: "ラ行", selected: true },
      { name: "ワ行", selected: true },
      { name: "ダクテン", selected: false },
      { name: "ハンダクテン", selected: false },
      { name: "ヨウオン", selected: false },
      { name: "ヨウオン ダクテン", selected: false },
      { name: "ヨウオン ハンダクテン", selected: false },
    ]
  }

  getDefaultOptions(): SavedOptions {
    return {
      options: {
        includeHiragana: true,
        includeKatakana: true,
        questionCount: 20,
        repetitionCount: 2,
        timeLimit: null
      },
      hiraganaGroups: this.getDefaultHiraganaGroups(),
      katakanaGroups: this.getDefaultKatakanaGroups()
    }
  }
}

import { Component, type OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { QuizService, QuizQuestion } from '../../services/quiz.service';
import { ThemeToggleComponent } from '../../components/theme-toggle.component';
import { TimerComponent } from '../../components/timer.component';

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ThemeToggleComponent,
    TimerComponent,
    MatIconModule,
  ],
  template: `
    <div class="container mx-auto px-4 py-8 max-w-4xl text-gray-600">
      <!-- Header with navigation and theme toggle -->
      <header class="flex justify-between items-center mb-6">
        <div class="flex items-center gap-2">
          <a
            routerLink="/"
            class="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <mat-icon class="text-gray-700 dark:text-gray-300">home</mat-icon>
          </a>
          <a
            routerLink="/options"
            class="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <mat-icon class="text-gray-700 dark:text-gray-300"
              >settings</mat-icon
            >
          </a>
        </div>

        <app-theme-toggle></app-theme-toggle>
      </header>

      <!-- Progress bar and stats -->
      <div
        class="flex flex-col md:flex-row justify-between items-center mb-6 gap-4"
      >
        <div class="flex items-center gap-4 order-2 md:order-1">
          <div
            class="flex items-center gap-1 bg-green-100 dark:bg-green-900 px-3 py-1 rounded-full"
          >
            <mat-icon class="text-green-600 dark:text-green-400"
              >check</mat-icon
            >
            <span class="font-medium">{{ correctAnswers }}</span>
          </div>
          <div
            class="flex items-center gap-1 bg-red-100 dark:bg-red-900 px-3 py-1 rounded-full"
          >
            <mat-icon class="text-red-600 dark:text-red-400">close</mat-icon>
            <span class="font-medium">
              {{ wrongAnswers }}
            </span>
          </div>
          @if (timeLimit) {
          <app-timer
            [timeLimit]="timeLimit"
            (timeUp)="handleTimeUp()"
            (timeUpdate)="updateElapsedTime($event)"
            #timer
          ></app-timer>
          } @else {
          <app-timer
            (timeUpdate)="updateElapsedTime($event)"
            #timer
          ></app-timer>
          }
        </div>

        <div class="text-center order-1 md:order-2 w-full md:w-auto">
          <div class="text-sm text-gray-600 dark:text-gray-400 mb-1">
            Question {{ currentQuestionIndex + 1 }} of {{ questions.length }}
          </div>
          <div
            class="w-full md:w-48 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden"
          >
            <div
              class="h-full bg-gradient-to-r from-indigo-600 to-pink-600 transition-all duration-300"
              [style.width.%]="(currentQuestionIndex / questions.length) * 100"
            ></div>
          </div>
        </div>
      </div>

      @if (currentQuestion && !quizCompleted) {
      <!-- Question card -->
      <div
        class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8 mb-8 max-w-2xl mx-auto"
      >
        <div class="text-center mb-8">
          <div
            class="text-8xl md:text-9xl mb-4 font-japanese animate-character"
          >
            {{ currentQuestion.character }}
          </div>
          <div class="text-sm text-gray-600 dark:text-gray-400">
            {{ currentQuestion.type === 'hiragana' ? 'Hiragana' : 'Katakana' }}
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3">
          @for (option of currentQuestion.options; track $index) {
          <button
            (click)="checkAnswer(option)"
            [disabled]="answerSelected"
            [class]="getOptionClass(option)"
          >
            {{ option }}
            @if (answerSelected && option === currentQuestion.romaji) {
            <mat-icon class="ml-1 text-green-600 dark:text-green-400"
              >check</mat-icon
            >
            } @else if (answerSelected && option === selectedAnswer && option
            !== currentQuestion.romaji) {
            <mat-icon class="ml-1 text-red-600 dark:text-red-400"
              >close</mat-icon
            >
            }
          </button>
          }
        </div>

        @if (answerSelected) {
        <div class="mt-6 text-center">
          <button
            (click)="nextQuestion()"
            class="bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-700 hover:to-pink-700 text-white px-6 py-2 rounded-full transition-colors"
          >
            Next Question
          </button>
        </div>
        }
      </div>
      } @if (timeIsUp && !quizCompleted) {
      <!-- Time's up overlay -->
      <div
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-10"
      >
        <div
          class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8 max-w-md mx-auto text-center"
        >
          <div class="text-amber-500 mb-4">
            <mat-icon
              style="font-size: 64px; width: 64px; height: 64px;"
              class="mx-auto"
              >warning</mat-icon
            >
          </div>
          <h2 class="text-2xl font-bold mb-4">Time's Up!</h2>
          <p class="mb-6">You've run out of time for this quiz.</p>
          <div class="flex flex-col md:flex-row gap-4 justify-center">
            <button
              (click)="finishQuiz()"
              class="bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-700 hover:to-pink-700 text-white px-6 py-2 rounded-full transition-colors"
            >
              See Results
            </button>
          </div>
        </div>
      </div>
      } @if (quizCompleted) {
      <!-- Results card -->
      <div
        class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8 mb-8 max-w-2xl mx-auto"
      >
        <div class="text-center mb-8">
          <h2
            class="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-600 dark:from-indigo-400 dark:to-pink-400 mb-4"
          >
            Quiz Completed!
          </h2>

          <div class="text-5xl font-bold mb-2">
            {{ correctAnswers }} / {{ questions.length }}
          </div>
          <div
            class="text-lg font-normal text-gray-600 dark:text-gray-400 mb-4"
          >
            {{ Math.round((correctAnswers / questions.length) * 100) }}% Correct
          </div>

          <div class="flex justify-center gap-4 mb-6">
            <div class="bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg">
              <div class="text-sm text-gray-500 dark:text-gray-400">Time</div>
              <div class="font-medium">{{ formatTime(elapsedTime) }}</div>
            </div>

            <div class="bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg">
              <div class="text-sm text-gray-500 dark:text-gray-400">
                Avg. Time/Question
              </div>
              <div class="font-medium">
                {{ formatTime(elapsedTime / questions.length) }}
              </div>
            </div>
          </div>
        </div>

        @if (isHighScore) {
        <div
          class="bg-yellow-100 dark:bg-yellow-900 p-4 rounded-lg text-center mb-6 animate-pulse"
        >
          <div class="text-yellow-600 dark:text-yellow-400 font-bold text-lg">
            New High Score! 🎉
          </div>
        </div>
        }

        <div class="flex flex-col md:flex-row gap-4 justify-center mt-8">
          <a
            routerLink="/options"
            class="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-bold py-3 px-6 rounded-full text-lg transition-transform hover:scale-105 flex items-center justify-center gap-2"
          >
            <mat-icon>settings</mat-icon>
            Change Options
          </a>

          <button
            (click)="restartQuiz()"
            class="bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-700 hover:to-pink-700 text-white font-bold py-3 px-6 rounded-full text-lg transition-transform hover:scale-105 flex items-center justify-center gap-2"
          >
            <mat-icon>refresh</mat-icon>
            Try Again
          </button>

          <a
            routerLink="/stats"
            class="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-full text-lg transition-transform hover:scale-105 flex items-center justify-center gap-2"
          >
            <mat-icon>bar_chart</mat-icon>
            View Stats
          </a>
        </div>
      </div>
      }
    </div>
  `,
  styles: [
    `
      .font-japanese {
        font-family: 'Noto Sans JP', sans-serif;
      }

      .animate-character {
        animation: fadeInScale 0.5s ease-out;
      }

      .animate-pulse {
        animation: pulse 2s infinite;
      }

      @keyframes fadeInScale {
        0% {
          transform: scale(0.9);
          opacity: 0;
        }
        100% {
          transform: scale(1);
          opacity: 1;
        }
      }

      @keyframes pulse {
        0%,
        100% {
          opacity: 1;
        }
        50% {
          opacity: 0.7;
        }
      }
    `,
  ],
})
export class QuizComponent implements OnInit {
  @ViewChild('timer') timerComponent!: TimerComponent;

  questions: QuizQuestion[] = [];
  currentQuestionIndex = 0;
  currentQuestion: QuizQuestion | null = null;
  answerSelected = false;
  selectedAnswer = '';
  correctAnswers = 0;
  wrongAnswers = 0;
  quizCompleted = false;
  timeIsUp = false;
  isHighScore = false;
  timeLimit: number | null = null;
  elapsedTime = 0;
  Math = Math;

  constructor(private quizService: QuizService) {}

  ngOnInit() {
    // Load quiz options to get time limit
    const options = this.quizService.getOptions();
    if (options) {
      this.timeLimit = options.options.timeLimit;
    }

    this.initializeQuiz();
  }

  initializeQuiz() {
    this.questions = this.quizService.generateQuiz();
    this.currentQuestionIndex = 0;
    this.correctAnswers = 0;
    this.wrongAnswers = 0;
    this.quizCompleted = false;
    this.timeIsUp = false;
    this.answerSelected = false;
    this.selectedAnswer = '';
    this.elapsedTime = 0;
    this.isHighScore = false;

    if (this.questions.length > 0) {
      this.currentQuestion = this.questions[0];
    } else {
      // No questions available based on options
      this.quizCompleted = true;
    }

    // Reset timer if it exists
    if (this.timerComponent) {
      this.timerComponent.resetTimer();
      this.timerComponent.startTimer();
    }
  }

  checkAnswer(answer: string) {
    this.answerSelected = true;
    this.selectedAnswer = answer;

    if (answer === this.currentQuestion?.romaji) {
      this.correctAnswers++;
    } else {
      this.wrongAnswers++;
    }
  }

  nextQuestion() {
    this.answerSelected = false;
    this.selectedAnswer = '';
    this.currentQuestionIndex++;

    if (this.currentQuestionIndex < this.questions.length) {
      this.currentQuestion = this.questions[this.currentQuestionIndex];
    } else {
      this.finishQuiz();
    }
  }

  finishQuiz() {
    this.quizCompleted = true;
    this.timeIsUp = false;

    // Stop the timer
    if (this.timerComponent) {
      this.timerComponent.stopTimer();
    }

    // Get saved options
    const savedOptions = this.quizService.getOptions();

    // Save progress to local storage
    const progress = {
      date: new Date(),
      totalQuestions: this.questions.length,
      correctAnswers: this.correctAnswers,
      timeSpent: this.elapsedTime,
      options: savedOptions || this.quizService.getDefaultOptions(),
    };

    this.quizService.saveProgress(progress);

    // Check if this is a high score
    const highScores = this.quizService.getHighScores();
    if (highScores.length > 0) {
      const scorePercentage =
        (this.correctAnswers / this.questions.length) * 100;
      const lowestHighScore = highScores[highScores.length - 1];
      const lowestPercentage =
        (lowestHighScore.correctAnswers / lowestHighScore.totalQuestions) * 100;

      if (highScores.length < 10 || scorePercentage > lowestPercentage) {
        this.isHighScore = true;
      }
    } else {
      // First score is automatically a high score
      this.isHighScore = true;
    }
  }

  handleTimeUp() {
    this.timeIsUp = true;
  }

  updateElapsedTime(time: number) {
    this.elapsedTime = time;
  }

  restartQuiz() {
    this.initializeQuiz();
  }

  getOptionClass(option: string) {
    const baseClass =
      'py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center';

    if (!this.answerSelected) {
      return `${baseClass} bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600`;
    }

    if (option === this.currentQuestion?.romaji) {
      return `${baseClass} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100`;
    }

    if (
      option === this.selectedAnswer &&
      option !== this.currentQuestion?.romaji
    ) {
      return `${baseClass} bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100`;
    }

    return `${baseClass} bg-gray-100 dark:bg-gray-700 opacity-70`;
  }

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
}

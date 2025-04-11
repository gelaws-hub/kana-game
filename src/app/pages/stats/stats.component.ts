import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterLink } from "@angular/router"
import { MatIconModule } from "@angular/material/icon"
import { QuizService, QuizProgress } from "../../services/quiz.service"
import { ThemeToggleComponent } from "../../components/theme-toggle.component"

@Component({
  selector: "app-stats",
  standalone: true,
  imports: [CommonModule, RouterLink, ThemeToggleComponent, MatIconModule],
  template: `
    <div class="container mx-auto px-4 py-8 max-w-4xl text-gray-500 dark:text-gray-400">
      <header class="flex justify-between items-center mb-6">
        <div class="flex items-center gap-2">
          <a routerLink="/" class="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
            <mat-icon class="text-gray-700 dark:text-gray-200">home</mat-icon>
          </a>
          <a routerLink="/options" class="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
            <mat-icon class="text-gray-700 dark:text-gray-200">settings</mat-icon>
          </a>
        </div>
        
        <app-theme-toggle></app-theme-toggle>
      </header>

      <div class="text-center mb-8">
        <h1 class="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-600 dark:from-indigo-400 dark:to-pink-400 mb-2">
          Your Progress
        </h1>
        <p class="text-gray-700 dark:text-gray-200">
          Track your learning journey
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <!-- High Scores -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div class="flex items-center mb-4">
            <div class="p-2 rounded-full bg-indigo-100 dark:bg-indigo-900 mr-3">
              <mat-icon class="text-indigo-600 dark:text-indigo-400">bar_chart</mat-icon>
            </div>
            <h2 class="text-xl font-bold text-indigo-600 dark:text-indigo-400">High Scores</h2>
          </div>
          
          @if (highScores.length === 0) {
            <div class="text-center py-8 text-gray-500 dark:text-gray-400">
              No high scores yet. Complete a quiz to see your scores here!
            </div>
          } @else {
            <div class="overflow-hidden rounded-lg border dark:border-gray-700">
              <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead class="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Rank</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Score</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Time</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  @for (score of highScores; track $index) {
                    <tr>
                      <td class="px-4 py-3 whitespace-nowrap">
                        <div class="text-sm font-medium">{{ $index + 1 }}</div>
                      </td>
                      <td class="px-4 py-3 whitespace-nowrap">
                        <div class="text-sm">{{ score.correctAnswers }}/{{ score.totalQuestions }} ({{ calculatePercentage(score) }}%)</div>
                      </td>
                      <td class="px-4 py-3 whitespace-nowrap">
                        <div class="text-sm">{{ formatTime(score.timeSpent) }}</div>
                      </td>
                      <td class="px-4 py-3 whitespace-nowrap">
                        <div class="text-sm">{{ formatDate(score.date) }}</div>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          }
        </div>

        <!-- Recent Activity -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div class="flex items-center mb-4">
            <div class="p-2 rounded-full bg-pink-100 dark:bg-pink-900 mr-3">
              <mat-icon class="text-pink-600 dark:text-pink-400">calendar_today</mat-icon>
            </div>
            <h2 class="text-xl font-bold text-pink-600 dark:text-pink-400">Recent Activity</h2>
          </div>
          
          @if (recentActivity.length === 0) {
            <div class="text-center py-8 text-gray-500 dark:text-gray-400">
              No recent activity. Start a quiz to track your progress!
            </div>
          } @else {
            <div class="space-y-4">
              @for (activity of recentActivity; track $index) {
                <div class="border dark:border-gray-700 rounded-lg p-4">
                  <div class="flex justify-between items-start mb-2">
                    <div class="font-medium">{{ formatDate(activity.date) }}</div>
                    <div class="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                      <mat-icon class="mr-1 text-sm">timer</mat-icon>
                      {{ formatTime(activity.timeSpent) }}
                    </div>
                  </div>
                  <div class="flex items-center justify-between">
                    <div>
                      <div class="text-sm text-gray-600 dark:text-gray-400">Score</div>
                      <div class="font-medium">{{ activity.correctAnswers }}/{{ activity.totalQuestions }}</div>
                    </div>
                    <div class="text-right">
                      <div class="text-sm text-gray-600 dark:text-gray-400">Accuracy</div>
                      <div class="font-medium">{{ calculatePercentage(activity) }}%</div>
                    </div>
                  </div>
                </div>
              }
            </div>
          }
        </div>
      </div>

      <div class="flex justify-center">
        <a 
          routerLink="/quiz" 
          class="bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-700 hover:to-pink-700 text-white font-bold py-3 px-6 rounded-full text-lg transition-transform hover:scale-105 flex items-center justify-center"
        >
          Start New Quiz
        </a>
      </div>
    </div>
  `,
})
export class StatsComponent implements OnInit {
  highScores: QuizProgress[] = []
  recentActivity: QuizProgress[] = []

  constructor(private quizService: QuizService) {}

  ngOnInit(): void {
    this.loadStats()
  }

  loadStats(): void {
    this.highScores = this.quizService.getHighScores()

    // Get recent activity (last 5 quizzes)
    const allProgress = this.quizService.getProgress()
    this.recentActivity = allProgress
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5)
  }

  calculatePercentage(progress: QuizProgress): number {
    return Math.round((progress.correctAnswers / progress.totalQuestions) * 100)
  }

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  formatDate(date: Date | string): string {
    const d = new Date(date)
    return d.toLocaleDateString()
  }
}

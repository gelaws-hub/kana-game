import { Component } from "@angular/core"
import { RouterLink } from "@angular/router"
import { CommonModule } from "@angular/common"
import { MatIconModule } from "@angular/material/icon"
import { ThemeToggleComponent } from "../../components/theme-toggle.component"
import { FooterComponent } from "../../components/footer.component"

@Component({
  selector: "app-landing",
  standalone: true,
  imports: [CommonModule, RouterLink, ThemeToggleComponent, MatIconModule, FooterComponent],
  template: `
    <div class="container mx-auto px-4 py-8 max-w-4xl">
      <header class="flex justify-between mb-4">
        <div class="flex items-center gap-2">
          <a routerLink="/stats" class="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700" aria-label="View Stats">
            <mat-icon class="text-gray-700 dark:text-gray-300">bar_chart</mat-icon>
          </a>
          <a routerLink="/chart" class="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700" aria-label="View Kana Chart">
            <mat-icon class="text-gray-700 dark:text-gray-300">grid_view</mat-icon>
          </a>
        </div>
        <app-theme-toggle></app-theme-toggle>
      </header>

      <div class="text-center mb-12 animate-fade-in">
        <h1 class="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-600 dark:from-indigo-400 dark:to-pink-400 mb-4">
          ひらがな & カタカナ Quiz
        </h1>
        <p class="text-xl text-gray-700 dark:text-gray-300">
          Test your Japanese character knowledge in a fun way!
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8 animate-slide-up hover:shadow-xl transition-shadow">
          <div class="flex items-center mb-4">
            <div class="icon-circle bg-indigo-100 dark:bg-indigo-900 mr-4 flex items-center justify-center">
              <mat-icon class="text-indigo-600 dark:text-indigo-200">menu_book</mat-icon>
            </div>
            <h2 class="text-2xl font-bold text-indigo-600 dark:text-indigo-200">How to Play</h2>
          </div>
          
          <div class="space-y-4 text-gray-700 dark:text-gray-300">
            <div class="flex items-start">
              <div class="number-circle bg-indigo-100 dark:bg-indigo-900 mr-4 text-indigo-600 dark:text-indigo-200 flex items-center justify-center">
                <span>1</span>
              </div>
              <p>A Japanese character will be displayed on the screen.</p>
            </div>
            
            <div class="flex items-start">
              <div class="number-circle bg-indigo-100 dark:bg-indigo-900 mr-4 text-indigo-600 dark:text-indigo-200 flex items-center justify-center">
                <span>2</span>
              </div>
              <p>Choose the correct romanized reading from the four options provided.</p>
            </div>
            
            <div class="flex items-start">
              <div class="number-circle bg-indigo-100 dark:bg-indigo-900 mr-4 text-indigo-600 dark:text-indigo-200 flex items-center justify-center">
                <span>3</span>
              </div>
              <p>Get immediate feedback on your answer and track your progress!</p>
            </div>
            
            <div class="flex items-start">
              <div class="number-circle bg-indigo-100 dark:bg-indigo-900 mr-4 text-indigo-600 dark:text-indigo-200 flex items-center justify-center">
                <span>4</span>
              </div>
              <p>Customize your quiz in the options to focus on specific characters.</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8 animate-slide-up hover:shadow-xl transition-shadow">
          <div class="flex items-center mb-4">
            <div class="icon-circle bg-pink-100 dark:bg-pink-900 mr-4 flex items-center justify-center">
              <mat-icon class="text-pink-600 dark:text-pink-200">emoji_events</mat-icon>
            </div>
            <h2 class="text-2xl font-bold text-pink-600 dark:text-pink-200">Features</h2>
          </div>
          
          <div class="space-y-4 text-gray-700 dark:text-gray-300">
            <div class="flex items-start">
              <div class="check-circle bg-pink-100 dark:bg-pink-900 mr-4 text-pink-600 dark:text-pink-200 flex items-center justify-center">
                <span>✓</span>
              </div>
              <p>Complete hiragana and katakana sets including dakuten and combination characters.</p>
            </div>
            
            <div class="flex items-start">
              <div class="check-circle bg-pink-100 dark:bg-pink-900 mr-4 text-pink-600 dark:text-pink-200 flex items-center justify-center">
                <span>✓</span>
              </div>
              <p>Customizable quiz options to focus on specific character groups.</p>
            </div>
            
            <div class="flex items-start">
              <div class="check-circle bg-pink-100 dark:bg-pink-900 mr-4 text-pink-600 dark:text-pink-200 flex items-center justify-center">
                <span>✓</span>
              </div>
              <p>Track your progress and compete with your previous high scores.</p>
            </div>
            
            <div class="flex items-start">
              <div class="check-circle bg-pink-100 dark:bg-pink-900 mr-4 text-pink-600 dark:text-pink-200 flex items-center justify-center">
                <span>✓</span>
              </div>
              <p>Timed quizzes to challenge yourself and improve your speed.</p>
            </div>
          </div>
        </div>
      </div>

      <div class="flex flex-col md:flex-row gap-4 justify-center animate-bounce-in">
        <a 
          routerLink="/options" 
          class="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 dark:from-indigo-500 dark:to-indigo-600 dark:hover:from-indigo-600 dark:hover:to-indigo-700 text-white font-bold py-3 px-6 rounded-full text-lg transition-transform hover:scale-105 flex items-center justify-center"
        >
          <mat-icon class="mr-2">settings</mat-icon>
          Customize Quiz
        </a>
        
        <a 
          routerLink="/quiz" 
          class="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 dark:from-pink-400 dark:to-pink-500 dark:hover:from-pink-500 dark:hover:to-pink-600 text-white font-bold py-3 px-6 rounded-full text-lg transition-transform hover:scale-105 flex items-center justify-center"
        >
          <mat-icon class="mr-2">play_arrow</mat-icon>
          Start Quiz Now
        </a>
        
        <a 
          routerLink="/chart" 
          class="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 dark:from-teal-400 dark:to-teal-500 dark:hover:from-teal-500 dark:hover:to-teal-600 text-white font-bold py-3 px-6 rounded-full text-lg transition-transform hover:scale-105 flex items-center justify-center"
        >
          <mat-icon class="mr-2">grid_view</mat-icon>
          Kana Chart
        </a>
      </div>
      <app-footer class="mt-12"></app-footer>
    </div>
  `,
  styles: [
    `
    .animate-fade-in {
      animation: fadeIn 0.8s ease-in-out;
    }
    
    .animate-slide-up {
      animation: slideUp 0.6s ease-out;
    }
    
    .animate-bounce-in {
      animation: bounceIn 0.8s ease-out;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @keyframes slideUp {
      from { transform: translateY(20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    
    @keyframes bounceIn {
      0% { transform: scale(0.8); opacity: 0; }
      70% { transform: scale(1.05); opacity: 1; }
      100% { transform: scale(1); opacity: 1; }
    }
  `,
  ],
})
export class LandingComponent {}

import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { RouterLink } from "@angular/router"
import { MatIconModule } from "@angular/material/icon"
import { QuizService, CharacterGroup, SavedOptions } from "../../services/quiz.service"
import { ThemeToggleComponent } from "../../components/theme-toggle.component"

@Component({
  selector: "app-options",
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ThemeToggleComponent, MatIconModule],
  template: `
    <div class="container mx-auto px-4 py-8 max-w-4xl text-gray-500 dark:text-gray-400">
      <header class="flex justify-between items-center mb-6">
        <a routerLink="/" class="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
          <mat-icon class="text-gray-700 dark:text-white">home</mat-icon>
        </a>
        <app-theme-toggle></app-theme-toggle>
      </header>

      <div class="text-center mb-8">
        <h1 class="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-600 dark:from-indigo-400 dark:to-pink-400 mb-2">
          Quiz Options
        </h1>
        <p class="text-gray-700 dark:text-gray-300">
          Customize your learning experience
        </p>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8 mb-8">
        <div class="mb-8">
          <h2 class="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">Character Sets</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="border dark:border-gray-700 rounded-lg p-4">
              <h3 class="font-bold mb-2 flex items-center">
                <input 
                  type="checkbox" 
                  [(ngModel)]="options.includeHiragana"
                  class="mr-2 h-5 w-5 accent-indigo-600"
                >
                <span>Hiragana (ひらがな)</span>
              </h3>
              
              <div class="grid grid-cols-2 gap-2 mt-4">
                @for (group of hiraganaGroups; track $index) {
                  <div class="flex items-center">
                    <input 
                      type="checkbox" 
                      [id]="'hiragana-' + $index"
                      [(ngModel)]="group.selected"
                      [disabled]="!options.includeHiragana"
                      class="mr-2 accent-indigo-600 cursor-pointer"
                    >
                    <label [for]="'hiragana-' + $index" class="text-sm">{{ group.name }}</label>
                  </div>
                }
              </div>
            </div>
            
            <div class="border dark:border-gray-700 rounded-lg p-4">
              <h3 class="font-bold mb-2 flex items-center">
                <input 
                  type="checkbox" 
                  [(ngModel)]="options.includeKatakana"
                  class="mr-2 h-5 w-5 accent-indigo-600"
                >
                <span>Katakana (カタカナ)</span>
              </h3>
              
              <div class="grid grid-cols-2 gap-2 mt-4">
                @for (group of katakanaGroups; track $index) {
                  <div class="flex items-center">
                    <input 
                      type="checkbox" 
                      [id]="'katakana-' + $index"
                      [(ngModel)]="group.selected"
                      [disabled]="!options.includeKatakana"
                      class="mr-2 accent-indigo-600 cursor-pointer"
                    >
                    <label [for]="'katakana-' + $index" class="text-sm">{{ group.name }}</label>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
        
        <div class="mb-8">
          <h2 class="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">Quiz Settings</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block mb-2 font-medium">Number of Questions</label>
              <div class="flex items-center">
                <input 
                  type="range" 
                  [(ngModel)]="options.questionCount" 
                  min="5" 
                  max="50" 
                  step="5"
                  class="w-full accent-indigo-600"
                >
                <span class="ml-4 w-12 text-center">{{ options.questionCount }}</span>
              </div>
            </div>
            
            <div>
              <label class="block mb-2 font-medium">Character Repetition</label>
              <div class="flex items-center">
                <input 
                  type="range" 
                  [(ngModel)]="options.repetitionCount" 
                  min="1" 
                  max="5" 
                  step="1"
                  class="w-full accent-indigo-600"
                >
                <span class="ml-4 w-12 text-center">{{ options.repetitionCount }}x</span>
              </div>
            </div>
          </div>
        </div>

        <div class="mb-8">
          <h2 class="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">Time Settings</h2>
          
          <div class="flex items-center mb-4">
            <input 
              type="checkbox" 
              id="enableTimeLimit"
              [(ngModel)]="timeLimitEnabled"
              class="mr-2 accent-indigo-600"
            >
            <label for="enableTimeLimit" class="font-medium flex items-center">
              <mat-icon class="mr-2 text-indigo-600 dark:text-indigo-400">timer</mat-icon>
              Enable Time Limit
            </label>
          </div>
          
          <div *ngIf="timeLimitEnabled" class="mt-4">
            <label class="block mb-2 font-medium">Time Limit (seconds)</label>
            <div class="flex items-center">
              <input 
                type="range" 
                [(ngModel)]="selectedTimeLimit" 
                min="30" 
                max="300" 
                step="30"
                class="w-full accent-indigo-600"
              >
              <span class="ml-4 w-16 text-center">{{ selectedTimeLimit }}s</span>
            </div>
          </div>
        </div>
        
        <div class="flex justify-between">
          <button 
            (click)="resetToDefaults()" 
            class="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 px-4 py-2 rounded-lg transition-colors flex items-center"
          >
            <mat-icon class="mr-2">refresh</mat-icon>
            Reset to Defaults
          </button>
          
          <div class="flex gap-3">
            <a 
              routerLink="/" 
              class="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 px-4 py-2 rounded-lg transition-colors"
            >
              Back
            </a>
            
            <button 
              (click)="saveOptions()" 
              class="bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-700 hover:to-pink-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
            >
              <mat-icon class="mr-2">save</mat-icon>
              Save & Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class OptionsComponent implements OnInit {
  options = {
    includeHiragana: true,
    includeKatakana: true,
    questionCount: 20,
    repetitionCount: 2,
    timeLimit: null as number | null,
  }

  hiraganaGroups: CharacterGroup[] = []
  katakanaGroups: CharacterGroup[] = []
  timeLimitEnabled = false
  selectedTimeLimit = 120

  constructor(private quizService: QuizService) {}

  ngOnInit() {
    // Load saved options if they exist
    const savedOptions = this.quizService.getOptions()
    if (savedOptions) {
      this.options = savedOptions.options
      this.hiraganaGroups = savedOptions.hiraganaGroups
      this.katakanaGroups = savedOptions.katakanaGroups
      this.timeLimitEnabled = this.options.timeLimit !== null
      if (this.options.timeLimit !== null) {
        this.selectedTimeLimit = this.options.timeLimit
      }
    } else {
      // Use default groups
      this.hiraganaGroups = this.quizService.getDefaultHiraganaGroups()
      this.katakanaGroups = this.quizService.getDefaultKatakanaGroups()
    }
  }

  saveOptions() {
    // Update time limit based on checkbox
    this.options.timeLimit = this.timeLimitEnabled ? this.selectedTimeLimit : null

    const optionsToSave: SavedOptions = {
      options: this.options,
      hiraganaGroups: this.hiraganaGroups,
      katakanaGroups: this.katakanaGroups,
    }

    this.quizService.saveOptions(optionsToSave)

    // Navigate to quiz page
    window.location.href = "/quiz"
  }

  resetToDefaults() {
    const defaults = this.quizService.getDefaultOptions()
    this.options = defaults.options
    this.hiraganaGroups = defaults.hiraganaGroups
    this.katakanaGroups = defaults.katakanaGroups
    this.timeLimitEnabled = false
    this.selectedTimeLimit = 120
  }
}

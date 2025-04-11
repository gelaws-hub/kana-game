import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterLink } from "@angular/router"
import { MatIconModule } from "@angular/material/icon"
import { ThemeToggleComponent } from "../../components/theme-toggle.component"
import { KanaChartComponent } from "../../components/kana-chart.component"

@Component({
  selector: "app-chart",
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule, ThemeToggleComponent, KanaChartComponent],
  template: `
    <div class="container mx-auto px-4 py-8 text-gray-600">
      <header class="flex justify-between items-center mb-6">
        <div class="flex items-center gap-2">
          <a routerLink="/" class="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
            <mat-icon class="text-gray-700 dark:text-gray-300">home</mat-icon>
          </a>
          <a routerLink="/options" class="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
            <mat-icon class="text-gray-700 dark:text-gray-300">settings</mat-icon>
          </a>
        </div>
        
        <app-theme-toggle></app-theme-toggle>
      </header>

      <div class="text-center mb-8">
        <h1 class="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-600 dark:from-indigo-400 dark:to-pink-400 mb-2">
          Kana Reference Chart
        </h1>
        <p class="text-gray-700 dark:text-gray-300">
          Complete reference for Hiragana and Katakana characters
        </p>
      </div>

      <app-kana-chart></app-kana-chart>
    </div>
  `
})
export class ChartComponent {}

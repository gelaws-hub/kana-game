import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { MatIconModule } from "@angular/material/icon"
import { ThemeService } from "../services/theme.service"

@Component({
  selector: "app-theme-toggle",
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <button 
      (click)="toggleTheme()" 
      class="p-2 rounded-full transition-colors hover:bg-gray-200 dark:hover:bg-gray-700"
      aria-label="Toggle theme"
    >
      <mat-icon *ngIf="isDarkMode" class="text-yellow-400">light_mode</mat-icon>
      <mat-icon *ngIf="!isDarkMode" class="text-indigo-600">dark_mode</mat-icon>
    </button>
  `,
})
export class ThemeToggleComponent implements OnInit {
  isDarkMode = false

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    this.themeService.theme$.subscribe((theme) => {
      this.isDarkMode = theme === "dark"
    })
  }

  toggleTheme(): void {
    this.themeService.toggleTheme()
  }
}

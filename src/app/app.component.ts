import { Component, type OnInit } from "@angular/core"
import { RouterOutlet } from "@angular/router"
import { CommonModule } from "@angular/common"
import { ThemeService } from "./services/theme.service"
import { BackgroundAnimationComponent } from "./components/background-animation.component"

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, CommonModule, BackgroundAnimationComponent],
  template: `
    <div class="relative min-h-screen">
      <!-- Background gradient layer -->
      <div class="absolute inset-0 z-0 bg-gradient-to-b from-indigo-50/90 to-pink-50/90 dark:from-indigo-950/80 dark:to-pink-950/80"></div>
      
      <!-- Animation layer -->
      <app-background-animation class="absolute inset-0 z-10"></app-background-animation>

      <!-- Main content -->
      <main class="relative z-20 min-h-screen transition-colors duration-300">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
})
export class AppComponent implements OnInit {
  constructor(private themeService: ThemeService) {}
  title = 'kana-game';

  ngOnInit() {
    this.themeService.initTheme()
  }
}

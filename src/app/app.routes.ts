import type { Routes } from "@angular/router"

export const routes: Routes = [
  {
    path: "",
    loadComponent: () => import("./pages/landing/landing.component").then((m) => m.LandingComponent),
  },
  {
    path: "options",
    loadComponent: () => import("./pages/options/options.component").then((m) => m.OptionsComponent),
  },
  {
    path: "quiz",
    loadComponent: () => import("./pages/quiz/quiz.component").then((m) => m.QuizComponent),
  },
  {
    path: "stats",
    loadComponent: () => import("./pages/stats/stats.component").then((m) => m.StatsComponent),
  },
  {
    path: "chart",
    loadComponent: () => import("./pages/chart/chart.component").then((m) => m.ChartComponent),
  },
  {
    path: "**",
    redirectTo: "",
  },
]

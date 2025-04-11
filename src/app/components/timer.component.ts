import { Component, Input, Output, EventEmitter, type OnInit, type OnDestroy } from "@angular/core"
import { CommonModule } from "@angular/common"
import { MatIconModule } from "@angular/material/icon"

@Component({
  selector: "app-timer",
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="flex items-center gap-2 text-gray-700 dark:text-gray-300">
      <mat-icon class="text-indigo-600 dark:text-indigo-400">timer</mat-icon>
      <span class="font-mono">{{ formattedTime }}</span>
    </div>
  `,
})
export class TimerComponent implements OnInit, OnDestroy {
  @Input() timeLimit: number | null = null // in seconds, null means no limit
  @Input() autoStart = true
  @Output() timeUp = new EventEmitter<void>()
  @Output() timeUpdate = new EventEmitter<number>()

  private intervalId: any
  private elapsedTime = 0
  formattedTime = "00:00"

  ngOnInit(): void {
    if (this.autoStart) {
      this.startTimer()
    }
  }

  ngOnDestroy(): void {
    this.stopTimer()
  }

  startTimer(): void {
    this.intervalId = setInterval(() => {
      this.elapsedTime++
      this.updateFormattedTime()
      this.timeUpdate.emit(this.elapsedTime)

      if (this.timeLimit && this.elapsedTime >= this.timeLimit) {
        this.timeUp.emit()
        this.stopTimer()
      }
    }, 1000)
  }

  stopTimer(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId)
    }
  }

  resetTimer(): void {
    this.stopTimer()
    this.elapsedTime = 0
    this.updateFormattedTime()
  }

  getElapsedTime(): number {
    return this.elapsedTime
  }

  private updateFormattedTime(): void {
    const minutes = Math.floor(this.elapsedTime / 60)
    const seconds = this.elapsedTime % 60
    this.formattedTime = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }
}

import { Component, type ElementRef, ViewChild, type AfterViewInit, type OnDestroy } from "@angular/core"
import { CommonModule } from "@angular/common"
import { ThemeService } from "../services/theme.service"
import type { Subscription } from "rxjs"

@Component({
  selector: "app-background-animation",
  standalone: true,
  imports: [CommonModule],
  template: `
    <canvas #canvas class="fixed top-0 left-0 w-full h-full -z-10"></canvas>
  `,
  styles: [
    `
    canvas {
      pointer-events: none;
    }
  `,
  ],
})
export class BackgroundAnimationComponent implements AfterViewInit, OnDestroy {
  @ViewChild("canvas") canvasRef!: ElementRef<HTMLCanvasElement>
  private ctx!: CanvasRenderingContext2D
  private animationId = 0
  private particles: Particle[] = []
  private isDarkMode = false
  private themeSubscription!: Subscription

  constructor(private themeService: ThemeService) {}

  ngAfterViewInit(): void {
    this.initCanvas()
    this.themeSubscription = this.themeService.theme$.subscribe((theme) => {
      this.isDarkMode = theme === "dark"
    })
    this.animate()
    window.addEventListener("resize", this.handleResize)
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.animationId)
    this.themeSubscription.unsubscribe()
    window.removeEventListener("resize", this.handleResize)
  }

  private initCanvas(): void {
    const canvas = this.canvasRef.nativeElement
    this.ctx = canvas.getContext("2d")!
    this.resizeCanvas()
    this.createParticles()
  }

  private handleResize = (): void => {
    this.resizeCanvas()
    this.createParticles()
  }

  private resizeCanvas(): void {
    const canvas = this.canvasRef.nativeElement
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }

  private createParticles(): void {
    this.particles = []
    const particleCount = Math.min(Math.floor(window.innerWidth / 20), 100)

    for (let i = 0; i < particleCount; i++) {
      this.particles.push(
        new Particle(
          Math.random() * window.innerWidth,
          Math.random() * window.innerHeight,
          Math.random() * 2 + 1,
          this.getRandomColor(),
          Math.random() * 0.5 + 0.1,
        ),
      )
    }
  }

  private getRandomColor(): string {
    const colors = this.isDarkMode
      ? ["#9c5fff", "#ff5f9c", "#5f9cff", "#5fffb8"]
      : ["#6366f1", "#ec4899", "#8b5cf6", "#06b6d4"]
    return colors[Math.floor(Math.random() * colors.length)]
  }

  private animate = (): void => {
    this.animationId = requestAnimationFrame(this.animate)
    this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)

    this.particles.forEach((particle) => {
      particle.update()
      particle.draw(this.ctx)
    })

    this.connectParticles()
  }

  private connectParticles(): void {
    const maxDistance = 150

    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x
        const dy = this.particles[i].y - this.particles[j].y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < maxDistance) {
          const opacity = 1 - distance / maxDistance
          const backgroundColor = this.isDarkMode ? "255, 255, 255" : "99, 102, 241"
          this.ctx.strokeStyle = `rgba(${backgroundColor}, ${opacity * 0.2})`
          this.ctx.lineWidth = 1
          this.ctx.beginPath()
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y)
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y)
          this.ctx.stroke()
        }
      }
    }
  }
}

class Particle {
  private vx: number
  private vy: number

  constructor(
    public x: number,
    public y: number,
    public size: number,
    public color: string,
    public speed: number,
  ) {
    this.vx = (Math.random() - 0.5) * this.speed
    this.vy = (Math.random() - 0.5) * this.speed
  }

  update(): void {
    this.x += this.vx
    this.y += this.vy

    if (this.x < 0 || this.x > window.innerWidth) {
      this.vx = -this.vx
    }

    if (this.y < 0 || this.y > window.innerHeight) {
      this.vy = -this.vy
    }
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    ctx.fillStyle = this.color
    ctx.fill()
  }
}

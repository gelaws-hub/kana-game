import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private renderer: Renderer2;
  private colorTheme = new BehaviorSubject<string>(this.getCurrentTheme());

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.initTheme();
  }

  private getCurrentTheme(): string {
    const theme = localStorage.getItem('theme');
    if (theme) {
      return theme;
    }
    
    // Check user preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  initTheme(): void {
    const theme = this.getCurrentTheme();
    this.setTheme(theme);
    this.colorTheme.next(theme);
  }

  get theme$() {
    return this.colorTheme.asObservable();
  }

  get isDarkMode() {
    return this.colorTheme.value === 'dark';
  }

  setTheme(theme: string): void {
    localStorage.setItem('theme', theme);
    this.colorTheme.next(theme);
    
    if (theme === 'dark') {
      this.renderer.addClass(document.documentElement, 'dark');
    } else {
      this.renderer.removeClass(document.documentElement, 'dark');
    }
  }

  toggleTheme(): void {
    const newTheme = this.colorTheme.value === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }
}

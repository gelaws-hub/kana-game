import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer
      class="text-sm text-center text-gray-600 dark:text-gray-400 mt-12 py-8 px-4"
    >
      <div class="max-w-4xl mx-auto space-y-2">
        <p>
          Practice your <strong>hiragana</strong> and
          <strong>katakana</strong> skills with our fun and interactive
          <strong>Japanese kana quiz game</strong>. Boost your memory, speed,
          and reading accuracy today!
        </p>
        <p>
          Your data is saved locally, so you can pick up right where you left
          off. No internet connection required!
        </p>
        <p>
          Ideal for learners of all levels, our kana game covers full
          <strong>dakuten</strong>, <strong>yōon</strong>, and more.
        </p>
        <p>
          Start mastering <strong>Japanese characters</strong> the fun
          way—anytime, anywhere.
        </p>
        <p class="mt-4 text-xs text-gray-500 dark:text-gray-500">
          © {{ year }} Kana Game. Created by
        </p>
        <a
          class="mt-4 text-xs text-gray-600 dark:text-gray-400 hover:underline"
          href="https://ibnu-fadhil.my.id"
          >Ibnu Fadhil</a
        >
      </div>
    </footer>
  `,
})
export class FooterComponent {
  year = new Date().getFullYear();
}

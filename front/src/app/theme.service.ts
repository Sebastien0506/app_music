import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  isDarkMode = signal(false);

  constructor() {
    const saveTheme = localStorage.getItem('dark-mode') === 'true';

    this.isDarkMode.set(saveTheme);
    this.applyTheme(saveTheme);
  }

  setDarkMode(value: boolean) {
    this.isDarkMode.set(value);

    localStorage.setItem('dark-mode', String(value));

    this.applyTheme(value);
  }

  private applyTheme(value: boolean) {
    if (value) {
      document.body.classList.add('dark-mode');
      document.documentElement.setAttribute('data-bs-theme', 'dark');
    } else {
      document.body.classList.remove('dark-mode');
      document.documentElement.setAttribute('data-bs-theme', 'light');
    }
  }
}

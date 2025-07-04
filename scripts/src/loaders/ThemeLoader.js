export class ThemeLoader {

    /**
     * @param {'dark'|'light'} theme 
     */
    static switchTheme(theme) {
        if (theme === 'dark') {
            document.documentElement.classList.add('sl-theme-dark');
        }
    
        if (theme === 'light') {
            document.documentElement.classList.remove('sl-theme-dark');
        }
    }

    static async load() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            this.switchTheme('dark');
        }
        document.getElementById('light').addEventListener('click', () => {
            this.switchTheme('light');
        });
        document.getElementById('dark').addEventListener('click', () => {
            this.switchTheme('dark');
        });
    }
}
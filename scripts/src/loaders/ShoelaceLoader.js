export class ShoelaceLoader {
    static async load() {
        await Promise.race([
            Promise.allSettled([
                // customElements.whenDefined('sl-button'),
                // customElements.whenDefined('sl-card'),
                // customElements.whenDefined('sl-rating')
            ]),
            new Promise(resolve => setTimeout(resolve, 2000))
        ]);
        document.documentElement.classList.remove('reduce-fouce');
    }
}
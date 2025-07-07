class BaseLoader {
    static async load() {
        // Override in subclasses
    }
}

class ShoelaceLoader extends BaseLoader {
    static async load() {
        await Promise.race([
            new Promise(resolve => setTimeout(resolve, 2000))
        ]);
        document.documentElement.classList.remove('reduce-fouce');
    }
}

class ThemeLoader extends BaseLoader {
    static async load() {
        const lightButton = document.getElementById('light');
        const darkButton = document.getElementById('dark');
        
        if (lightButton) {
            lightButton.addEventListener('click', () => {
                document.documentElement.classList.remove('sl-theme-dark');
            });
        }
        
        if (darkButton) {
            darkButton.addEventListener('click', () => {
                document.documentElement.classList.add('sl-theme-dark');
            });
        }
    }
}

class ButtonsReactivityLoader extends BaseLoader {
    static async load() {
        const handleRowSelection = (event) => {
            const { domain, selectedCount = 0 } = event.detail;

            const editButtons = document.querySelectorAll('.edit_button');
            const matchingEditButtons = Array.from(editButtons).filter(button => {
                return button.dataset.domain === domain
            });
            matchingEditButtons.forEach(button => {
                if (selectedCount === 1) {
                    button.disabled = false;
                } else {
                    button.disabled = true;
                }
            });

            const deleteButtons = document.querySelectorAll('.delete_button');
            const matchingDeleteButtons = Array.from(deleteButtons).filter(button => 
                button.dataset.domain === domain
            );
            matchingDeleteButtons.forEach(button => {
                if (selectedCount === 1) {
                    button.disabled = false;
                } else {
                    button.disabled = true;
                }
            });
        };
        
        document.addEventListener('row_selection', handleRowSelection);
        document.addEventListener('table_updated', handleRowSelection)
    }
}

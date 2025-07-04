/** LOADERS */

class BaseLoader {
    static async load() {
        // Override in subclasses
    }
}

class ShoelaceLoader extends BaseLoader {
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

/** ================================================= */

/** CONSUMERS */

class BaseConsumer {
    constructor() {
        this.api = 'http://localhost:5000';
    }
    
    async request(endpoint, options = {}) {
        try {
            const response = await fetch(`${this.api}${endpoint}`, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });
            return await response.json();
        } catch (error) {
            console.error('Request failed:', error);
            return null;
        }
    }
}

class AccountsConsumer extends BaseConsumer {
    async list() {
        return this.request('/accounts');
    }
    
    async create(data) {
        return this.request('/accounts', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }
    
    async update(id, data) {
        return this.request(`/accounts/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }
    
    async delete(id) {
        return this.request(`/accounts/${id}`, {
            method: 'DELETE'
        });
    }
}

class IncomesConsumer extends BaseConsumer {
    async list() {
        return this.request('/incomes');
    }
    
    async create(data) {
        return this.request('/incomes', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }
    
    async update(id, data) {
        return this.request(`/incomes/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }
    
    async delete(id) {
        return this.request(`/incomes/${id}`, {
            method: 'DELETE'
        });
    }
}

class ExpensesConsumer extends BaseConsumer {
    async list() {
        return this.request('/expenses');
    }
    
    async create(data) {
        return this.request('/expenses', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }
    
    async update(id, data) {
        return this.request(`/expenses/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }
    
    async delete(id) {
        return this.request(`/expenses/${id}`, {
            method: 'DELETE'
        });
    }
}

/** ================================================= */

/** BUILDERS */

class DatalistBuilder {
    static build(container, data, type) {
        if (!container || !data) return;
        
        container.innerHTML = '';
        
        if (data.length === 0) {
            container.innerHTML = '<p>Nenhum item encontrado.</p>';
            return;
        }
        
        const table = document.createElement('table');
        table.className = 'data-table';
        
        // Create headers based on type
        const headers = this.getHeaders(type);
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        
        headers.forEach(header => {
            const th = document.createElement('th');
            th.textContent = header;
            headerRow.appendChild(th);
        });
        
        thead.appendChild(headerRow);
        table.appendChild(thead);
        
        const tbody = document.createElement('tbody');
        data.forEach(item => {
            const row = document.createElement('tr');
            row.dataset.id = item.id;
            
            headers.forEach(header => {
                const td = document.createElement('td');
                const key = this.getKeyForHeader(header, type);
                td.textContent = item[key] || '';
                row.appendChild(td);
            });
            
            tbody.appendChild(row);
        });
        
        table.appendChild(tbody);
        container.appendChild(table);
    }
    
    static getHeaders(type) {
        switch (type) {
            case 'accounts':
                return ['Nome', 'Saldo', 'Tipo'];
            case 'incomes':
                return ['Descrição', 'Valor', 'Data', 'Conta'];
            case 'expenses':
                return ['Descrição', 'Valor', 'Data', 'Categoria'];
            default:
                return [];
        }
    }
    
    static getKeyForHeader(header, type) {
        const mappings = {
            accounts: {
                'Nome': 'name',
                'Saldo': 'balance',
                'Tipo': 'type'
            },
            incomes: {
                'Descrição': 'description',
                'Valor': 'amount',
                'Data': 'date',
                'Conta': 'account'
            },
            expenses: {
                'Descrição': 'description',
                'Valor': 'amount',
                'Data': 'date',
                'Categoria': 'category'
            }
        };
        
        return mappings[type]?.[header] || header.toLowerCase();
    }
}

/** ================================================= */

/** HANDLERS */

class BaseHandler {
    constructor(consumer) {
        this.consumer = consumer;
    }
    
    async handle() {
        // Override in subclasses
    }
}

class AccountsHandler extends BaseHandler {
    async handle() {
        const listBtn = document.getElementById('list_accounts');
        const createBtn = document.getElementById('create_account');
        const editBtn = document.getElementById('edit_account');
        const deleteBtn = document.getElementById('delete_account');
        const container = document.getElementById('accounts_list_container');
        
        if (listBtn) {
            listBtn.addEventListener('click', async () => {
                const data = await this.consumer.list();
                if (data) {
                    DatalistBuilder.build(container, data, 'accounts');
                }
            });
        }
        
        if (createBtn) {
            createBtn.addEventListener('click', () => {
                // Implement create modal/form
                console.log('Create account clicked');
            });
        }
        
        if (editBtn) {
            editBtn.addEventListener('click', () => {
                // Implement edit functionality
                console.log('Edit account clicked');
            });
        }
        
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => {
                // Implement delete functionality
                console.log('Delete account clicked');
            });
        }
    }
}

class IncomesHandler extends BaseHandler {
    async handle() {
        const listBtn = document.getElementById('list_incomes');
        const createBtn = document.getElementById('create_income');
        const editBtn = document.getElementById('edit_income');
        const deleteBtn = document.getElementById('delete_income');
        const container = document.getElementById('incomes_list_container');
        
        if (listBtn) {
            listBtn.addEventListener('click', async () => {
                const data = await this.consumer.list();
                if (data) {
                    DatalistBuilder.build(container, data, 'incomes');
                }
            });
        }
        
        if (createBtn) {
            createBtn.addEventListener('click', () => {
                console.log('Create income clicked');
            });
        }
        
        if (editBtn) {
            editBtn.addEventListener('click', () => {
                console.log('Edit income clicked');
            });
        }
        
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => {
                console.log('Delete income clicked');
            });
        }
    }
}

class ExpensesHandler extends BaseHandler {
    async handle() {
        const listBtn = document.getElementById('list_expenses');
        const createBtn = document.getElementById('create_expense');
        const editBtn = document.getElementById('edit_expense');
        const deleteBtn = document.getElementById('delete_expense');
        const container = document.getElementById('expenses_list_container');
        
        if (listBtn) {
            listBtn.addEventListener('click', async () => {
                const data = await this.consumer.list();
                if (data) {
                    DatalistBuilder.build(container, data, 'expenses');
                }
            });
        }
        
        if (createBtn) {
            createBtn.addEventListener('click', () => {
                console.log('Create expense clicked');
            });
        }
        
        if (editBtn) {
            editBtn.addEventListener('click', () => {
                console.log('Edit expense clicked');
            });
        }
        
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => {
                console.log('Delete expense clicked');
            });
        }
    }
}

/** ================================================= */

/** APP */

window.App = {
    api: 'http://localhost:5000',
    builders: {
        DatalistBuilder
    },
    loaders: {
        ShoelaceLoader,
        ThemeLoader,
    },
    handlers: {
        AccountsHandler: new AccountsHandler(new AccountsConsumer()),
        IncomesHandler: new IncomesHandler(new IncomesConsumer()),
        ExpensesHandler: new ExpensesHandler(new ExpensesConsumer()),
    }
}

window.addEventListener('DOMContentLoaded', () => {
    /** Initiate Loaders - Dependencies and Styles configurations */
    Object.values(App.loaders).forEach(async (loader) => await loader.load());
});

window.addEventListener('load', () => {
    /** Initiate Handlers - DOM manipulations */
    Object.values(App.handlers).forEach(async (handler) => await handler.handle());
})

/** ================================================= */
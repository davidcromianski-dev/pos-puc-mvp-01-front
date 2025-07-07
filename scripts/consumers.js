/**
 * @typedef ModelItem
 * @property {string} name - The field name (usually same as the object key)
 * @property {string} display - Human-readable label for the field
 * @property {string} type - Data type (int, str, bool, date, datetime, decimal)
 * @property {boolean|null} disabled - Whether the field is read-only/disabled
 * @property {boolean|null} required - Whether the field is mandatory
 */

/**
 * @typedef {Object.<string, ModelItem>} Model
 * @description A model definition object where keys are field names and values are ModelItem configurations
 */

class BaseConsumer {
    /**
     * @type {Model }
     */
    model = {}

    async list(route) {
        return this.request(route);
    }

    async get(route, id) {
        return this.request(`${route}?id=${id}`)
    }

    async create(route, data) {
        return this.request(route, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    async update(route, id, data) {
        return this.request(`${route}?id=${id}`, {
            method: 'PATCH',
            body: JSON.stringify(data)
        });
    }

    async delete(route, id) {
        return this.request(`/${route}?id=${id}`, {
            method: 'DELETE'
        });
    }

    async request(endpoint, options = {}) {
        try {
            const response = await fetch(`${window.App.api}${endpoint}`, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Request failed:', error);
            window.App.alert('danger', `Ops! Ocorreu um erro.`);
            return null;
        }
    }
}

class AccountsConsumer extends BaseConsumer {
    name = {
        singular: 'Conta',
        plural: 'Contas'
    }

    model = {
        id: { name: 'id', display: 'ID', type: 'int', disabled: true },
        bank: { name: 'bank', display: 'Banco', type: 'str', required: true },
        active: { name: 'active', display: 'Ativo', type: 'bool' },
        created_at: { name: 'created_at', display: 'Data de criação', type: 'datetime', disabled: true, hidden: true }
    }

    async list() {
        return super.list('/accounts');
    }

    async get(id) {
        return super.get('/account', id);
    }
    
    async create(data) {
        return super.create('/account', data);
    }
    
    async update(id, data) {
        return super.update('/account', id, data);
    }
    
    async delete(id) {
        return super.delete('/account', id);
    }
}

class IncomesConsumer extends BaseConsumer {
    name = {
        singular: 'Receita',
        plural: 'Receitas'
    }

    model = {
        id: { name: 'id', display: 'ID', type: 'int', disabled: true },
        status: { 
            name: 'status', 
            display: 'Status', 
            type: 'enum', 
            required: true, 
            values: [
                { value: 'PE', display: 'Pendente' },
                { value: 'RE', display: 'Recebido' },
                { value: 'OD', display: 'Atrasado' },
                { value: 'CA', display: 'Cancelado' }
            ]
        },
        description: { name: 'description', display: 'Descrição', type: 'str', required: true },
        category: { name: 'category', display: 'Categoria', type: 'str', required: true },
        income_type: { name: 'income_type', display: 'Tipo',type: 'enum', required: true,  values: [
            { value: 'FI', display: 'Fixa' },
            { value: 'VA', display: 'Variável' },
        ] },
        account_id: { name: 'account_id', display: 'ID Conta', type: 'int', required: true },
        amount: { name: 'amount', display: 'Valor', type: 'decimal', required: true },
        payment_method: { 
            name: 'payment_method', 
            display: 'Tipo de pagamento', 
            type: 'enum', 
            required: true, 
            values: [
                { value: 'pix', display: 'PIX' },
                { value: 'cartao_de_credito', display: 'Cartão de Crédito' },
                { value: 'cartao_de_debito', display: 'Cartão de Débito' },
                { value: 'dinheiro', display: 'Dinheiro' }
            ]
        },
        actual_date: { name: 'actual_date', display: 'Data efetuada', type: 'date', required: false },
        expected_date: { name: 'expected_date', display: 'Data prevista', type: 'date', required: true },
        created_at: { name: 'created_at', display: 'Data de criação', type: 'datetime', disabled: true, hidden: true }
    }

    async list() {
        return super.list('/incomes');
    }

    async get(id) {
        return super.get('/income', id);
    }
    
    async create(data) {
        return super.create('/income', data);
    }
    
    async update(id, data) {
        return super.update('/income', id, data);
    }
    
    async delete(id) {
        return super.delete('/income', id);
    }
}

class ExpensesConsumer extends BaseConsumer {
    name = {
        singular: 'Despesa',
        plural: 'Despesas'
    }

    model = {
        id: { name: 'id', display: 'ID', type: 'int', disabled: true },
        status: { 
            name: 'status', 
            display: 'Status', 
            type: 'enum', 
            required: true, 
            values: [
                { value: 'PE', display: 'Pendente' },
                { value: 'PA', display: 'Pago' },
                { value: 'OD', display: 'Atrasado' },
                { value: 'CA', display: 'Cancelado' }
            ]
        },
        description: { name: 'description', display: 'Descrição', type: 'str', required: true },
        category: { name: 'category', display: 'Categoria', type: 'str', required: true },
        expense_type: { name: 'expense_type', display: 'Tipo', type: 'enum', required: true,  values: [
            { value: 'FI', display: 'Fixa' },
            { value: 'VA', display: 'Variável' },
        ] },
        account_id: { name: 'account_id', display: 'ID Conta', type: 'int', required: true },
        amount: { name: 'amount', display: 'Valor', type: 'decimal', required: true },
        payment_method: { 
            name: 'payment_method', 
            display: 'Tipo de pagamento', 
            type: 'enum', 
            required: true, 
            values: [
                { value: 'pix', display: 'PIX' },
                { value: 'cartao_de_credito', display: 'Cartão de Crédito' },
                { value: 'cartao_de_debito', display: 'Cartão de Débito' },
                { value: 'dinheiro', display: 'Dinheiro' }
            ]
        },
        actual_date: { name: 'actual_date', display: 'Data efetuada', type: 'date', required: false },
        expected_date: { name: 'expected_date', display: 'Data prevista', type: 'date', required: true },
        created_at: { name: 'created_at', display: 'Data de criação', type: 'datetime', disabled: true, hidden: true }
    }

    async list() {
        return super.list('/expenses');
    }

    async get(id) {
        return super.get('/expense', id);
    }
    
    async create(data) {
        return super.create('/expense', data);
    }
    
    async update(id, data) {
        return super.update('/expense', id, data);
    }
    
    async delete(id) {
        return super.delete('/expense', id);
    }
}
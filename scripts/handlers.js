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
                listBtn.loading = true
                const response = await this.consumer.list();
                if (response.data) {
                    App.builders.DatalistBuilder.build(container, response.data, 'accounts');
                }
                listBtn.loading = false;
            });
        }
        
        if (createBtn) {
            createBtn.addEventListener('click', async () => {
                createBtn.disabled = true;
                await App.builders.FormBuilder.build(document.body, [], 'accounts')
            });
        }
        
        if (editBtn) {
            editBtn.addEventListener('click', async () => {
                const selectedRows = document.querySelectorAll('tbody tr[selected]');
                if (selectedRows.length !== 1) {
                    App.alert('warning', 'Selecione exatamente uma conta para editar');
                    return;
                }
                
                const selectedId = selectedRows[0].dataset.id;
                const response = await this.consumer.get(selectedId);
                if (response.data) {
                    App.builders.FormBuilder.build(document.body, response.data, 'accounts', 'edit');
                } else {
                    App.alert('danger', 'Ops! Ocorreu um erro desconhecido.')
                }
            });
        }
        
        if (deleteBtn) {
            deleteBtn.addEventListener('click', async () => {
                const selectedRows = document.querySelectorAll('tbody tr[selected]');
                if (selectedRows.length !== 1) {
                    App.alert('warning', 'Selecione exatamente uma conta para deletar');
                    return;
                }
                
                const selectedId = selectedRows[0].dataset.id;
                const selectedData = selectedRows[0];
                
                const dialog = document.createElement('sl-dialog');
                dialog.label = 'Confirmar exclusão';
                dialog.className = 'confirm-dialog';
                
                const content = document.createElement('div');
                content.innerHTML = `
                    <p>Tem certeza que deseja deletar a conta <strong>${selectedData.cells[2]?.textContent || 'ID: ' + selectedId}</strong>?</p>
                    <p>Esta ação não pode ser desfeita.</p>
                `;
                
                const buttonContainer = document.createElement('div');
                buttonContainer.className = 'dialog-buttons';
                
                const cancelBtn = document.createElement('sl-button');
                cancelBtn.textContent = 'Cancelar';
                cancelBtn.variant = 'neutral';
                cancelBtn.addEventListener('click', () => {
                    dialog.hide();
                    dialog.remove();
                });
                
                const confirmBtn = document.createElement('sl-button');
                confirmBtn.textContent = 'Deletar';
                confirmBtn.variant = 'danger';
                confirmBtn.addEventListener('click', async () => {
                    confirmBtn.loading = true;
                    try {
                        await this.consumer.delete(selectedId);
                        App.alert('success', 'Conta deletada com sucesso!');
                        selectedData.remove();
                        dialog.hide();
                        dialog.remove();
                    } catch (error) {
                        App.alert('danger', `Erro ao deletar: ${error.message}`);
                    } finally {
                        confirmBtn.loading = false;
                    }
                });
                
                buttonContainer.appendChild(cancelBtn);
                buttonContainer.appendChild(confirmBtn);
                
                dialog.appendChild(content);
                dialog.appendChild(buttonContainer);
                document.body.appendChild(dialog);
                dialog.show();
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
                listBtn.loading = true
                const response = await this.consumer.list();
                if (response.data) {
                    DatalistBuilder.build(container, response.data, 'incomes');
                }
                listBtn.loading = false;
            });
        }
        
        if (createBtn) {
            createBtn.addEventListener('click', async () => {
                createBtn.disabled = true;
                await App.builders.FormBuilder.build(document.body, [], 'incomes')
            });
        }
        
        if (editBtn) {
            editBtn.addEventListener('click', async () => {
                const selectedRows = document.querySelectorAll('tbody tr[selected]');
                if (selectedRows.length !== 1) {
                    App.alert('warning', 'Selecione exatamente uma entrada para editar');
                    return;
                }
                
                const selectedId = selectedRows[0].dataset.id;
                const response = await this.consumer.get(selectedId);
                if (response.data) {
                    App.builders.FormBuilder.build(document.body, response.data, 'incomes', 'edit');
                }
            });
        }
        
        if (deleteBtn) {
            deleteBtn.addEventListener('click', async () => {
                const selectedRows = document.querySelectorAll('tbody tr[selected]');
                if (selectedRows.length !== 1) {
                    App.alert('warning', 'Selecione exatamente uma entrada para deletar');
                    return;
                }
                
                const selectedId = selectedRows[0].dataset.id;
                const selectedData = selectedRows[0];
                
                const dialog = document.createElement('sl-dialog');
                dialog.label = 'Confirmar exclusão';
                dialog.className = 'confirm-dialog';
                
                const content = document.createElement('div');
                content.innerHTML = `
                    <p>Tem certeza que deseja deletar a entrada <strong>${selectedData.cells[3]?.textContent || 'ID: ' + selectedId}</strong>?</p>
                    <p>Esta ação não pode ser desfeita.</p>
                `;
                
                const buttonContainer = document.createElement('div');
                buttonContainer.className = 'dialog-buttons';
                
                const cancelBtn = document.createElement('sl-button');
                cancelBtn.textContent = 'Cancelar';
                cancelBtn.variant = 'neutral';
                cancelBtn.addEventListener('click', () => {
                    dialog.hide();
                    dialog.remove();
                });
                
                const confirmBtn = document.createElement('sl-button');
                confirmBtn.textContent = 'Deletar';
                confirmBtn.variant = 'danger';
                confirmBtn.addEventListener('click', async () => {
                    confirmBtn.loading = true;
                    try {
                        await this.consumer.delete(selectedId);
                        App.alert('success', 'Entrada deletada com sucesso!');
                        selectedData.remove();
                        dialog.hide();
                        dialog.remove();
                    } catch (error) {
                        App.alert('danger', `Erro ao deletar: ${error.message}`);
                    } finally {
                        confirmBtn.loading = false;
                    }
                });
                
                buttonContainer.appendChild(cancelBtn);
                buttonContainer.appendChild(confirmBtn);
                
                dialog.appendChild(content);
                dialog.appendChild(buttonContainer);
                document.body.appendChild(dialog);
                dialog.show();
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
                listBtn.loading = true
                const response = await this.consumer.list();
                if (response.data) {
                    DatalistBuilder.build(container, response.data, 'expenses');
                }
                listBtn.loading = false;
            });
        }
        
        if (createBtn) {
            createBtn.addEventListener('click', async () => {
                createBtn.disabled = true;
                await App.builders.FormBuilder.build(document.body, [], 'expenses')
            });
        }
        
        if (editBtn) {
            editBtn.addEventListener('click', async () => {
                const selectedRows = document.querySelectorAll('tbody tr[selected]');
                if (selectedRows.length !== 1) {
                    App.alert('warning', 'Selecione exatamente uma despesa para editar');
                    return;
                }
                
                const selectedId = selectedRows[0].dataset.id;
                const response = await this.consumer.get(selectedId);
                if (response.data) {
                    App.builders.FormBuilder.build(document.body, response.data, 'expenses', 'edit');
                }
            });
        }
        
        if (deleteBtn) {
            deleteBtn.addEventListener('click', async () => {
                const selectedRows = document.querySelectorAll('tbody tr[selected]');
                if (selectedRows.length !== 1) {
                    App.alert('warning', 'Selecione exatamente uma despesa para deletar');
                    return;
                }
                
                const selectedId = selectedRows[0].dataset.id;
                const selectedData = selectedRows[0];
                
                const dialog = document.createElement('sl-dialog');
                dialog.label = 'Confirmar exclusão';
                dialog.className = 'confirm-dialog';
                
                const content = document.createElement('div');
                content.innerHTML = `
                    <p>Tem certeza que deseja deletar a despesa <strong>${selectedData.cells[3]?.textContent || 'ID: ' + selectedId}</strong>?</p>
                    <p>Esta ação não pode ser desfeita.</p>
                `;
                
                const buttonContainer = document.createElement('div');
                buttonContainer.className = 'dialog-buttons';
                
                const cancelBtn = document.createElement('sl-button');
                cancelBtn.textContent = 'Cancelar';
                cancelBtn.variant = 'neutral';
                cancelBtn.addEventListener('click', () => {
                    dialog.hide();
                    dialog.remove();
                });
                
                const confirmBtn = document.createElement('sl-button');
                confirmBtn.textContent = 'Deletar';
                confirmBtn.variant = 'danger';
                confirmBtn.addEventListener('click', async () => {
                    confirmBtn.loading = true;
                    try {
                        await this.consumer.delete(selectedId);
                        App.alert('success', 'Despesa deletada com sucesso!');
                        selectedData.remove();
                        dialog.hide();
                        dialog.remove();
                    } catch (error) {
                        App.alert('danger', `Erro ao deletar: ${error.message}`);
                    } finally {
                        confirmBtn.loading = false;
                    }
                });
                
                buttonContainer.appendChild(cancelBtn);
                buttonContainer.appendChild(confirmBtn);
                
                dialog.appendChild(content);
                dialog.appendChild(buttonContainer);
                document.body.appendChild(dialog);
                dialog.show();
            });
        }
    }
}
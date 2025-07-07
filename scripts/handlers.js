class BaseHandler {
    constructor(consumer) {
        this.consumer = consumer;
    }
    
    async handle() {
        // Override in subclasses
    }

    async handleList(listBtnId, containerId, entityType) {
        const listBtn = document.getElementById(listBtnId);
        const container = document.getElementById(containerId);
        
        if (listBtn) {
            listBtn.addEventListener('click', async () => {
                listBtn.loading = true;
                const response = await this.consumer.list();
                if (response?.data) {
                    App.builders.DatalistBuilder.build(container, response.data, entityType);
                }
                listBtn.loading = false;
            });
        }
    }

    async handleCreate(createBtnId, entityType) {
        const createBtn = document.getElementById(createBtnId);
        
        if (createBtn) {
            createBtn.addEventListener('click', async () => {
                createBtn.disabled = true;
                await App.builders.FormBuilder.build(document.body, [], entityType);
            });
        }
    }

    async handleEdit(editBtnId, entityType, entityName) {
        const editBtn = document.getElementById(editBtnId);
        
        if (editBtn) {
            editBtn.addEventListener('click', async () => {
                const selectedRows = document.querySelectorAll('tbody tr[selected]');
                if (selectedRows.length !== 1) {
                    App.alert('warning', `Selecione exatamente um(a) ${entityName} para editar`);
                    return;
                }
                
                const selectedId = selectedRows[0].dataset.id;
                const response = await this.consumer.get(selectedId);
                if (response.data) {
                    App.builders.FormBuilder.build(document.body, response.data, entityType, 'edit', selectedId);
                } else {
                    App.alert('danger', 'Ops! Ocorreu um erro desconhecido.');
                }
            });
        }
    }

    // Common delete operation
    async handleDelete(deleteBtnId, entityType, entityName, displayColumnIndex = 3) {
        const deleteBtn = document.getElementById(deleteBtnId);
        
        if (deleteBtn) {
            deleteBtn.addEventListener('click', async () => {
                const selectedRows = document.querySelectorAll('tbody tr[selected]');
                if (selectedRows.length !== 1) {
                    App.alert('warning', `Selecione exatamente um(a) ${entityName} para deletar`);
                    return;
                }
                
                const selectedId = selectedRows[0].dataset.id;
                const selectedData = selectedRows[0];
                
                const dialog = document.createElement('sl-dialog');
                dialog.label = 'Confirmar exclusão';
                dialog.className = 'confirm-dialog';
                
                const content = document.createElement('div');
                content.innerHTML = `
                    <p>Tem certeza que deseja deletar o(a) ${entityName} <strong>${selectedData.cells[displayColumnIndex]?.textContent || 'ID: ' + selectedId}</strong>?</p>
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
                        App.alert('success', `${entityName.charAt(0).toUpperCase() + entityName.slice(1)} deletado(a) com sucesso!`);
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

class AccountsHandler extends BaseHandler {
    async handle() {
        await this.handleList('list_accounts', 'accounts_list_container', 'accounts');
        await this.handleCreate('create_account', 'accounts');
        await this.handleEdit('edit_account', 'accounts', 'conta');
        await this.handleDelete('delete_account', 'accounts', 'conta', 2);
    }
}

class IncomesHandler extends BaseHandler {
    async handle() {
        await this.handleList('list_incomes', 'incomes_list_container', 'incomes');
        await this.handleCreate('create_income', 'incomes');
        await this.handleEdit('edit_income', 'incomes', 'entrada');
        await this.handleDelete('delete_income', 'incomes', 'entrada', 3);
    }
}

class ExpensesHandler extends BaseHandler {
    async handle() {
        await this.handleList('list_expenses', 'expenses_list_container', 'expenses');
        await this.handleCreate('create_expense', 'expenses');
        await this.handleEdit('edit_expense', 'expenses', 'despesa');
        await this.handleDelete('delete_expense', 'expenses', 'despesa', 3);
    }
}
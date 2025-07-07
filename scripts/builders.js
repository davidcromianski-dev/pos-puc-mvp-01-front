class DatalistBuilder {
    static async build(container, data, domain) {
        if (!container || !data) return;
        
        container.innerHTML = '';
        
        if (data.length === 0) {
            const alert = document.createElement('sl-alert')
            alert.variant = "primary";
            alert.innerText = "Nenhum item encontrado."
            alert.setAttribute('open', 'true')
            container.appendChild(alert)
            return;
        }
        
        const table = document.createElement('table');
        table.className = 'data-table';
        
        const headers = this.getHeaders(domain);
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');

        const checkTh = document.createElement('th');
        const checkbox = document.createElement('sl-checkbox');
        checkbox.className = 'select-all-checkbox';
        
        checkbox.addEventListener('sl-change', (event) => {
            const itemCheckboxes = table.querySelectorAll('.item-checkbox');
            itemCheckboxes.forEach(itemCheckbox => {
                itemCheckbox.checked = event.target.checked;
                const row = itemCheckbox.closest('tr');
                if (event.target.checked) {
                    row.setAttribute('selected', '');
                } else {
                    row.removeAttribute('selected');
                }
            });
            
            this.dispatchRowSelectionEvent(table, domain);
        });
        
        checkTh.appendChild(checkbox);
        headerRow.appendChild(checkTh);
        
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
            
            const checkTd = document.createElement('td');
            const itemCheckbox = document.createElement('sl-checkbox');
            itemCheckbox.className = 'item-checkbox';
            itemCheckbox.dataset.itemId = item.id;
            
            itemCheckbox.addEventListener('sl-change', (event) => {
                if (event.target.checked) {
                    row.setAttribute('selected', '');
                } else {
                    row.removeAttribute('selected');
                }
                
                this.dispatchRowSelectionEvent(table, domain);
            });
            
            checkTd.appendChild(itemCheckbox);
            row.appendChild(checkTd);
            
            headers.forEach(header => {
                const td = document.createElement('td');
                const key = this.getKeyForHeader(header, domain);
                td.textContent = item[key] || '';
                row.appendChild(td);
            });
            
            tbody.appendChild(row);
        });
        
        table.appendChild(tbody);
        container.appendChild(table);

        this.dispatchRowSelectionEvent(table, domain);
    }
    
    static getHeaders(domain) {
        let ConsumerClass;
        switch (domain) {
            case 'accounts':
                ConsumerClass = App.handlers.AccountsHandler.consumer;
                break;
            case 'expenses':
                ConsumerClass = App.handlers.ExpensesHandler.consumer;
                break;
            case 'incomes':
                ConsumerClass = App.handlers.IncomesHandler.consumer;
                break;
            default:
                return [];
        }
        
        if (ConsumerClass && ConsumerClass.model) {
            return Object.values(ConsumerClass.model).map(field => field.display);
        }
        
        return [];
    }
    
    static getKeyForHeader(header, domain) {
        let ConsumerClass;
        switch (domain) {
            case 'accounts':
                ConsumerClass = App.handlers.AccountsHandler.consumer;
                break;
            case 'expenses':
                ConsumerClass = App.handlers.ExpensesHandler.consumer;
                break;
            case 'incomes':
                ConsumerClass = App.handlers.IncomesHandler.consumer;
                break;
            default:
                return header.toLowerCase();
        }
        
        if (ConsumerClass && ConsumerClass.model) {
            const field = Object.values(ConsumerClass.model).find(field => field.display === header);
            return field ? field.name : header.toLowerCase();
        }
        
        return header.toLowerCase();
    }
    
    static dispatchRowSelectionEvent(table, domain) {
        const selectedRows = table.querySelectorAll('tbody tr[selected]');
        const selectedCount = selectedRows.length;

        const event = new CustomEvent('row_selection', {
            detail: {
                domain,
                selectedCount: selectedCount,
                selectedRows: Array.from(selectedRows).map(row => ({
                    id: row.dataset.id,
                    element: row
                }))
            }
        });
        
        document.dispatchEvent(event);
    }

    static dispatchTableUpdateEvent(table, domain) {
        const event = new CustomEvent('table_updated', {
            detail: {
                table,
                domain,
            }
        });
        
        document.dispatchEvent(event);
    }
}

class FormBuilder {
    static async build(container, data, domain, mode = 'create', target_id = null) {
        let ConsumerClass;
        switch (domain) {
            case 'accounts':
                ConsumerClass = App.handlers.AccountsHandler.consumer;
                break;
            case 'expenses':
                ConsumerClass = App.handlers.ExpensesHandler.consumer;
                break;
            case 'incomes':
                ConsumerClass = App.handlers.IncomesHandler.consumer;
                break;
            default:
                return;
        }

        const dialog = document.createElement('sl-dialog');
        dialog.label = mode === 'create' ? `Criar ${ConsumerClass.name.singular}` : `Editar ${ConsumerClass.name.singular}`;
        dialog.className = 'form-dialog';

        const form = document.createElement('form');
        form.id = `${domain}_form`;

        const formFields = Object.entries(ConsumerClass.model)
            .filter(([key, field]) => !field.hidden)
            .map(([key, field]) => {
                const fieldContainer = document.createElement('div');
                fieldContainer.className = 'form-field';

                let input;
                if (field.type === 'enum' && Array.isArray(field.values) && field.values.length > 0) {
                    input = document.createElement('sl-select');
                    input.id = field.name;
                    input.name = field.name;
                    input.required = field.required;
                    input.disabled = field.disabled;
                    input.label = field.display;
                    if (data && data[field.name]) {
                        input.value = data[field.name];
                    }
                    field.values.forEach(opt => {
                        const option = document.createElement('sl-option');
                        option.value = opt.value;
                        option.textContent = opt.display;
                        input.appendChild(option);
                    });
                } else {
                    switch (field.type) {
                        case 'bool':
                            input = document.createElement('sl-checkbox');
                            input.id = field.name;
                            input.name = field.name;
                            input.required = field.required;
                            input.innerText = field.display;
                            input.disabled = field.disabled;
                            if (data && data[field.name]) {
                                input.checked = data[field.name];
                            }
                            break;
                        case 'date':
                        case 'datetime':
                            input = document.createElement('sl-input');
                            input.type = field.type === 'date' ? 'date' : 'datetime-local';
                            input.id = field.name;
                            input.name = field.name;
                            input.required = field.required;
                            input.label = field.display;
                            input.disabled = field.disabled;
                            if (data && data[field.name]) {
                                const date = new Date(data[field.name]);
                                const formatted = date.toISOString().split("T")[0];
                                input.value = formatted;
                            }
                            break;
                        case 'int':
                            input = document.createElement('sl-input');
                            input.type = 'number';
                            input.id = field.name;
                            input.name = field.name;
                            input.required = field.required;
                            input.label = field.display;
                            input.disabled = field.disabled;
                            if (data && data[field.name]) {
                                input.value = data[field.name];
                            }
                            break;
                        case 'decimal':
                            input = document.createElement('sl-input');
                            input.type = 'number';
                            input.step = '0.01';
                            input.id = field.name;
                            input.name = field.name;
                            input.required = field.required;
                            input.label = field.display;
                            input.disabled = field.disabled;
                            if (data && data[field.name]) {
                                input.value = data[field.name];
                            }
                            break;
                        default:
                            input = document.createElement('sl-input');
                            input.id = field.name;
                            input.name = field.name;
                            input.required = field.required;
                            input.label = field.display;
                            input.disabled = field.disabled;
                            if (data && data[field.name]) {
                                input.value = data[field.name];
                            }
                    }
                }

                fieldContainer.appendChild(input);
                return fieldContainer;
            });

        formFields.forEach(field => form.appendChild(field));

        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'form-buttons';

        const handleButtons = () => {
            const button = document.querySelector(`.${mode}_button[data-domain="${domain}"`);
            if (button) {
                button.removeAttribute('disabled');
            }
        }

        const cancelBtn = document.createElement('sl-button');
        cancelBtn.textContent = 'Cancelar';
        cancelBtn.variant = 'neutral';
        cancelBtn.addEventListener('click', () => {
            dialog.hide();
            dialog.remove();
            handleButtons()
        });

        const submitBtn = document.createElement('sl-button');
        submitBtn.textContent = 'Salvar';
        submitBtn.variant = 'primary';
        submitBtn.type = 'submit';
        submitBtn.addEventListener('click', () => {
            if (form.checkValidity()) {
                form.requestSubmit();
                handleButtons();
              } else {
                form.reportValidity();
              }
        })

        buttonContainer.appendChild(cancelBtn);
        buttonContainer.appendChild(submitBtn);

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            submitBtn.loading = true;

            const formData = new FormData(form);
            const data = {};
            formData.forEach((value, key) => {
                if (key.includes('checkbox')) {
                    data[key] = form.querySelector(`[name="${key}"]`).checked;
                } else {
                    data[key] = value;
                }
            });

            try {
                if (mode === 'create') {
                    const response = await ConsumerClass.create(data);
                    if (!response) {
                        throw new Error();
                    }
                    App.alert('success', `${ConsumerClass.name.singular} criado(a) com sucesso!`);
                } else {
                    if (!target_id) {
                        throw new Error('Target ID was not informed');
                    }
                    const response = await ConsumerClass.update(target_id, data);
                    if (!response) {
                        throw new Error();
                    }
                    App.alert('success', `${ConsumerClass.name.singular} atualizado com sucesso!`);
                }

                dialog.hide();
                dialog.remove();

                const listBtn = document.getElementById(`list_${domain}`);
                if (listBtn) {
                    listBtn.click();
                }
            } catch (error) {
                console.error(error)
                App.alert('danger', `Ops! Ocorreu um erro.`);
            } finally {
                submitBtn.loading = false;
            }
        });

        dialog.appendChild(form);
        dialog.appendChild(buttonContainer);
        container.appendChild(dialog);

        dialog.addEventListener('sl-request-close', event => {
            if (event.detail.source === 'overlay') {
              event.preventDefault();
            }
            handleButtons()
        });

        setTimeout(() => {
            dialog.show();
        }, 100);
    }
}
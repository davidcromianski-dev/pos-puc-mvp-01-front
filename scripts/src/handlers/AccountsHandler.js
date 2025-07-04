import { IHandler } from "./IHandler.js";
import { AccountsConsumer } from "../consumers/AccountsConsumer.js";

export class AccountsHandler extends IHandler {    
    async handle() {
        const listContainer = document.getElementById('accounts_list_container');
        const listButton = document.getElementById('list_accounts');
        listButton.addEventListener('click', async () => {
            listButton.loading = true;

            listContainer.innerHTML = '';

            const data = await this.consumer.list();
            if (data.length === 0) {
                const alert = `
                    <sl-alert open>
                        <sl-icon slot="icon" name="emoji-frown"></sl-icon>
                        Não há dados!
                    </sl-alert>
                `;
                listContainer.innerHTML = alert;
                listButton.loading = false;
                return;
            }

            const columns = Object.keys(data[0]);
            const datalist = App.builders.DatalistBuilder.build(columns, data);
            datalist.setAttribute('domain', this.consumer.domain);

            console.log(datalist);

            listButton.loading = false;
        });
    }
}
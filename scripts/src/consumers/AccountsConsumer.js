import { IConsumer } from "./IConsumer.js";

export class AccountsConsumer extends IConsumer {

    constructor() {
        super('accounts', 'accounts');
    }

    async list() {
        const response = await fetch(`${App.api}/${this.url_prefix}`);
        const data = await response.json();
        return data;
    }
}
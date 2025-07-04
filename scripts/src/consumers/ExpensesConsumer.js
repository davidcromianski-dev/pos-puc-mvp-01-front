import { IConsumer } from "./IConsumer.js";

export class ExpensesConsumer extends IConsumer {

    constructor() {
        super('expenses', 'expenses');
    }

    async list() {
        const response = await fetch(`${App.api}/${this.url_prefix}`);
        const data = await response.json();
        console.log(data);
    }
}
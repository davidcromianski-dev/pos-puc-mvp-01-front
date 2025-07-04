import { IConsumer } from "./IConsumer.js";

export class IncomesConsumer extends IConsumer {

    constructor() {
        super('incomes', 'incomes');
    }

    async list() {
        const response = await fetch(`${App.api}/${this.url_prefix}`);
        const data = await response.json();
        console.log(data);
    }
}
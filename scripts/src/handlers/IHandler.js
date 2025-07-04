import { IConsumer } from "../consumers/IConsumer.js";

export class IHandler {
    /**
     * @param { IConsumer } consumer
     */
    consumer;

    /**
     * @param { IConsumer } consumer 
     */
    constructor(consumer) {
        this.consumer = consumer;
    }

    /**
     * @abstract
     */
    async handle() {
        throw new Error('This method must not be called from the interface');
    }
}
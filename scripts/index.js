import { ShoelaceLoader } from "./src/loaders/ShoelaceLoader.js";
import { ThemeLoader } from "./src/loaders/ThemeLoader.js";

import { AccountsConsumer } from "./src/consumers/AccountsConsumer.js";
import { IncomesConsumer } from "./src/consumers/IncomesConsumer.js";
import { ExpensesConsumer } from "./src/consumers/ExpensesConsumer.js";

import { AccountsHandler } from "./src/handlers/AccountsHandler.js";
import { IncomesHandler } from "./src/handlers/IncomesHandler.js";
import { ExpensesHandler } from "./src/handlers/ExpensesHandler.js";

import { DatalistBuilder } from "./src/builders/DatalistBuilder.js";

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

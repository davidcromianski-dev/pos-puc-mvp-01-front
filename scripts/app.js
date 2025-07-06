window.App = {
    api: 'http://localhost:5000',
    builders: {
        DatalistBuilder,
        FormBuilder
    },
    loaders: {
        ShoelaceLoader,
        ThemeLoader,
        ButtonsReactivityLoader,
    },
    handlers: {
        AccountsHandler: new AccountsHandler(new AccountsConsumer()),
        IncomesHandler: new IncomesHandler(new IncomesConsumer()),
        ExpensesHandler: new ExpensesHandler(new ExpensesConsumer()),
    },
    alert: (type, message) => {
        const icon = (() => {
            switch (type) {
                case 'primary':
                    return 'info-circle';
                case 'success':
                    return 'check2-circle';
                case 'neutral':
                    return 'gear';
                case 'warning':
                    return 'exclamation-triangle';
                case 'danger':
                    return 'exclamation-octagon';
                default:
                    return false;
            }
        })();

        const alert = document.createElement('sl-alert');
        alert.variant = type;
        alert.duration = 3000;
        alert.countdown = "rtl";
        alert.closable = true;
        alert.innerText = message;

        if (icon) {
            const iconEl = document.createElement('sl-icon');
            iconEl.slot = 'icon';
            iconEl.name = icon;
            alert.prepend(iconEl);
        }

        document.documentElement.appendChild(alert)
        setTimeout(() => {
            alert.toast()
        }, 100)
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
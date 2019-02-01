function select(selector, context) {
    if (typeof selector !== 'string') {
        return [];
    }
    if ((context === undefined) || !isElement(context)) {
        context = window.document;
    }
    var selection = context.querySelectorAll(selector);
    return Array.prototype.slice.call(selection);

};

function isElement(value) {
    return !!value && typeof value === 'object' && value.nodeType === 1;
}

function showPanelListener(el) {
    var expanded = el.getAttribute('aria-expanded') === 'true';
    this.hideAll();
    if (!expanded) {
        this.show(el);
    }
    return false;
}

function Accordion(el) {
    var self = this;
    this.root = el;

    // delegate click events on each <button>
    var buttons = select('button', this.root);
    buttons.forEach(function (el) {
        el.addEventListener('click', showPanelListener.bind(self, el));
    });

    // find the first expanded button
    var expanded = this.$('button[aria-expanded=true]')[0];
    this.hideAll();
    if (expanded !== undefined) {
        this.show(expanded);
    }
}

Accordion.prototype.$ = function (selector) {
    return select(selector, this.root);
};

Accordion.prototype.hide = function (button) {
    var selector = button.getAttribute('aria-controls'),
        content = this.$('#' + selector)[0];

    button.setAttribute('aria-expanded', 'false');
    content.setAttribute('aria-hidden', 'true');
    return this;
};

Accordion.prototype.show = function (button) {
    var selector = button.getAttribute('aria-controls'),
        content = this.$('#' + selector)[0];

    button.setAttribute('aria-expanded', 'true');
    content.setAttribute('aria-hidden', 'false');
    return this;
};

Accordion.prototype.hideAll = function () {
    var self = this;
    var buttons = this.$('ul > li > button, .usa-accordion-button');
    buttons.forEach(function (button) {
        self.hide(button);
    });
    return this;
};

function initAccordions() {
    var accordions = select('.usa-accordion, .usa-accordion-bordered');
    accordions.forEach(function (el) {
        new Accordion(el);
    });
}

module.exports.init = initAccordions;

export class IConsumer {
    /**
     * @abstract
     * @param { string } url_prefix
     */
    url_prefix;

    /**
     * @abstract
     * @param { string } domain
     */
    domain;

    /**
     * @param {string} url_prefix 
     * @param {string} domain 
     */
    constructor(url_prefix, domain) {
        this.url_prefix = url_prefix;
        this.domain = domain;
    }
    
    /**
     * @abstract
     */
    async list() {
        throw new Error('This method must not be called from the interface');
    }

    /**
     * @abstract
     * @param {{}} data 
     */
    async create(data) {
        throw new Error('This method must not be called from the interface');
    }

    /**
     * @abstract
     * @param {int} id 
     * @param {{}} data 
     */
    async edit(id, data) {
        throw new Error('This method must not be called from the interface');
    }

    /**
     * @abstract
     * @param {int} id 
     */
    async delete(id) {
        throw new Error('This method must not be called from the interface');
    }
}
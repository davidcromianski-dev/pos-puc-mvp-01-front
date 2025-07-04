/**
 * @typedef Column
 * @property { string } title
 * @property { int } order
 */

/**
 * @typedef { [{ [key: string]: any }] } Data
 */

export class DatalistBuilder {
    /**
     * @param { [Column] } columns 
     * @param { Data } data
     * @returns { HTMLElement }
     */
    static build(columns, data) {
        const element =  document.createElement('div');
        element.classList.add('datalist');
        
        return this
            .columns(element, columns)
            .populate(element, data)
            .render(element);
    }

    /**
     * @param { HTMLElement } element
     * @param { [Column] } columns 
     * @returns { this }
     */
    static columns(element, columns) {
        return this;
    }

    /**
     * @param { HTMLElement } element
     * @param { [Data] } data
     * @returns { this }
     */
    static populate(element, data) {
        return this;
    }

    /**
     * @returns { HTMLElement }
     */
    static render(element) {
        return element;
    }
}
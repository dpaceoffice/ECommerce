import React, { Component } from 'react';
import storeGen from '../utility/storeGen';

export default class StorePage extends Component {
    constructor() {
        super();
        this.state = { ctg: undefined };
    }

    setCtg = async (id) => {
        await this.setState({ ctg: id });
    }

    render() {
        const categories = this.props.data.cstate;
        let cat_order = undefined;
        if (this.props.data.start !== undefined) {
            cat_order = categories[this.props.data.start].order;
            if (cat_order.length <= 0) {
                cat_order = undefined;
            }
        }
        const products = this.props.data.pstate;
        let results = storeGen(this.state.ctg, cat_order, categories, products, this.props.modal, this.props.reload, this.setCtg);
        let products_inner = results[0];
        let category_inner = results[1];
        let ctg = results[2];

        if (this.state.ctg !== ctg)
            this.state.ctg = ctg

        let html = <div><div className="row mt-5 text-center">
            <div className="col-sm" style={{ maxWidth: '25rem', marginLeft: '30px' }}>
                <div className="card mb-2" style={{ maxWidth: '18rem', marginLeft: '30px' }}>
                    <ul className="list-group list-group-flush">
                        <div id="categories-container">
                            {category_inner}
                        </div>
                    </ul>
                </div>
            </div>
            <div className="col-sm">
                <div id="products-container" className="row">
                    {products_inner}
                </div>
            </div>
        </div></div>;
        return html;
    }
}
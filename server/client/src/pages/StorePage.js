import React, { Component } from 'react';
import Product from '../components/Product';

export default class StorePage extends Component {
    constructor() {
        super();
        this.state = { ctg: undefined };
    }

    render() {
        let active = undefined;
        const categories = this.props.data.cstate;
        const products = this.props.data.pstate;
        let category_inner = [];
        let products_inner = [];
        for (const category in categories) {
            const data = categories[category];
            const id = data['_id'];
            const type = data['type'];
            if (this.state.ctg == undefined)
                this.state.ctg = id;
            if (id === this.state.ctg)
                active = data['products']
            category_inner.push(<li key={id} onClick={() => { this.setState({ ctg: id }) }} className="btn list-group-item">{type}</li>);
        }
        for (const index in active) {
            let product = active[index];
            let data = products[product];
            var id = data['_id'];
            var title = data['title'];
            var desc = data['des'];
            var price = Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
            }).format(data['price']);
            var img = data['image'];
            products_inner.push(<Product modal={this.props.modal} key={id} reload={this.props.reload} id={id} title={title} desc={desc} price={price} img={img} />);
        }

        let html = <div><div className="row mt-5 text-center">
            <div className="col">
                <div className="card mb-2" style={{ maxWidth: '18rem', marginLeft: '60px' }}>
                    <ul className="list-group list-group-flush">
                        <div id="categories-container">
                            {category_inner}
                        </div>
                    </ul>
                </div>
            </div>
            <div className="col">
                <div id="products-container" className="row ms-5">
                    {products_inner}
                </div>
            </div>
        </div></div>;
        return html;
    }
}
import React, { Component } from 'react';
/* Muuri react */
import DraggableGrid, { DraggableItem } from 'ruuri';
import Product from '../components/Product';


export default class AdminPage extends Component {
    constructor() {
        super();
        this.setModalRef = element => { this.setState({ modal: element }) };
        this.productsContainer = React.createRef(null);
        this.state = { ctg: undefined, updateOrder: this.updateOrder, updateCatOrder: this.updateCatOrder, deletePending: undefined, blockMove: [] };
    }
    setDPend = (id) => {
        this.setState({ deletePending: id });
    }
    swapMove = (id) => {
        let blockMove = this.state.blockMove;
        if (blockMove.includes(id)) {
            this.state.blockMove = blockMove.filter(e => e !== id);
        } else {
            blockMove.push(id);
        }
    };

    getKey(item) {
        for (let key in item.getElement()) {
            let value = item.getElement()[key];
            if (key.includes('__reactProps$')) {
                let key = value.children.props.children.key;
                return key;
            }
        }
        return null;
    }
    updateOrder = async (order) => {
        const config = new Object();
        config.method = "POST";
        config.headers = { 'Content-Type': 'application/json' };
        config.body = JSON.stringify({ curCat: this.state.ctg, order: order });
        const response = await fetch("/admin/rearrangeLayout", config);
        const data = await response.json();
        if (data)
            this.pendingReload = true;
    }

    deleteProduct = async (id) => {
        const config = new Object();
        config.method = "POST";
        config.headers = { 'Content-Type': 'application/json' };
        config.body = JSON.stringify({ id });
        const response = await fetch("/admin/removeProduct", config);
        const data = await response.json();
        if (data.error) {
            alert(data.error);
        } else {
            this.state.modal.click();
            this.props.reload();
        }
    }

    updateCatOrder = async (order) => {
        const config = new Object();
        config.method = "POST";
        config.headers = { 'Content-Type': 'application/json' };
        config.body = JSON.stringify({ order: order });
        const response = await fetch("/admin/sortcat", config);
        const data = await response.json();
        if (data)
            this.pendingReload = true;
    }
    componentDidMount = async () => {
        this.props.reload();
    }
    render() {
        let active = undefined;
        const categories = this.props.data.cstate;
        let cat_order = categories[this.props.data.start].order;
        if (cat_order.length <= 0) {
            cat_order = undefined;
        }
        const products = this.props.data.pstate;
        let category_inner = [];
        let html = undefined;
        let populate = (data, id, type) => {
            if (this.state.blockMove.includes('blankboi'))
                this.state.blockMove = ['blankboi'];
            else
                this.state.blockMove = [];
            if (this.state.ctg == undefined)
                this.state.ctg = id;
            if (id === this.state.ctg) {
                active = data['products']
                html = <DraggableItem key={id}> <li key={id} onClick={async () => {
                    if (this.state.ctg != id) {
                        this.props.reload();
                        this.setState({ ctg: id });
                    }
                }} className="btn btn-success list-group-item">{type}</li></DraggableItem>;
            } else {
                html = <DraggableItem key={id}> <li key={id} onClick={async () => {
                    if (this.state.ctg != id) {
                        this.props.reload();
                        this.setState({ ctg: id });
                    }
                }} className="btn list-group-item">{type}</li></DraggableItem>;
            }
            category_inner.push(html);
        }
        if (cat_order == undefined)
            for (const category in categories) {
                const data = categories[category];
                const id = data['_id'];
                const type = data['type'];
                populate(data, id, type);
            }
        else
            for (const i in cat_order) {
                const category = cat_order[i];
                const data = categories[category];
                const id = data['_id'];
                const type = data['type'];
                populate(data, id, type)
            }
        let items = [];
        for (const index in active) {
            let product = active[index];
            if (product == null)
                continue;
            let data = products[product];
            var id = data['_id'];
            var title = data['title'];
            var desc = data['des'];
            var price = Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
            }).format(data['price']);
            var img = data['image'];
            items.push({ key: id, id: id, title: title, desc: desc, price: price, img: img, adminPage: true, swapMove: this.swapMove, reload: this.props.reload, productsContainer: this.productsContainer, setToDelete: this.setDPend });
        }
        const children = items.map((props) =>
            <DraggableItem key={props.key} style={{ marginLeft: '13px' }}>
                <Product {...props} />
            </DraggableItem>

        );
        const blank = <DraggableItem key='blankboi' style={{ marginLeft: '13px' }}>
            <Product blank={true} key="blankboi" id="blankboi" ctg={this.state.ctg} title="SAMPLE TITLE" desc="SAMPLE DESCRIPTION" price="$0.00" img="/assets/default_img.png" setToDelete={this.setDPend} adminPage={true} swapMove={this.swapMove} reload={this.props.reload} productsContainer={this.productsContainer} />
        </DraggableItem>;
        const newctg =
            <li className="btn list-group-item">Create New Category</li>
            ;

        const state = this.state;
        return (<div>
            <div className="row mt-5 text-center">
                <div className="col-sm" style={{ maxWidth: '25rem', marginLeft: '30px' }}>
                    <div className="mb-2" style={{ maxWidth: '18rem', marginLeft: '30px' }}>
                        <ul className="list-group list-group-flush">
                            <div id="categories-container">
                                <DraggableGrid
                                    className="row"
                                    dragEnabled
                                    dragFixed
                                    dragSortPredicate={{
                                        action: "swap"
                                    }}
                                    dragSortHeuristics={{
                                        sortInterval: 0
                                    }}
                                    layout={{
                                        fillGaps: false,
                                        horizontal: false,
                                        alignRight: false,
                                        alignBottom: false,
                                        rounding: false
                                    }}
                                    dragStartPredicate={(item, event) => {
                                        let key = undefined;
                                        event = event.target;
                                        for (key in event) {
                                            if (key.includes('__reactFiber$')) {
                                                key = event[key].key;
                                                break;
                                            }
                                        }
                                        return this.state.ctg === key;
                                    }}
                                    onDragEnd={async (item, event) => {
                                        if (event.distance > 0) {
                                            const grid = await item.getGrid();
                                            const items = await grid.getItems();
                                            const keys = [];
                                            for (let i in items) {
                                                item = items[i];
                                                for (let key in item.getElement()) {
                                                    let value = item.getElement()[key];
                                                    if (key.includes('__reactProps$'))
                                                        keys.push(value.children.props.children[1].key);
                                                }
                                            }
                                            await state.updateCatOrder(keys);
                                        }
                                    }}>
                                    {category_inner}
                                </DraggableGrid>
                                {newctg}
                            </div>
                        </ul>
                    </div>
                </div>
                <div className="col-sm">
                    <div id="products-container" className="row">
                        <DraggableGrid
                            ref={this.productsContainer}
                            dragEnabled
                            dragFixed
                            dragSortPredicate={{
                                action: "swap"
                            }}
                            dragStartPredicate={(item, event) => {
                                return !this.state.blockMove.includes(this.getKey(item));
                            }}
                            dragSortHeuristics={{
                                sortInterval: 0
                            }}
                            onDragEnd={async (item, event) => {
                                if (event.distance > 0) {
                                    const grid = await item.getGrid();
                                    const items = await grid.getItems();
                                    const keys = [];
                                    for (let i in items) {
                                        item = items[i];
                                        for (let key in item.getElement()) {
                                            let value = item.getElement()[key];
                                            if (key.includes('__reactProps$')) {
                                                let key = value.children.props.children.key;
                                                if (key !== 'blankboi')
                                                    keys.push(key);
                                            }
                                        }
                                    }
                                    await state.updateOrder(keys);
                                }
                            }}>
                            {children}
                            {blank}
                        </DraggableGrid>
                    </div>
                </div>
            </div>
            <div className="modal fade" id="alertModal" tabindex="-1" role="dialog" aria-labelledby="alertModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="alertModalLabel">Confirmation</h5>
                            <button ref={this.setModalRef} type="button" className="close" data-bs-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <p>Are you sure you want to delete this product?</p>
                            <p>It will no longer be displayed under customers' purchases, and it is not recoverable.</p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Dismiss</button>
                            <button type="button" onClick={async (e) => { this.deleteProduct(this.state.deletePending) }} className="btn btn-danger">Delete Product</button>
                        </div>
                    </div>
                </div>
            </div>
        </div >
        );
    }

}
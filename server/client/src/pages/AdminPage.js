import React, { Component } from 'react';
/* Muuri react */
import DraggableGrid, { DraggableItem } from 'ruuri';
import Product from '../components/Product';

export default class AdminPage extends Component {
    constructor() {
        super();
        this.blockMove = []
        this.pendingReload = false;
        this.state = { ctg: undefined, updateOrder: this.updateOrder, updateCatOrder: this.updateCatOrder };
    }

    swapMove = (id) => {
        let blockMove = this.blockMove;
        if (blockMove.includes(id)) {
            this.blockMove = blockMove.filter(e => e !== id);
        } else {
            blockMove.push(id);
        }
    };

    getKey(item) {
        for (let key in item.getElement()) {
            let value = item.getElement()[key];
            if (key.includes('__reactProps$')) {
                let key = value.children.props.children.key;
                if (key !== 'blankboi')
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
            this.blockMove = [];
            if (this.state.ctg == undefined)
                this.setState({ ctg: id });
            if (id === this.state.ctg)
                active = data['products']
            if (id === this.state.ctg) {
                html = <DraggableItem key={id}> <li key={id} onClick={async () => {
                    if (this.state.ctg != id) {
                        // if (this.pendingReload) {//Ensures that any fundamental changes on the backend are synced
                        this.props.reload();
                        // }
                        this.setState({ ctg: id });
                    }
                }} className="btn btn-success list-group-item">{type}</li></DraggableItem>;
            } else {
                html = <DraggableItem key={id}> <li key={id} onClick={async () => {
                    if (this.state.ctg != id) {
                        // if (this.pendingReload) {//Ensures that any fundamental changes on the backend are synced
                        this.props.reload();
                        // }
                        this.setState({ ctg: id });
                    }
                }} className="btn list-group-item">{type}</li></DraggableItem>;
            }
            category_inner.push(html);

        }
        if (cat_order == undefined)
            for (const category in category) {
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
            items.push({ key: id, id: id, title: title, desc: desc, price: price, img: img, adminPage: true, swapMove: this.swapMove });
        }

        // Items to components.

        const children = items.map((props) =>
            <DraggableItem key={props.key} className="ms-5">
                <Product {...props} />
            </DraggableItem>

        );
        const blank = <DraggableItem key='blankboi' className="ms-5">
            <Product blank={true} />
        </DraggableItem>;
        const state = this.state;
        return (<div>
            <div className="row mt-5 text-center">
                <div className="col-sm" style={{ maxWidth: '18rem', marginLeft: '60px' }}>
                    <div className="mb-2" style={{ maxWidth: '18rem', marginLeft: '60px' }}>
                        <ul className="list-group list-group-flush">
                            <div id="categories-container" className="ms-1">
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
                                            console.log(event);
                                            const keys = [];
                                            for (let i in items) {
                                                item = items[i];
                                                for (let key in item.getElement()) {
                                                    let value = item.getElement()[key];
                                                    //console.log(item.getElement());
                                                    if (key.includes('__reactProps$'))
                                                        keys.push(value.children.props.children[1].key);
                                                }
                                            }
                                            await state.updateCatOrder(keys);
                                        }
                                    }}>
                                    {category_inner}
                                </DraggableGrid>
                            </div>
                        </ul>
                    </div>
                </div>
                <div className="col-sm">
                    <div id="products-container" className="row-sm ms-1">
                        <DraggableGrid
                            dragEnabled
                            dragFixed
                            dragSortPredicate={{
                                action: "swap"
                            }}
                            dragStartPredicate={(item, event) => {
                                return !this.blockMove.includes(this.getKey(item));
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
            </div></div >);
    }

}
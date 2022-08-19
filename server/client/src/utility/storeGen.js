import Product from '../components/Product';
export default function storeGen(ctg, cat_order, categories, products, modal, reload, setCtg) {
    var active = undefined;
    var category_inner = [];
    var products_inner = [];

    var populate = (data, id, type) => {
        if (ctg == undefined)
            ctg = id;
        if (id === ctg)
            active = data['products']
        category_inner.push(<li key={id} onClick={async () => { await setCtg(id); ctg = id }} className="btn list-group-item">{type}</li>);
    }
    if (cat_order === undefined)
        for (const category in categories) {
            const data = categories[category];
            const id = data['_id'];
            const type = data['type'];
            populate(
                data,
                id,
                type);
        }
    else
        for (const i in cat_order) {
            const category = cat_order[i];
            const data = categories[category];
            const id = data['_id'];
            const type = data['type'];
            populate(data,
                id,
                type);
        }
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
        products_inner.push(<Product modal={modal} key={id} reload={reload} id={id} title={title} desc={desc} price={price} img={img} />);
    }
    return [products_inner, category_inner, ctg];
}
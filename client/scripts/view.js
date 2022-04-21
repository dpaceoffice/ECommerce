const displayStore = (categories, products) => {
    document.getElementById("categories-container").innerHTML = "";
    document.getElementById("products-container").innerHTML = "";
    for (const category in categories) {
        let title = categories[category];
        document.getElementById("categories-container").innerHTML +=
            `<li id="cat_id" cat_id=` + category + ` class="btn list-group-item">` +
            title +
            `</li>`;
    }
    addController('cat_id');
    for (const product in products) {
        let [img, title, desc, price] = products[product];
        document.getElementById("products-container").innerHTML +=
            `<div class="col"><div class="card mb-1" style="width: 18rem;">
        <img class="card-img-top" src="` +
            img +
            `" alt="` +
            title +
            `">
            <div class="card-body">
                <h5 class="card-title">` +
            title +
            `</h5>
                <p class="card-text">` +
            desc +
            `</p>
                <p class="card-text">` +
            price +
            `</p>
                <a class="btn btn-primary" id="addtocart" product_number=${product}>Add to Cart</a>
            </div>
    </div></div>`;
    }
    addController('addtocart');
}

const displayCheckout = (body, total, checkout) => {
    document.getElementById("checkout").innerHTML = checkout
    document.getElementById("cart-body").innerHTML = body;
    document.getElementById("cost-label").innerHTML = total;
    addController('rmfromcart');
}

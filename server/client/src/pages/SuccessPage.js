import { Component } from 'react';
export default class SuccessPage extends Component {
    constructor() {
        super();
        this.state = { imagepath: null };
    }
    async componentDidMount() {
        let path = "/uploads/" + this.props.data.user.profileImage;
        if (await fetch(path).then(response => response.status) == 404)
            path = "/assets/default_img.png";
        this.setState({ imagepath: path });
    }
    render() {
        const breakdown = this.props.breakdown;
        const details = this.props.paypal_order.purchase_units[0];
        const shipping = details.shipping;
        const buyer = shipping.name.full_name;
        const address = shipping.address;
        const payment = details.payments.captures[0];
        const status = payment.status;
        const amount = payment.amount.value;
        const products = breakdown.allProducts;
        const purchases = this.props.data.user.purchases;
        const purchase_quntities = this.props.data.user.purchase_quantities;
        const product_ids = this.props.data.pstate;
        let body = [];
        if (products.length > 0) {
            for (const product of products) {
                body.push(<p>{product.title} - {product.price} x {product.quantity}</p>);
            }
        }
        let purchase_list = [];
        for (const purchase of purchases) {
            const product = product_ids[purchase];
            const quantity = purchase_quntities[purchase];
            if (product === undefined)
                continue;
            purchase_list.push(<p>{product.title} - ${product.price} x {quantity}</p>)
        }

        var total = <p>Total Cost: ${amount}</p>;
        return (
            <div className="container mt-5">
                <div className="row">
                    <div className="col-sm p-2">
                        <div className="card p-2">
                            <div className="card">
                                <div className="card-body d-flex flex-column align-items-center text-center">
                                    <img src={this.state.imagepath} alt="Profile Image Display" className="rounded-circle" width="150" />
                                    <h4>{this.props.data.user.name}</h4>
                                </div>
                            </div>
                            <div className="card m-2">
                                <div className="card-body d-flex flex-column align-items-center text-center">
                                    <h4>All Purchases:</h4>
                                    {purchase_list}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm p-2">
                        <div className="card">
                            <div className="card-body d-flex flex-column align-items-center text-center">
                                <h2>Thank you, {buyer}! </h2>
                                <h1 className="text-success">Status: {status}</h1>
                            </div>
                        </div>
                        <div className="row p-2">
                            <div className="card">
                                <div className="card-body d-flex flex-column align-items-center text-center">
                                    <div className="col">
                                        <div className="d-flex justify-content-center text-center">
                                            <h3>Your information:</h3>
                                        </div>
                                        <p>{address.address_line_1}, {address.admin_area_2}, {address.admin_area_1}, {address.postal_code}, {address.country_code}</p>
                                    </div>
                                    <div className="col">
                                        <div className="d-flex justify-content-center text-center">
                                            <h3>Your purchase:</h3>
                                        </div>
                                        {body}
                                    </div>
                                    <div className="col">
                                        <div className="d-flex justify-content-center text-center">
                                            <h3>Breakdown:</h3>
                                        </div>
                                        {total}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>);
    }

}
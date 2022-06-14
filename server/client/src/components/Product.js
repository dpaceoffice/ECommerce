import React, { Component } from 'react';
export default class Product extends Component {

    constructor(props) {
        super(props);
        this.DEFAULT = 0;
        this.MODIFY = 1;
        this.state = { adminPage: props.adminPage, view: this.DEFAULT, title: this.props.title, desc: this.props.desc, price: this.props.price };
    }

    addToCart = async (id) => {
        const config = new Object();
        config.method = "POST";
        config.headers = { 'Content-Type': 'application/json' };
        config.body = JSON.stringify({ id });
        const response = await fetch(`/add-product/`, config);
        if (response.status === 203)
            this.props.modal.click();
        else
            this.props.reload();
    }

    modifyProduct = async () => {
        this.props.swapMove();
        this.setState({ view: this.MODIFY });
    }

    render() {
        let button = <></>;
        let titleField = [<h5 className="ms-0 card-title">{this.props.title}</h5>];
        let descField = [<p className="card-text">{this.props.desc}</p>];
        let priceField = [<p className="card-text">{this.props.price}</p>];
        if (!this.state.adminPage)
            button = [<a className="btn" onClick={async () => { await this.addToCart(this.props.id) }} style={{ backgroundColor: '#577a58', color: "white" }} id="addtocart" product_number={this.props.id}>Add to Cart</a>];
        else {
            titleField = [<h5 className="ms-0 card-title">{this.props.title}</h5>, <input className="form-control mb-2" type='text' placeholder={this.state.title} onKeyPress={this.handleEnter} onChange={(e) => this.setState({ title: e.target.value })} />];
            descField = [<p className="card-text">{this.props.desc}</p>, <textarea className="form-control mb-2" type='text' placeholder={this.state.desc} onKeyPress={this.handleEnter} onChange={(e) => this.setState({ desc: e.target.value })} />];
            priceField = [<p className="card-text">{this.props.price}</p>, <input className="form-control mb-2" type='text' placeholder={this.state.price} onKeyPress={this.handleEnter} onChange={(e) => this.setState({ price: e.target.value })} />];
            button = [<><a className="btn me-2" onClick={async () => { this.modifyProduct() }} style={{ backgroundColor: '#577a58', color: "white" }}>Modify</a>
                <a className="btn" onClick={async () => { }} style={{ backgroundColor: '#577a58', color: "white" }}>Delete</a></>, <a className="btn me-2" onClick={async () => { this.setState({ view: this.DEFAULT }); this.props.swapMove(); }} style={{ backgroundColor: '#577a58', color: "white" }}>Save</a>];
        }
        let view = <div key={this.props.id} className="col" style={{ maxWidth: '18rem', marginLeft: '60px' }}>
            <div className="card mb-3" style={{ filter: 'drop-shadow(7px 7px 0px #597658)', width: '18rem', borderWidth: 'thick', borderStyle: 'solid', borderColor: '#709a71', background: '#709a71' }}>
                <img className="card-img-top" src={this.props.img} alt={this.props.title} />
                <div className="card-body">
                    {titleField[this.state.view]}
                    {descField[this.state.view]}
                    {priceField[this.state.view]}
                    {button[this.state.view]}
                </div>
            </div>
        </div>;
        if (this.props.blank)
            view = <div key='blankboi' className="col" style={{ maxWidth: '18rem', marginLeft: '60px' }}>
                <div className="card mb-3" style={{ filter: 'drop-shadow(7px 7px 0px #597658)', width: '18rem', borderWidth: 'thick', borderStyle: 'solid', borderColor: '#709a71', background: '#709a71' }}>
                    <img className="card-img-top" src='/assets/default_img.png' alt='blank' />
                    <div className="card-body">
                        <h5 className="ms-0 card-title">
                            SAMLE TITLE</h5>
                        <p className="card-text">
                            SAMPLE DESCRIPTION</p>
                        <p className="card-text">$0.00</p>
                        <button className="btn" style={{ backgroundColor: '#577a58', color: "white" }}>Create new product</button>
                    </div>
                </div>
            </div>;
        return (view);
    }
}
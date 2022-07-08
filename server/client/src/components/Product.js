import React, { Component } from 'react';
export default class Product extends Component {

    constructor(props) {
        super(props);
        this.DEFAULT = 0;
        this.MODIFY = 1;
        this.resizeObserver = null;
        this.resizeElement = React.createRef();
        this.state = { adminPage: props.adminPage, view: this.DEFAULT, img: undefined, title: undefined, desc: undefined, price: undefined, err: '', formData: undefined };
    }

    componentWillUnmount() {
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
        }

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
        this.props.swapMove(this.props.id);
        this.setState({ view: this.MODIFY });
        //refresh muuri
        this.props.productsContainer.current.grid._resizeHandler();
        this.resizeObserver = new ResizeObserver((entries) => {
            this.resize();
        });
        if (this.resizeElement.current !== null)
            this.resizeObserver.observe(this.resizeElement.current);
    }

    handleEnter = (event) => {
        if (event.key.toLowerCase() === "enter") {
            const form = event.target.form;
            const index = [...form].indexOf(event.target);
            if (form.elements.length - 1 < index + 1)
                this.submit();
            else
                form.elements[index + 1].focus();
            event.preventDefault();
        }
    }

    handleRequest = async (vars, edit = true) => {
        const config = new Object();
        config.method = "POST";
        config.headers = { 'Content-Type': 'application/json' };
        config.body = JSON.stringify({ vars });

        const response = edit ? await fetch("/admin/editProduct", config) : await fetch("/admin/addProduct", config);
        const data = await response.json();

        if (data.error) {
            this.setState({ err: data.errorMsg });
        } else {
            this.setState({ adminPage: this.props.adminPage, view: this.DEFAULT, img: undefined, title: undefined, desc: undefined, price: undefined, err: '', formData: undefined });
            this.props.reload();
        }
    }
    saveChanges = async (edit = true) => {
        let data = {};
        var regex = /^\d+$/;
        if (!edit)
            data.ctg = this.props.ctg;
        if (this.state.title)
            data.title = this.state.title;
        else if (!edit)
            data.title = this.props.title;
        if (this.state.desc)
            data.desc = this.state.desc;
        else if (!edit)
            data.desc = this.props.desc;

        if (this.state.price) {
            if (this.state.price.match(regex) == null) {
                this.setState({ err: 'Invalid price, only provide numbers; No currency units (e.g - $)' });
                this.props.productsContainer.current.grid._resizeHandler();
                return;
            } else
                data.price = parseInt(this.state.price);
        } else if (!edit)
            data.price = 0;
        if (this.state.formData !== undefined) {
            const config = new Object();
            config.method = "POST";
            config.body = this.state.formData;

            const response = await fetch("/admin/image", config);
            const data = await response.json();

            if (data.error) {
                this.setState({ err: data.error });
                return;
            } else {
                this.state.img = "/assets/" + data.name;
            }
        }
        if (this.state.img)
            data.image = this.state.img;
        else if (!edit)
            data.image = this.props.img;

        if (Object.keys(data).length > 0) {
            data.id = this.props.id;
            await this.handleRequest(data, edit);
            this.props.reload();
        }
        this.revertEditDisplay();
    }
    revertEditDisplay = () => {
        this.setState({ view: this.DEFAULT, err: '', formData: undefined });
        this.props.productsContainer.current.grid._resizeHandler();
        this.props.swapMove(this.props.id);
    }
    onFileChange = async (event) => {
        var file = event.target.files[0];

        const formData = new FormData();
        // Update the formData object
        formData.append(
            "file",
            file,
            file.name
        );
        this.setState({ formData: formData });
    }
    resize = () => {
        this.props.productsContainer.current.grid._resizeHandler();
    }

    render() {
        let button = <></>;
        let titleField = [<h5 className="ms-0 card-title">{this.props.title}</h5>, <input className="form-control mb-2" type='text' placeholder={this.props.title} onKeyPress={this.handleEnter} onChange={(e) => this.setState({ title: e.target.value })} />];
        let descField = [<p className="card-text">{this.props.desc}</p>, <textarea ref={this.resizeElement} className="form-control mb-2" type='text' placeholder={this.props.desc} onKeyPress={this.handleEnter} onChange={(e) => this.setState({ desc: e.target.value })} />];
        let priceField = [<p className="card-text">{this.props.price}</p>, <input className="form-control mb-2" type='text' placeholder={this.props.price} onKeyPress={this.handleEnter} onChange={(e) => this.setState({ price: e.target.value })} />];
        let imageUpload = [<></>,
        <input type="file" accept="image/x-png,image/gif,image/jpeg" onChange={this.onFileChange} className="form-control btn-sm btn-light mb-2" />
        ];
        if (this.props.blank)
            button = [<button className="btn" onClick={async () => { this.modifyProduct() }} style={{ backgroundColor: '#577a58', color: "white" }}>Create new product</button>, <><button className="btn me-2" onClick={() => this.saveChanges(false)} style={{ backgroundColor: '#577a58', color: "white" }}>Commit product</button>
                <button className="btn" onClick={() => {
                    this.revertEditDisplay();
                }} style={{ backgroundColor: '#577a58', color: "white" }}>Cancel</button></>]
        else if (!this.state.adminPage)
            button = [<a className="btn" onClick={async () => { await this.addToCart(this.props.id) }} style={{ backgroundColor: '#577a58', color: "white" }} id="addtocart" product_number={this.props.id}>Add to Cart</a>];
        else
            button = [<><a className="btn me-2" onClick={async () => { this.modifyProduct() }} style={{ backgroundColor: '#577a58', color: "white" }}>Modify</a>
                <a className="btn" onClick={() => this.props.setToDelete(this.props.id)} data-bs-toggle="modal" data-bs-target="#alertModal" style={{ backgroundColor: '#577a58', color: "white" }}>Delete</a></>, <a className="btn form-control me-2" onClick={async () => { await this.saveChanges(); }} style={{ backgroundColor: '#577a58', color: "white" }}>Save</a>];

        let view = <div key={this.props.id} className="col" style={{ maxWidth: '18rem', marginLeft: '60px' }}>
            <div className="card mb-3" style={{ filter: 'drop-shadow(7px 7px 0px #597658)', width: '18rem', borderWidth: 'thick', borderStyle: 'solid', borderColor: '#709a71', background: '#709a71' }}>
                <img onLoad={() => this.resize()} className="card-img-top" src={this.props.img} alt={this.props.title} />
                <div className="card-body">
                    {<p className="text-white">{this.state.err}</p>}
                    {titleField[this.state.view]}
                    {descField[this.state.view]}
                    {priceField[this.state.view]}
                    {imageUpload[this.state.view]}
                    {button[this.state.view]}
                </div>
            </div>
        </div>;
        return (view);
    }
}
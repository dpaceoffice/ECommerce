import React, { Component } from "react";

export default class ProfilePage extends Component {
    constructor(props) {
        super(props);
        this.DISPLAY = 0;
        this.MODIFY = 1;
        const user = this.props.data.user;
        let last = user.name.split(' ')[1];
        if (last == undefined)
            last = '';
        this.state = { aiEntry: null, aiResponse: null, selectedFile: null, imagePath: null, profileImage: user.profileImage, view: this.DISPLAY, fname: user.name.split(' ')[0], lname: last, email: user.email, mobile: user.phone, address: user.address, password: user.password, err: '' };
    }
    handleRequest = async (vars) => {
        try {
            const config = new Object();
            config.method = "POST";
            config.headers = { 'Content-Type': 'application/json' };
            config.body = JSON.stringify({ vars });
            const response = await fetch("/profile/modify", config);
            const data = await response.json();

            if (data.error) {
                this.setState({ err: data.errorMsg });
            } else {
                this.props.reload();
            }

        } catch (error) {
            console.log(error.stack);
        }
    }
    modifyProfile = async () => {
        if (this.state.view !== this.MODIFY)
            return;
        const format = (err) => {
            var usernameRegex = /^[a-zA-Z0-9]+$/;
            var passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
            var emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
            var phoneRegex = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/
            if (this.state.fname.match(usernameRegex) == null)
                err = 'Your first name is not valid. Only characters A-Z, a-z and \'-\' are  acceptable.';
            else if (this.state.lname.match(usernameRegex) == null)
                err = 'Your last name is not valid. Only characters A-Z, a-z and \'-\' are  acceptable.';
            else if (this.state.email.match(emailRegex) == null)
                err = 'The email entered is invalid!';
            else if (this.state.password && this.state.password.match(passwordRegex) == null)
                err = 'Password must be a minimum eight characters, at least one letter, one number and one special character.';
            else if (this.state.mobile.match(phoneRegex) == null)
                err = 'Invalid phone number provided.';
            else
                err = '';
            this.setState({ err: err });
            return err;
        };
        if (!format(this.state.err)) {
            var name = this.state.fname + ' ' + this.state.lname;

            let data = {};
            if (this.state.fname || this.state.lname)
                data.name = name;
            if (this.state.email)
                data.email = this.state.email;
            if (this.state.password)
                data.password = this.state.password;
            if (this.state.mobile)
                data.phone = this.state.mobile;
            if (this.state.address)
                data.address = this.state.address;
            await this.handleRequest(data);
            this.setState({ view: this.DISPLAY })
        }
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
        const config = new Object();
        config.method = "POST";
        config.body = formData;

        const response = await fetch("/profile/image", config);
        const data = await response.json();
        if (data.error)
            this.setState({ err: data.error });
        else {
            this.setState({ imagePath: "/uploads/" + data.name, profileImage: data.name, err: '' });
        }
    }

    componentDidMount = async () => {
        let path = "/uploads/" + this.state.profileImage;
        if (await fetch(path).then(response => response.status) == 404)
            path = "/assets/default_img.png";
        this.setState({ imagePath: path });
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
    useAI = async (message) => {
        this.setState({ aiResponse: 'Loading...' })
        const config = new Object();
        config.method = "POST";
        config.headers = { 'Content-Type': 'application/json' };
        config.body = JSON.stringify({ message });
        const response = await fetch("/openai/prompt/", config);
        const data = await response.json();
        this.setState({ aiResponse: data.result })
    }

    render() {
        const user = this.props.data.user;
        if (user === undefined) {
            this.props.showStore();
            return <p>Logging out..</p>;
        }
        let privilage = <></>
        if (user.rights == 2) {
            privilage = <button onClick={this.props.showAdmin} className="btn btn-warning">Modify Store Front</button>;
        }
        let questionField = <><input className="form-control" type="text" placeHolder="Ask any questions you'd like." value={this.state.aiEntry} onChange={(e) => this.setState({ aiEntry: e.target.value })} onKeyPress={async e => { if (e.key.toLowerCase() === "enter") await this.useAI(this.state.aiEntry) }}></input><p>{this.state.aiResponse}</p></>
        let fnameField = [<>{this.state.fname}</>, <input className="form-control" type='text' placeholder={this.state.fname} onKeyPress={this.handleEnter} onChange={(e) => this.setState({ fname: e.target.value })} value={this.state.fname} />]
        let lnameField = [<>{this.state.lname}</>, <input className="form-control" type='text' placeholder={this.state.lname} onKeyPress={this.handleEnter} onChange={(e) => this.setState({ lname: e.target.value })} value={this.state.lname} />]
        let emailField = [<>{this.state.email}</>, <input className="form-control" type='text' placeholder={this.state.email} onKeyPress={this.handleEnter} onChange={(e) => this.setState({ email: e.target.value })} value={this.state.email} />]
        let mobileField = [<>{this.state.mobile}</>, <input className="form-control" type='text' placeholder={this.state.mobile} onKeyPress={this.handleEnter} onChange={(e) => this.setState({ mobile: e.target.value })} value={this.state.mobile} />]
        let addressField = [<>{this.state.address}</>, <input className="form-control" type='text' placeholder={this.state.address} onKeyPress={this.handleEnter} onChange={(e) => this.setState({ address: e.target.value })} value={this.state.address} />]
        let imageDisplay = <><img src={this.state.imagePath} alt="Profile Image Display" className="rounded-circle" width="150" /></>;
        let imageUpload = [<></>,
        <>
            <div className="row">
                <div className="col">
                    <h6 className="mb-0">Upload a profile image</h6>
                </div>
                <div className="col text-secondary"><input type="file" accept="image/x-png,image/gif,image/jpeg" onChange={this.onFileChange} className="btn-sm btn-light" />
                </div>
            </div>
            <hr />
        </>];
        let purchase_list = []
        const product_ids = this.props.data.pstate;
        for (const purchase of user.purchases) {
            const product = product_ids[purchase];
            //if (product === undefined)
            //continue;
            const quantity = user.purchase_quantities[purchase];
            purchase_list.push(<p>{product.title} - ${product.price} x {quantity}</p>)
        }
        let editSaveButton = ['Edit', 'Save'];
        return (
            <div className="container">
                <div className="main-body mt-5">
                    <div className="row gutters-sm">
                        <div className="col-md-4 mb-3">
                            <div className="card">
                                <div className="card-body">
                                    <div className="d-flex flex-column align-items-center text-center">
                                        {imageDisplay}
                                        <div className="mt-3">
                                            <h4>{this.state.fname + ' ' + this.state.lname}</h4>
                                            <p className="text-secondary mb-1">Rights: {user.rights}</p>
                                            {privilage}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col">
                            <div className="card mb-3">
                                <div className="card-body">
                                    <h6 className="d-flex align-items-center mb-3"><i className="material-icons text-success mr-2">Profile Settings</i></h6>
                                    <div className="row">
                                        <div className="col-sm-12">
                                            <h6 className="mb-0">First Name</h6>
                                        </div>
                                        <div className="col text-secondary">
                                            {fnameField[this.state.view]}
                                        </div>
                                    </div>
                                    <hr />
                                    <div className="row">
                                        <div className="col-sm-12">
                                            <h6 className="mb-0">Last Name</h6>
                                        </div>
                                        <div className="col text-secondary">
                                            {lnameField[this.state.view]}
                                        </div>
                                    </div>
                                    <hr />
                                    <div className="row">
                                        <div className="col-sm-12">
                                            <h6 className="mb-0">Email </h6>
                                        </div>
                                        <div className="col text-secondary">
                                            {emailField[this.state.view]}
                                        </div>
                                    </div>
                                    <hr />
                                    <div className="row">
                                        <div className="col-sm-12">
                                            <h6 className="mb-0">Mobile</h6>
                                        </div>
                                        <div className="col text-secondary">
                                            {mobileField[this.state.view]}
                                        </div>
                                    </div>
                                    <hr />
                                    <div className="row">
                                        <div className="col-sm-12">
                                            <h6 className="mb-0">Address</h6>
                                        </div>
                                        <div className="col text-secondary">
                                            {addressField[this.state.view]}
                                        </div>
                                    </div>
                                    <hr />
                                    {imageUpload[this.state.view]}
                                    <div className="row">
                                        <div className="col-sm-12">
                                            <a className="btn btn-success" onClick={() => (this.state.view === this.DISPLAY ? this.setState({ view: this.MODIFY }) : this.modifyProfile())}>{editSaveButton[this.state.view]}</a><div className="text-danger">{this.state.err}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm mb-3">
                            <div className="card h-100">
                                <div className="card-body">
                                    <h6 className="d-flex align-items-center mb-3"><i className="material-icons text-success mr-2">Purchases</i></h6>
                                    {purchase_list}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>);
    }
}
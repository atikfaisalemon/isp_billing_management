import React, { Component } from 'react'
import Header from '../Header';
import Sidebar from '../Sidebar';
import Footer from '../Footer';
import { Link } from "react-router-dom";
import { findClientById, viewClientonJson } from '../../services/client'
import { storeBill } from '../../services/bill'
import Select from 'react-select';
import Swal from 'sweetalert2'

export default class Bill extends Component {

    render() {
        return (
            <>
                <Header />
                <Sidebar />
                <div className="page-container">

                    <div className="main-content">
                        <div className="page-header">
                            <h2 className="header-title">Bill</h2>
                            <div className="header-sub-title">
                                <nav className="breadcrumb breadcrumb-dash">
                                    <Link to="/dashboard" className="breadcrumb-item"><i className="anticon anticon-home m-r-5"></i>Home</Link>
                                    <Link className="breadcrumb-item" to="/bill">Bill List</Link>
                                </nav>
                            </div>
                        </div>
                        <div className="card">
                            <div className="card-body">
                                <h4>Collect Bill</h4>
                                <BillForm {...this.props} />
                            </div>
                        </div>
                    </div>
                    <Footer />
                </div>
            </>
        )
    }
}


export class BillForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            bill_date: '',
            client: '',
            amount: '',
            remarks: '',
            isLoading: false,
            error: '',
            options: [],
            selectedClient: null
        }
    }

    componentDidMount() {
        viewClientonJson().then((res) => {
            this.setState({ options: res.data })
        }).catch(e => { console.log(e) })
    }
    // componentDidUpdate() {
    //     if (this.state.client.value) {
    //         findClientById(this.state.client.value).then((res) => {
    //             this.setState({
    //                 amount: res.data.package.price
    //             })

    //         }).catch((err) => { console.log(err) })
    //     }
    // }
    changeInput(e) {
        this.setState({ [e.target.name]: e.target.value })
    }
    handleChange = client => {
        this.setState({ client });
    };
    async submitFrom(e) {
        const { history } = this.props;
        this.setState({ isLoading: true })
        e.preventDefault();
        const postBody = {
            bill_date: this.state.bill_date,
            amount: this.state.amount,
            client: this.state.client.value,
            remarks: this.state.remarks
        }
        const response = await storeBill(postBody);
        if (response.data.success) {
            history.push('/bill')
            Swal.fire({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                icon: 'success',
                title: 'Bill Information Updated'
            })
        } else {
            this.setState({ isLoading: false })
            Swal.fire({
                icon: 'error',
                title: 'Oops... Something went wrong!',
                text: response.data.error,
            })
        }
    }
    render() {
        return (
            <>
                <div className="m-t-25">
                    <form onSubmit={(e) => this.submitFrom(e)}>
                        <div className="row">
                            <div className="col-sm-6">

                                <div className="form-group">
                                    <label htmlFor="bill_date"> Select Client</label>
                                    <Select
                                        onChange={this.handleChange}
                                        options={this.state.options}
                                        value={this.state.client}
                                    />
                                </div>
                            </div>

                            <div className="col-sm-6">
                                <div className="form-group">
                                    <label htmlFor="bill_date"> Date</label>
                                    <input type="date" className="form-control" id="bill_date" placeholder="eg. Tuhin Khan" name="bill_date" value={this.state.bill_date} onChange={(e) => this.changeInput(e)} />
                                </div>
                            </div>
                            <div className="col-sm-6">
                                <div className="form-group">
                                    <label htmlFor="amount">Amount</label>
                                    <input type="text" className="form-control" id="amount" placeholder="eg. 5000" name="amount" value={this.state.amount} onChange={(e) => this.changeInput(e)} />
                                </div>
                            </div>
                            <div className="col-sm-6">
                                <div className="form-group">
                                    <label htmlFor="remarks">Remark</label>
                                    <input type="text" className="form-control" id="remarks" placeholder="eg." name="remarks" value={this.state.remarks} onChange={(e) => this.changeInput(e)} />
                                </div>
                            </div>
                        </div>

                        <input type="submit" className="btn btn-primary" value={this.state.isLoading ? "Saving..." : "Save"} disabled={this.state.isLoading} />
                    </form>

                </div>
            </>
        )
    }
}
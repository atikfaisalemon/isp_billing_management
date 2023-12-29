import Axios from "axios"
import moment from "moment";
import React, { useEffect, useState } from "react"
import DataTable from "react-data-table-component";
import logo from "../../img/logo.jpg"

const column = [
    {
        name: 'Collection Date',
        sortable: true,
        cell: row => <>
            {moment(row.collection_date).format("MMMM Do, YYYY")}
        </>,
    },
    {
        name: 'Amount',
        selector: 'amount',
        sortable: true,
    },
    {
        name: 'Remarks',
        selector: 'description',
        sortable: true,
    },
    {
        name: 'Status',
        selector: 'status',
        sortable: true,
        cell: row => <>
            {row.status ? <span className='badge badge-success'>Approved</span> : <span className='badge badge-danger'>Pending</span>}
        </>,
    },

]

export default function ClientDashboard() {
    const [client, setClient] = useState(null)
    const [error, setError] = useState(null)

    const OnSubmit = (data) => {
        Axios.post("http://127.0.0.1:8000/api/client/find", data).then(res => {
            if (res.data.success) {
                setClient(res.data)
                setError(null);
                window.localStorage.setItem("client", JSON.stringify(res.data))
            } else {
                setError(res.data.message)
            }
        }).catch(e => console.log(e))
    }

    useEffect(() => {
        if (typeof window !== "undefined") {
            const client = window.localStorage.getItem("client");
            if (client) {
                const clientJson = JSON.parse(client)
                const data = {
                    username: clientJson.client.user_name,
                    phone: clientJson.client.phone
                }
                Axios.post("http://127.0.0.1:8000/api/client/find", data).then(res => {
                    if (res.data.success) {
                        window.localStorage.setItem("client", JSON.stringify(res.data))
                        setClient(clientJson)
                        setError(null);
                    }
                }).catch(e => console.log(e))
            }
        }
    }, [])

    const handleLogout = () => {
        window.localStorage.removeItem("client")
        setClient(null)
    }

    return (
        <>
            <div className="container mt-4 d-flex flex-column justify-content-between" style={{
                height: "100vh"
            }}>


                {
                    client ? (
                        <div className="card">
                            <div className="card-body">
                                {/* Logout button */}
                                <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
                                {/* Client info */}
                                <div className="d-flex flex-column justify-content-center align-items-center">
                                    <h4>{client.client.client_name}</h4>
                                    <p><b>Username:</b> {client.client.user_name}</p>
                                    <p><b>Phone</b> {client.client.phone}</p>
                                    <p><b>Package name:</b> {client.client.package.name}</p>
                                    <p><b>Package price:</b> {client.client.package.price}</p>
                                    <p><b>Address</b> {client.client.address}</p>
                                    <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#exampleModal">
                                        Pay Bills
                                    </button>

                                    <div className="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                        <div className="modal-dialog" role="document">
                                            <div className="modal-content">
                                                <div className="modal-header">
                                                    <h5 className="modal-title" id="exampleModalLabel">Modal title</h5>
                                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                                        <span aria-hidden="true">&times;</span>
                                                    </button>
                                                </div>
                                                <div className="modal-body">
                                                    <PaymentForm client={client} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* Transaction history */}
                                <div className="m-t-25">
                                    <DataTable
                                        columns={column}
                                        data={client.data}
                                        pagination={true}
                                        noHeader={true}
                                        highlightOnHover
                                    />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="d-flex justify-content-center align-items-center mt-5">

                                <LoginForm OnSubmit={OnSubmit} error={error} />
                            </div>
                        </>
                    )
                }

                <Footer />
            </div>

        </>
    )
}

import BkashQrCode from "../../img/bkash_qr_code.jpg"
import dayjs from "dayjs";
import { storeBillByClient } from "../../services/bill";
import Swal from "sweetalert2";

function PaymentForm({ client }) {
    const [formData, setFormData] = useState({
        bill_date: dayjs(new Date()).format('YYYY-MM-DD'),
        amount: client.client.package.price.toString(),
        remarks: "",
        client: client.client.id
    })

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(old => ({ ...old, [name]: value }))
    }

    const SubmitForm = async (e) => {
        e.preventDefault()
        const response = await storeBillByClient(formData);
        if (response.data.success) {
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
    return (
        <>
            <div className="text-center">

                <img src={BkashQrCode} alt="bkash qr code" className="w-50" />
            </div>
            <form onSubmit={SubmitForm}>
                <div className="row">
                    <div className="col-sm-6">
                        <div className="form-group">
                            <label htmlFor="bill_date"> Date</label>
                            <input type="date" className="form-control" id="bill_date" placeholder="eg. Tuhin Khan" name="bill_date" value={formData.bill_date} onChange={handleChange} />
                        </div>
                    </div>
                    <div className="col-sm-6">
                        <div className="form-group">
                            <label htmlFor="amount">Amount</label>
                            <input type="text" className="form-control" id="amount" placeholder="eg. 5000" name="amount" value={formData.amount} onChange={handleChange} />
                        </div>
                    </div>
                    <div className="col-sm-6">
                        <div className="form-group">
                            <label htmlFor="remarks">Transaction number</label>
                            <input type="text" className="form-control" id="remarks" placeholder="eg. 123xxxxxxx" name="remarks" value={formData.remarks} onChange={handleChange} />
                        </div>
                    </div>
                </div>

                <input type="submit" className="btn btn-primary" value="Save" />
            </form>
        </>
    )
}

function LoginForm({ OnSubmit, error }) {
    const [formState, setFormState] = useState({
        username: "",
        phone: ""
    })

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormState({
            ...formState,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = formState
        OnSubmit(data);
    }
    return (
        <>
            <form onSubmit={handleSubmit} style={{
                maxWidth: "400px",
                width: "100%"
            }}>
                <div className="form-group">
                    <label htmlFor="usernameLabel">Username</label>
                    <input type="text" className="form-control" id="usernameLabel" placeholder="Enter username" name="username" value={formState.username}
                        onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="phonLabel">Phone</label>
                    <input type="text" className="form-control" id="phonLabel" placeholder="Phone" name="phone" value={formState.phone}
                        onChange={handleChange} />
                </div>
                {
                    error && <p className="text-danger">{error}</p>
                }
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </>
    )
}

export function Footer() {
    return <footer className="pt-4 my-md-5 pt-md-5 border-top">
        <div className="row">
            <div className="col-12 col-md">
                <img className="mb-2" src={logo} alt="" width="80" height="80" />
                <small className="d-block mb-3 text-muted">&copy; 2023-2024</small>
            </div>
            <div className="col-6 col-md">
                <h5>Address</h5>
                <ul className="list-unstyled text-small">
                    <li><a>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-geo-alt-fill" viewBox="0 0 16 16">
                            <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10m0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6" />
                        </svg>
                        <span className='ml-1'>Uttara Sector 10</span></a></li>


                    <li><a>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-signpost-2" viewBox="0 0 16 16">
                            <path d="M7 1.414V2H2a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h5v1H2.5a1 1 0 0 0-.8.4L.725 8.7a.5.5 0 0 0 0 .6l.975 1.3a1 1 0 0 0 .8.4H7v5h2v-5h5a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1H9V6h4.5a1 1 0 0 0 .8-.4l.975-1.3a.5.5 0 0 0 0-.6L14.3 2.4a1 1 0 0 0-.8-.4H9v-.586a1 1 0 0 0-2 0zM13.5 3l.75 1-.75 1H2V3zm.5 5v2H2.5l-.75-1 .75-1z" />
                        </svg>
                        <span className='ml-1'>Road No 20</span></a></li>

                    <li><a>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-house-door-fill" viewBox="0 0 16 16">
                            <path d="M6.5 14.5v-3.505c0-.245.25-.495.5-.495h2c.25 0 .5.25.5.5v3.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5" />
                        </svg>
                        <span className='ml-1'>House No 32</span></a></li>
                </ul>
            </div>
            <div className="col-6 col-md">
                <h5>Service</h5>
                <ul className="list-unstyled text-small">
                    <li><a>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-headset" viewBox="0 0 16 16">
                            <path d="M8 1a5 5 0 0 0-5 5v1h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a6 6 0 1 1 12 0v6a2.5 2.5 0 0 1-2.5 2.5H9.366a1 1 0 0 1-.866.5h-1a1 1 0 1 1 0-2h1a1 1 0 0 1 .866.5H11.5A1.5 1.5 0 0 0 13 12h-1a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1h1V6a5 5 0 0 0-5-5" />
                        </svg>
                        <span className='ml-1'>Helpline</span></a></li>

                    <li><a className="text-muted" href="#">+8801712965007</a></li>

                    <li><a>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-bank" viewBox="0 0 16 16">
                            <path d="m8 0 6.61 3h.89a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5H15v7a.5.5 0 0 1 .485.38l.5 2a.498.498 0 0 1-.485.62H.5a.498.498 0 0 1-.485-.62l.5-2A.501.501 0 0 1 1 13V6H.5a.5.5 0 0 1-.5-.5v-2A.5.5 0 0 1 .5 3h.89zM3.777 3h8.447L8 1zM2 6v7h1V6zm2 0v7h2.5V6zm3.5 0v7h1V6zm2 0v7H12V6zM13 6v7h1V6zm2-1V4H1v1zm-.39 9H1.39l-.25 1h13.72l-.25-1Z" />
                        </svg>
                        <span className='ml-1'>Payment Issue</span></a></li>

                    <li><a className="text-muted" href="#">+8801789393745</a></li>
                </ul>
            </div>
            <div className="col-6 col-md">
                <h5>Find Us</h5>
                <ul className="list-unstyled text-small">
                    <li><a className="text-muted" href="https://wwww.facebook.com/signalicon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-facebook" viewBox="0 0 16 16">
                            <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951" />
                        </svg>
                        <span className='ml-1'>Facebook</span></a></li>

                    <li><a className="text-muted" href="#">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-youtube" viewBox="0 0 16 16">
                            <path d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.009.104c-.05.572-.124 1.14-.235 1.558a2.007 2.007 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.007 2.007 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31.4 31.4 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103.003-.052.008-.104.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.007 2.007 0 0 1 1.415-1.42c.487-.13 1.544-.21 2.654-.26l.17-.007.172-.006.086-.003.171-.007A99.788 99.788 0 0 1 7.858 2h.193zM6.4 5.209v4.818l4.157-2.408z" />
                        </svg>
                        <span className='ml-1'>Youtube</span></a></li>


                    <li><a className="text-muted" href="signalicongp@gmail.com">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-envelope-at-fill" viewBox="0 0 16 16">
                            <path d="M2 2A2 2 0 0 0 .05 3.555L8 8.414l7.95-4.859A2 2 0 0 0 14 2zm-2 9.8V4.698l5.803 3.546L0 11.801Zm6.761-2.97-6.57 4.026A2 2 0 0 0 2 14h6.256A4.493 4.493 0 0 1 8 12.5a4.49 4.49 0 0 1 1.606-3.446l-.367-.225L8 9.586l-1.239-.757ZM16 9.671V4.697l-5.803 3.546.338.208A4.482 4.482 0 0 1 12.5 8c1.414 0 2.675.652 3.5 1.671" />
                            <path d="M15.834 12.244c0 1.168-.577 2.025-1.587 2.025-.503 0-1.002-.228-1.12-.648h-.043c-.118.416-.543.643-1.015.643-.77 0-1.259-.542-1.259-1.434v-.529c0-.844.481-1.4 1.26-1.4.585 0 .87.333.953.63h.03v-.568h.905v2.19c0 .272.18.42.411.42.315 0 .639-.415.639-1.39v-.118c0-1.277-.95-2.326-2.484-2.326h-.04c-1.582 0-2.64 1.067-2.64 2.724v.157c0 1.867 1.237 2.654 2.57 2.654h.045c.507 0 .935-.07 1.18-.18v.731c-.219.1-.643.175-1.237.175h-.044C10.438 16 9 14.82 9 12.646v-.214C9 10.36 10.421 9 12.485 9h.035c2.12 0 3.314 1.43 3.314 3.034zm-4.04.21v.227c0 .586.227.8.581.8.31 0 .564-.17.564-.743v-.367c0-.516-.275-.708-.572-.708-.346 0-.573.245-.573.791Z" />
                        </svg>
                        <span className='ml-1'>signalicongp@gmail.com</span></a></li>
                </ul>
            </div>
        </div>
    </footer>
}
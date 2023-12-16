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
                setClient(JSON.parse(client))
                setError(null);
            }
        }
    }, [client])

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
                    <li><a className="text-muted" href="#">Uttara Sector 10</a></li>
                    <li><a className="text-muted" href="#">Road 20</a></li>
                    <li><a className="text-muted" href="#">House 32</a></li>
                </ul>
            </div>
            <div className="col-6 col-md">
                <h5>Service</h5>
                <ul className="list-unstyled text-small">
                    <li><a className="text-muted" href="#">Support Number</a></li>
                    <li><a className="text-muted" href="#">+8801712965007</a></li>
                    <li><a className="text-muted" href="#">Payment Support</a></li>
                    <li><a className="text-muted" href="#">+8801789393745</a></li>
                </ul>
            </div>
            <div className="col-6 col-md">
                <h5>Find Us</h5>
                <ul className="list-unstyled text-small">
                <li><a className="text-muted" href="https://wwww.facebook.com/signalicon">Facebook</a></li>
                    <li><a className="text-muted" href="#">Youtube/signalicon</a></li>
                    <li><a className="text-muted" href="#">Email</a></li>
                    <li><a className="text-muted" href="#">signalicongp@gmail.com</a></li>
                </ul>
            </div>
        </div>
    </footer>
}
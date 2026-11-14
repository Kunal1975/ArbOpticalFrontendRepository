import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import config from "../Configsettings/appsettings.json";

interface CustomerckModel {
    customerID: number;
    custTitle: string;
    firstName: string;
    middleName: string;
    lastName: string;
    surName: string;
    sex: string;
    custEmail: string;
    dateOfbirth: string;
    age: number;
    address1: string;
    address2: string;
    address3: string;
    areaPin: string;
    dateofEnquiry: string;
    mobile: string;
    createdOn: string;
    createdBy: string;
    modifiedBy: string;
    modifiedOn: string;
}

interface CustomerPopupProps {
    onSelectCustomer: (customerID: number, mobile: string) => void;
}

const CustomerPopup: React.FC<CustomerPopupProps> = ({ onSelectCustomer }) => {
    const [customers, setCustomers] = useState<CustomerckModel[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [nameSearch, setNameSearch] = useState("");
    const [mobileSearch, setMobileSearch] = useState("");

    useEffect(() => {
        const fetchCustomer = async () => {
            try {
                const url = config.Serviceurl.FetchCustomer;
                const response = await axios.get<CustomerckModel[]>(url);
                setCustomers(Array.isArray(response.data) ? response.data : []);
            } catch (err) {
                console.error("API Error:", err);
                setError("Error fetching customers. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        void fetchCustomer();
    }, []);

    const filteredCustomers = useMemo(() => {
        const name = nameSearch.trim().toLowerCase();
        const mobile = mobileSearch.trim().toLowerCase();

        return customers.filter(customer =>
            (customer.firstName ?? "").toLowerCase().includes(name) &&
            (customer.mobile ?? "").toLowerCase().includes(mobile)
        );
    }, [customers, nameSearch, mobileSearch]);

    const handleSelect = (customer: CustomerckModel) => {
        onSelectCustomer(customer.customerID, customer.mobile ?? "");
    };

    return (
        <>
            <div
                className="col-sm-12 container"
                style={{
                    marginTop: "2%",
                    background: "#59afd5",
                    color: "white",
                    fontWeight: "bold",
                    padding: "8px"
                }}
            >
                List of Customers
            </div>

            <div className="card col-sm-12 container">
                <div
                    className="row"
                    style={{ marginTop: "1%", overflow: "auto", maxHeight: "450px" }}
                >
                    {loading && <p>Loading customers...</p>}
                    {error && <p className="text-danger">{error}</p>}

                    {!loading && !error && (
                        <>
                            <table
                                className="table table-bordered table-hover"
                                style={{
                                    borderCollapse: "collapse",
                                    width: "100%",
                                    fontSize: "12px"
                                }}
                            >
                                <thead>
                                    <tr>
                                        <th>Serial No</th>
                                        <th>ID</th>
                                        <th>Title</th>
                                        <th>First Name</th>
                                        <th>Last Name</th>
                                        <th>Sex</th>
                                        <th>Age</th>
                                        <th>Mobile</th>
                                        <th>Action</th>
                                    </tr>
                                    <tr>
                                        <th />
                                        <th />
                                        <th />
                                        <th>
                                            <input
                                                type="text"
                                                className="form-control form-control-sm"
                                                placeholder="Search name"
                                                value={nameSearch}
                                                onChange={e => setNameSearch(e.target.value)}
                                            />
                                        </th>
                                        <th />
                                        <th />
                                        <th />
                                        <th>
                                            <input
                                                type="text"
                                                className="form-control form-control-sm"
                                                placeholder="Search mobile"
                                                value={mobileSearch}
                                                onChange={e => setMobileSearch(e.target.value)}
                                            />
                                        </th>
                                        <th />
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredCustomers.map((item, index) => (
                                        <tr key={item.customerID}>
                                            <td>{index + 1}</td>
                                            <td>{item.customerID}</td>
                                            <td>{item.custTitle || "N/A"}</td>
                                            <td>{item.firstName || "N/A"}</td>
                                            <td>{item.lastName || "N/A"}</td>
                                            <td>{item.sex || "N/A"}</td>
                                            <td>{item.age || "N/A"}</td>
                                            <td>{item.mobile || "N/A"}</td>
                                            <td>
                                                <button
                                                    type="button"
                                                    className="btn btn-primary btn-sm"
                                                    onClick={() => handleSelect(item)}
                                                >
                                                    Select
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredCustomers.length === 0 && (
                                        <tr>
                                            <td colSpan={9} className="text-center">
                                                No matching customers found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default CustomerPopup;

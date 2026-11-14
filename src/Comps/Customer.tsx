import React, { useEffect, useState } from "react";
import axios from "axios";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { FaEdit } from "react-icons/fa";
import DeskTop from "./DeskTop";
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

const PAGE_SIZE = 30;

const Customer: React.FC = () => {
  const [data, setData] = useState<CustomerckModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editCustomer, setEditCustomer] =
    useState<CustomerckModel | null>(null);

  useEffect(() => {
    void fetchCustomer();
  }, []);

  const fetchCustomer = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get<CustomerckModel[]>(
        config.Serviceurl.FetchCustomer
      );
      setData(response.data ?? []);
    } catch (err) {
      setError("Error fetching data");
      console.error("API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const dateOnly = (value?: string) => value?.split("T")[0] || "";

  const openEditPopup = (customerID: number) => {
    const customer = data.find((item) => item.customerID === customerID);

    if (customer) {
      setEditCustomer({ ...customer });
    }
  };

  const closeEditPopup = () => {
    setEditCustomer(null);
  };

  const updateEditField = (
    field: keyof CustomerckModel,
    value: string | number
  ) => {
    setEditCustomer((current) =>
      current ? { ...current, [field]: value } : current
    );
  };

  const handleUpdate = async () => {
    if (!editCustomer) return;

    const payload: CustomerckModel = {
      ...editCustomer,
      customerID: Number(editCustomer.customerID),
      age: Number(editCustomer.age),
      modifiedBy: localStorage.getItem("userName") ?? "",
      modifiedOn: new Date().toISOString(),
    };

    try {
      await axios.put(config.Serviceurl.UpdateCustomer, payload);

      setData((current) =>
        current.map((item) =>
          item.customerID === payload.customerID ? payload : item
        )
      );

      setEditCustomer(payload);
      alert("Customer updated successfully");
    } catch (err) {
      console.error("Customer update failed:", err);
      alert("Failed to update customer");
    }
  };

  const columns: GridColDef<CustomerckModel>[] = [
    {
      field: "serialNo",
      headerName: "Serial No",
      width: 90,
      sortable: false,
      filterable: false,
      valueGetter: (_value, row) =>
        data.findIndex((item) => item.customerID === row.customerID) + 1,
    },
    { field: "customerID", headerName: "ID", width: 85 },
    { field: "custTitle", headerName: "Title", width: 90 },
    { field: "firstName", headerName: "First Name", minWidth: 130, flex: 1 },
    { field: "lastName", headerName: "Last Name", minWidth: 130, flex: 1 },
    { field: "sex", headerName: "Sex", width: 80 },
    { field: "age", headerName: "Age", width: 75 },
    { field: "mobile", headerName: "Mobile", minWidth: 130 },
    {
      field: "dateofEnquiry",
      headerName: "Date of Enquiry",
      width: 140,
      valueFormatter: (value) => dateOnly(String(value ?? "")),
    },
    { field: "address3", headerName: "Purpose", minWidth: 140, flex: 1 },
    { field: "areaPin", headerName: "Pin", width: 90 },
    { field: "custEmail", headerName: "Email", minWidth: 170, flex: 1 },
    {
      field: "dateOfbirth",
      headerName: "Birthday",
      width: 130,
      valueFormatter: (value) => dateOnly(String(value ?? "")),
    },
    {
      field: "edit",
      headerName: "Edit",
      width: 75,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <button
          type="button"
          className="btn btn-sm btn-outline-primary"
          aria-label={`Edit customer ${params.row.customerID}`}
          title="Edit customer"
          onClick={() => openEditPopup(params.row.customerID)}
        >
          <FaEdit />
        </button>
      ),
    },
  ];

  return (
    <>
      <DeskTop />

      <div
        className="col-sm-10 container"
        style={{
          marginTop: "2%",
          background: "#59afd5",
          color: "white",
          fontWeight: "bold",
        }}
      >
        List of Customers
      </div>

      <div className="card col-sm-10 container">
        {error && (
          <p role="alert" style={{ color: "red", marginTop: 12 }}>
            {error}
          </p>
        )}

        <div style={{ height: 500, width: "100%", marginTop: "1%" }}>
          <DataGrid
            rows={data}
            columns={columns}
            getRowId={(row) => row.customerID}
            loading={loading}
            showToolbar
            pageSizeOptions={[PAGE_SIZE]}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: PAGE_SIZE },
              },
            }}
            disableRowSelectionOnClick
          />
        </div>

        <div style={{ padding: "8px 12px", fontWeight: 600 }}>
          Total customers: {data.length}
        </div>
      </div>

      {editCustomer && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-customer-title"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1050,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
          }}
        >
          <div
            className="card"
            style={{
              width: "min(700px, 100%)",
              maxHeight: "90vh",
              overflowY: "auto",
              padding: 20,
            }}
          >
            <div className="d-flex justify-content-between align-items-start mb-3">
              <h5 id="edit-customer-title" className="mb-0">
                Edit - {editCustomer.custTitle} {editCustomer.firstName}{" "}
                {editCustomer.lastName}
              </h5>

              <span className="text-muted">
                Customer ID: {editCustomer.customerID}
              </span>
            </div>

            <div className="row g-2">
              <div className="col-md-6">
                <label htmlFor="editTitle" className="form-label">
                  Title
                </label>
                <input
                  id="editTitle"
                  className="form-control"
                  value={editCustomer.custTitle}
                  onChange={(e) =>
                    updateEditField("custTitle", e.target.value)
                  }
                />
              </div>

              <div className="col-md-6">
                <label htmlFor="editFirstName" className="form-label">
                  First Name
                </label>
                <input
                  id="editFirstName"
                  className="form-control"
                  value={editCustomer.firstName}
                  onChange={(e) =>
                    updateEditField("firstName", e.target.value)
                  }
                />
              </div>

              <div className="col-md-6">
                <label htmlFor="editMiddleName" className="form-label">
                  Middle Name
                </label>
                <input
                  id="editMiddleName"
                  className="form-control"
                  value={editCustomer.middleName}
                  onChange={(e) =>
                    updateEditField("middleName", e.target.value)
                  }
                />
              </div>

              <div className="col-md-6">
                <label htmlFor="editLastName" className="form-label">
                  Last Name
                </label>
                <input
                  id="editLastName"
                  className="form-control"
                  value={editCustomer.lastName}
                  onChange={(e) =>
                    updateEditField("lastName", e.target.value)
                  }
                />
              </div>

              <div className="col-md-6">
                <label htmlFor="editSex" className="form-label">
                  Sex
                </label>
                <input
                  id="editSex"
                  className="form-control"
                  value={editCustomer.sex}
                  onChange={(e) => updateEditField("sex", e.target.value)}
                />
              </div>

              <div className="col-md-6">
                <label htmlFor="editAge" className="form-label">
                  Age
                </label>
                <input
                  id="editAge"
                  type="number"
                  className="form-control"
                  value={editCustomer.age}
                  onChange={(e) =>
                    updateEditField("age", Number(e.target.value))
                  }
                />
              </div>

              <div className="col-md-6">
                <label htmlFor="editMobile" className="form-label">
                  Mobile
                </label>
                <input
                  id="editMobile"
                  className="form-control"
                  value={editCustomer.mobile}
                  onChange={(e) => updateEditField("mobile", e.target.value)}
                />
              </div>

              <div className="col-md-6">
                <label htmlFor="editEnquiry" className="form-label">
                  Date of Enquiry
                </label>
                <input
                  id="editEnquiry"
                  type="date"
                  className="form-control"
                  value={dateOnly(editCustomer.dateofEnquiry)}
                  onChange={(e) =>
                    updateEditField("dateofEnquiry", e.target.value)
                  }
                />
              </div>

              <div className="col-md-6">
                <label htmlFor="editPurpose" className="form-label">
                  Purpose
                </label>
                <textarea
                  id="editPurpose"
                  className="form-control"
                  value={editCustomer.address3}
                  onChange={(e) => updateEditField("address3", e.target.value)}
                />
              </div>

              <div className="col-md-6">
                <label htmlFor="editPin" className="form-label">
                  Pin
                </label>
                <input
                  id="editPin"
                  className="form-control"
                  value={editCustomer.areaPin}
                  onChange={(e) => updateEditField("areaPin", e.target.value)}
                />
              </div>

              <div className="col-md-6">
                <label htmlFor="editEmail" className="form-label">
                  Email
                </label>
                <input
                  id="editEmail"
                  type="email"
                  className="form-control"
                  value={editCustomer.custEmail}
                  onChange={(e) =>
                    updateEditField("custEmail", e.target.value)
                  }
                />
              </div>

              <div className="col-md-6">
                <label htmlFor="editBirthday" className="form-label">
                  Birthday
                </label>
                <input
                  id="editBirthday"
                  type="date"
                  className="form-control"
                  value={dateOnly(editCustomer.dateOfbirth)}
                  onChange={(e) =>
                    updateEditField("dateOfbirth", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="d-flex justify-content-end gap-2 mt-3">
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleUpdate}
              >
                Update
              </button>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={closeEditPopup}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Customer;
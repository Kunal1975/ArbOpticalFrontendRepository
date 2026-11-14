import React, { useState } from "react";
import axios from "axios";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { Modal } from "react-bootstrap";
import DeskTop from "./DeskTop";
import config from "../Configsettings/appsettings.json";

interface OrderList {
  orderId: number;
  orderFolio: string;
  orderDate: string;
  orderType: string;
  custMobile: string;
  firstName: string;
  lastName: string;
  inventoryID: number;
  brandName: string;
  model: string;
  color: string;
  lensType: string;
  lensVENDOR: string;
  fvendor: string;
  rsph: string;
  rcyl: string;
  raxis: number;
  rAdd: string;
  rva: string;
  lsph: string;
  lcyl: string;
  laxis: string;
  lAdd: string;
  lva: string;
  repd: number;
  lepd: number;
  rFittingHeight: number;
  lFittingHeight: number;
  rBifocalHeight: number;
  lbifocalheight: number;
  tint: string;
  amount: number;
  discount: number;
  advance: number;
  outstanding: number;
  createdBy: string;
  createdAt: string | Date;
  orderStatus: string;
}

interface InvoiceResponse {
  invoiceId: number;
  orederId: number;
  custMobile: string;
  framMrp: number;
  lensMrp: number;
  discount: number;
  amountReceived: number;
  invoicestatus: string;
  isDailyLedgerUpdated: number;
  createdBy: string;
  createdDate: string;
}

interface InvoiceForm {
  orderId: number;
  mobile: string;
  frameMrp: string;
  lensMrp: string;
  received: string;
}

const PAGE_SIZE = 30;

const emptyInvoice: InvoiceForm = {
  orderId: 0,
  mobile: "",
  frameMrp: "",
  lensMrp: "",
  received: "",
};

const OrderList: React.FC = () => {
  const [orders, setOrders] = useState<OrderList[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showInvoice, setShowInvoice] = useState(false);
  const [invoiceOrder, setInvoiceOrder] = useState<OrderList | null>(null);
  const [invoiceForm, setInvoiceForm] = useState<InvoiceForm>(emptyInvoice);

  const [showOrderUpdate, setShowOrderUpdate] = useState(false);
  const [updateOrder, setUpdateOrder] = useState<OrderList | null>(null);
  const [updatedLensType, setUpdatedLensType] = useState("");
  const [fittingCharge, setFittingCharge] = useState("");

  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [totals, setTotals] = useState({
    amount: 0,
    discount: 0,
    outstanding: 0,
  });

  const fetchOrders = async () => {
    if (!dateRange.from || !dateRange.to) {
      setError("Select both From and To dates before loading orders.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get<OrderList[]>(
        `${config.Serviceurl.ViewOrder}/${dateRange.from}/${dateRange.to}`
      );

      const fetchedOrders = response.data ?? [];
      setOrders(fetchedOrders);

      setTotals({
        amount: fetchedOrders.reduce(
          (sum, item) => sum + (Number(item.amount) || 0),
          0
        ),
        discount: fetchedOrders.reduce(
          (sum, item) => sum + (Number(item.discount) || 0),
          0
        ),
        outstanding: fetchedOrders.reduce(
          (sum, item) => sum + (Number(item.outstanding) || 0),
          0
        ),
      });
    } catch (err) {
      setError("Error fetching orders. Please try again.");
      console.error("Order API error:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (value?: string | Date | null) => {
    if (!value) return "N/A";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "N/A";

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-2);

    return `${day}-${month}-${year}`;
  };

  const openInvoice = (order: OrderList) => {
    if (order.orderStatus?.toLowerCase() === "invoiced") return;

    setInvoiceOrder(order);
    setInvoiceForm({
      ...emptyInvoice,
      orderId: order.orderId,
      mobile: order.custMobile ?? "",
      received: String(order.amount ?? ""),
    });
    setShowInvoice(true);
  };

  const createInvoice = async () => {
    if (!invoiceOrder) return;

    const payload = {
      orederId: invoiceOrder.orderId,
      custMobile: invoiceOrder.custMobile,
      framMrp: Number(invoiceForm.frameMrp) || 0,
      lensMrp: Number(invoiceForm.lensMrp) || 0,
      discount: Number(invoiceOrder.discount) || 0,
      advance: Number(invoiceOrder.advance) || 0,
      amountReceived: Number(invoiceForm.received) || 0,
      createdBy: localStorage.getItem("userName") || "unknown",
    };

    try {
      const response = await axios.post<InvoiceResponse>(
        config.Serviceurl.Invoice,
        payload
      );

      if (response.data.invoiceId > 0) {
        setOrders((current) =>
          current.map((item) =>
            item.orderId === invoiceOrder.orderId
              ? { ...item, orderStatus: "Invoiced" }
              : item
          )
        );

        setShowInvoice(false);
        setInvoiceOrder(null);
        alert("Invoice created successfully.");
      } else {
        alert("Invoice was not created. Please check the response and try again.");
      }
    } catch (err) {
      console.error("Invoice creation failed:", err);
      alert("Failed to create invoice. Please try again.");
    }
  };

  const openOrderUpdate = (order: OrderList) => {
    if (order.orderStatus?.toLowerCase() !== "pending") return;

    setUpdateOrder(order);
    setUpdatedLensType(order.lensType ?? "");
    setFittingCharge("");
    setShowOrderUpdate(true);
  };

  const saveOrderUpdate = async () => {
    if (!updateOrder) return;

    const payload = {
      orderfolio: updateOrder.orderFolio,
      lenstype: updatedLensType,
      fittingCharge: Number(fittingCharge) || 0,
      orderDate: new Date(),
    };

    try {
      const response = await axios.put(
        config.Serviceurl.UpdateOrder,
        payload
      );

      setOrders((current) =>
        current.map((item) =>
          item.orderId === updateOrder.orderId
            ? { ...item, lensType: updatedLensType }
            : item
        )
      );

      alert(response.data?.message ?? "Order updated successfully.");
      setShowOrderUpdate(false);
      setUpdateOrder(null);
    } catch (err) {
      console.error("Order update failed:", err);
      alert("Failed to update order. Please try again.");
    }
  };

  const columns: GridColDef<OrderList>[] = [
    {
      field: "serialNo",
      headerName: "Serial No",
      width: 85,
      sortable: false,
      filterable: false,
      renderCell: (params) =>
        params.api.getRowIndexRelativeToVisibleRows(params.id) + 1,
    },
    { field: "orderId", headerName: "Order ID", width: 90 },
    { field: "orderFolio", headerName: "Order Folio", minWidth: 170, flex: 1 },
    {
      field: "orderDate",
      headerName: "Order Date",
      width: 115,
      valueFormatter: (value) => formatDate(value as string),
    },
    { field: "orderType", headerName: "Order Type", width: 110 },
    { field: "firstName", headerName: "First Name", width: 120 },
    { field: "lastName", headerName: "Last Name", width: 120 },
    { field: "custMobile", headerName: "Mobile", width: 125 },
    { field: "brandName", headerName: "Brand", width: 120 },
    { field: "model", headerName: "Model", width: 120 },
    { field: "color", headerName: "Color", width: 100 },
    {
  field: "lensType",
  headerName: "Lens Type",
  width: 150,
  renderCell: (params) => {
    const lensType = String(params.row.lensType ?? "").trim().toLowerCase();
    const showUpdateButton =
      params.row.orderStatus?.trim().toLowerCase() === "pending" &&
      lensType !== "" &&
      lensType !== "na" &&
      lensType !== "n/a";

    return (
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span>{params.row.lensType || "N/A"}</span>

        {showUpdateButton && (
          <button
            type="button"
            className="btn btn-sm btn-secondary"
            title="Update pending order lens details"
            aria-label={`Update lens type for order ${params.row.orderFolio}`}
            onClick={() => openOrderUpdate(params.row)}
          >
            …
          </button>
        )}
      </div>
    );
  },
},
    {
      field: "rightPower",
      headerName: "Right Power",
      minWidth: 205,
      valueGetter: (_value, row) =>
        `SPH ${row.rsph ?? ""} / CYL ${row.rcyl ?? ""} / AXIS ${
          row.raxis ?? ""
        } / ADD ${row.rAdd ?? ""} / VA ${row.rva ?? ""}`,
    },
    {
      field: "leftPower",
      headerName: "Left Power",
      minWidth: 205,
      valueGetter: (_value, row) =>
        `SPH ${row.lsph ?? ""} / CYL ${row.lcyl ?? ""} / AXIS ${
          row.laxis ?? ""
        } / ADD ${row.lAdd ?? ""} / VA ${row.lva ?? ""}`,
    },
    { field: "amount", headerName: "Amount", width: 100 },
    { field: "discount", headerName: "Discount", width: 100 },
    { field: "advance", headerName: "Advance", width: 100 },
    { field: "outstanding", headerName: "Outstanding", width: 120 },
    {
      field: "orderStatus",
      headerName: "Status / Invoice",
      width: 150,
      renderCell: (params) => (
        <button
          type="button"
          className={`btn btn-sm ${
            params.value?.toLowerCase() === "invoiced"
              ? "btn-success"
              : "btn-danger"
          }`}
          disabled={params.value?.toLowerCase() === "invoiced"}
          onClick={() => openInvoice(params.row)}
        >
          {params.value || "N/A"}
        </button>
      ),
    },
  ];
   

  const netAmount = totals.amount - totals.discount;
  const collectedAmount = netAmount - totals.outstanding;

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
        List of Orders Based on Date Selection
      </div>

      <div className="card col-sm-10 container" style={{height:"700"}}>
        <div
          className="row"
          style={{ marginTop: "1%", alignItems: "center" }}
        >
          <div className="col-md-6" />

          <div className="col-md-6">
            <div className="row align-items-center g-2">
              <div className="col-sm-1">
                <label htmlFor="frmorddate">From:</label>
              </div>
              <div className="col-sm-4">
                <input
                  id="frmorddate"
                  type="date"
                  className="form-control"
                  value={dateRange.from}
                  onChange={(event) =>
                    setDateRange((current) => ({
                      ...current,
                      from: event.target.value,
                    }))
                  }
                />
              </div>

              <div className="col-sm-1">
                <label htmlFor="toorddate">To:</label>
              </div>
              <div className="col-sm-4">
                <input
                  id="toorddate"
                  type="date"
                  className="form-control"
                  value={dateRange.to}
                  onChange={(event) =>
                    setDateRange((current) => ({
                      ...current,
                      to: event.target.value,
                    }))
                  }
                />
              </div>

              <div className="col-md-2">
                <button
                  className="btn btn-primary"
                  onClick={fetchOrders}
                  disabled={loading}
                >
                  {loading ? "Loading…" : "Orders"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <p role="alert" style={{ color: "red", marginTop: 12 }}>
            {error}
          </p>
        )}

        <div style={{ height: 460, width: "100%", marginTop: "1%" }}>
          <DataGrid
            rows={orders}
            columns={columns}
            getRowId={(row) => row.orderId}
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

        <div className="table-responsive" style={{ marginTop: 12,height:50 }}>
          <table className="table table-bordered table-sm mb-2">
            <tbody>
              <tr>
                <th>Total Orders</th>
                <td>{orders.length}</td>
                <th>Total Amount</th>
                <td>{totals.amount.toFixed(2)}</td>
                <th>Total Discount</th>
                <td>{totals.discount.toFixed(2)}</td>
                <th>Net Amount</th>
                <td>{netAmount.toFixed(2)}</td>
                <th>Total Outstanding</th>
                <td>{totals.outstanding.toFixed(2)}</td>
                <th>Collected</th>
                <td>{collectedAmount.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        show={showInvoice}
        onHide={() => setShowInvoice(false)}
        size="lg"
      >
        <Modal.Header>
          <div
            className="col-sm-12 container"
            style={{
              background: "#59afd5",
              color: "white",
              fontWeight: "bold",
            }}
          >
            Invoice Generation
          </div>
        </Modal.Header>

        <Modal.Body>
          <div className="col-sm-11 container">
            <div className="row">
              <div className="col-sm-2">
                <label htmlFor="txtOrderId">Order ID</label>
              </div>
              <div className="col-sm-3">
                <input
                  id="txtOrderId"
                  className="form-control"
                  readOnly
                  value={invoiceForm.orderId || ""}
                />
              </div>
              <div className="col-sm-2">
                <label htmlFor="txtMobile">Mobile No</label>
              </div>
              <div className="col-sm-4">
                <input
                  id="txtMobile"
                  className="form-control"
                  readOnly
                  value={invoiceForm.mobile}
                />
              </div>
            </div>

            <div className="row mt-2">
              <div className="col-sm-2">
                <label htmlFor="txtframeMrp">Frame MRP</label>
              </div>
              <div className="col-sm-3">
                <input
                  id="txtframeMrp"
                  type="number"
                  min="0"
                  className="form-control"
                  value={invoiceForm.frameMrp}
                  onChange={(event) =>
                    setInvoiceForm((current) => ({
                      ...current,
                      frameMrp: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="col-sm-2">
                <label htmlFor="txtlensMrp">Lens MRP</label>
              </div>
              <div className="col-sm-4">
                <input
                  id="txtlensMrp"
                  type="number"
                  min="0"
                  className="form-control"
                  value={invoiceForm.lensMrp}
                  onChange={(event) =>
                    setInvoiceForm((current) => ({
                      ...current,
                      lensMrp: event.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div className="row mt-2">
              <div className="col-sm-7" />
              <div className="col-sm-2">
                <label>Net Amount</label>
              </div>
              <div className="col-sm-3">
                <input
                  className="form-control"
                  readOnly
                  value={invoiceOrder?.amount ?? ""}
                />
              </div>
            </div>

            <div className="row mt-2">
              <div className="col-sm-7" />
              <div className="col-sm-2">
                <label>Discount</label>
              </div>
              <div className="col-sm-3">
                <input
                  className="form-control"
                  readOnly
                  value={invoiceOrder?.discount ?? ""}
                />
              </div>
            </div>

            <div className="row mt-2">
              <div className="col-sm-7" />
              <div className="col-sm-2">
                <label>Advance</label>
              </div>
              <div className="col-sm-3">
                <input
                  className="form-control"
                  readOnly
                  value={invoiceOrder?.advance ?? ""}
                />
              </div>
            </div>

            <div className="row mt-2">
              <div className="col-sm-7" />
              <div className="col-sm-2">
                <label htmlFor="txtAmount">Received</label>
              </div>
              <div className="col-sm-3">
                <input
                  id="txtAmount"
                  type="number"
                  min="0"
                  className="form-control"
                  value={invoiceForm.received}
                  onChange={(event) =>
                    setInvoiceForm((current) => ({
                      ...current,
                      received: event.target.value,
                    }))
                  }
                />
              </div>
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <button className="btn btn-primary" onClick={createInvoice}>
            Create Invoice
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => setShowInvoice(false)}
          >
            Close
          </button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showOrderUpdate}
        onHide={() => setShowOrderUpdate(false)}
        size="lg"
      >
        <Modal.Header>
          <div
            className="col-sm-12 container"
            style={{
              background: "#59afd5",
              color: "white",
              fontWeight: "bold",
            }}
          >
            Order Update
          </div>
        </Modal.Header>

        <Modal.Body>
          <div className="col-sm-11 container">
            <div className="row">
              <div className="col-sm-2">
                <label htmlFor="txtOrderfolio">Order Folio</label>
              </div>
              <div className="col-sm-4">
                <input
                  id="txtOrderfolio"
                  className="form-control"
                  readOnly
                  value={updateOrder?.orderFolio ?? ""}
                />
              </div>
            </div>

            <div className="row mt-3">
              <div className="col-sm-2">
                <label htmlFor="txtlensType">Lens Type</label>
              </div>
              <div className="col-sm-9">
                <input
                  id="txtlensType"
                  className="form-control"
                  value={updatedLensType}
                  onChange={(event) =>
                    setUpdatedLensType(event.target.value)
                  }
                />
              </div>
            </div>

            <div className="row mt-3">
              <div className="col-sm-2">
                <label htmlFor="txtfcharge">Fitting Cost</label>
              </div>
              <div className="col-sm-4">
                <input
                  id="txtfcharge"
                  type="number"
                  min="0"
                  className="form-control"
                  value={fittingCharge}
                  onChange={(event) =>
                    setFittingCharge(event.target.value)
                  }
                />
              </div>
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <button className="btn btn-primary" onClick={saveOrderUpdate}>
            Update and Close
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => setShowOrderUpdate(false)}
          >
            Cancel
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default OrderList;
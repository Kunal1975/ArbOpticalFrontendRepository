import React, { useRef, useState } from "react";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { AiOutlineDownload } from "react-icons/ai";
import { Modal } from "react-bootstrap";
import axios from "axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import DeskTop from "./DeskTop";
import config from "../Configsettings/appsettings.json";

interface InvoiceRecord {
  invoiceId: number;
  orderFolio: string;
  orderDate: string;
  invoiceDate: string;
  custMobile: string;
  title: string;
  firstName: string;
  lastName: string;
  age: number;
  brandName: string;
  model: string;
  color: string;
  lenceType: string;
  framMrp: number;
  lensMrp: number;
  amount: number;
  discount: number;
  advance: number;
  balance: number;
}

const initialInvoice: InvoiceRecord = {
  invoiceId: 0,
  orderFolio: "",
  orderDate: "",
  invoiceDate: "",
  custMobile: "",
  title: "",
  firstName: "",
  lastName: "",
  age: 0,
  brandName: "",
  model: "",
  color: "",
  lenceType: "",
  framMrp: 0,
  lensMrp: 0,
  amount: 0,
  discount: 0,
  advance: 0,
  balance: 0,
};

const PAGE_SIZE = 30;

const Invoice: React.FC = () => {
  const [data, setData] = useState<InvoiceRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [invoiceData, setInvoiceData] =
    useState<InvoiceRecord>(initialInvoice);
  const [show, setShow] = useState(false);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [selectedDates, setSelectedDates] = useState({
    from: "",
    to: "",
  });

  const invoiceRef = useRef<HTMLDivElement>(null);

  const fetchInvoices = async () => {
    if (!selectedDates.from || !selectedDates.to) {
      setError("Select both dates before loading invoices.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get<InvoiceRecord[]>(
        `${config.Serviceurl.InvoiceView}/${selectedDates.from}/${selectedDates.to}`
      );

      const apiData = response.data ?? [];
      const uniqueData = apiData.filter(
        (item, index, array) =>
          index ===
          array.findIndex((row) => row.invoiceId === item.invoiceId)
      );

      setData(uniqueData);
    } catch (err) {
      setError("Error fetching invoice data");
      console.error("Invoice API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (value?: string | null) => {
    if (!value) return "N/A";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "N/A";

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-2);

    return `${day}-${month}-${year}`;
  };

  const invoicePrint = async (invoiceId: number) => {
    try {
      const response = await axios.get<InvoiceRecord>(
        `${config.Serviceurl.Invoicedownload}/${invoiceId}`
      );

      setInvoiceData(response.data);

      const amount = Number(response.data.amount) || 0;
      const discount = Number(response.data.discount) || 0;

      setDiscountPercent(
        amount > 0 ? Math.round((discount * 100) / amount) : 0
      );

      setShow(true);
    } catch (err) {
      console.error("Invoice Download Error:", err);
      alert("Unable to fetch invoice details");
    }
  };

  const downloadPDF = async () => {
    if (!invoiceRef.current) {
      alert("Error: Invoice content not found!");
      return;
    }

    try {
      const canvas = await html2canvas(invoiceRef.current, {
        scale: 2,
      });

      const image = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imageWidth = 190;
      const pageHeight = 150;
      const imageHeight = (canvas.height * imageWidth) / canvas.width;

      let heightLeft = imageHeight;
      let position = 0;

      pdf.addImage(
        image,
        "PNG",
        0,
        position,
        imageWidth,
        imageHeight
      );

      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imageHeight;
        pdf.addPage();
        pdf.addImage(
          image,
          "PNG",
          0,
          position,
          imageWidth,
          imageHeight
        );
        heightLeft -= pageHeight;
      }

      pdf.save(`Invoice_${invoiceData.orderFolio || "default"}.pdf`);
      setShow(false);
    } catch (err) {
      console.error("PDF Generation Error:", err);
      alert("Unable to generate PDF");
    }
  };

  const columns: GridColDef<InvoiceRecord>[] = [
    {
      field: "serialNo",
      headerName: "Serial No",
      width: 85,
      sortable: false,
      filterable: false,
      renderCell: (params) =>
        params.api.getRowIndexRelativeToVisibleRows(params.id) + 1,
    },
    {
      field: "invoiceId",
      headerName: "Invoice ID",
      width: 95,
    },
    {
      field: "orderFolio",
      headerName: "Order Folio",
      minWidth: 155,
      flex: 1,
    },
    {
      field: "orderDate",
      headerName: "Order Date",
      width: 110,
      valueFormatter: (value) => formatDate(value as string),
    },
    {
      field: "invoiceDate",
      headerName: "Invoice Date",
      width: 110,
      valueFormatter: (value) => formatDate(value as string),
    },
    {
      field: "firstName",
      headerName: "First Name",
      minWidth: 120,
      flex: 1,
    },
    {
      field: "lastName",
      headerName: "Last Name",
      minWidth: 120,
      flex: 1,
    },
    {
      field: "custMobile",
      headerName: "Mobile",
      width: 125,
    },
    {
      field: "age",
      headerName: "Age",
      width: 70,
    },
    {
      field: "brandName",
      headerName: "Brand",
      minWidth: 110,
      flex: 1,
    },
    {
      field: "model",
      headerName: "Model",
      minWidth: 110,
      flex: 1,
    },
    {
      field: "color",
      headerName: "Color",
      width: 95,
    },
    {
      field: "lenceType",
      headerName: "Lens Type",
      minWidth: 130,
      flex: 1,
    },
    {
      field: "framMrp",
      headerName: "Frame MRP",
      width: 105,
    },
    {
      field: "lensMrp",
      headerName: "Lens MRP",
      width: 105,
    },
    {
      field: "amount",
      headerName: "Amount",
      width: 100,
    },
    {
      field: "discount",
      headerName: "Discount",
      width: 100,
    },
    {
      field: "download",
      headerName: "Download",
      width: 95,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <button
          type="button"
          className="btn btn-sm"
          aria-label={`Download invoice ${params.row.invoiceId}`}
          title="Preview and download invoice PDF"
          onClick={() => invoicePrint(params.row.invoiceId)}
        >
          <AiOutlineDownload size={22} />
        </button>
      ),
    },
  ];

  const invoiceLines = [
    {
      label: "Amount",
      value: invoiceData.amount,
      color: "#ff0000",
    },
    { label: "CGST", value: 0 },
    { label: "SGST", value: 0 },
    {
      label: `Discount ${discountPercent}%`,
      value: invoiceData.discount,
      color: "#008000",
    },
    {
      label: "Total",
      value: invoiceData.amount - invoiceData.discount,
      color: "#008000",
    },
    { label: "Advance", value: invoiceData.advance },
    { label: "Received", value: invoiceData.balance },
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
        List of Invoices On Date Selection
      </div>

      <div className="card col-sm-10 container" style={{height:"600px"}}>
        <div
          className="row align-items-center g-2"
          style={{ marginTop: "1%" }}
        >
          <div className="col-md-6" />

          <div className="col-md-6">
            <div className="row align-items-center g-2">
              <div className="col-sm-2">
                <label htmlFor="frmorddate">Date Range:</label>
              </div>

              <div className="col-sm-4">
                <input
                  id="frmorddate"
                  type="date"
                  className="form-control"
                  value={selectedDates.from}
                  onChange={(event) =>
                    setSelectedDates((current) => ({
                      ...current,
                      from: event.target.value,
                    }))
                  }
                />
              </div>

              <div className="col-sm-4">
                <input
                  id="toorddate"
                  type="date"
                  className="form-control"
                  value={selectedDates.to}
                  onChange={(event) =>
                    setSelectedDates((current) => ({
                      ...current,
                      to: event.target.value,
                    }))
                  }
                />
              </div>

              <div className="col-md-2">
                <button
                  className="btn btn-primary"
                  onClick={fetchInvoices}
                  disabled={loading}
                >
                  {loading ? "Loading…" : "Invoices"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <p role="alert" style={{ color: "red", marginTop: 10 }}>
            {error}
          </p>
        )}

        <div
          style={{
            height: "calc(100vh - 245px)",
            minHeight: 420,
            width: "100%",
            marginTop: 6,
          }}
        >
          <DataGrid
                rows={data}
                columns={columns}
                getRowId={(row) => row.invoiceId}
                loading={loading}
                showToolbar
                density="standard"
                rowHeight={40}
                columnHeaderHeight={48}
                pageSizeOptions={[PAGE_SIZE]}
                initialState={{
                    pagination: {
                    paginationModel: {
                        page: 0,
                        pageSize: PAGE_SIZE,
                    },
                    },
                }}
                disableRowSelectionOnClick
                />
        </div>

        <div style={{ padding: "6px 10px", fontWeight: 600 }}>
          Total invoices: {data.length}
        </div>
      </div>

      <Modal show={show} onHide={() => setShow(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Invoice Preview</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div
            ref={invoiceRef}
            id="invoiceCapture"
            style={{
              padding: 20,
              background: "#ffffff",
              color: "#0096FF",
              fontSize: 13,
            }}
          >
            <div className="container" style={{ fontSize: 14 }}>
              <div className="row">
                <div
                  className="col-sm-12"
                  style={{
                    border: "1px solid black",
                    background: "#0096FF",
                    color: "#ffffff",
                  }}
                >
                  Invoice
                </div>
              </div>

              <br />

              <div className="row">
                <div className="col-sm-10">
                  <img
                    src={require("../images/aarblogo.jpg")}
                    style={{
                      height: 24,
                      width: 32,
                      marginLeft: "1%",
                    }}
                    alt="Logo"
                  />
                  <strong> ARB OPTICAL AND EYE CLINIC</strong>
                </div>

                <div className="col-sm-1">
                  <strong>Original</strong>
                </div>
              </div>

              <div className="row">
                <div
                  className="col-sm-6"
                  style={{ marginLeft: "2%", fontSize: 12 }}
                >
                  {config.Address.Add1}
                </div>
              </div>

              <div className="row">
                <div
                  className="col-sm-6"
                  style={{ marginLeft: "2%", fontSize: 12 }}
                >
                  {config.Address.Add2}
                </div>
              </div>

              <div className="row">
                <div
                  className="col-sm-8"
                  style={{ marginLeft: "2%", fontSize: 12 }}
                >
                  Invoice against Order No: {invoiceData.orderFolio}
                </div>
              </div>

              <div className="row">
                <div
                  className="col-sm-1"
                  style={{ marginLeft: "2%", fontSize: 12 }}
                >
                  Customer:
                </div>

                <div className="col-sm-3" style={{ marginLeft: ".5%" }}>
                  {invoiceData.title}.{invoiceData.firstName}.
                  {invoiceData.lastName}
                </div>

                <div className="col-sm-3" style={{ marginLeft: "2%" }}>
                  Mobile: {invoiceData.custMobile}
                </div>

                <div className="col-sm-2" style={{ marginLeft: "2%" }}>
                  Age: {invoiceData.age}
                </div>

                <div className="col-sm-1" style={{ marginLeft: "1%" }}>
                  Currency: INR
                </div>
              </div>
            </div>

            <div className="container" style={{ marginLeft: "1%" }}>
              <div className="row">
                <div
                  style={{
                    height: 30,
                    border: "1px solid",
                    width: "60%",
                    marginLeft: "1%",
                  }}
                >
                  <label style={{ marginLeft: "1%", fontWeight: "bold" }}>
                    Item Description
                  </label>
                </div>

                <div
                  style={{
                    height: 30,
                    border: "1px solid",
                    width: "15%",
                  }}
                >
                  <label style={{ marginLeft: "1%", fontWeight: "bold" }}>
                    Quantity
                  </label>
                </div>

                <div
                  style={{
                    height: 30,
                    border: "1px solid",
                    width: "18%",
                  }}
                >
                  <label
                    style={{
                      marginLeft: "1%",
                      fontWeight: "bold",
                      float: "right",
                    }}
                  >
                    Price
                  </label>
                </div>
              </div>

              <div className="row">
                <div
                  style={{
                    height: 30,
                    width: "60%",
                    marginLeft: "1%",
                  }}
                >
                  <label style={{ marginLeft: "1%" }}>
                    <strong>Frame:</strong>{" "}
                    {invoiceData.brandName},{invoiceData.model},
                    {invoiceData.color}
                  </label>
                </div>

                <div
                  style={{
                    height: 30,
                    border: "1px solid",
                    width: "15%",
                  }}
                >
                  <label style={{ marginLeft: "1%", float: "right" }}>1</label>
                </div>

                <div
                  style={{
                    height: 30,
                    border: "1px solid",
                    width: "18%",
                  }}
                >
                  <label style={{ marginLeft: "1%", float: "right" }}>
                    {invoiceData.framMrp}.00
                  </label>
                </div>
              </div>

              <div className="row">
                <div
                  style={{
                    height: 30,
                    width: "60%",
                    marginLeft: "1%",
                  }}
                >
                  <label style={{ marginLeft: "1%" }}>
                    <strong>Lens:</strong> {invoiceData.lenceType}
                  </label>
                </div>

                <div
                  style={{
                    height: 30,
                    border: "1px solid",
                    width: "15%",
                  }}
                >
                  <label style={{ marginLeft: "1%", float: "right" }}>1</label>
                </div>

                <div
                  style={{
                    height: 30,
                    border: "1px solid",
                    width: "18%",
                  }}
                >
                  <label style={{ marginLeft: "1%", float: "right" }}>
                    {invoiceData.lensMrp}.00
                  </label>
                </div>
              </div>

              {invoiceLines.map((row) => (
                <div className="row" key={row.label}>
                  <div
                    style={{
                      height: 30,
                      width: "60%",
                      marginLeft: "1%",
                    }}
                  />

                  <div
                    style={{
                      height: 30,
                      border: "1px solid",
                      width: "15%",
                    }}
                  >
                    <label
                      style={{
                        marginLeft: "1%",
                        float: "right",
                        color: row.color,
                      }}
                    >
                      <strong>{row.label}</strong>
                    </label>
                  </div>

                  <div
                    style={{
                      height: 30,
                      border: "1px solid",
                      width: "18%",
                    }}
                  >
                    <label
                      style={{
                        marginLeft: "1%",
                        float: "right",
                        color: row.color,
                      }}
                    >
                      {row.value}.00
                    </label>
                  </div>
                </div>
              ))}

              <div className="row">
                <div style={{ height: 70, width: "60%" }}>
                  <div className="col-sm-10">
                    <img
                      src={require("../images/signature.png")}
                      style={{
                        height: 62,
                        width: 62,
                        marginLeft: "52%",
                        paddingTop: "2%",
                      }}
                      alt="Signature"
                    />
                  </div>
                </div>
              </div>

              <div className="row">
                <div style={{ height: 30, width: "60%" }}>
                  <div className="col-sm-10">
                    <span style={{ marginLeft: "1%", fontSize: 12 }}>
                      For ARB Opticals and Eye Clinic_______________
                    </span>
                  </div>
                </div>
              </div>

              <div className="row">
                <div style={{ height: 30, width: "60%" }}>
                  <div className="col-sm-10">
                    <span style={{ marginLeft: "30%" }}>
                      [Authorized Signatory]
                    </span>
                  </div>
                </div>
              </div>

              <div className="row">
                <div style={{ height: 30, width: "60%" }}>
                  <div className="col-sm-10">
                    Received with thanks, keep businessing with Us.
                  </div>
                </div>
              </div>

              <div className="row">
                <div style={{ height: 30, width: "60%" }}>
                  <div className="col-sm-10">
                    Date: {formatDate(new Date().toISOString())}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <span style={{ fontSize: 9, marginRight: "auto" }}>
            Electronically generated Invoice
          </span>

          <button className="btn btn-primary" onClick={downloadPDF}>
            Confirm Save
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Invoice;
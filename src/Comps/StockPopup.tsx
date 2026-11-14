
import React, { useState } from 'react';
import config from "../Configsettings/appsettings.json";
import axios from 'axios';

interface StockCheckModel {
    articalId: number;
    inventoryId: number;
    articalType: string;
    model: string;
    brand: string;
    asize: number;
    temple: number;
    bridge: number;
    color: string;
    unitPrice: number;
    mrp: number;
    purchaseDate: string;
    stock: number;
}

interface StockPopupProps {
    onSelectStock: (inventoryId: number) => void;
}

const StockPopup: React.FC<StockPopupProps> = ({ onSelectStock }) => {

    const [data, setData] = useState<StockCheckModel[]>([]);
    const [olddata, setOldData] = useState<StockCheckModel[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch stock based on selected article
    const fetchStock = async () => {
        try {
            setLoading(true);
            setError(null);

            const article = (
                document.getElementById("dbArticle") as HTMLSelectElement
            ).value;

            let url = "";

            if (article === "Frame") {
                url = config.Serviceurl.FrameUrlStockcheck;
            }
            else if (article === "SunGlass") {
                url = config.Serviceurl.Glassstockcheck;
            }
            else {
                setData([]);
                setOldData([]);
                setLoading(false);
                return;
            }

            const response = await axios.get(url, {
                params: { type: article }
            });

            setData(response.data);
            setOldData(response.data);

        } catch (err) {
            setError("Error fetching data");
            console.error("API Error:", err);
        } finally {
            setLoading(false);
        }
    };

    // Search stock records
    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {

        if (e.key !== "Enter") {
            return;
        }

        const searchValue = e.currentTarget.value.trim().toLowerCase();
        const fieldName = e.currentTarget.name;

        if (searchValue === "") {
            setData(olddata);
            return;
        }

        let filtered: StockCheckModel[] = [];

        if (fieldName === "txtsbrand") {
            filtered = olddata.filter(item =>
                item.brand?.toLowerCase().includes(searchValue)
            );
        }
        else if (fieldName === "txtmodel") {
            filtered = olddata.filter(item =>
                item.model?.toLowerCase().includes(searchValue)
            );
        }
        else if (fieldName === "txtstock") {
            filtered = olddata.filter(item =>
                item.stock.toString().includes(searchValue)
            );
        }

        setData(filtered);
    };

    // Send selected inventory ID to parent component
    const handleSelect = (inventoryId: number) => {
        onSelectStock(inventoryId);
    };

    return (
        <>
            <div
                className="col-sm-11 container"
                style={{
                    marginTop: "2%",
                    background: "#59afd5",
                    color: "white",
                    fontWeight: "bold"
                }}
            >
                Stock Check for Article
            </div>

            <div className="card col-sm-11 container">

                <div className="row" style={{ marginTop: "1%" }}>

                    <div className="col-sm-2">
                        <label style={{ float: "right" }}>
                            Select Article
                        </label>
                    </div>

                    <div className="col-sm-2">
                        <select id="dbArticle" className="form-select">
                            <option value="Box">Box</option>
                            <option value="Frame">Frame</option>
                            <option value="SunGlass">SunGlass</option>
                            <option value="ContactLens">Contact Lens</option>
                        </select>
                    </div>

                    <div className="col-sm-3">
                        <button
                            id="btnstock"
                            type="button"
                            className="btn btn-primary"
                            onClick={fetchStock}
                        >
                            View Stock
                        </button>
                    </div>

                </div>

                <div
                    className="row"
                    style={{
                        marginTop: "1%",
                        overflow: "scroll",
                        height: "450px"
                    }}
                >

                    {loading && <p>Loading...</p>}

                    {error && (
                        <p style={{ color: "red" }}>{error}</p>
                    )}

                    {data.length > 0 ? (

                        <table
                            className="table table-bordered"
                            style={{
                                borderCollapse: "collapse",
                                width: "100%",
                                fontSize: "12px"
                            }}
                        >

                            <thead>
                                <tr>
                                    <th>Serial No</th>
                                    <th>StockID</th>
                                    <th>Brand</th>
                                    <th>Model</th>
                                    <th>Color</th>
                                    <th>Stock</th>
                                    <th>Action</th>
                                </tr>

                                <tr>
                                    <th></th>
                                    <th></th>

                                    <th>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="txtsbrand"
                                            onKeyDown={handleSearch}
                                            placeholder="Search Brand"
                                        />
                                    </th>

                                    <th>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="txtmodel"
                                            onKeyDown={handleSearch}
                                            placeholder="Search Model"
                                        />
                                    </th>

                                    <th></th>

                                    <th>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="txtstock"
                                            onKeyDown={handleSearch}
                                            placeholder="Search Stock"
                                        />
                                    </th>

                                    <th></th>
                                </tr>
                            </thead>

                            <tbody>
                                {data.map((item, index) => (
                                    <tr key={item.articalId}>
                                        <td>{index + 1}</td>
                                        <td>{item.inventoryId}</td>
                                        <td>{item.brand || "N/A"}</td>
                                        <td>{item.model || "N/A"}</td>
                                        <td>{item.color || "N/A"}</td>
                                        <td>{item.stock}</td>

                                        <td>
                                            {item.stock > 0 ? (
                                                            <button
                                                                type="button"
                                                                className="btn btn-primary btn-sm"
                                                                onClick={() => onSelectStock(item.inventoryId)}
                                                            >
                                                                Select
                                                            </button>
                                                        ) : (
                                                            <span style={{ color: "red", fontWeight: "bold" }}>
                                                                Out of Stock
                                                            </span>
                                                        )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>

                        </table>

                    ) : (
                        !loading && !error && (
                            <p>No data available</p>
                        )
                    )}

                </div>

            </div>
        </>
    );
};

export default StockPopup;

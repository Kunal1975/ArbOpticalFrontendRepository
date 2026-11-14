import React, { useState } from 'react';
import axios from 'axios';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import DeskTop from './DeskTop';
import config from '../Configsettings/appsettings.json';

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

const PAGE_SIZE = 30;

const Stock: React.FC = () => {
  const [rows, setRows] = useState<StockCheckModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStock = async () => {
    const article = (
      document.getElementById('dbArticle') as HTMLSelectElement
    ).value;

    let url: string | undefined;

    if (article === 'Frame') {
      url = config.Serviceurl.FrameUrlStockcheck;
    } else if (article === 'SunGlass') {
      url = config.Serviceurl.Glassstockcheck;
    }

    if (!url) {
      setRows([]);
      setError(`Stock lookup is not configured for ${article}.`);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get<StockCheckModel[]>(url, {
        params: { type: article },
      });

      setRows(response.data ?? []);
    } catch (err) {
      setError('Error fetching data');
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = localStorage.getItem('userType') === 'Admin';

  const columns: GridColDef<StockCheckModel>[] = [
    {
      field: 'serialNo',
      headerName: 'Serial No',
      width: 90,
      sortable: false,
      filterable: false,
      valueGetter: (_value, row) =>
        rows.findIndex((item) => item.articalId === row.articalId) + 1,
    },
    { field: 'inventoryId', headerName: 'Stock ID', width: 105 },
    { field: 'brand', headerName: 'Brand', minWidth: 140, flex: 1 },
    { field: 'model', headerName: 'Model', minWidth: 130, flex: 1 },
    { field: 'color', headerName: 'Color', minWidth: 110, flex: 1 },
    { field: 'asize', headerName: 'Asize', width: 90 },
    { field: 'temple', headerName: 'Temple', width: 90 },
    { field: 'bridge', headerName: 'Bridge', width: 90 },
    ...(isAdmin
      ? [
          {
            field: 'unitPrice',
            headerName: 'Unit Price',
            width: 115,
            valueFormatter: (value: number | null) =>
              `R.S ${Number(value ?? 0).toFixed(2)}`,
          } as GridColDef<StockCheckModel>,
        ]
      : []),
    {
      field: 'mrp',
      headerName: 'M.R.P',
      width: 110,
      valueFormatter: (value: number | null) => `R.S ${value ?? 0}`,
    },
    { field: 'purchaseDate', headerName: 'Purchase Date', width: 140 },
    { field: 'stock', headerName: 'Stock', width: 90 },
  ];

  const totalStock = rows.reduce(
    (total, row) => total + (Number(row.stock) || 0),
    0,
  );

  return (
    <>
      <DeskTop />

      <div
        className="col-sm-10 container"
        style={{
          marginTop: '2%',
          background: '#59afd5',
          color: 'white',
          fontWeight: 'bold',
        }}
      >
        Stock Check for Article
      </div>

      <div className="card col-sm-10 container">
        <div className="row" style={{ marginTop: '1%' }}>
          <div className="col-sm-2">
            <label htmlFor="dbArticle" style={{ float: 'right' }}>
              Select Article
            </label>
          </div>

          <div className="col-sm-2">
            <select
              id="dbArticle"
              className="form-select"
              defaultValue="Frame"
            >
              <option value="Box">Box</option>
              <option value="Frame">Frame</option>
              <option value="SunGlass">SunGlass</option>
              <option value="ContactLens">Contact Lens</option>
            </select>
          </div>

          <div className="col-sm-2">
            <button
              className="btn btn-primary"
              onClick={fetchStock}
              disabled={loading}
            >
              View Stock
            </button>
          </div>
        </div>

        {error && (
          <p role="alert" style={{ color: 'red', marginTop: 12 }}>
            {error}
          </p>
        )}

        <div style={{ height: 500, width: '100%', marginTop: '1%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            getRowId={(row) => row.articalId}
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

        <div style={{ padding: '8px 12px', fontWeight: 600 }}>
          Total records: {rows.length} | Total stock: {totalStock}
        </div>
      </div>
    </>
  );
};

export default Stock;
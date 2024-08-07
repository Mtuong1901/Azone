"use client";
import Left from "@/component/left";
import useSWR from "swr";
import { useState } from "react";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function Orders() {
  const { data, error, mutate } = useSWR(
    `${process.env.NEXT_PUBLIC_API}/orders`,
    fetcher
  );
  
  const [loading, setLoading] = useState(false);

  if (!data) return <div>Loading...</div>;
  if (error) return <div>Failed to load orders</div>;

  const handleSentStatus = async (e, orderId) => {
    const newStatus = e.target.value;

    setLoading(true);
    try {
      // Gửi yêu cầu cập nhật trạng thái
      await fetch(`${process.env.NEXT_PUBLIC_API}/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      // Cập nhật dữ liệu trên trang
      alert('Status :' + newStatus);
      mutate(); 
    } catch (error) {
      console.error('Failed to update order status:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Processing':
        return 'status-processing';
      case 'Delivery':
        return 'status-delivery';
      case 'Cancel':
        return 'status-cancel';
      default:
        return '';
    }
  };

  return (
    <div>
      <div className="container-fluid overflow-hidden">
        <div className="row vh-100 overflow-auto">
          <Left />
          <div className="col d-flex flex-column h-sm-100">
            <main className="row overflow-auto">
              <div className="col">
                <div className="p-3 bg-light text-dark">
                  <h1 align="center" className="fs-1">
                    Orders
                  </h1>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Customer Name</th>
                        <th>Order Date</th>
                        <th>Total Amount</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((order) => (
                        <tr key={order._id}>
                          <td>{order._id}</td>
                          <td>{order.name || 'N/A'}</td>
                          <td>{order.date || 'N/A'}</td>
                          <td>{order.total ? order.total.toLocaleString() : '0'} VND</td>
                          <td>
                            <span className={`status-indicator ${getStatusClass(order.status)}`} />
                            <select
                              defaultValue={order.status}
                              onChange={(e) => handleSentStatus(e, order._id)}
                            >
                              <option value="Processing">Processing</option>
                              <option value="Delivery">Delivery</option>
                              <option value="Cancel">Cancel</option>
                            </select>
                            {loading && <span>Updating...</span>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}

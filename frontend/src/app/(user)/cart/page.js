'use client'
import { removeCart, removeItem } from "@/redux/slices/cartSlices";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function Cart({ setIsCartOpen }) {
  const cart = useSelector((state) => state.cart);
  const [total, setTotal] = useState(0);
  const dispatch = useDispatch();

  useEffect(() => {
    const newTotal = cart.reduce(
      (acc, product) => acc + product.price * product.quantity,
      0
    );
    setTotal(newTotal);
  }, [cart]);

  if (cart.length === 0) {
    return (
      <>
        <h2 align="center">Your Cart</h2>
        <p align="center">Cart is empty</p>
      </>
    );
  }

  const handleRemoveItem = (product, size) => {
    dispatch(removeItem({ product, size }));
  };

  const handleOpenCart = (e) => {
    setIsCartOpen(false); // Đóng giỏ hàng khi mở modal

  };

  return (
    <>
      <h2 align="center">Your Cart</h2>
      <table className="table">
        <thead>
          <tr>
            <th></th>
            <th>Image</th>
            <th>Name</th>
            <th>Quantity</th>
            <th>Size</th>
            <th>Price</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {cart.map((item, index) => (
            <tr key={item._id}>
              <td>{index + 1}</td>
              <td>
                <img
                  className="img-thumbnail"
                  style={{ width: "8em" }}
                  src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${item.image}`}
                  alt={item.name}
                />
              </td>
              <td>{item.name}</td>
              <td>{item.quantity}</td>
              <td>{item.size}</td>
              <td>{item.price ? item.price.toLocaleString() : "N/A"} VND</td>
              <td>
                <button
                  className="btn btn-outline-danger"
                  onClick={() => handleRemoveItem(item, item.size)}
                >
                  <i className="fa-solid fa-trash-alt"></i>
                </button>
              </td>
            </tr>
          ))}
          <tr>
            <td colSpan="5">Total</td>
            <td className="text-end">{total.toLocaleString()} VND</td>
            <td>
              <button
                className="btn btn-outline-danger"
                onClick={() => dispatch(removeCart())}
              >
                <i className="fa-solid fa-trash-alt"></i> All
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <div className="order">
        <Link href="/order"><button
          type="button"
          className="btn btn-primary"
          onClick={handleOpenCart}
        >Checkout</button></Link>
      </div>
    </>
  );
}

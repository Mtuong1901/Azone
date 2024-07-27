import { removeCart, removeItem } from "@/app/redux/slices/cartSlices";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function Cart() {
  const cart = useSelector((state) => state.cart);
  const [total, setTotal] = useState(0);
  const [fullname, setFullname] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const dispatch = useDispatch();

  useEffect(() => {
    const newTotal = cart.reduce(
      (acc, product) => acc + product.price * product.quantity,
      0
    );
    setTotal(newTotal);
  }, [cart]);

  const handleRemoveItem = (productId, size) => {
    dispatch(removeItem({ productId, size }));
  };

  const submit = (e) => {
    e.preventDefault();
    fetch(`${process.env.NEXT_PUBLIC_API}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: {
          fullname: fullname,
          phone: phone,
          address: address,
        },
        detail: cart,
        total_Money: total,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Order placed successfully:", data);
        // Xóa giỏ hàng sau khi đặt hàng thành công
        dispatch(removeCart());
        // Thực hiện hành động khác sau khi đặt hàng thành công, ví dụ như chuyển hướng
      })
      .catch((error) => {
        console.error("Error placing order:", error);
        // Xử lý lỗi
      });
  };

  if (cart.length === 0) {
    return (
      <>
        <h2 align="center">Your Cart</h2>
        <p align="center">Cart is empty</p>
      </>
    );
  }

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
                  onClick={() => handleRemoveItem(item._id, item.size)}
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
    </>
  );
}

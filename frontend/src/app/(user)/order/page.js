'use client';

import { removeCart } from '@/redux/slices/cartSlices';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

export default function Order() {
  const cart = useSelector((state) => state.cart);
  const router = useRouter();
  const dispatch = useDispatch()
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      email: '',
      address: '',
      phone: '',
      paymentMethod: 'cod',
      total: 0,  
    }
  });

  const calculateTotal = () => {
    return cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  };
  const now = new Date();
  const day = now.getDate().toString().padStart(2, '0');
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const year = now.getFullYear();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');
  const formattedDateTime = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;

  const onSubmit = async (data) => {
    const orderData = { 
      ...data,
      cart,
      total: calculateTotal(),
      date : formattedDateTime,  
      status: 'Processing'     
    };

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API}/orders/addorder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      const result = await res.json();

      if (result.error) {
        throw new Error(result.error);
      } else {
        console.log(result);
        alert('Order submitted!');
        dispatch(removeCart());
        router.push('/menu');
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-6">
          <h2 className="text-center mb-4">Order Form</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="name" className="form-label">Name</label>
                <input
                  type="text"
                  className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                  id="name"
                  placeholder="Your Name"
                  {...register('name', { required: 'Name is required' })}
                />
                {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
              </div>
              <div className="col-md-6">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email"
                  className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  id="email"
                  placeholder="Your Email"
                  {...register('email', { required: 'Email is required' })}
                />
                {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="address" className="form-label">Address</label>
              <textarea
                className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                id="address"
                rows="3"
                placeholder="Your Address"
                {...register('address', { required: 'Address is required' })}
              ></textarea>
              {errors.address && <div className="invalid-feedback">{errors.address.message}</div>}
            </div>
            <div className="mb-3">
              <label htmlFor="phone" className="form-label">Phone</label>
              <input
                type="tel"
                className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                id="phone"
                placeholder="Your Phone Number"
                {...register('phone', { required: 'Phone number is required' })}
              />
              {errors.phone && <div className="invalid-feedback">{errors.phone.message}</div>}
            </div>
            <div className="mb-3">
              <label htmlFor="payment" className="form-label">Payment Method</label>
              <select
                className={`form-select ${errors.paymentMethod ? 'is-invalid' : ''}`}
                id="payment"
                {...register('paymentMethod', { required: 'Payment method is required' })}
              >
                <option value="" disabled>Select payment method</option>
                <option value="credit">Credit Card</option>
                <option value="paypal">PayPal</option>
                <option value="cash">Cash on Delivery</option>
              </select>
              {errors.paymentMethod && <div className="invalid-feedback">{errors.paymentMethod.message}</div>}
            </div>
            <button type="submit" className="btn btn-primary">Place Order</button>
          </form>
        </div>
        <div className="col-md-6">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Tên sản phẩm</th>
                <th scope="col">Giá</th>
                <th scope="col">Số lượng</th>
                <th scope="col">Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item, index) => (
                <tr key={item._id}>
                  <td>{index + 1}</td>
                  <td>{item.name}</td>
                  <td>{item.price.toLocaleString()} VND</td>
                  <td>{item.quantity}</td>
                  <td>{(item.price * item.quantity).toLocaleString()} VND</td>
                </tr>
              ))}
              <tr>
                <td colSpan="4" className="text-end">Total</td>
                <td>{calculateTotal().toLocaleString()} VND</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

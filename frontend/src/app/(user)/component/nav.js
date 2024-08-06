'use client';
import { useState } from 'react';
import { usePathname } from 'next/navigation'; 
import Link from 'next/link';
import Cart from '../cart/page';
import Authenticated from './authenticated';
import { useSelector } from 'react-redux'; // Import useSelector từ react-redux

export default function Nav() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const pathname = usePathname(); 
  const cartItems = useSelector(state => state.cart); // Lấy danh sách sản phẩm từ Redux store

  const handleCloseCart = () => {
    setIsCartOpen(false);
  };

  if (pathname === '/login' || pathname === '/signup') {
    return null;
  }

  return (
    <header>
      <div className="nav-top d-flex justify-content-between align-items-center p-2 bg-secondary">
        <div>Location</div>
        <div>
          <p className="mb-0">
            <strong>Free Shipping!</strong> On All Orders
          </p>
        </div>
        <div>
          <ul className="list-inline mb-0">
            <li className="list-inline-item">Vietnamese</li>
            <li className="list-inline-item">Store Location</li>
            <li className="list-inline-item">Track Order</li>
            <li className="list-inline-item">Help</li>
          </ul>
        </div>
      </div>
      <nav className="navbar navbar-expand-lg bg-body-tertiary border-bottom p-3">
        <div className="container-fluid">
          <Link className="navbar-brand" href="/">Wallstore</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div className="navbar-nav fs-3">
              <Link className="nav-link" href="/">Home</Link>
              <Link className="nav-link" href="/menu">Menu</Link>
              <Link className="nav-link" href="#">About</Link>
            </div>
            <form className="d-flex ms-auto" action='/search' method='get'>
              <input
                  className="form-control me-1 fs-5"
                  type="search"
                  placeholder="Search"
                  name="keyword"
              />
            </form>
          </div>
          <div className="navbar-nav d-flex align-items-center">
            <Authenticated setIsCartOpen={setIsCartOpen}/>
            <div className="position-relative">
              <button className="btn btn-link" onClick={() => setIsCartOpen(true)}>
                <i className="bi bi-cart fs-3"></i> {/* Icon giỏ hàng */}
                {cartItems.length > 0 && ( // Hiển thị số lượng sản phẩm nếu có
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {cartItems.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>
      <div className={`cart-modal ${isCartOpen ? 'open' : ''}`}>
        <button className="close-btn fs-3" onClick={handleCloseCart}>X</button>
        <Cart setIsCartOpen={setIsCartOpen}/>
      </div>
      <style jsx>{`
        .cart-modal {
          position: fixed;
          top: 0;
          right: -100%;
          width: 700px;
          height: 100%;
          background: white;
          box-shadow: -2px 0 5px rgba(0, 0, 0, 0.5);
          transition: right 0.3s ease;
          padding: 20px;
          z-index: 1000;
        }
        .cart-modal.open {
          right: 0;
        }
        .close-btn {
          position: absolute;
          top: 10px;
          right: 10px;
          background: none;
          border: none;
          font-size: 20px;
          cursor: pointer;
        }
        .badge {
          font-size: 1rem;
        }
        
      `}</style>
    </header>
  );
}

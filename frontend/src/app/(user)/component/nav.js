'use client';
import { useState } from 'react';
import Link from 'next/link';
import Cart from '../cart/page';

export default function Nav() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleOpenCart = (e) => {
    e.preventDefault();
    setIsCartOpen(true);
  };

  const handleCloseCart = () => {
    setIsCartOpen(false);
  };

  return (
    <div>
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
      <nav className="navbar navbar-expand-lg bg-body-tertiary border-bottom">
        <div className="container-fluid">
          <Link className="navbar-brand" href="#">Wallstore</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div className="navbar-nav">
              <Link className="nav-link active" href="/">Home</Link>
              <Link className="nav-link" href="/menu">Menu</Link>
              <Link className="nav-link" href="#">About</Link>
            </div>
            <form className="d-flex ms-auto" role="search">
              <input className="form-control me-2" type="search" placeholder="Search" />
            </form>
          </div>
          <div className="navbar-nav">
            <Link className="nav-link" href="/login">Sign in<i className="fa-solid fa-user ms-2"></i></Link>
            <Link className="nav-link" href="#"><i className="fa-solid fa-heart"></i></Link>
            <a className="nav-link" href="#" onClick={handleOpenCart}><i className="fa-solid fa-cart-shopping"></i></a>
          </div>
        </div>
      </nav>
      <div className={`cart-modal ${isCartOpen ? 'open' : ''}`}>
        <button className="close-btn" onClick={handleCloseCart}>X</button>
        <Cart/>
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
      `}</style>
    </div>
  );
}

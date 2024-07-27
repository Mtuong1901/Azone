import Link from 'next/link';

export default function Nav() {
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
            <Link className="nav-link" href="#">Sign in<i className="fa-solid fa-user ms-2"></i></Link>
            <Link className="nav-link" href="#"><i className="fa-solid fa-heart"></i></Link>
            <Link className="nav-link" href="#"><i className="fa-solid fa-cart-shopping"></i></Link>
          </div>
        </div>
      </nav>
    </div>
  );
}

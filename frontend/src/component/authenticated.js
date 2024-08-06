'use client';
import { logout } from "@/redux/slices/authSlice";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";

export default function Authenticated({ setIsCartOpen }) {
    // Truy cập vào Redux store
    const authenticated = useSelector((state) => state.auth.authenticated); // Đảm bảo đường dẫn đúng
    const user = useSelector((state) => state.auth.user); // Đảm bảo đường dẫn đúng
    const dispatch = useDispatch();
    const handleOpenCart = (e) => {
        e.preventDefault();
        setIsCartOpen(true);
    };

    return (
        <>
            {!authenticated ? (
                <Link className="nav-link" href="/login">
                    Sign in<i className="fa-solid fa-user ms-2"></i>
                </Link>
            ) : (
                <>
                    <Link className="nav-link" href="#">
                        <div class="dropdown">
                        <a class="btn btn-outline-secondary dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <i className="fa-solid fa-user ms-2">{user?.username}</i>
                        </a>
                        <ul class="dropdown-menu">
                            <li><a class="dropdown-item" href="#">Profile</a></li>
                            <li><a class="dropdown-item" href="#">Your order</a></li>
                            <li><a class="dropdown-item" href="#"  onClick={() => dispatch(logout())}><i class="fa-solid fa-arrow-right-from-bracket"></i> Log out</a></li>
                        </ul>
                        </div>
                    </Link>
                    <Link className="nav-link" href="#">
                        <i className="fa-solid fa-heart fs-2"></i>
                    </Link>
                    <a className="nav-link" href="#" onClick={handleOpenCart}>
                        <i className="fa-solid fa-cart-shopping fs-2"></i>
                    </a>
                </>
            )}
        </>
    );
}

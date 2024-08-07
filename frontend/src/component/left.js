'use client'
import { logout } from "@/redux/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";

export default function Left() {
  const user = useSelector((state) => state.auth.user)
  const dispatch = useDispatch();
  return (
    <>
      <div class="col-12 col-sm-3 col-xl-2 px-sm-2 px-0 bg-dark d-flex sticky-top">
        <div class="d-flex flex-sm-column flex-row flex-grow-1 align-items-center align-items-sm-start px-3 pt-2 text-white">
          <a
            href="/admin"
            class="d-flex align-items-center pb-sm-3 mb-md-0 me-md-auto text-warning text-decoration-none"
          >
            <span class="fs-5">
              W<span class="d-none d-sm-inline">allStore</span>
            </span>
          </a>
          <ul
            class="nav nav-pills flex-sm-column flex-row flex-nowrap flex-shrink-1 flex-sm-grow-0 flex-grow-1 mb-sm-auto mb-0 justify-content-center align-items-center align-items-sm-start"
            id="menu"
          >
            <li class="nav-item">
              <a href="/admin/products" class="nav-link px-sm-0 px-2 text-light">
                <i class="fs-5 bi-grid"></i>
                <span class="ms-1 d-none d-sm-inline">Products</span>
              </a>
            </li>
            <li class="nav-item">
              <a href="/admin/orders" class="nav-link px-sm-0 px-2 text-light">
                <i class="fs-5 bi-table"></i>
                <span class="ms-1 d-none d-sm-inline">Orders</span>
              </a>
            </li>
            <li class="nav-item">
              <a href="/admin/category" class="nav-link px-sm-0 px-2 text-light">
                <i class="fs-5 bi-table"></i>
                <span class="ms-1 d-none d-sm-inline">Categorys</span>
              </a>
            </li>
            <li class="nav-item"> 
              <a href="/admin/customers" class="nav-link px-sm-0 px-2 text-light">
                <i class="fs-5 bi-people"></i>
                <span class="ms-1 d-none d-sm-inline">Customers</span>{" "}
              </a>
            </li>
          </ul>
          <div class="dropdown py-sm-4 mt-sm-auto ms-auto ms-sm-0 flex-shrink-1">
            <a
              href="#"
              class="d-flex align-items-center text-white text-decoration-none dropdown-toggle"
              id="dropdownUser1"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <img
                src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${user?.image}`}
                alt="hugenerd"
                width="28"
                height="28"
                class="rounded-circle"
              ></img>
              <span class="d-none d-sm-inline mx-1">{user?.username}</span>
            </a>
            <ul
              class="dropdown-menu dropdown-menu-dark text-small shadow"
              aria-labelledby="dropdownUser1"
            >
              <li>
                <a class="dropdown-item" href="#">
                  New project...
                </a>
              </li>
              <li>
                <a class="dropdown-item" href="/admin/setting">
                  Settings
                </a>
              </li>
              <li>
                <a class="dropdown-item" href="/admin/profile">
                  Profile
                </a>
              </li>
              <li>
                <hr class="dropdown-divider"></hr>
              </li>
              <li>
                <a class="dropdown-item" href="#" onClick={() => dispatch(logout())}>
                  Sign out
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

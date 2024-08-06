"use client";
import { useState } from "react";
import Filter from "../component/filter";
import ProductList from "../component/productList";
import useSWR from "swr";
import { useDispatch, useSelector } from "react-redux";
import { sortDefault, sortASC, sortDESC } from "@/app/redux/slices/sortSlice";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function Menu() {
  const sortType = useSelector((state) => state.sort);
  const dispatch = useDispatch();
  const [isVisible, setIsVisible] = useState(true);
  const { data: products, error: productError } = useSWR(
    `${process.env.NEXT_PUBLIC_API}/products`,
    fetcher
  );

  if (!products) return <div>Loading...</div>;
  if (productError) return <div>Failed to load products</div>;

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const handleSortChange = (e) => {
    const value = e.target.value;
    if (value === "default") {
      dispatch(sortDefault());
    } else if (value === "price") {
      dispatch(sortASC());
    } else if (value === "price-desc") {
      dispatch(sortDESC());
    }
  };

  return (
    <>
      <div className="container-fluid h-100">
        <div className="tool">
          <button
            onClick={toggleVisibility}
            className={`mb-3 btn ${isVisible ? "btn-hide" : "btn-show"}`}
          >
            <i className="fa-solid fa-sliders"></i>
            {isVisible ? "Hide Filter" : "Show Filter"}
          </button>
          <div className="result text-outline-dark">
            <h3>
              Tổng số sản phẩm: <strong style={{ color: "yellow" }}>{products.length}</strong>
            </h3>
          </div>
          <div className="sort">
            <select onChange={handleSortChange}>
              <option value="default">Default</option>
              <option value="price">Increase</option>
              <option value="price-desc">Decrease</option>
            </select>
          </div>
        </div>
        <div className="row h-100">
          <div
            className={`col-md-3 h-100 bg-light filter-content ${isVisible ? "open" : "closed"}`}
          >
            <Filter data={products} />
          </div>
          <div className={isVisible ? "col-md-9 h-100" : "col-md-12 h-100 bg-light"}>
            <div className="product-container">
              <ProductList data={products} sortType={sortType} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

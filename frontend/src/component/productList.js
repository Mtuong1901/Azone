import { useSelector } from "react-redux";
import Product from "./product";

export default function ProductList(props) {
  const sortType = useSelector((state) => state.sort);
  const {min,max} = useSelector((state) => state.filter);
  let sortedList = [...props.data];
  sortedList = sortedList.filter((item) => item.price >= min && item.price <= max);
  if (sortType === "ASC") {
    sortedList.sort((a, b) => a.price - b.price);
  } else if (sortType === "DESC") {
    sortedList.sort((a, b) => b.price - a.price);
  }
  return (
    <>
      {sortedList.map((data) => (
        <div key={data._id}>
          <Product data={data} />
        </div>
      ))}
    </>
  );
}

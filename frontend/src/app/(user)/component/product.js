import Link from "next/link";

export default function Product(props){
    const product = props.data;
    return (
        <>
        <div className="pro-box">
                <div className="product-item">
                  <Link href={`/detail/${product._id}`}><img
                    className="product-img"
                    src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${product.image}`}
                  ></img></Link>
                  <div className="product-info">
                    <h5>{product.name}</h5>
                    <p>{product.description}</p>
                    <span>{product.price.toLocaleString()} VND</span>
                  </div>
                  <button className="product-btn btn btn-primary">Add to Cart</button>
                </div>
              </div>
        </>
    )
}
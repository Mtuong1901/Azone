import Product from "./product";

export default function ProductList(props){
    const list = props.data;
    return (
           <>
           {list.map((data) => (
                 <div key={data._id}>
                 <Product data={data} />
               </div>
            ))}
           </>
        
    );
}
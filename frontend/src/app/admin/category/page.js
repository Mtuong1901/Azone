'use client'
import Left from "@/component/left";
import Link from "next/link";
import useSWR from "swr";
const fetcher = (...args) => fetch(...args).then((res) => res.json());
export default function Category(){
    const { data: categories, error } = useSWR(
        `${process.env.NEXT_PUBLIC_API}/products/category`,
        fetcher
    );
    if (!categories) return <div>Loading...</div>;
    if (error) return <div>Failed to load categories</div>;
    const handleDelete = async (id) => {
      if (confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?")) {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API}/products/deleteCategory/${id}`, {
          method: "DELETE",
        });
        const result = await res.json();
        if (result.message) {
          alert(result.message);
          window.location.reload();
        }
      }
    };
    return (
        <div>
        <div className="container-fluid overflow-hidden">
          <div className="row vh-100 overflow-auto">
            <Left />
            <div className="col d-flex flex-column h-sm-100">
              <main className="row overflow-auto">
                <div className="col">
                  <div className="p-3 bg-light text-dark">
                    <h1 align="center" className="fs-1">
                     Category
                    </h1>
                    
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Category ID</th>
                          <th>Category IMG</th>
                          <th>Category Name</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {categories.map((category) => {
                            return(
                                <tr key={category.id}>
                                  <td>{category._id}</td>
                                  <td>
                                    <img src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${category.image}`} alt={category.name} style={{width: 100 + 'PX'}}/>
                                  </td>
                                  <td>{category.name}</td>
                                  <td>
                                    <Link href={`/admin/category/edit/${category._id}`}>
                                    <button className="btn btn-primary" >Edit</button>
                                    </Link>
                                    <button className="btn btn-danger" onClick={()  =>handleDelete(category._id)}>Delete</button>
                                  </td>
                                </tr>
                            )
                        })}
                    </tbody>
                    </table>
                    <Link href="/admin/category/add"><button className="btn btn-outline-danger w-100">Add</button></Link>
                  </div>
                </div>
              </main>
            </div>
          </div>
        </div>
      </div>
    )
}
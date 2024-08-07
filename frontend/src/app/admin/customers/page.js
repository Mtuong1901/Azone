"use client";
import Left from "@/component/left";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useSWR from "swr";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function Customers() {
  const [editCustomer, setEditCustomer] = useState(null);
  const { data, error, mutate } = useSWR(
    `${process.env.NEXT_PUBLIC_API}/users/customers`,
    fetcher
  );

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: "",
      email: "",
      phone: "",
      image: null,
    },
  });
  useEffect(() => {
    if (editCustomer) {
      setValue("username", editCustomer.username);
      setValue("email", editCustomer.email);
      setValue("phone", editCustomer.phone);
    }
  }, [editCustomer, setValue]);
  if (!data) return <div>Loading...</div>;
  if (error) return <div>Failed to load customers</div>;

  const handleAddCustomer = async (values) => {
    const formData = new FormData();
    formData.append("username", values.username);
    formData.append("email", values.email);
    formData.append("phone", values.phone);
    formData.append("password", 1);
    if (values.image?.[0]) {
      formData.append("image", values.image[0]);
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API}/users/addcustomer`,
        {
          method: "POST",
          body: formData,
        }
      );
      const result = await res.json();
      if (res.ok) {
        alert("Customer added successfully");
        reset();
        mutate(); // Re-fetch data
      } else {
        console.error(result.error);
        alert("Failed to add customer: " + result.error);
      }
    } catch (error) {
      console.error("Error adding customer:", error);
      alert("An error occurred while adding the customer.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa khách hàng này không?")) {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API}/users/deleteCustomer/${id}`,
          {
            method: "DELETE",
          }
        );
        const result = await res.json();
        if (res.ok) {
          alert(result.message);
          mutate(); // Re-fetch data
        } else {
          alert("Failed to delete customer: " + result.message);
        }
      } catch (error) {
        console.error("Error deleting customer:", error);
        alert("An error occurred while deleting the customer.");
      }
    }
  };

  const handleEditCustomer = async (values) => {
    const formData = new FormData();
    formData.append("username", values.username);
    formData.append("email", values.email);
    formData.append("phone", values.phone);
    if (values.image?.[0]) {
      formData.append("image", values.image[0]);
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API}/users/updatecustomer/${editCustomer._id}`,
        {
          method: "PUT",
          body: formData,
        }
      );
      const result = await res.json();
      if (res.ok) {
        alert("Customer updated successfully");
        mutate(); 
        window.location.reload();
      } else {
        console.error(result.error);
        alert("Failed to update customer: " + result.error);
      }
    } catch (error) {
      console.error("Error updating customer:", error);
      alert("An error occurred while updating the customer.");
    }
  };

  const handleEdit = async (id, customer) => {
    setEditCustomer(customer);
    const modal = new window.bootstrap.Modal(
      document.getElementById('editCustomerModal')
    );
    modal.show();
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
                  <h1 align="center" className="fs-1">Customers</h1>
                  <button
                    className="btn btn-primary m-1"
                    data-bs-toggle="modal"
                    data-bs-target="#addCustomerModal"
                  >
                    Add
                  </button>

                  <div
                    className="modal fade"
                    id="addCustomerModal"
                    tabIndex="-1"
                    aria-labelledby="addCustomerModalLabel"
                    aria-hidden="true"
                  >
                    <div className="modal-dialog">
                      <div className="modal-content">
                        <form onSubmit={handleSubmit(handleAddCustomer)}>
                          <div className="modal-header">
                            <h1 className="modal-title fs-5" id="addCustomerModalLabel">
                              Add Customer
                            </h1>
                            <button
                              type="button"
                              className="btn-close"
                              data-bs-dismiss="modal"
                              aria-label="Close"
                            ></button>
                          </div>
                          <div className="modal-body">
                            <div className="mb-3">
                              <label htmlFor="username" className="form-label">
                                Username
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                id="username"
                                {...register("username", {
                                  required: "Username is required",
                                })}
                              />
                              {errors.username && (
                                <div className="text-danger">
                                  {errors.username.message}
                                </div>
                              )}
                            </div>
                            <div className="mb-3">
                              <label htmlFor="email" className="form-label">
                                Email
                              </label>
                              <input
                                type="email"
                                className="form-control"
                                id="email"
                                {...register("email", {
                                  required: "Email is required",
                                })}
                              />
                              {errors.email && (
                                <div className="text-danger">
                                  {errors.email.message}
                                </div>
                              )}
                            </div>
                            <div className="mb-3">
                              <label htmlFor="phone" className="form-label">
                                Phone
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                id="phone"
                                {...register("phone", {
                                  required: "Phone number is required",
                                })}
                              />
                              {errors.phone && (
                                <div className="text-danger">
                                  {errors.phone.message}
                                </div>
                              )}
                            </div>
                            <div className="form-group">
                              <label htmlFor="image">Image</label>
                              <input
                                type="file"
                                className="form-control"
                                id="image"
                                {...register("image")}
                              />
                            </div>
                          </div>
                          <div className="modal-footer">
                            <button
                              type="button"
                              className="btn btn-secondary"
                              data-bs-dismiss="modal"
                            >
                              Close
                            </button>
                            <button type="submit" className="btn btn-primary">
                              Save changes
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>

                  <div
                    className="modal fade"
                    id="editCustomerModal"
                    tabIndex="-1"
                    aria-labelledby="editCustomerModalLabel"
                    aria-hidden="true"
                  >
                    <div className="modal-dialog">
                      <div className="modal-content">
                        <form onSubmit={handleSubmit(handleEditCustomer)}>
                          <div className="modal-header">
                            <h1 className="modal-title fs-5" id="editCustomerModalLabel">
                              Edit Customer
                            </h1>
                            <button
                              type="button"
                              className="btn-close"
                              data-bs-dismiss="modal"
                              aria-label="Close"
                            ></button>
                          </div>
                          <div className="modal-body">
                            <div className="mb-3">
                              <label htmlFor="username" className="form-label">
                                Username
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                id="username"
                                defaultValue={editCustomer?.username}
                                {...register("username", {
                                  required: "Username is required",
                                })}
                              />
                              {errors.username && (
                                <div className="text-danger">
                                  {errors.username.message}
                                </div>
                              )}
                            </div>
                            <div className="mb-3">
                              <label htmlFor="email" className="form-label">
                                Email
                              </label>
                              <input
                                type="email"
                                className="form-control"
                                id="email"
                                defaultValue={editCustomer?.email}
                                {...register("email", {
                                  required: "Email is required",
                                })}
                              />
                              {errors.email && (
                                <div className="text-danger">
                                  {errors.email.message}
                                </div>
                              )}
                            </div>
                            <div className="mb-3">
                              <label htmlFor="phone" className="form-label">
                                Phone
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                id="phone"
                                defaultValue={editCustomer?.phone}
                                {...register("phone", {
                                  required: "Phone number is required",
                                })}
                              />
                              {errors.phone && (
                                <div className="text-danger">
                                  {errors.phone.message}
                                </div>
                              )}
                            </div>
                            <div className="form-group">
                              <label htmlFor="image">Image</label>
                              {editCustomer?.image && (
                                <img
                                  src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${editCustomer.image}`}
                                  alt="Customer"
                                  className="img-fluid mb-2"
                                />
                              )}
                              <input
                                type="file"
                                className="form-control"
                                id="image"
                                {...register("image")}
                              />
                            </div>
                          </div>
                          <div className="modal-footer">
                            <button
                              type="button"
                              className="btn btn-secondary"
                              data-bs-dismiss="modal"
                            >
                              Close
                            </button>
                            <button type="submit" className="btn btn-primary">
                              Save changes
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>

                  <table className="table">
                    <thead>
                      <tr>
                        <th>Customer ID</th>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((customer) => (
                        <tr key={customer._id}>
                          <td>{customer._id}</td>
                          <td>
                            <img
                              src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${customer.image}`}
                              alt="Customer"
                              style={{ width: "100px" }}
                            />
                          </td>
                          <td>{customer.username || "N/A"}</td>
                          <td>{customer.email || "N/A"}</td>
                          <td>{customer.phone || "N/A"}</td>
                          <td>
                            <button
                              type="button"
                              className="btn btn-warning"
                              onClick={() => handleEdit(customer._id, customer)}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              className="btn btn-danger m-1"
                              onClick={() => handleDelete(customer._id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";
import Left from "@/component/left";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import useSWR, { mutate } from "swr";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const { data: user, error } = useSWR(
    `${process.env.NEXT_PUBLIC_API}/users/admin`,
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
    if (profile) {
      setValue("username", profile.username);
      setValue("email", profile.email);
      setValue("phone", profile.phone);
      reset({ image: null });
    }
  }, [profile, setValue, reset]);

  const handleEditProfile = async (values) => {
    const formData = new FormData();
    formData.append("username", values.username);
    formData.append("email", values.email);
    formData.append("phone", values.phone);
    if (values.image?.[0]) {
      formData.append("image", values.image[0]);
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API}/users/updateadmin/${profile._id}`,
        {
          method: "PUT",
          body: formData,
        }
      );
      const result = await res.json();
      if (res.ok) {
        alert("Admin updated successfully");
        mutate();
        window.location.reload();
      } else {
        console.error(result.error);
        alert("Failed to update admin: " + result.error);
      }
    } catch (error) {
      console.error("Error updating admin:", error);
      alert("An error occurred while updating the admin.");
    }
  };

  const EditProfile = async (id) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API}/users/${id}`);
    const data = await res.json();
    setProfile(data);
    console.log(data);
  };

  if (error) return <div>Failed to load</div>;
  if (!user) return <div>Loading...</div>;

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
                    Profile
                  </h1>

                  <div
                    className="modal fade"
                    id="exampleModal"
                    tabIndex="-1"
                    aria-labelledby="exampleModalLabel"
                    aria-hidden="true"
                  >
                    <div className="modal-dialog">
                      <div className="modal-content">
                        <form onSubmit={handleSubmit(handleEditProfile)}>
                          <div className="modal-header">
                            <h1
                              className="modal-title fs-5"
                              id="exampleModalLabel"
                            >
                              Edit Profile
                            </h1>
                            <button
                              type="button"
                              className="btn-close"
                              data-bs-dismiss="modal"
                              aria-label="Close"
                            ></button>
                          </div>
                          <div className="modal-body">
                            <div className="form-group">
                              <label>Username</label>
                              <input
                                type="text"
                                {...register("username", { required: true })}
                                className="form-control"
                              />
                              {errors.username && (
                                <span>This field is required</span>
                              )}
                            </div>
                            <div className="form-group">
                              <label>Email</label>
                              <input
                                type="email"
                                {...register("email", { required: true })}
                                className="form-control"
                              />
                              {errors.email && (
                                <span>This field is required</span>
                              )}
                            </div>
                            <div className="form-group">
                              <label>Phone</label>
                              <input
                                type="text"
                                {...register("phone", { required: true })}
                                className="form-control"
                              />
                              {errors.phone && (
                                <span>This field is required</span>
                              )}
                            </div>
                            <div className="form-group">
                              <label>Profile Image</label>
                              <input
                                type="file"
                                {...register("image")}
                                className="form-control"
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
                  <section className="vh-1">
                    <div className="container py-3 h-50">
                      <div className="row d-flex justify-content-center align-items-center h-50">
                        <div className="col-md-12 col-xl-4">
                          <div
                            className="card"
                            style={{ borderRadius: "15px" }}
                          >
                            {user.map((user) => {
                              return (
                                <>
                                  <div className="card-body text-center">
                                    <div className="mt-3 mb-4">
                                      <img
                                        src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${user.image}`}
                                        className="rounded-circle img-fluid"
                                        style={{ width: "100px" }}
                                      />
                                    </div>
                                    <h4 className="mb-2">{user.username}</h4>
                                    <p className="text mb-4">
                                      Contact <a href="#!">{user.phone}</a>
                                      <span className="mx-3">|</span>
                                      <a href="#!">{user.email}</a>
                                    </p>
                                    <div className="mb-4 pb-2">
                                      <button
                                        type="button"
                                        className="btn btn-outline-primary btn-floating"
                                      >
                                        <i className="fab fa-facebook-f fa-lg"></i>
                                      </button>
                                      <button
                                        type="button"
                                        className="btn btn-outline-primary btn-floating"
                                      >
                                        <i className="fab fa-twitter fa-lg"></i>
                                      </button>
                                      <button
                                        type="button"
                                        className="btn btn-outline-primary btn-floating"
                                      >
                                        <i className="fab fa-skype fa-lg"></i>
                                      </button>
                                    </div>
                                    <button
                                      type="button"
                                      className="btn btn-primary btn-rounded btn-lg"
                                      data-bs-toggle="modal"
                                      data-bs-target="#exampleModal"
                                      onClick={() => EditProfile(user._id)}
                                    >
                                      Edit Profile
                                    </button>
                                    <div className="d-flex justify-content-between text-center mt-5 mb-2">
                                      <div>
                                        <p className="mb-2 h5">8471</p>
                                        <p className="text-muted mb-0">
                                          Wallets Balance
                                        </p>
                                      </div>
                                      <div className="px-3">
                                        <p className="mb-2 h5">8512</p>
                                        <p className="text-muted mb-0">
                                          Income amounts
                                        </p>
                                      </div>
                                      <div>
                                        <p className="mb-2 h5">4751</p>
                                        <p className="text-muted mb-0">
                                          Total Transactions
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}

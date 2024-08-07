"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Left from "../../component/left";

export default function Dashboard() {
  const router = useRouter();
  const authenticated = useSelector((state) => state.auth.authenticated);
  const user = useSelector((state) => state.auth.user);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    if (!authenticated) {
      setError("Bạn cần đăng nhập để truy cập trang này.");
      setLoading(false);
      router.push("/login");
    } else if (user && user.role !== "admin") {
      setError("Bạn không có quyền truy cập trang này.");
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [authenticated, user, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <div className="container-fluid overflow-hidden">
        <div className="row vh-100 overflow-auto">
          <Left />
          <div className="col d-flex flex-column h-sm-100">
            <main className="row overflow-auto">
              <div className="col">
                <div className="p-3 bg-light text-dark">
                  <h1 align="center" className="fs-1">
                    Dashboard
                  </h1>
                  <div className="row-admin">
                    <div className="row-title">
                      <h3>Today's Sales</h3>
                      <p>Sales Summary</p>
                    </div>
                    <div className="col-admin">
                      <div className="col-md-3 col-lg-2 mb-4">
                        <div
                          className="box-card"
                          style={{
                            backgroundColor: "rgb(255, 226, 229)",
                            width: "100%",
                            height: "100%",
                          }}
                        >
                          <div className="card-body">
                            <i
                              className="fa-solid fa-chart-simple fs-1"
                              style={{ color: "#Fa5a7d" }}
                            ></i>
                            <h2 className="card-title p-2">$1k</h2>
                            <p className="card-text">Total Sales</p>
                            <p className="text-primary">Last day +8%</p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-3 col-lg-2 mb-4">
                        <div
                          className="box-card"
                          style={{ backgroundColor: "rgb(255, 244, 222)" }}
                        >
                          <div className="card-body">
                            <i
                              className="fa-solid fa-file-lines fs-1"
                              style={{ color: "#ff9473" }}
                            ></i>
                            <h2 className="card-title p-2">300</h2>
                            <p className="card-text">Total Orders</p>
                            <p className="text-primary">Last day +8%</p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-3 col-lg-2 mb-4">
                        <div
                          className="box-card"
                          style={{ backgroundColor: "rgb(220, 252, 231)" }}
                        >
                          <div className="card-body">
                            <i
                              className="fa-solid fa-receipt fs-1"
                              style={{ color: "#3cd856" }}
                            ></i>
                            <h2 className="card-title p-2">5</h2>
                            <p className="card-text">Sold</p>
                            <p className="text-primary">Last day +8%</p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-3 col-lg-2 mb-4">
                        <div
                          className="box-card"
                          style={{ backgroundColor: "rgb(243, 232, 255)" }}
                        >
                          <div className="card-body">
                            <i
                              className="fa-solid fa-user-plus fs-1"
                              style={{ color: "#bf83ff" }}
                            ></i>
                            <h2 className="card-title p-2">8</h2>
                            <p className="card-text">Customers</p>
                            <p className="text-primary">Last day +8%</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
              </div>
            </main>
          </div>
        </div>
      </div>
    </>
  );
}

"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [agreeTerms, setAgreeTerms] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }
        if (!agreeTerms) {
            alert("You must agree to the terms of service");
            return;
        }
        
        try {
            // Replace with your API endpoint and method
            const response = await fetch(`${process.env.NEXT_PUBLIC_API}/users/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username, email, password })
            });
            console.log(response);
            if (response.ok) {
               alert("success")
                router.push('/login');
            } else {
                console.error("Registration failed");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <>
            <section className="vh-100" style={{ backgroundColor: "#eee" }}>
                <div className="container h-100">
                    <div className="row d-flex justify-content-center align-items-center h-100">
                        <div className="col-lg-12 col-xl-11">
                            <div className="card text-black" style={{ borderRadius: 10 + "px" }}>
                                <div className="card-body p-md-5">
                                    <div className="row justify-content-center">
                                        <div className="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1">
                                            <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">Sign up</p>
                                            <form className="mx-1 mx-md-4" onSubmit={handleSubmit}>
                                                <div className="d-flex flex-row align-items-center mb-4">
                                                    <i className="fas fa-user fa-lg me-3 fa-fw"></i>
                                                    <div className="form-outline flex-fill mb-0">
                                                        <input 
                                                            type="text" 
                                                            id="form3Example1c" 
                                                            className="form-control" 
                                                            value={username} 
                                                            onChange={(e) => setUsername(e.target.value)} 
                                                        />
                                                        <label className="form-label" htmlFor="form3Example1c">Your Name</label>
                                                    </div>
                                                </div>

                                                <div className="d-flex flex-row align-items-center mb-4">
                                                    <i className="fas fa-envelope fa-lg me-3 fa-fw"></i>
                                                    <div className="form-outline flex-fill mb-0">
                                                        <input 
                                                            type="email" 
                                                            id="form3Example3c" 
                                                            className="form-control" 
                                                            value={email} 
                                                            onChange={(e) => setEmail(e.target.value)} 
                                                        />
                                                        <label className="form-label" htmlFor="form3Example3c">Your Email</label>
                                                    </div>
                                                </div>

                                                <div className="d-flex flex-row align-items-center mb-4">
                                                    <i className="fas fa-lock fa-lg me-3 fa-fw"></i>
                                                    <div className="form-outline flex-fill mb-0">
                                                        <input 
                                                            type="password" 
                                                            id="form3Example4c" 
                                                            className="form-control" 
                                                            value={password} 
                                                            onChange={(e) => setPassword(e.target.value)} 
                                                        />
                                                        <label className="form-label" htmlFor="form3Example4c">Password</label>
                                                    </div>
                                                </div>

                                                <div className="d-flex flex-row align-items-center mb-4">
                                                    <i className="fas fa-key fa-lg me-3 fa-fw"></i>
                                                    <div className="form-outline flex-fill mb-0">
                                                        <input 
                                                            type="password" 
                                                            id="form3Example4cd" 
                                                            className="form-control" 
                                                            value={confirmPassword} 
                                                            onChange={(e) => setConfirmPassword(e.target.value)} 
                                                        />
                                                        <label className="form-label" htmlFor="form3Example4cd">Repeat your password</label>
                                                    </div>
                                                </div>

                                                <div className="form-check d-flex justify-content-center mb-5">
                                                    <input 
                                                        className="form-check-input me-2" 
                                                        type="checkbox" 
                                                        value="" 
                                                        id="form2Example3c" 
                                                        checked={agreeTerms}
                                                        onChange={(e) => setAgreeTerms(e.target.checked)} 
                                                    />
                                                    <label className="form-check-label" htmlFor="form2Example3c">
                                                        I agree all statements in <a href="#!">Terms of service</a>
                                                    </label>
                                                </div>

                                                <div className="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                                                    <button type="submit" className="btn btn-primary btn-lg">Register</button>
                                                </div>
                                            </form>
                                        </div>
                                        <div className="col-md-10 col-lg-6 col-xl-7 d-flex align-items-center order-1 order-lg-2">
                                            <img 
                                                src="https://i.pinimg.com/564x/6f/5d/fd/6f5dfd199e5045a5d46185e69f54c4ad.jpg" 
                                                style={{ borderRadius: 10 + "px" }} 
                                                className="img-fluid" 
                                                alt="Sample" 
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

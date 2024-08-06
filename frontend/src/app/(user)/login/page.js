'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { login } from '../../redux/slices/authSlice';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    const dispatch = useDispatch();

    const handleSubmit = async (event) => {
        event.preventDefault();

        const response = await fetch(`${process.env.NEXT_PUBLIC_API}/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            const data = await response.json();
            const { token, user } = data;
            dispatch(login({ token, user }));
            localStorage.setItem('token', token);
            alert('Login successful!');
            router.push('/'); // Chuyển hướng sau khi đăng nhập thành công
        } else {
            const data = await response.json();
            console.error('Login failed:', data.message || 'Unknown error');
            alert('Login failed: ' + (data.message || 'Unknown error'));
        }
    };

    return (
        <form className="vh-100 gradient-custom" onSubmit={handleSubmit}>
            <div className="container py-5 h-100">
                <div className="row d-flex justify-content-center align-items-center h-100">
                    <div className="col-12 col-md-8 col-lg-6 col-xl-5">
                        <div className="card bg-dark text-white" style={{ borderRadius: '1rem' }}>
                            <div className="card-body p-5 text-center">
                                <div className="mb-md-5 mt-md-4 pb-5">
                                    <h2 className="fw-bold mb-2 text-uppercase">Login</h2>
                                    <p className="text-white-50 mb-5">Please enter your login and password!</p>

                                    <div className="form-outline form-white mb-4">
                                        <input 
                                            type="email" 
                                            id="typeEmailX" 
                                            className="form-control form-control-lg" 
                                            value={email} 
                                            onChange={(e) => setEmail(e.target.value)} 
                                            required 
                                        />
                                        <label className="form-label" htmlFor="typeEmailX">Email</label>
                                    </div>

                                    <div className="form-outline form-white mb-4">
                                        <input 
                                            type="password" 
                                            id="typePasswordX" 
                                            className="form-control form-control-lg" 
                                            value={password} 
                                            onChange={(e) => setPassword(e.target.value)} 
                                            required 
                                        />
                                        <label className="form-label" htmlFor="typePasswordX">Password</label>
                                    </div>

                                    <p className="small mb-5 pb-lg-2"><a className="text-white-50" href="#!">Forgot password?</a></p>

                                    <button 
                                        className="btn btn-outline-light btn-lg px-5" 
                                        type="submit"
                                    >
                                        Login
                                    </button>

                                    <div className="d-flex justify-content-center text-center mt-4 pt-1">
                                        <a href="#!" className="text-white"><i className="fab fa-facebook-f fa-lg"></i></a>
                                        <a href="#!" className="text-white"><i className="fab fa-twitter fa-lg mx-4 px-2"></i></a>
                                        <a href="#!" className="text-white"><i className="fab fa-google fa-lg"></i></a>
                                    </div>
                                </div>

                                <div>
                                    <p className="mb-0">Don't have an account? <a href="/signup" className="text-white-50 fw-bold">Sign Up</a></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}

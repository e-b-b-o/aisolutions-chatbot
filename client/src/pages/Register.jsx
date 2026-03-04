import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/authService';
import { ArrowLeft } from 'lucide-react';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const usernameRegex = /^[a-zA-Z0-9_\s]{3,20}$/;
        if (!username || !usernameRegex.test(username)) {
            return setError('Username must be 3-20 characters long.');
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            return setError('Please enter a valid email address.');
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\W]{8,}$/;
        if (!password || !passwordRegex.test(password)) {
            return setError('Password must be at least 8 characters, with 1 uppercase and 1 number.');
        }

        try {
            await authService.register({ username, email, password });
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="min-h-screen bg-section flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <button 
                    onClick={() => navigate('/')}
                    className="flex items-center text-sm font-medium text-secondary hover:text-accent mb-8 transition-colors px-4 py-2 rounded-md hover:bg-gray-100 w-max"
                >
                    <ArrowLeft size={16} className="mr-2" /> Go back to landing page
                </button>
                <h2 className="text-center text-3xl font-bold text-primary tracking-tight">
                    Create a new account
                </h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-main py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-light">
                    {error && (
                        <div className="mb-4 bg-red-50 p-4 rounded-md">
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    )}
                    
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label className="label">
                                Username
                            </label>
                            <div className="mt-1">
                                <input
                                    type="text"
                                    required
                                    className="input-field"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="label">
                                Email address
                            </label>
                            <div className="mt-1">
                                <input
                                    type="email"
                                    required
                                    className="input-field"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="label">
                                Password
                            </label>
                            <div className="mt-1">
                                <input
                                    type="password"
                                    required
                                    className="input-field"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <p className="mt-2 text-xs text-secondary">
                                    Min 8 characters, 1 uppercase, 1 number.
                                </p>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="w-full btn btn-primary flex justify-center py-2 px-4 shadow-sm"
                            >
                                Sign up
                            </button>
                        </div>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-light" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-main text-secondary">
                                    Already have an account?
                                </span>
                            </div>
                        </div>

                        <div className="mt-6 text-center">
                            <Link to="/login" className="font-medium text-accent hover:text-indigo-500">
                                Sign in instead
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;

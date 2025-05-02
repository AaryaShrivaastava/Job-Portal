import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { RadioGroup } from '../ui/radio-group'
import { Button } from '../ui/button'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading, setUser } from '@/redux/authSlice'
import { Loader2 } from 'lucide-react'

const Login = () => {
    const [input, setInput] = useState({
        email: "",
        password: "",
        role: "",
    });
    const [emailError, setEmailError] = useState('');
    const { loading, user } = useSelector(store => store.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const validateEmail = (email) => {
        if (!email) return false;
        return email.includes('@') && email.includes('.') && 
               email.indexOf('@') < email.lastIndexOf('.');
    };

    const changeEventHandler = (e) => {
        const { name, value } = e.target;
        setInput({ ...input, [name]: value });
        
        // Real-time email validation
        if (name === 'email') {
            if (!value) {
                setEmailError('Email is required');
            } else if (!validateEmail(value)) {
                setEmailError('Please enter a valid email address with @ and .');
            } else {
                setEmailError('');
            }
        }
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        
        // Validation checks
        if (!input.email || !input.password || !input.role) {
            toast.error("All fields are required");
            return;
        }
        
        if (!validateEmail(input.email)) {
            setEmailError('Please enter a valid email address');
            return;
        }

        try {
            dispatch(setLoading(true));
            const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true,
            });
            if (res.data.success) {
                dispatch(setUser(res.data.user));
                navigate("/");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        } finally {
            dispatch(setLoading(false));
        }
    }

    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [])

    // Required field indicator component
    const RequiredField = () => (
        <span className="text-red-500 ml-1">*</span>
    );

    return (
        <div>
            <Navbar />
            <div className='flex items-center justify-center max-w-7xl mx-auto'>
                <form onSubmit={submitHandler} className='w-1/2 border border-gray-200 rounded-md p-4 my-10'>
                    <h1 className='font-bold text-xl mb-5'>Login</h1>
                    <p className="text-sm text-gray-500 mb-4">Fields marked with <RequiredField /> are required</p>
                    
                    <div className='my-2'>
                        <Label>
                            Email
                            <RequiredField />
                        </Label>
                        <Input
                            type="email"
                            value={input.email}
                            name="email"
                            onChange={changeEventHandler}
                            placeholder="XYZ@gmail.com"
                            className={emailError ? 'border-red-500' : ''}
                            required
                        />
                        {emailError && (
                            <p className="text-red-500 text-sm mt-1">{emailError}</p>
                        )}
                    </div>

                    <div className='my-2'>
                        <Label>
                            Password
                            <RequiredField />
                        </Label>
                        <Input
                            type="password"
                            value={input.password}
                            name="password"
                            onChange={changeEventHandler}
                            placeholder="......"
                            required
                        />
                    </div>
                    <div className='flex items-center justify-between'>
                        <div>
                            <Label className="mb-2 block">
                                Role
                                <RequiredField />
                            </Label>
                            <RadioGroup className="flex items-center gap-4 my-2">
                                <div className="flex items-center space-x-2">
                                    <Input
                                        type="radio"
                                        name="role"
                                        value="student"
                                        checked={input.role === 'student'}
                                        onChange={changeEventHandler}
                                        className="cursor-pointer"
                                        required
                                    />
                                    <Label htmlFor="r1">Student</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Input
                                        type="radio"
                                        name="role"
                                        value="recruiter"
                                        checked={input.role === 'recruiter'}
                                        onChange={changeEventHandler}
                                        className="cursor-pointer"
                                        required
                                    />
                                    <Label htmlFor="r2">Recruiter</Label>
                                </div>
                            </RadioGroup>
                        </div>
                    </div>
                    {
                        loading ? <Button className="w-full my-4"> <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait </Button> : <Button type="submit" className="w-full my-4">Login</Button>
                    }
                    <span className='text-sm'>Don't have an account? <Link to="/signup" className='text-blue-600'>Signup</Link></span>
                </form>
            </div>
        </div>
    )
}

export default Login
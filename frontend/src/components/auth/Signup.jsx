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
import { setLoading } from '@/redux/authSlice'
import { Loader2 } from 'lucide-react'

const Signup = () => {
    const [input, setInput] = useState({
        fullname: "",
        email: "",
        phoneNumber: "",
        password: "",
        role: "",
        file: ""
    });
    
    const [errors, setErrors] = useState({
        fullname: "",
        email: "",
        phoneNumber: ""
    });

    const {loading, user} = useSelector(store=>store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const validateFullName = (name) => {
        const hasDigits = /\d/.test(name);
        return !hasDigits;
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePhone = (phone) => {
        const phoneRegex = /^\d{10}$/;
        return phoneRegex.test(phone);
    };

    const changeEventHandler = (e) => {
        const { name, value } = e.target;
        setInput({ ...input, [name]: value });
        
        setErrors(prev => ({ ...prev, [name]: "" }));

        if (name === 'fullname' && value) {
            if (!validateFullName(value)) {
                setErrors(prev => ({ 
                    ...prev, 
                    fullname: "Full name should not contain any digits" 
                }));
            }
        }

        if (name === 'email' && value) {
            if (!validateEmail(value)) {
                setErrors(prev => ({ 
                    ...prev, 
                    email: "Please enter a valid email address (must contain @ and .)" 
                }));
            }
        }

        if (name === 'phoneNumber' && value) {
            if (!validatePhone(value)) {
                setErrors(prev => ({ 
                    ...prev, 
                    phoneNumber: "Phone number must be exactly 10 digits" 
                }));
            }
        }
    };

    const changeFileHandler = (e) => {
        setInput({ ...input, file: e.target.files?.[0] });
    };

    const submitHandler = async (e) => {
        e.preventDefault();

        if (!validateFullName(input.fullname)) {
            setErrors(prev => ({ 
                ...prev, 
                fullname: "Full name should not contain any digits" 
            }));
            return;
        }

        if (!validateEmail(input.email)) {
            setErrors(prev => ({ 
                ...prev, 
                email: "Please enter a valid email address (must contain @ and .)" 
            }));
            return;
        }

        if (!validatePhone(input.phoneNumber)) {
            setErrors(prev => ({ 
                ...prev, 
                phoneNumber: "Phone number must be exactly 10 digits" 
            }));
            return;
        }

        const formData = new FormData();
        formData.append("fullname", input.fullname);
        formData.append("email", input.email);
        formData.append("phoneNumber", input.phoneNumber);
        formData.append("password", input.password);
        formData.append("role", input.role);
        if (input.file) {
            formData.append("file", input.file);
        }

        try {
            dispatch(setLoading(true));
            const axiosInstance = axios.create({
                baseURL: "http://localhost:3000/api/v1/",
                withCredentials: true,
            });

            const response = await axiosInstance.post(`${USER_API_END_POINT}/register`, formData, {
                headers: { 'Content-Type': "multipart/form-data" },
                withCredentials: true,
            });
            
            navigate("/login");
            toast.success(response.data.message);
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Registration failed");
        } finally {
            dispatch(setLoading(false));
        }
    };

    useEffect(()=>{
        if(user){
            navigate("/");
        }
    },[]);

    return (
        <div>
            <Navbar />
            <div className='flex items-center justify-center max-w-7xl mx-auto'>
                <form onSubmit={submitHandler} className='w-1/2 border border-gray-200 rounded-md p-4 my-10'>
                    <h1 className='font-bold text-xl mb-5'>Sign Up</h1>
                    <div className='my-2'>
                        <Label>Full Name <span className="text-red-500">*</span></Label>
                        <Input
                            type="text"
                            value={input.fullname}
                            name="fullname"
                            onChange={changeEventHandler}
                            placeholder="Name"
                            className={errors.fullname ? 'border-red-500' : ''}
                        />
                        {errors.fullname && <p className="text-red-500 text-sm mt-1">{errors.fullname}</p>}
                    </div>
                    <div className='my-2'>
                        <Label>Email <span className="text-red-500">*</span></Label>
                        <Input
                            type="email"
                            value={input.email}
                            name="email"
                            onChange={changeEventHandler}
                            placeholder="XYZ@gmail.com"
                            className={errors.email ? 'border-red-500' : ''}
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>
                    <div className='my-2'>
                        <Label>Phone Number <span className="text-red-500">*</span></Label>
                        <Input
                            type="text"
                            value={input.phoneNumber}
                            name="phoneNumber"
                            onChange={changeEventHandler}
                            placeholder="1234567890"
                            className={errors.phoneNumber ? 'border-red-500' : ''}
                        />
                        {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
                    </div>
                    <div className='my-2'>
                        <Label>Password <span className="text-red-500">*</span></Label>
                        <Input
                            type="password"
                            value={input.password}
                            name="password"
                            onChange={changeEventHandler}
                            placeholder="......"
                        />
                    </div>
                    <div className='flex items-center justify-between'>
                        <div>
                            <Label className="block mb-2">Role <span className="text-red-500">*</span></Label>
                            <RadioGroup className="flex items-center gap-4">
                                <div className="flex items-center space-x-2">
                                    <Input
                                        type="radio"
                                        name="role"
                                        value="student"
                                        checked={input.role === 'student'}
                                        onChange={changeEventHandler}
                                        className="cursor-pointer"
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
                                    />
                                    <Label htmlFor="r2">Recruiter</Label>
                                </div>
                            </RadioGroup>
                        </div>
                        <div className='flex items-center gap-2'>
                            <Label>Profile</Label>
                            <Input
                                accept="image/*"
                                type="file"
                                onChange={changeFileHandler}
                                className="cursor-pointer"
                            />
                        </div>
                    </div>
                    {
                        loading ? 
                        <Button className="w-full my-4"> 
                            <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait 
                        </Button> : 
                        <Button 
                            type="submit" 
                            className="w-full my-4" 
                            disabled={!!errors.fullname || !!errors.email || !!errors.phoneNumber}
                        >
                            Signup
                        </Button>
                    }
                    <span className='text-sm'>Already have an account? <Link to="/login" className='text-blue-600'>Login</Link></span>
                </form>
            </div>
        </div>
    );
};

export default Signup;
import React, { useEffect, useState } from 'react';
import Navbar from '../shared/Navbar';
import { Button } from '../ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from 'axios';
import { COMPANY_API_END_POINT } from '@/utils/constant';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';
import useGetCompanyById from '@/hooks/useGetCompanyById';

const worldCities = [
    "Ayodhya", "Agra", "Ahmedabad", "Bangalore", "Bhopal", "Chennai", "Coimbatore", 
    "Delhi", "Goa", "Guwahati", "Hyderabad", "Indore", "Jaipur", "Kanpur", "Kochi", "Kolkata", "Lucknow", 
    "Mumbai", "Nagpur", "Patna", "Pune", "Ranchi", "Surat", "Thiruvananthapuram", "Udaipur", "Varanasi", 
    "Visakhapatnam"
].sort();
worldCities.unshift("Ayodhya");

const CompanySetup = () => {
    const params = useParams();
    useGetCompanyById(params.id);
    const [input, setInput] = useState({
        name: "",
        description: "",
        website: "",
        location: "",
        file: null
    });
    const [errors, setErrors] = useState({});
    const {singleCompany} = useSelector(store=>store.company);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const validateForm = () => {
        const newErrors = {};
        if (!input.name.trim()) newErrors.name = "Company name is required";
        if (!input.description.trim()) newErrors.description = "Description is required";
        if (!input.website.trim()) newErrors.website = "Website is required";
        if (!input.location) newErrors.location = "Location is required";
        if (!input.file && !singleCompany.logo) newErrors.file = "Logo is required";
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
        // Clear error when user starts typing
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: "" });
        }
    }

    const handleLocationChange = (value) => {
        setInput({ ...input, location: value });
        if (errors.location) {
            setErrors({ ...errors, location: "" });
        }
    }

    const changeFileHandler = (e) => {
        const file = e.target.files?.[0];
        setInput({ ...input, file });
        if (errors.file) {
            setErrors({ ...errors, file: "" });
        }
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            toast.error("Please fill all required fields");
            return;
        }

        const formData = new FormData();
        formData.append("name", input.name);
        formData.append("description", input.description);
        formData.append("website", input.website);
        formData.append("location", input.location);
        if (input.file) {
            formData.append("file", input.file);
        }

        try {
            setLoading(true);
            const res = await axios.put(`${COMPANY_API_END_POINT}/update/${params.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });
            if (res.data.success) {
                toast.success(res.data.message);
                navigate("/admin/companies");
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        setInput({
            name: singleCompany.name || "",
            description: singleCompany.description || "",
            website: singleCompany.website || "",
            location: singleCompany.location || "",
            file: singleCompany.file || null
        })
    }, [singleCompany]);

    return (
        <div>
            <Navbar />
            <div className="max-w-xl mx-auto my-10">
                <form onSubmit={submitHandler}>
                    <div className="flex items-center gap-5 p-8">
                        <Button onClick={() => navigate("/admin/companies")} variant="outline" className="flex items-center gap-2 text-gray-500 font-semibold">
                            <ArrowLeft />
                            <span>Back</span>
                        </Button>
                        <h1 className="font-bold text-xl">Company Setup</h1>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label className="flex gap-1">
                                Company Name
                                <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                type="text"
                                name="name"
                                value={input.name}
                                onChange={changeEventHandler}
                                className={errors.name ? "border-red-500" : ""}
                            />
                            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                        </div>
                        <div>
                            <Label className="flex gap-1">
                                Description
                                <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                type="text"
                                name="description"
                                value={input.description}
                                onChange={changeEventHandler}
                                className={errors.description ? "border-red-500" : ""}
                            />
                            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                        </div>
                        <div>
                            <Label className="flex gap-1">
                                Website
                                <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                type="text"
                                name="website"
                                value={input.website}
                                onChange={changeEventHandler}
                                className={errors.website ? "border-red-500" : ""}
                            />
                            {errors.website && <p className="text-red-500 text-sm mt-1">{errors.website}</p>}
                        </div>
                        <div>
                            <Label className="flex gap-1">
                                Location
                                <span className="text-red-500">*</span>
                            </Label>
                            <Select
                                value={input.location}
                                onValueChange={handleLocationChange}
                            >
                                <SelectTrigger className={errors.location ? "border-red-500" : ""}>
                                    <SelectValue placeholder="Select a city" />
                                </SelectTrigger>
                                <SelectContent>
                                    {worldCities.map((city) => (
                                        <SelectItem key={city} value={city}>
                                            {city}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
                        </div>
                        <div>
                            <Label className="flex gap-1">
                                Logo
                                <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={changeFileHandler}
                                className={errors.file ? "border-red-500" : ""}
                            />
                            {errors.file && <p className="text-red-500 text-sm mt-1">{errors.file}</p>}
                        </div>
                    </div>
                    {loading ? (
                        <Button disabled className="w-full my-4">
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                        </Button>
                    ) : (
                        <Button type="submit" className="w-full my-4">Update</Button>
                    )}
                </form>
            </div>
        </div>
    );
}

export default CompanySetup;
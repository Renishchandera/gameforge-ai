import { useDispatch, useSelector } from "react-redux";
import { Button } from "../ui/button";
import { Field, FieldError, FieldLabel, FieldLegend, FieldSet, FieldGroup } from "../ui/field";
import { Input } from "../ui/input";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { registerUser } from "@/features/auth/authSlice";
import { Loader2 } from "lucide-react";

export default function RegisterForm()
{
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {loading, error, isAuthenticated} = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: ""
    });
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const handleChange = async (e)=>{
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        // Clear password error when user types
        if (e.target.name === "password" || e.target.name === "cpassword") {
            setPasswordError("");
        }
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
        if (formData.password && e.target.value !== formData.password) {
            setPasswordError("Passwords do not match");
        } else {
            setPasswordError("");
        }
    };

    const handleSubmit = async (e)=>{
        e.preventDefault();
        // Check if passwords match before submitting
        if (formData.password !== confirmPassword) {
            setPasswordError("Passwords do not match");
            return;
        }
        dispatch(registerUser(formData));
    };

    useEffect(() => {
        if(isAuthenticated){
            navigate("/")
        }
    }, [isAuthenticated]);

    return(
        <section className="w-full max-w-md mx-auto px-4 py-8">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md border border-gray-200">
                <FieldSet className="p-6 space-y-5">
                    <div className="text-center mb-6">
                        <FieldLegend className="text-2xl font-bold text-gray-900">Create Account</FieldLegend>
                        <p className="text-sm text-gray-500 mt-1">Join GameForge to start building games</p>
                    </div>
                    
                    <FieldGroup className="space-y-4">
                        <Field>
                            <FieldLabel htmlFor="username" className="text-sm font-medium text-gray-700">Username</FieldLabel>
                            <Input 
                                type={"text"} 
                                name="username" 
                                id="username" 
                                required 
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
                                placeholder="johndoe"
                            />
                            <FieldError errors={["Username is not valid!"]} className="text-xs text-red-500 mt-1" />
                        </Field>
                        
                        <Field>
                            <FieldLabel htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</FieldLabel>
                            <Input 
                                type={"email"} 
                                id="email" 
                                name="email" 
                                required 
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
                                placeholder="you@example.com"
                            />
                            <FieldError errors={["Email Format is not valid!"]} className="text-xs text-red-500 mt-1" />
                        </Field>
                        
                        <Field>
                            <FieldLabel htmlFor="password" className="text-sm font-medium text-gray-700">Password</FieldLabel>
                            <Input 
                                type={"password"} 
                                id="password" 
                                name="password" 
                                required 
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
                                placeholder="••••••••"
                            />
                            <FieldError errors={["Incorrect Password Format"]} className="text-xs text-red-500 mt-1" />
                        </Field>
                        
                        <Field>
                            <FieldLabel htmlFor="cpassword" className="text-sm font-medium text-gray-700">Confirm Password</FieldLabel>
                            <Input 
                                type={"password"} 
                                id="cpassword" 
                                name="cpassword" 
                                required 
                                onChange={handleConfirmPasswordChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
                                placeholder="••••••••"
                            />
                            {passwordError && (
                                <p className="text-xs text-red-500 mt-1">{passwordError}</p>
                            )}
                            <FieldError errors={["Incorrect Password Format"]} className="text-xs text-red-500 mt-1" />
                        </Field>
                    </FieldGroup>
                    
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-md text-sm">
                            {error}
                        </div>
                    )}
                    
                    <Field className="pt-2">
                        <Button 
                            disabled={loading} 
                            type={"submit"}
                            className="w-full bg-black text-white hover:bg-gray-800 focus:ring-4 focus:ring-gray-300 font-medium rounded-md text-sm px-5 py-2.5 transition-colors"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="inline mr-2 h-4 w-4 animate-spin" />
                                    Creating Account...
                                </>
                            ) : (
                                "Register"
                            )}
                        </Button>
                    </Field>
                    
                    <p className="text-center text-sm text-gray-500 mt-4">
                        Already have an account?{" "}
                        <a href="/auth" className="text-black hover:underline font-medium">
                            Sign in here
                        </a>
                    </p>
                </FieldSet>
            </form>
        </section>
    )
}
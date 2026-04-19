import { loginUser } from "@/features/auth/authSlice";
import { Button } from "../ui/button";
import { Field, FieldError, FieldLabel, FieldLegend, FieldSet, FieldGroup } from "../ui/field";
import { Input } from "../ui/input";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export default function LoginForm() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

    const [credentials, setCredentials] = useState({
        email: "",
        password: ""
    });
    const handleChange = (e) => {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value,
        });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(loginUser(credentials));
    }
    useEffect(() => {
        if (isAuthenticated) {
            navigate("/");
        }
    }, [isAuthenticated]);
    
    return (
        <section className="w-full max-w-md mx-auto px-4 py-8">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md border border-gray-200">
                <FieldSet className="p-6 space-y-5">
                    <div className="text-center mb-6">
                        <FieldLegend className="text-2xl font-bold text-gray-900">Welcome Back</FieldLegend>
                        <p className="text-sm text-gray-500 mt-1">Sign in to your GameForge account</p>
                    </div>
                    
                    <FieldGroup className="space-y-4">
                        <Field>
                            <FieldLabel htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</FieldLabel>
                            <Input
                                type="email"
                                id="email"
                                name="email"
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
                                placeholder="you@example.com"
                            />
                            <FieldError errors={["Email Format is not valid!"]} className="text-xs text-red-500 mt-1" />
                        </Field>
                        
                        <Field>
                            <FieldLabel htmlFor="password" className="text-sm font-medium text-gray-700">Password</FieldLabel>
                            <Input
                                type="password"
                                id="password"
                                name="password"
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
                                placeholder="••••••••"
                            />
                            <FieldError errors={["Incorrect Password"]} className="text-xs text-red-500 mt-1" />
                        </Field>
                    </FieldGroup>
                    
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-md text-sm">
                            {error}
                        </div>
                    )}
                    
                    <Field className="pt-2">
                        <Button 
                            type="submit" 
                            disabled={loading}
                            className="w-full bg-black text-white hover:bg-gray-800 focus:ring-4 focus:ring-gray-300 font-medium rounded-md text-sm px-5 py-2.5 transition-colors"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="inline mr-2 h-4 w-4 animate-spin" />
                                    Logging in...
                                </>
                            ) : (
                                "Login"
                            )}
                        </Button>
                    </Field>
                    
                    <p className="text-center text-sm text-gray-500 mt-4">
                        Don't have an account?{" "}
                        <a href="/auth/register" className="text-black hover:underline font-medium">
                            Register here
                        </a>
                    </p>
                </FieldSet>
            </form>
        </section>
    )
}
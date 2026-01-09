import { loginUser } from "@/features/auth/authSlice";
import { Button } from "../ui/button";
import { Field, FieldError, FieldLabel, FieldLegend, FieldSet, FieldGroup } from "../ui/field";
import { Input } from "../ui/input";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
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
        <section>
            <form onSubmit={handleSubmit}>
                <FieldSet>
                    <FieldLegend>Login Form</FieldLegend>
                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="email">Email</FieldLabel>
                            <Input
                                type="email"
                                id="email"
                                name="email"
                                onChange={handleChange}
                                required
                            />

                            <FieldError errors={["Email Format is not valid!"]} />
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="password">Password</FieldLabel>
                            <Input
                                type="password"
                                id="password"
                                name="password"
                                onChange={handleChange}
                                required
                            />

                            <FieldError errors={["Incorrect Password"]} />
                        </Field>
                    </FieldGroup>
                    <Field>
                        <Button type={"submit"} >Login</Button>
                    </Field>
                </FieldSet>
            </form>
        </section>
    )
}
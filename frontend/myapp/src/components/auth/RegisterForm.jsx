import { useDispatch, useSelector } from "react-redux";
import { Button } from "../ui/button";
import { Field, FieldError, FieldLabel, FieldLegend,FieldSet, FieldGroup } from "../ui/field";
import { Input } from "../ui/input";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { registerUser } from "@/features/auth/authSlice";

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
    const handleChange = async (e)=>{
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    }
    const handleSubmit = async (e)=>{
        e.preventDefault();
        dispatch(registerUser(formData));
    };

    useEffect(() => {
        if(isAuthenticated){
            navigate("/")
        }
    }, [isAuthenticated]);
    return(
        <section>
            <form onSubmit={handleSubmit}>
            <FieldSet>
                <FieldLegend>Register Form</FieldLegend>
            <FieldGroup>
            <Field>
                <FieldLabel htmlFor="username">Username</FieldLabel>
                <Input type={"text"} name="username" id="username" required onChange={handleChange}></Input>
                <FieldError errors={["Username is not valid!"]}/>
            </Field>
            <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input type={"email"} id="email" name="email" required onChange={handleChange}></Input>
                <FieldError errors={["Email Format is not valid!"]}/>
            </Field>
            <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input type={"password"} id="password" name="password" required onChange={handleChange}></Input>
                <FieldError errors={["Incorrect Password Format"]}/>
            </Field>
            <Field>
                <FieldLabel htmlFor="cpassword">Confirm Password</FieldLabel>
                <Input type={"password"} id="cpassword" name="cpassword" required ></Input>
                <FieldError errors={["Incorrect Password Format"]}/>
            </Field>
            </FieldGroup>
            <Field>
                <Button disabled={loading} type={"submit"} >{loading ? "Creating Account" : "Register"}</Button>
            </Field>
            {/* <FieldError errors={error}/> */}
        </FieldSet>
        </form>
        </section>
    )
}
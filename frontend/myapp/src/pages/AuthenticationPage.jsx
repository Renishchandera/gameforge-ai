import { Outlet } from "react-router";

export default function({children})
{
    return(
        <>
            <Outlet>{children}</Outlet>
        </>
    )
}
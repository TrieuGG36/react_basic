import { useState } from "react";
import { loginApi} from "../services/userService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";



const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [passowrd, setPassword] = useState("");
    const [isShowPassword, setIsshowPassword] = useState(false);
    const [loadingAPI, setLoadingAPI] = useState(false);
    
    useEffect(() => {
        let token = localStorage.getItem("token");
        if(token){
            navigate("/");
        }
    },[])

    const handleLogin = async () => {
        if(!email || !passowrd){
            toast.error("Email / Password is required");
            return;
        }
        setLoadingAPI(true);

        let res = await loginApi(email, passowrd);
        if(res && res.token){
            localStorage.setItem("token", res.token);
            toast.success("Login successfully")
            navigate("/");
        }else{
            if(res && res.status === 400){
                toast.error(res.data.error);
            }
        }
        setLoadingAPI(false);
        console.log(">>> Check login: ", res);
    }
    return (<>
        <div className="login-container col-12 col-sm-4">
            <div className="title">Login</div>
            <div className="text">Email or UserName</div>
            <input type="text" placeholder="Email or UserName..." value={email} onChange={(event) => setEmail(event.target.value)} />
            
            <div className="input-2">
                <input type={isShowPassword === true ? "text" : "password"}
                placeholder="Password..."  
                value={passowrd} 
                onChange={(event) => setPassword(event.target.value)} />
                <i className={isShowPassword === true ? "fa-solid fa-eye" : "fa-sharp fa-solid fa-eye-slash"} 
                onClick={() => setIsshowPassword(!isShowPassword)}></i>
            </div>
            

            <button 
            className={email && passowrd ? "active" : ""} 
            disabled={email && passowrd ? false : true}
            onClick={() => handleLogin()}
            >  {loadingAPI && <i className="fas fa-sync fa-spin"></i> }
            &nbsp;
            Login
            </button>
            <div className="back">
            <i className="fa-solid fa-angle-left"></i> Go back
            </div>
        </div>

        </>)
}
export default Login;
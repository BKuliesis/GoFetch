import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AuthenticationPage.module.css";
import "../../global.css";
import { login } from "../../services/Registry";

function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Logging in with:", { email, password });

        const user = await login(email, password);
        if (user) {
            console.log("Login successful:", user);
            navigate("/dashboard");
        } else {
            setError("Invalid Email or Password");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className={styles.input}>
                <label>Email</label>
                <input 
                    type="email" 
                    value={email} 
                    placeholder="john.doe@example.com"
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                />
            </div>

            <div className={styles.input}>
                <label>Password</label>
                <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                />
            </div>

            <p className={styles.error}>{error}</p>

            <button type="submit" className="btn2 btn-primary" style={{width: "100%"}}>Login</button>
        </form>
    );
}

export default LoginForm;

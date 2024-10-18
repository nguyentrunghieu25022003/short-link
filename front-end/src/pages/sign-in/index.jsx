import { useState } from "react";
import { handleSignIn } from "../../api/index";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isValid, setIsValid] = useState(true);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await handleSignIn({ email: email, password: password });
      
      if (response) {
        const { user, accessToken, refreshToken } = response;

        localStorage.setItem("user-short-link", JSON.stringify(user));
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
    
        setEmail("");
        setPassword("");
    
        setTimeout(() => {
          window.location.href = "/";
        }, 3000);
      } else {
        setIsValid(false);
      }
    } catch (err) {
      setIsValid(false);
      console.log("Error: " + err.message);
    }
  };

  return (
    <div className="container mt-5">
      <div className="w-50" style={{ margin: "0 auto" }}>
        <h2 className="mb-4 fs-1 fw-bold">Sign In</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3 mt-2">
            <label htmlFor="email" className="form-label fs-4">Email address:</label>
            <input
              type="email"
              className="form-control fs-5"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-3 mt-2">
            <label htmlFor="password" className="form-label fs-4">Password:</label>
            <input
              type="password"
              className="form-control fs-5"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          {!isValid && <strong className="d-block mt-2 fs-5 text-danger fw-medium">Invalid login information, please check and try again.</strong>}
          <button type="submit" className="btn btn-primary fs-3 fw-medium w-100 mt-5">Sign In</button>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
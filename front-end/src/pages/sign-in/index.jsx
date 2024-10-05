import { useState } from "react";
import { handleSignIn } from "../../api/index";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await handleSignIn({ email: email, password: password });
      if (response) {
        localStorage.setItem("user-short-link", JSON.stringify(response.user));
        setEmail("");
        setPassword("");
        setTimeout(() => {
          window.location.href = "/";
        }, 3000);
      }
    } catch (err) {
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
          <button type="submit" className="btn btn-primary fs-3 fw-medium w-100 mt-3">Sign In</button>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
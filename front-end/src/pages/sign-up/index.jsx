import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { handleSignUp } from "../../api/index";

const SignUp = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const accept = document.querySelector("input[name='accept']:checked");
      if(!accept) {
        alert("Please accept our terms before registering for an account.");
        return;
      }

      const response = await handleSignUp({
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
      });

      if (response) {
        setFirstName("");
        setLastName("");
        setEmail("");
        setPassword("");
        navigate("/sign-in");
      }
    } catch (err) {
      console.log("Error: " + err.message);
    }
  };

  return (
    <div className="container mt-5">
      <div className="w-50" style={{ margin: "0 auto" }}>
        <h2 className="mb-4 fs-1 fw-bold">Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="firstName" className="form-label fs-4">First Name:</label>
            <input
              type="text"
              className="form-control fs-5"
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Enter your first name"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="lastName" className="form-label fs-4">Last Name:</label>
            <input
              type="text"
              className="form-control fs-5"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Enter your last name"
              required
            />
          </div>
          <div className="mb-3">
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
          <div className="mb-3">
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
          <p className="d-flex align-items-center gap-2 mt-4 fs-5"><input type="checkbox" name="accept" /><span>I hereby certify that all provided information is valid, and I agree to the terms and conditions of the application.</span></p>
          <button type="submit" className="btn btn-primary fs-3 fw-medium w-100 mt-5">Sign Up</button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
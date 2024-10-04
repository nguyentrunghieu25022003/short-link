import { Link } from "react-router-dom";
import useAuthToken from "../../utils/auth";
import { handleLogOut } from "../../api/index";

const Header = () => {
  const { userToken } = useAuthToken();
  
  const submitLogOutRequest = async () => {
    try {
      const response = await handleLogOut();
      if(response) {
        console.log("Logged out successfully !");
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      }
    } catch (err) {
      console.log("Error: " + err.message);
    }
  };

  return (
    <header className="bg-primary pt-3 pb-3">
      <div className="container">
        <div className="row">
          <nav className="navbar navbar-expand-lg navbar-light">
            <div className="container-fluid">
              <Link to="/" className="navbar-brand fs-1 fw-medium text-light">
                Short Link
              </Link>
              <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarNav"
                aria-controls="navbarNav"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav ms-auto">
                  { userToken ? (
                    <>
                      <li className="nav-item">
                        <Link to="/" className="nav-link fs-3 text-light fw-medium">
                          Home
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link to="/history" className="nav-link fs-3 text-light fw-medium">
                          History
                        </Link>
                      </li>
                      <li className="nav-item">
                        <span className="nav-link fs-3 text-light fw-medium" onClick={() => submitLogOutRequest()}>
                          Log out
                        </span>
                      </li>
                    </>
                  ) : (
                    <>
                      <li className="nav-item">
                        <Link to="/sign-in" className="nav-link fs-3 text-light fw-medium">
                          Sign in
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link to="/sign-up" className="nav-link fs-3 text-light fw-medium">
                          Sign up
                        </Link>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;

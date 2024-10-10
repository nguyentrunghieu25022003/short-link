import { Link } from "react-router-dom";
import { handleLogOut } from "../../api/index";
import "./header.css";

const Header = () => {
  const user = localStorage.getItem("user-short-link");
  
  const submitLogOutRequest = async () => {
    try {
      const response = await handleLogOut();
      if(response) {
        localStorage.removeItem("user-short-link");
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
                data-bs-toggle="offcanvas"
                data-bs-target="#offcanvasNavbar"
                aria-controls="offcanvasNavbar"
              >
                <span className="navbar-toggler-icon"></span>
              </button>
              <div
                className="offcanvas offcanvas-end custom-canvas"
                tabIndex="-1"
                id="offcanvasNavbar"
                aria-labelledby="offcanvasNavbarLabel"
              >
                <div className="offcanvas-header bg-primary">
                  <h5 className="offcanvas-title fs-1 fw-medium text-light" id="offcanvasNavbarLabel">
                    Menu
                  </h5>
                  <button
                    type="button"
                    className="btn-close text-light text-reset"
                    data-bs-dismiss="offcanvas"
                    aria-label="Close"
                  ></button>
                </div>
                <div className="offcanvas-body bg-primary">
                  <ul className="navbar-nav me-auto mb-2 mb-lg-0 custom-item">
                    <li className="nav-item">
                      <Link to="/" className="nav-link fs-3 text-light fw-medium">
                        Home
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        to="/histories"
                        className="nav-link fs-3 text-light fw-medium"
                      >
                        History
                      </Link>
                    </li>
                  </ul>
                  <ul className="navbar-nav ms-auto navbar-custom">
                    {user ? (
                      <li className="nav-item">
                        <span
                          className="nav-link fs-3 text-light fw-medium log-out-item"
                          onClick={() => submitLogOutRequest()}
                        >
                          Log out
                        </span>
                      </li>
                    ) : (
                      <>
                        <li className="nav-item pr-5">
                          <Link
                            to="/sign-in"
                            className="nav-link fs-3 text-light fw-medium"
                          >
                            Sign in /
                          </Link>
                        </li>
                        <li className="nav-item">
                          <Link
                            to="/sign-up"
                            className="nav-link fs-3 text-light fw-medium"
                          >
                            Sign up
                          </Link>
                        </li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;

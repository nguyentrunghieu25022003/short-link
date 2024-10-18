import "./header.css";
import { Link } from "react-router-dom";
import { handleLogOut } from "../../api/index";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import LogoutIcon from "@mui/icons-material/Logout";

const Header = () => {
  const user = localStorage.getItem("user-short-link");
  const accessToken = localStorage.getItem("accessToken");
  
  const submitLogOutRequest = async () => {
    try {
      const response = await handleLogOut(accessToken);
      if (response) {
        localStorage.removeItem("user-short-link");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      }
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } catch (err) {
      console.log("Error: " + err.message);
    }
  };

  return (
    <header className="bg-primary pt-3 pb-3 fixed-top">
      <div className="container">
        <div className="row">
          <nav className="navbar navbar-expand-lg navbar-light">
            <div className="container-fluid">
              <Link to="/" className="navbar-brand fs-1 fw-medium text-light">
                Short URL
              </Link>
              <button
                className="menu-toggle"
                type="button"
                data-bs-toggle="offcanvas"
                data-bs-target="#offcanvasNavbar"
                aria-controls="offcanvasNavbar"
              >
                <MenuIcon className="icon" />
              </button>
              <div
                className="offcanvas offcanvas-end custom-canvas"
                tabIndex="-1"
                id="offcanvasNavbar"
                aria-labelledby="offcanvasNavbarLabel"
              >
                <div className="offcanvas-header bg-primary">
                  <h5
                    className="offcanvas-title fs-1 fw-medium text-light"
                    id="offcanvasNavbarLabel"
                  >
                    Short URL
                  </h5>
                  <button
                    type="button"
                    className="close text-light text-reset"
                    data-bs-dismiss="offcanvas"
                  >
                    <CloseIcon className="icon" />
                  </button>
                </div>
                <div className="offcanvas-body bg-primary">
                  <ul className="navbar-nav me-auto mb-2 mb-lg-0 custom-item">
                    <li className="nav-item dropdown">
                      <a
                        className="nav-link dropdown-toggle fs-3 text-light fw-medium"
                        href="#"
                        id="navbarDropdown"
                        role="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        Tools
                      </a>
                      <ul
                        className="dropdown-menu"
                        aria-labelledby="navbarDropdown"
                      >
                        <li>
                          <Link to="/" className="dropdown-item nav-link fs-4 fw-medium">
                            Short URL
                          </Link>
                        </li>
                        <li>
                          <Link to="/social-snapshot" className="dropdown-item nav-link fs-4 fw-medium">
                            Social Network
                          </Link>
                        </li>
                      </ul>
                    </li>
                    <li className="nav-item">
                      <Link
                        to="/histories"
                        className="nav-link fs-3 text-light fw-medium"
                      >
                        Activity
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
                          <LogoutIcon className="fs-2" />
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

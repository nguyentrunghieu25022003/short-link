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
              <div className="d-flex align-items-center gap-5" >
                <Link to="/" className="navbar-brand fs-1 fw-medium text-light">
                  Short Link
                </Link>
                <Link to="/" className="nav-link fs-3 text-light fw-medium">
                  Home
                </Link>
                <Link to="/histories" className="nav-link fs-3 text-light fw-medium">
                  History
                </Link>
              </div>
              <div>
                <ul className="navbar-nav ms-auto">
                  { userToken ? (
                    <>
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

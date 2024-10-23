import "./social-snapshot.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { getAllResult } from "../../api/index";

const SocialSnapshot = () => {
  const [userInput, setUserInput] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      let url;
      const isNumber = /^[0-9]+$/.test(userInput);
      if (!isNumber) {
        url = `${import.meta.env.VITE_API_URL}/api/crawl/social-snapshot/name`;
      } else {
        url = `${import.meta.env.VITE_API_URL}/api/crawl/social-snapshot/id`;
      }
      const response = await axios.post(url, {
        userInput: userInput,
      });
      if (response.status === 200) {
        setIsLoading(false);
        console.log("Successfully");
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  useEffect(() => {
    (async () => {
      const response = await getAllResult();
      setResults(response);
    })();
  }, [isLoading]);

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="mt-3 d-flex align-items-center gap-3">
            <input
              type="text"
              className="form-control fs-4 w-100"
              placeholder="Enter User ID or Username..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
            />
            <button
              className="btn btn-primary fs-4 fw-bold"
              onClick={handleSubmit}
            >
              Search
            </button>
          </div>
          <strong className="d-block mt-3 fs-5 text-danger fw-medium">
            Warning: Please be mindful not to abuse this feature. Overuse or
            misuse may lead to restrictions.
          </strong>
        </div>
      </div>
      {isLoading && (
        <div className="loading">
          <img src="/imgs/03-42-05-37_512.webp" alt="loading" />
        </div>
      )}
      <div className="row justify-content-center mt-5">
        <div className="col-12">
          <div className="table-responsive">
            <table className="table table-bordered table-hover">
              <thead className="table-dark">
                <tr className="fs-3 fw-medium table-dark text-center">
                  <th>#</th>
                  <th>Facebook URL</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Created at</th>
                </tr>
              </thead>
              <tbody>
                {results?.map((item, index) => {
                  const isNumber = /^[0-9]+$/.test(item?.userInfo);
                  return (
                    <tr
                      key={index}
                      className="fs-4 fw-normal text-dark table-light align-middle ="
                    >
                      <td className="text-center">{index + 1}</td>
                      <td
                        className="text-truncate"
                        style={{ maxWidth: "280px" }}
                      >
                        <a
                          className="text-decoration-none"
                          href={`${import.meta.env.VITE_FACEBOOK_URL}/${
                            isNumber ? "profile.php?id=" : ""
                          }${item?.userInfo}`}
                          target="_blank"
                        >
                          {import.meta.env.VITE_FACEBOOK_URL}/
                          {isNumber ? "profile.php?id=" : ""}
                          <span className="text-danger">{item?.userInfo}</span>
                        </a>
                      </td>
                      <td className="text-center">
                        {item?.email.map((mail, idx) => (
                          <span className="d-block pt-2 pb-2" key={idx}>
                            {mail.includes("You're logged") ? "Empty" : mail}
                          </span>
                        ))}
                        {item.email.length === 0 && <span>Empty</span>}
                      </td>
                      <td className="text-center">
                        {item?.phoneNumber.map((number, idx) => (
                          <span className="d-block pt-2 pb-2" key={idx}>
                            {number.includes("You're logged") ? "Empty" : number}
                          </span>
                        ))}
                        {item.phoneNumber.length === 0 && <span>Empty</span>}
                      </td>
                      <td className="text-center">{new Date(item.createdAt).toLocaleString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialSnapshot;

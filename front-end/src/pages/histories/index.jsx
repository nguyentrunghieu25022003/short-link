import { useEffect, useState } from "react";
import { getUserHistories } from "../../api/index";
import Loading from "../../components/loading/index";

const Histories = () => {
  const [shortenedLinks, setShortenedLinks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const userId = JSON.parse(localStorage.getItem("user-short-link")).id;

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const response = await getUserHistories(userId);
        console.log(response)
        setShortenedLinks(response);
      } catch (err) {
        console.log("Error: " + err.message);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [userId]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="container">
      <div className="row">
        <h3 className="fs-1 fw-bold pt-5 pb-5">Histories</h3>
        <div className="table-responsive">
          <table className="table table-hover table-bordered">
            <thead>
              <tr className="fs-3 fw-medium text-dark table-primary">
                <th className="text-light">#</th>
                <th className="text-light">Shortened Link</th>
                <th className="text-light">Original Link</th>
                <th className="text-light">Created At</th>
                <th className="text-light">IP and Location</th>
              </tr>
            </thead>
            <tbody>
              {shortenedLinks?.map((link, index) => (
                <tr
                  key={index}
                  className="fs-4 fw-normal text-dark table-light align-middle"
                >
                  <td>{index + 1}</td>
                  <td className="text-truncate" style={{ maxWidth: "150px" }}>
                    <a
                      href={`${import.meta.env.VITE_API_URL}/api/url/shorten/${
                        link.shortId
                      }`}
                      target="_blank"
                      className="link-primary"
                      style={{ cursor: "pointer" }}
                    >
                      {import.meta.env.VITE_API_URL}/api/url/{link.shortId}
                    </a>
                  </td>
                  <td className="text-truncate" style={{ maxWidth: "250px" }}>
                    <a
                      href={link.originalUrl}
                      target="_blank"
                      className="text-decoration-none text-dark"
                    >
                      {link.originalUrl}
                    </a>
                  </td>
                  <td>{new Date(link.createdAt).toLocaleString()}</td>
                  <td>
                    <ul style={{ maxHeight: "100px", overflowY: "auto" }}>
                      {link.visits.map((item, idx) => (
                        <li key={idx} className="pt-2 pb-2">
                          {idx + 1}{")"} <strong className="fw-bold">{item?.ip}</strong> - {item?.location?.region}, {" "} {item?.location?.country} - {new Date(item.timestamp).toLocaleString()}
                        </li>
                      ))}
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Histories;
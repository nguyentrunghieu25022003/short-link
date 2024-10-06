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
  };

  return (
    <div className="container">
      <div className="row">
        <h3 className="fs-1 fw-bold pt-5 pb-5">Histories</h3>
        <table className="table table-hover">
          <thead>
            <tr className="fs-3 fw-medium text-dark table-dark">
              <th>#</th>
              <th>Shortened Link</th>
              <th>Original Link</th>
              <th>Created At</th>
              <th>IP</th>
            </tr>
          </thead>
          <tbody>
            {shortenedLinks?.map((link, index) => (
              <tr
                key={index}
                className="fs-4 fw-normal text-dark table-light align-middle"
              >
                <td>{index + 1}</td>
                <td>
                <a
                  href={`${import.meta.env.VITE_API_URL}/api/url/redirect/${link.shortId}`}
                  target="_blank"
                  className="link-primary"
                  style={{ cursor: "pointer" }}
                >
                  {import.meta.env.VITE_API_URL}/api/{link.shortId}
                </a>
              </td>
                <td className="text-truncate" style={{ maxWidth: "450px" }}>
                  <a href={link.originalUrl} target="_blank" className="text-decoration-none text-dark">{link.originalUrl}</a>
                </td>
                <td>{new Date(link.createdAt).toLocaleString()}</td>
                <td>
                  <ul>
                    {link.visits.map((item, index) => {
                      return (
                        <li key={index}>{item?.ip} - {item?.location?.region}, {item?.location?.country}</li>
                      );
                    })}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Histories;

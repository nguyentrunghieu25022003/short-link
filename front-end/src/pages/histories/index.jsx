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
        <div className="table-responsive mt-5 mb-5">
          <table className="table table-hover table-bordered">
            <thead>
              <tr className="fs-3 fw-medium table-dark text-center">
                <th className="text-light">#</th>
                <th className="text-light">Shortened URL</th>
                <th className="text-light">Original URL</th>
                <th className="text-light">Created at</th>
                <th className="text-light">IP Address - Location</th>
              </tr>
            </thead>
            <tbody>
              {shortenedLinks?.map((link, index) => (
                <tr
                  key={index}
                  className="fs-4 fw-normal text-dark table-light align-middle"
                >
                  <td className="text-center">{index + 1}</td>
                  <td className="text-truncate" style={{ maxWidth: "250px" }}>
                    <a
                      href={`${import.meta.env.VITE_API_URL}/${
                        link.shortId
                      }`}
                      target="_blank"
                      className="link-primary"
                      style={{ cursor: "pointer" }}
                    >
                      {import.meta.env.VITE_API_URL}/{link.shortId}
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
                  <td className="text-center">{new Date(link.createdAt).toLocaleString()}</td>
                  <td>
                    <ul style={{ maxHeight: "100px", overflowY: "auto" }}>
                      {link.visits.map((item, idx) => (
                        <li key={idx} className="pt-2 pb-2">
                          {idx + 1}{")"} <strong className="fw-bold">{item?.ip}</strong> - {item?.location?.region ? item?.location?.region + "," : ""} {" "} {item?.location?.country ? item?.location?.country + " -" : ""} {new Date(item.timestamp).toLocaleString()}
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
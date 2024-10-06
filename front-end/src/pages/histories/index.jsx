import { useEffect, useState } from "react";
import { getUserHistories } from "../../api/index";

const Histories = () => {
  const [shortenedLinks, setShortenedLinks] = useState([]);
  const userId = JSON.parse(localStorage.getItem("user-short-link")).id;

  useEffect(() => {
    (async () => {
      const response = await getUserHistories(userId);
      setShortenedLinks(response);
    })();
  }, [userId]);

  return (
    <div>
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
                <span className="link-primary">
                  {import.meta.env.VITE_API_URL}/{link.shortId}
                </span>
              </td>
              <td className="text-truncate" style={{ maxWidth: "450px" }}>
                {link.originalUrl}
              </td>
              <td>{new Date(link.createdAt).toLocaleString()}</td>
              <td>
                <ul>
                  {link.visits.map((item, index) => {
                    return (
                      <li key={index}>{item.ip}</li>
                    );
                  })}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Histories;
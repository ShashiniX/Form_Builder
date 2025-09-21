import React, { useEffect, useState } from "react";

const AllSubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/api/submissions")
      .then(res => res.json())
      .then(data => {
        setSubmissions(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading submissions...</p>;
  if (submissions.length === 0) return <p>No submissions found.</p>;

  return (
    <div className="container">
      <h2>All Form Submissions</h2>
      {submissions.map(sub => (
        <div key={sub.id} style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
          <p><strong>Form:</strong> {sub.form_title}</p>
          <p><strong>Submission ID:</strong> {sub.id}</p>
          <p><strong>Submitted At:</strong> {new Date(sub.submitted_at).toLocaleString()}</p>
          <div>
            {Object.entries(sub.data).map(([key, value]) => (
              <p key={key}>
                <strong>{key}:</strong> {Array.isArray(value) ? value.join(", ") : value}
              </p>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AllSubmissions;

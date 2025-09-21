import React, { useEffect, useState } from "react";
import "./FormsList.css";

const FormsList = () => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedForm, setSelectedForm] = useState(null);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetch("http://localhost:8000/api/forms")
      .then(res => res.json())
      .then(data => {
        setForms(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this form?")) return;

    try {
      const res = await fetch(`http://localhost:8000/api/forms/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");

      setForms(prev => prev.filter(f => f.id !== id));
      alert("Form deleted successfully!");
    } catch (err) {
      console.error(err);
      alert("Error deleting form");
    }
  };

  const handleEdit = (formId) => {
    window.location.href = `/edit-form/${formId}`;
  };

  const handleChange = (field, value, type, checked) => {
    setFormData(prev => {
      if (type === "checkbox") {
        const current = prev[field.label] || [];
        return {
          ...prev,
          [field.label]: checked
            ? [...current, value]
            : current.filter(v => v !== value),
        };
      }
      return { ...prev, [field.label]: value };
    });
  };

  const validateForm = () => {
    const newErrors = {};
    selectedForm.fields.forEach(field => {
      const value = formData[field.label];
      if (field.required) {
        if (field.type === "checkbox" && (!value || value.length === 0)) {
          newErrors[field.label] = "Please select at least one option";
        } else if (!value || value === "") {
          newErrors[field.label] = "This field is required";
        }
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      fetch(`http://localhost:8000/api/forms/${selectedForm.id}/submissions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: formData }),
      })
        .then(res => {
          if (!res.ok) throw new Error("Failed to submit");
          return res.json();
        })
        .then(response => {
          alert("Form submitted successfully!");
          setSelectedForm(null);
        })
        .catch(err => {
          console.error(err);
          alert("Error submitting form");
        });
    }
  };

  if (loading) return <p>Loading forms...</p>;

  return (
    <div className="container">
      <h2>Saved Forms</h2>
      {forms.length === 0 ? (
        <p>No forms found.</p>
      ) : (
        <div className="forms-grid">
          {forms.map(form => (
            <div key={form.id} className="form-card">
              <h3>{form.title}</h3>
              <p>{form.fields.length} Field(s)</p>

              {/* Buttons */}
              <div className="card-actions">
                <button
                  className="btn-edit"
                  onClick={() => handleEdit(form.id)}
                >
                  ✏️ Edit
                </button>
                <button
                  className="btn-preview"
                  onClick={() => {
                    setSelectedForm(form);
                    const initialData = {};
                    form.fields.forEach(f => {
                      initialData[f.label] = f.type === "checkbox" ? [] : "";
                    });
                    setFormData(initialData);
                    setErrors({});
                  }}
                >
                  👁 Preview
                </button>
                <button
                  className="btn-delete"
                  onClick={() => handleDelete(form.id)}
                >
                  🗑 Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal (Preview) */}
      {selectedForm && (
        <div className="modal-overlay" onClick={() => setSelectedForm(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>{selectedForm.title}</h2>
            <form onSubmit={handleSubmit}>
              {selectedForm.fields.map((field, idx) => (
                <div key={idx} className="form-group">
                  <label>
                    {field.label}{" "}
                    {field.required && <span style={{ color: "red" }}>*</span>}
                  </label>

                  {field.type === "text" && (
                    <input
                      type="text"
                      value={formData[field.label] || ""}
                      onChange={e =>
                        handleChange(field, e.target.value, field.type)
                      }
                    />
                  )}

                  {field.type === "textarea" && (
                    <textarea
                      value={formData[field.label] || ""}
                      onChange={e =>
                        handleChange(field, e.target.value, field.type)
                      }
                    />
                  )}

                  {field.type === "radio" &&
                    field.options.map((opt, i) => (
                      <div key={i}>
                        <input
                          type="radio"
                          name={field.label}
                          value={opt}
                          checked={formData[field.label] === opt}
                          onChange={e =>
                            handleChange(field, e.target.value, field.type)
                          }
                        />
                        {opt}
                      </div>
                    ))}

                  {field.type === "checkbox" &&
                    field.options.map((opt, i) => (
                      <div key={i}>
                        <input
                          type="checkbox"
                          value={opt}
                          checked={(formData[field.label] || []).includes(opt)}
                          onChange={e =>
                            handleChange(
                              field,
                              opt,
                              field.type,
                              e.target.checked
                            )
                          }
                        />
                        {opt}
                      </div>
                    ))}

                  {errors[field.label] && (
                    <p style={{ color: "red" }}>{errors[field.label]}</p>
                  )}
                </div>
              ))}

              <div className="modal-actions">
                <button type="submit" className="btn-submit">
                  Submit
                </button>
                <button
                  type="button"
                  className="close-btn"
                  onClick={() => setSelectedForm(null)}
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormsList;

import React, { useState } from "react";
import './App.css'; 
import FormPreview from "./FormPreview";

function App() {
  const [title, setTitle] = useState("");
  const [fields, setFields] = useState([]);

  const addField = (type) => {
    const newField = {
      id: Date.now(),
      type,
      label: `${type.charAt(0).toUpperCase() + type.slice(1)} Field`,
      required: false,
      options: type === "checkbox" || type === "radio" ? ["Option 1", "Option 2"] : [],
    };
    setFields([...fields, newField]);
  };

  const updateField = (id, key, value) => {
    setFields(fields.map(f => (f.id === id ? { ...f, [key]: value } : f)));
  };

  const updateOption = (fieldId, index, value) => {
    setFields(fields.map(f =>
      f.id === fieldId
        ? { ...f, options: f.options.map((opt, i) => (i === index ? value : opt)) }
        : f
    ));
  };

  const addOption = (fieldId) => {
    setFields(fields.map(f =>
      f.id === fieldId ? { ...f, options: [...f.options, `Option ${f.options.length + 1}`] } : f
    ));
  };

  const removeField = (id) => {
    setFields(fields.filter(f => f.id !== id));
  };

  const moveField = (id, direction) => {
    const index = fields.findIndex(f => f.id === id);
    if (direction === "up" && index > 0) {
      const newFields = [...fields];
      [newFields[index - 1], newFields[index]] = [newFields[index], newFields[index - 1]];
      setFields(newFields);
    }
    if (direction === "down" && index < fields.length - 1) {
      const newFields = [...fields];
      [newFields[index + 1], newFields[index]] = [newFields[index], newFields[index + 1]];
      setFields(newFields);
    }
  };

  const saveForm = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, fields }),
      });
      const data = await response.json();
      if (data.success) {
        alert("Form saved to database!");
        console.log(data.form);
      } else {
        alert("Failed to save form.");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while saving form.");
    }
  };

  return (
    <div className="container">
      <h2>Create Form</h2>

      <div className="form-group">
        <label>Form Title *</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter form title"
        />
      </div>

      <div className="buttons">
        <button onClick={() => addField("text")}>+ Text Input</button>
        <button onClick={() => addField("textarea")}>+ Text Area</button>
        <button onClick={() => addField("radio")}>+ Radio Button</button>
        <button onClick={() => addField("checkbox")}>+ Checkbox</button>
      </div>

      {fields.map(field => (
        <div key={field.id} className="field-box">
          <div className="field-header">
            <strong>{field.type}</strong>
            <div>
              <button onClick={() => moveField(field.id, "up")}>↑</button>
              <button onClick={() => moveField(field.id, "down")}>↓</button>
              <button onClick={() => removeField(field.id)}>🗑</button>
            </div>
          </div>

          <label>Label</label>
          <input
            type="text"
            value={field.label}
            onChange={(e) => updateField(field.id, "label", e.target.value)}
          />

          {(field.type === "checkbox" || field.type === "radio") && (
            <div className="options">
              <label>Options</label>
              {field.options.map((opt, i) => (
                <input
                  key={i}
                  type="text"
                  value={opt}
                  onChange={(e) => updateOption(field.id, i, e.target.value)}
                />
              ))}
              <button onClick={() => addOption(field.id)}>+ Add Option</button>
            </div>
          )}

          <div>
            <input
              type="checkbox"
              checked={field.required}
              onChange={(e) => updateField(field.id, "required", e.target.checked)}
            />
            <label>Required</label>
          </div>
        </div>
      ))}

      <div className="buttons">
        <button onClick={saveForm} className="save-btn">Save Form</button>
      </div>

      <FormPreview fields={fields} />
    </div>
  );
}

export default App;

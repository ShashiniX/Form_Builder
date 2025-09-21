import React from "react";

const FormPreview = ({ fields }) => {
  return (
    <div className="preview">
      <h3>Form Preview</h3>
      <form>
        {fields.map((field) => (
          <div key={field.id} className="preview-field">
            <label>
              {field.label} {field.required && "*"}
            </label>

            {field.type === "text" && (
              <input type="text" placeholder={field.label} required={field.required} />
            )}

            {field.type === "textarea" && (
              <textarea placeholder={field.label} required={field.required}></textarea>
            )}

            {(field.type === "radio" || field.type === "checkbox") &&
              field.options.map((opt, i) => (
                <div key={i}>
                  <input
                    type={field.type}
                    name={field.type === "radio" ? field.id : `${field.id}-${i}`}
                    required={field.required && field.type === "radio"}
                  />
                  <label>{opt}</label>
                </div>
              ))}
          </div>
        ))}
      </form>
    </div>
  );
};

export default FormPreview;

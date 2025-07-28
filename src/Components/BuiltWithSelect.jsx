import React from "react";
import Select, { components } from "react-select";

// Official, colored SVGs for top techs (fixed size, w-6 h-6)
const ReactIcon = () => (
  <svg className="w-full h-full" viewBox="0 0 32 32" fill="none">
    <circle cx="16" cy="16" r="2.5" fill="#61DAFB" />
    <g stroke="#61DAFB" strokeWidth="2" fill="none">
      <ellipse rx="11" ry="4.2" transform="matrix(.866 .5 -.866 .5 16 16)" />
      <ellipse rx="11" ry="4.2" transform="matrix(-.866 .5 .866 .5 16 16)" />
      <ellipse rx="11" ry="4.2" transform="matrix(1 0 0 1 16 16)" />
    </g>
  </svg>
);
const NodejsIcon = () => (
  <svg className="w-full h-full" viewBox="0 0 32 32" fill="none">
    <path d="M16 2.7l12.1 7v12.6L16 29.3 3.9 22.3V9.7L16 2.7z" fill="#539E43" />
    <path
      d="M16 4.6l10.1 5.8v11.2L16 27.4l-10.1-5.8V10.4L16 4.6z"
      fill="#fff"
    />
    <path
      d="M16 6.5l8.1 4.7v9.4L16 25.3l-8.1-4.7v-9.4L16 6.5z"
      fill="#539E43"
    />
  </svg>
);
const TypeScriptIcon = () => (
  <svg className="w-full h-full" viewBox="0 0 32 32" fill="none">
    <rect width="32" height="32" rx="6" fill="#3178C6" />
    <path
      d="M13.5 14.5v-2h-7v2h2.5v7h2v-7h2.5zm2.5 7v-2h4.5v-1.5h-4.5v-2h6.5v2h-2v1.5h2v2h-6.5z"
      fill="#fff"
    />
  </svg>
);
const NextjsIcon = () => (
  <svg className="w-full h-full" viewBox="0 0 32 32" fill="none">
    <circle cx="16" cy="16" r="16" fill="#fff" />
    <path
      d="M7.5 16c0-4.7 3.8-8.5 8.5-8.5s8.5 3.8 8.5 8.5-3.8 8.5-8.5 8.5S7.5 20.7 7.5 16zm8.5-7a7 7 0 100 14 7 7 0 000-14z"
      fill="#000"
    />
    <path d="M20.5 20.5l-9-9" stroke="#000" strokeWidth="1.5" />
  </svg>
);
const ReduxIcon = () => (
  <svg className="w-full h-full" viewBox="0 0 32 32" fill="none">
    <circle cx="16" cy="16" r="16" fill="#764ABC" />
    <path
      d="M23.2 20.7c.2-1.2-.7-2.3-2-2.3-.7 0-1.3.3-1.7.8-2.2-1.1-4.2-2.7-5.7-4.7.2-.4.3-.8.3-1.2 0-1.2-1-2.2-2.2-2.2s-2.2 1-2.2 2.2c0 .7.3 1.3.8 1.7-1.1 2.2-1.7 4.7-1.7 7.3 0 1.2 1 2.2 2.2 2.2.7 0 1.3-.3 1.7-.8 2.2 1.1 4.7 1.7 7.3 1.7 1.2 0 2.2-1 2.2-2.2 0-.7-.3-1.3-.8-1.7z"
      fill="#fff"
    />
  </svg>
);
const FirebaseIcon = () => (
  <svg className="w-full h-full" viewBox="0 0 32 32" fill="none">
    <path d="M6 26l10-20 10 20H6z" fill="#FFA000" />
    <path d="M16 6l10 20H6L16 6z" fill="#FFCA28" />
  </svg>
);
const TailwindIcon = () => (
  <svg className="w-full h-full" viewBox="0 0 32 32" fill="none">
    <path
      d="M16 10c-4 0-6.7 2-8 6 1.3-2 3-3 5-3 1.2 0 2.2.4 3 1.2.8.8 1.8 1.2 3 1.2 2 0 3.7-1 5-3-1.3 4-4 6-8 6-4 0-6.7-2-8-6 1.3 4 4 6 8 6 4 0 6.7-2 8-6-1.3 2-3 3-5 3-1.2 0-2.2-.4-3-1.2-.8-.8-1.8-1.2-3-1.2z"
      fill="#38BDF8"
    />
  </svg>
);
const JavaScriptIcon = () => (
  <svg className="w-full h-full" viewBox="0 0 32 32" fill="none">
    <rect width="32" height="32" rx="6" fill="#F7DF1E" />
    <path
      d="M19.5 22.5c.3.5.7.8 1.3.8.6 0 1-.3 1-.8 0-.5-.3-.7-1.1-1.1l-.4-.2c-1.2-.5-2-1.1-2-2.3 0-1.1.8-2 2.1-2 1 0 1.7.3 2.2 1.2l-1.2.8c-.2-.4-.5-.6-1-.6-.5 0-.8.2-.8.6 0 .4.3.6 1.1 1l.4.2c1.3.6 2.1 1.2 2.1 2.4 0 1.4-1.1 2.1-2.3 2.1-1.2 0-2-.6-2.4-1.4l1.2-.7zm-5.2.1c.2.4.4.7.9.7.5 0 .8-.2.8-.7v-4.2h1.5v4.2c0 1.3-.8 2-2.2 2-1.2 0-2-.6-2.4-1.4l1.2-.7z"
      fill="#000"
    />
  </svg>
);

const techOptions = [
  { value: "react", label: "ReactJS", icon: <ReactIcon /> },
  { value: "nodejs", label: "Node.js", icon: <NodejsIcon /> },
  { value: "supabase", label: "supabase", icon: <FirebaseIcon /> },
  { value: "typescript", label: "TypeScript", icon: <TypeScriptIcon /> },
  { value: "nextjs", label: "NextJS", icon: <NextjsIcon /> },
  { value: "redux", label: "Redux", icon: <ReduxIcon /> },
  { value: "firebase", label: "Firebase", icon: <FirebaseIcon /> },
  { value: "tailwindcss", label: "TailwindCSS", icon: <TailwindIcon /> },
  { value: "javascript", label: "JavaScript", icon: <JavaScriptIcon /> },
  // ...rest fallback to emoji
  { value: "vue", label: "Vue.js", icon: null },
  { value: "angular", label: "Angular", icon: null },
  { value: "python", label: "Python", icon: null },
  { value: "django", label: "Django", icon: null },
  { value: "flask", label: "Flask", icon: null },
  { value: "express", label: "Express", icon: null },
  { value: "mongodb", label: "MongoDB", icon: null },
  { value: "postgresql", label: "PostgreSQL", icon: null },
  { value: "mysql", label: "MySQL", icon: null },
  { value: "graphql", label: "GraphQL", icon: null },
  { value: "docker", label: "Docker", icon: null },
  { value: "kubernetes", label: "Kubernetes", icon: null },
  { value: "aws", label: "AWS", icon: null },
  { value: "gcp", label: "Google Cloud", icon: null },
  { value: "azure", label: "Azure", icon: null },
  { value: "php", label: "PHP", icon: null },
  { value: "laravel", label: "Laravel", icon: null },
  { value: "ruby", label: "Ruby", icon: null },
  { value: "rails", label: "Rails", icon: null },
  { value: "csharp", label: "C#", icon: null },
  { value: "dotnet", label: ".NET", icon: null },
  { value: "java", label: "Java", icon: null },
  { value: "spring", label: "Spring", icon: null },
  { value: "go", label: "Go", icon: null },
  { value: "swift", label: "Swift", icon: null },
  { value: "kotlin", label: "Kotlin", icon: null },
  { value: "flutter", label: "Flutter", icon: null },
  { value: "reactnative", label: "React Native", icon: null },
  { value: "svelte", label: "Svelte", icon: null },
  { value: "other", label: "Other", icon: null },
];

const customStyles = {
  control: (provided) => ({
    ...provided,
    borderRadius: "1rem",
    minHeight: "48px",
    borderColor: "#e5e7eb",
    boxShadow: "none",
    padding: "2px 4px",
    background: "#f9fafb",
  }),
  multiValue: (provided) => ({
    ...provided,
    borderRadius: "1rem",
    background: "#f3f6fa",
    border: "1px solid #e5e7eb",
    display: "flex",
    alignItems: "center",
    padding: "2px 8px",
    fontWeight: 500,
    fontSize: "1rem",
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    padding: 0,
    display: "flex",
    alignItems: "center",
    fontWeight: 500,
    fontSize: "1rem",
  }),
  multiValueRemove: (provided) => ({
    ...provided,
    borderRadius: "50%",
    background: "transparent",
    color: "#64748b",
    ":hover": { background: "#e5e7eb", color: "#ef4444" },
    marginLeft: 4,
  }),
  option: (provided, state) => ({
    ...provided,
    borderRadius: "1rem",
    background: state.isFocused ? "#f3f6fa" : "#fff",
    color: "#222",
    display: "flex",
    alignItems: "center",
    fontWeight: 500,
    fontSize: "1rem",
    padding: "8px 16px",
    cursor: "pointer",
  }),
  menu: (provided) => ({
    ...provided,
    borderRadius: "1rem",
    boxShadow: "0 4px 24px 0 rgba(0,0,0,0.08)",
    marginTop: 4,
    zIndex: 20,
  }),
  input: (provided) => ({
    ...provided,
    fontSize: "1rem",
    fontWeight: 500,
    margin: 0,
    padding: 0,
  }),
};

const MultiValueLabel = (props) => (
  <components.MultiValueLabel {...props}>
    {props.data.icon && (
      <span className="w-6 h-6 mr-2 flex items-center justify-center">
        {props.data.icon}
      </span>
    )}
    {props.data.label}
  </components.MultiValueLabel>
);

const Option = (props) => (
  <components.Option {...props}>
    {props.data.icon && (
      <span className="w-6 h-6 mr-2 flex items-center justify-center">
        {props.data.icon}
      </span>
    )}
    {props.data.label}
  </components.Option>
);

const formatCreateLabel = (inputValue) => `Add "${inputValue}"`;

const relatedSuggestions = (selected) => {
  const selectedValues = selected.map((s) => s.value);
  let suggestions = [];
  if (selectedValues.includes("react") && !selectedValues.includes("redux")) {
    suggestions.push("redux");
  }
  if (
    selectedValues.includes("nodejs") &&
    !selectedValues.includes("typescript")
  ) {
    suggestions.push("typescript");
  }
  if (selectedValues.includes("vue") && !selectedValues.includes("vuex")) {
    suggestions.push("vuex");
  }
  if (suggestions.length < 3) {
    suggestions = [
      ...suggestions,
      ...techOptions
        .map((opt) => opt.value)
        .filter(
          (val) => !selectedValues.includes(val) && !suggestions.includes(val),
        )
        .slice(0, 5 - suggestions.length),
    ];
  }
  return techOptions.filter((opt) => suggestions.includes(opt.value));
};

export default function BuiltWithSelect({ value, onChange }) {
  // react-select expects value as array of options
  const handleChange = (selected) => {
    if (!selected) return onChange([]);
    if (selected.length > 10) return;
    onChange(selected);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className="block font-semibold text-lg">Built with</label>
        <span className="text-sm text-gray-400 font-medium">Upto 10</span>
      </div>
      <Select
        isMulti
        options={techOptions}
        value={value}
        onChange={handleChange}
        placeholder="Type to search or add..."
        closeMenuOnSelect={false}
        hideSelectedOptions={false}
        components={{ MultiValueLabel, Option }}
        styles={customStyles}
        formatCreateLabel={formatCreateLabel}
        isClearable={false}
        isSearchable
        isValidNewOption={(inputValue, selectValue, selectOptions) =>
          !!inputValue &&
          !selectOptions.some(
            (option) => option.label.toLowerCase() === inputValue.toLowerCase(),
          ) &&
          selectValue.length < 10
        }
        allowCreateWhileLoading={false}
        menuPlacement="auto"
        maxMenuHeight={220}
        noOptionsMessage={({ inputValue }) =>
          inputValue ? `No results for "${inputValue}"` : "No options"
        }
      />
      <div className="mt-6">
        <div className="font-semibold mb-2 text-gray-500 text-base">
          Suggested
        </div>
        <div className="flex flex-wrap gap-2">
          {relatedSuggestions(value).map((opt) => (
            <button
              key={opt.value}
              type="button"
              className="flex items-center bg-gray-100 hover:bg-blue-100 text-gray-800 rounded-full px-3 py-1 text-sm border border-gray-200 shadow-sm transition font-medium focus:outline-none focus:ring-2 focus:ring-blue-400"
              onClick={() => {
                if (
                  !value.find((v) => v.value === opt.value) &&
                  value.length < 10
                ) {
                  onChange([...value, opt]);
                }
              }}
            >
              <span className="w-6 h-6 mr-2 flex items-center justify-center">
                {opt.icon && opt.icon}
              </span>
              {opt.label}
              <span className="ml-1 font-bold text-green-600">+</span>
            </button>
          ))}
        </div>
      </div>
      {value.length === 0 && (
        <div className="text-xs text-red-500 mt-2">
          Please select at least one technology.
        </div>
      )}
    </div>
  );
}

import { useState } from "react";
import { useNavigate, Link } from "react-router";
import DashboardLayout from "../components/layout/DashboardLayout";
import { createProjectAPI } from "../features/projects/projectAPI";

export default function CreateProjectPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    genre: "",
    platform: "",
    coreMechanic: "",
    artStyle: "",
    monetization: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name) {
      setError("Project name is required");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await createProjectAPI(form);

      if (res.success) {
        navigate(`/projects/${res.project._id}`);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Create New Project</h1>
          <p className="text-sm text-gray-600">
            Start a new game project by defining its core details.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white border rounded-lg p-6 space-y-4"
        >
          <Input
            label="Project Name *"
            name="name"
            value={form.name}
            onChange={handleChange}
          />

          <Textarea
            label="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
          />

          <Input
            label="Genre"
            name="genre"
            value={form.genre}
            onChange={handleChange}
          />

          <Input
            label="Platform"
            name="platform"
            value={form.platform}
            onChange={handleChange}
          />

          <Input
            label="Core Mechanic"
            name="coreMechanic"
            value={form.coreMechanic}
            onChange={handleChange}
          />

          <Input
            label="Art Style"
            name="artStyle"
            value={form.artStyle}
            onChange={handleChange}
          />

          <Input
            label="Monetization"
            name="monetization"
            value={form.monetization}
            onChange={handleChange}
          />

          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}

          {/* Actions */}
          <div className="flex justify-between items-center pt-4">
            <Link
              to="/projects"
              className="text-sm text-gray-600 hover:underline"
            >
              ← Back to Projects
            </Link>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 disabled:bg-gray-400"
            >
              {loading ? "Creating..." : "Create Project"}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}

/* -------- Small reusable inputs (keep local for now) -------- */

function Input({ label, ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">
        {label}
      </label>
      <input
        {...props}
        className="w-full border rounded px-3 py-2 text-sm"
      />
    </div>
  );
}

function Textarea({ label, ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">
        {label}
      </label>
      <textarea
        {...props}
        rows={3}
        className="w-full border rounded px-3 py-2 text-sm"
      />
    </div>
  );
}

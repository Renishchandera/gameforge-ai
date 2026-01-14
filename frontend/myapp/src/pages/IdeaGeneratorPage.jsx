import { useState } from "react";
import { generateIdeaAPI, feasibilityAPI } from "../features/ideator/ideatorAPI";

export default function IdeaGeneratorPage() {
  const [form, setForm] = useState({
    domain: "",
    audience: "",
    platform: "",
    constraints: "",
    monetization: "",
  });

  const [idea, setIdea] = useState(null);
  const [feasibility, setFeasibility] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const generateIdea = async () => {
    try{
        setLoading(true);
        const data = await generateIdeaAPI(form);
        console.log(data);
        setIdea(data.idea);
        setFeasibility(null);
        setLoading(false);
    }catch(e)
    {
        console.log(e);
    }
  };

  const checkFeasibility = async () => {
    const data = await feasibilityAPI(idea);
    console.log(data);
    setFeasibility(data);
  };

  return (
    <div className="p-6 grid grid-cols-2 gap-6">
      {/* LEFT: INPUT */}
      <div className="space-y-3">
        {Object.keys(form).map((key) => (
          <input
            key={key}
            name={key}
            placeholder={key}
            className="w-full p-2 border"
            onChange={handleChange}
          />
        ))}

        <button
          onClick={generateIdea}
          className="bg-black text-white px-4 py-2"
        >
          {loading ? "Generating..." : "Generate Idea"}
        </button>
      </div>

      {/* RIGHT: OUTPUT */}
      <div>
        {idea && (
          <>
            <pre className="p-3 bg-gray-100 whitespace-pre-wrap">
              {idea}
            </pre>

            <button
              onClick={checkFeasibility}
              className="mt-3 bg-blue-600 text-white px-4 py-2"
            >
              Check Feasibility
            </button>
          </>
        )}

        {feasibility && (
          <div className="mt-4 p-4 border">
            <h3 className="font-bold">
              Score: {feasibility.score}/100
            </h3>
            <p>{feasibility.reasoning}</p>
            <ul className="list-disc ml-4">
              {feasibility.risks.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

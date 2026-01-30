import { useState,useEffect } from "react";
import { useParams, useOutletContext } from "react-router";
import { predictSuccessAPI } from "../../features/ML/mlAPI";

export default function ProjectPrediction() {
  const { projectId } = useParams();
  const { project, refreshProject} = useOutletContext();

  const [prediction, setPrediction] = useState(
    project.successPrediction || null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
  if (project.successPrediction) {
    setPrediction(project.successPrediction);
  }
}, [project.successPrediction]);
const handlePredict = async () => {
  try {
    setLoading(true);
    setError(null);

    const res = await predictSuccessAPI(projectId);

    if (res.success) {
      // 🔑 THIS IS THE FIX
      await refreshProject();
      setPrediction(res.prediction);
    } else {
      setError("Failed to get prediction");
    }
  } catch (err) {
    console.error(err);
    setError("Something went wrong while predicting");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="max-w-3xl space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold">AI Success Prediction</h2>
        <p className="text-sm text-gray-600">
          Estimate the market success potential of this project using AI.
        </p>
      </div>

      {/* No prediction yet */}
      {!prediction && (
        <div className="border rounded-lg bg-white p-6">
          <p className="mb-4 text-gray-700">
            No prediction has been run for this project yet.
          </p>

          <button
            onClick={handlePredict}
            disabled={loading}
            className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 disabled:bg-gray-400"
          >
            {loading ? "Predicting..." : "Predict Success"}
          </button>

          {error && (
            <p className="text-sm text-red-600 mt-3">{error}</p>
          )}
        </div>
      )}

      {/* Prediction result */}
      {prediction && (
        <div className="border rounded-lg bg-white p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-lg">Prediction Result</h3>
            <button
              onClick={handlePredict}
              disabled={loading}
              className="text-sm px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
            >
              {loading ? "Re-running..." : "Re-run Prediction"}
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <Metric label="Success Probability">
              {prediction.probability}%
            </Metric>

            <Metric label="Confidence">
              {prediction.confidence}
            </Metric>

            <Metric label="Verdict">
              {prediction.verdict}
            </Metric>
          </div>

          <div className="text-sm text-gray-500">
            Model: {prediction.modelVersion} <br />
            Predicted at:{" "}
            {new Date(prediction.predictedAt).toLocaleString()}
          </div>

          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Simple metric component
 */
function Metric({ label, children }) {
  return (
    <div className="border rounded p-4">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="text-lg font-bold">{children}</p>
    </div>
  );
}

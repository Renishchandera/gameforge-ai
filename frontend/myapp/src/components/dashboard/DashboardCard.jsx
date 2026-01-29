export default function DashboardCard({ title, description, action }) {
  return (
    <div className="border rounded-lg bg-white p-5 flex flex-col justify-between">
      <div>
        <h3 className="font-semibold text-lg mb-1">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>

      <div className="mt-4">
        {action}
      </div>
    </div>
  );
}

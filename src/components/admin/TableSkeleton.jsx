export default function TableSkeleton({ columns = 5, rows = 6 }) {
  return (
    <div className="w-full animate-pulse">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              {Array.from({ length: columns }).map((_, i) => (
                <th key={i} className="px-6 py-4">
                  <div className="h-3 bg-gray-200 rounded w-20"></div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {Array.from({ length: rows }).map((_, rIndex) => (
              <tr key={rIndex}>
                {Array.from({ length: columns }).map((_, cIndex) => (
                  <td key={cIndex} className="px-6 py-4">
                    <div className="flex flex-col gap-2">
                      <div className={`h-3 bg-gray-200 rounded ${cIndex === 0 ? 'w-8' : cIndex === 1 ? 'w-32' : 'w-24'}`}></div>
                      {cIndex === 1 && <div className="h-2 bg-gray-100 rounded w-16"></div>}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

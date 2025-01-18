import React, { useState } from 'react';
import { penalties } from './penaltiesData';

const PenaltiesTable = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPenalties = penalties.filter(penalty =>
    penalty["Penalty Name"].toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="border rounded-lg p-4">
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Penalties Reference</h2>
        <input
          type="text"
          placeholder="Search penalties..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left border-b">Penalty</th>
              <th className="p-2 text-left border-b">Yards</th>
              <th className="p-2 text-left border-b">Enforced From</th>
              <th className="p-2 text-center border-b">Loss of Down</th>
              <th className="p-2 text-center border-b">Auto 1st Down</th>
            </tr>
          </thead>
          <tbody>
            {filteredPenalties.map((penalty, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                <td className="p-2">{penalty["Penalty Name"]}</td>
                <td className="p-2">{penalty["Yardage"]} yards</td>
                <td className="p-2">{penalty["Enforced From"]}</td>
                <td className="p-2 text-center">
                  {penalty["Loss of Down"] === "Yes" ? "✓" : "-"}
                </td>
                <td className="p-2 text-center">
                  {penalty["Automatic First Down"] === "Yes" ? "✓" : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PenaltiesTable;

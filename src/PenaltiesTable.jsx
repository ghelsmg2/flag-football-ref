import React, { useState, useMemo } from 'react';
import { penalties } from './penaltiesData';

const PenaltiesTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({
    key: 'Penalty Name',
    direction: 'ascending'
  });

  const sortedPenalties = useMemo(() => {
    let sortablePenalties = [...penalties];
    if (sortConfig.key) {
      sortablePenalties.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortablePenalties;
  }, [sortConfig]);

  const filteredPenalties = sortedPenalties.filter(penalty =>
    penalty["Penalty Name"].toLowerCase().includes(searchTerm.toLowerCase())
  );

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (columnName) => {
    if (sortConfig.key !== columnName) return '↕';
    return sortConfig.direction === 'ascending' ? '↑' : '↓';
  };

  const renderSortableHeader = (label, key) => (
    <th 
      className="p-2 text-left border-b cursor-pointer hover:bg-gray-200"
      onClick={() => requestSort(key)}
    >
      <div className="flex items-center justify-between">
        <span>{label}</span>
        <span className="text-gray-500 ml-1">{getSortIcon(key)}</span>
      </div>
    </th>
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
        <table className="w-full min-w-[800px]">
          <thead className="bg-gray-100">
            <tr>
              {renderSortableHeader('Penalty', 'Penalty Name')}
              {renderSortableHeader('Yards', 'Yardage')}
              {renderSortableHeader('Enforced From', 'Enforced From')}
              {renderSortableHeader('Loss of Down', 'Loss of Down')}
              {renderSortableHeader('Auto 1st Down', 'Automatic First Down')}
              {renderSortableHeader('Loss of Timeout', 'Loss of Timeout')}
            </tr>
          </thead>
          <tbody>
            {filteredPenalties.map((penalty, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                <td className="p-2">{penalty["Penalty Name"]}</td>
                <td className="p-2">
                  {penalty["Yardage"] === "0" ? "-" : `${penalty["Yardage"]} yards`}
                </td>
                <td className="p-2">{penalty["Enforced From"]}</td>
                <td className="p-2 text-center">
                  {penalty["Loss of Down"] === "Yes" ? "✓" : "-"}
                </td>
                <td className="p-2 text-center">
                  {penalty["Automatic First Down"] === "Yes" ? "✓" : "-"}
                </td>
                <td className="p-2 text-center">
                  {penalty["Loss of Timeout"] === "Yes" ? "✓" : "-"}
                </td>
              </tr>
            ))}
            {filteredPenalties.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center p-4 text-gray-500">
                  No penalties found matching your search
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="mt-4 text-sm text-gray-600">
        Showing {filteredPenalties.length} of {penalties.length} penalties
      </div>
    </div>
  );
};

export default PenaltiesTable;

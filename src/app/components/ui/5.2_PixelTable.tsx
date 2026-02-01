// import React from 'react';

interface PixelTableProps {
    data: any[];
    columns: { header: string, accessor: string }[];
}

const PixelTable: React.FC<PixelTableProps> = ({ data, columns }) => {
    return (
        <table className="w-full text-xs text-left">
            <thead className="bg-gray-800 text-gray-400">
                <tr>
                    {columns.map((col) => (
                        <th key={col.accessor} className="p-2 border-b border-gray-700">
                            {col.header}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.map((row, idx) => (
                    <tr key={idx} className="border-b border-gray-700 hover:bg-gray-800">
                        {columns.map((col) => (
                            <td key={col.accessor} className="p-2 text-gray-300">
                                {row[col.accessor]}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default PixelTable;

import React from 'react';

interface Column<T> {
    header: string;
    key: keyof T;
    width?: string;
}

interface PixelTableProps<T> {
    data: T[];
    columns: Column<T>[];
}

function PixelTable<T extends { id: string | number }>({ data, columns }: PixelTableProps<T>) {
    return (
        <div className="w-full border-2 border-gray-700 bg-gray-900">
            {/* Header */}
            <div className="flex border-b-2 border-gray-700 bg-gray-800">
                {columns.map((col) => (
                    <div key={col.header} className={`p-2 text-xs font-bold text-gray-400 ${col.width || 'flex-1'}`}>
                        {col.header}
                    </div>
                ))}
            </div>

            {/* Body */}
            <div className="flex flex-col">
                {data.map((row, idx) => (
                    <div key={row.id} className="flex border-b border-gray-800 last:border-b-0 hover:bg-gray-800">
                        {columns.map((col) => (
                            <div key={`${row.id}-${String(col.key)}`} className={`p-2 text-xs text-white ${col.width || 'flex-1'}`}>
                                {String(row[col.key])}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default PixelTable;

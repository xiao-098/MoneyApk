import { getCategoryById } from './parser';

export function exportToCSV(records) {
  const headers = ['日期', '分类', '金额', '备注'];
  const rows = records.map(r => {
    const cat = getCategoryById(r.category_id);
    return [
      r.record_date,
      cat ? cat.name : '未知',
      r.amount.toFixed(2),
      r.note || ''
    ];
  });

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  const BOM = '﻿';
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `记账记录_${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

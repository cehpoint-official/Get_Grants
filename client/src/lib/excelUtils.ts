
import * as XLSX from 'xlsx';
import { Application } from '@shared/schema';

export const exportToExcel = (data: Application[], fileName: string) => {
 
  const visibleData = data.map(app => ({
    Name: app.name,
    Email: app.email,
    Phone: app.phone,
    'What do you need help with?': app.helpDescription || 'N/A',
    'Support Areas': app.supportAreas ? app.supportAreas.join(', ') : 'N/A'
  }));

  const ws = XLSX.utils.json_to_sheet(visibleData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Applications');
  XLSX.writeFile(wb, `${fileName}.xlsx`);
};
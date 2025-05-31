import React, { useState } from 'react';
import { Upload, FileText, Users, AlertCircle, CheckCircle } from 'lucide-react';
import * as XLSX from 'xlsx';
import * as mammoth from 'mammoth';

import { GlobalWorkerOptions, getDocument } from 'pdfjs-dist';

GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";



  const parseFullName = (fullName) => {
    if (!fullName || typeof fullName !== 'string') return null;
    const cleanName = fullName.trim().replace(/\s+/g, ' ');
    const parts = cleanName.split(' ').filter(part => part.length > 0);
    if (parts.length >= 2) {
      if (/^(VM|[A-Z]{2,}\d+|\d+[A-Z]+|\d+$)/.test(parts[0])) return null;
      if (parts.every(part => /[A-Za-z]/.test(part))) {
        return {
          first: parts[0],
          middle: parts.length === 3 ? parts[1] : (parts.length > 3 ? parts.slice(1, -1).join(' ') : ''),
          last: parts[parts.length - 1],
          full: cleanName
        };
      }
    }
    return null;
  };

  const extractNamesFromTable = (headers, rows) => {
    
    const names = [];
    const nameColumnIndices = {};

    headers.forEach((header, index) => {
      const headerStr = String(header).toLowerCase().trim();
      
      if (headerStr.includes('full') && headerStr.includes('name')) {
        nameColumnIndices.fullName = index;
      } else if (headerStr === 'name') {
        nameColumnIndices.fullName = index;
      } else if (headerStr.includes('first') || headerStr.includes('given')) {
        nameColumnIndices.firstName = index;
      } else if (headerStr.includes('last') || headerStr.includes('surname') || headerStr.includes('family')) {
        nameColumnIndices.lastName = index;
      } else if (headerStr.includes('middle')) {
        nameColumnIndices.middleName = index;
      } else if (headerStr.includes('candidate') && headerStr.includes('name')) {
        nameColumnIndices.fullName = index;
      } else if (headerStr.includes('student') && headerStr.includes('name')) {
        nameColumnIndices.fullName = index;
      } else if (headerStr.includes('person') && headerStr.includes('name')) {
        nameColumnIndices.fullName = index;
      }
    });


    rows.forEach((row, rowIndex) => {
      let nameObj = null;
      if (nameColumnIndices.fullName !== undefined) {
        const fullName = row[nameColumnIndices.fullName];
        if (fullName && String(fullName).trim()) {
          nameObj = parseFullName(String(fullName).trim());
        }
      }
      if (!nameObj && (nameColumnIndices.firstName !== undefined || nameColumnIndices.lastName !== undefined)) {
        const first = nameColumnIndices.firstName !== undefined ? String(row[nameColumnIndices.firstName] || '').trim() : '';
        const middle = nameColumnIndices.middleName !== undefined ? String(row[nameColumnIndices.middleName] || '').trim() : '';
        const last = nameColumnIndices.lastName !== undefined ? String(row[nameColumnIndices.lastName] || '').trim() : '';
        if (first || last) {
          nameObj = {
            first,
            middle,
            last,
            full: [first, middle, last].filter(n => n).join(' ')
          };
        }
      }
      if (nameObj && nameObj.full) {
        names.push(nameObj);
      }
    });

    return names;
  };

  const processExcelFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const allNames = [];

        workbook.SheetNames.forEach(sheetName => {
          const sheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

          if (jsonData.length > 0) {
            let headerRowIndex = -1;
            let detectedHeaders = [];

            // Search through the first 50 rows for a valid header
            const limit = Math.min(50, jsonData.length);
            for (let i = 0; i < limit; i++) {
              const row = jsonData[i];
              const joined = row.map(cell => String(cell || '').toLowerCase()).join(' ');
              if (/(full\s*name|first\s*name|last\s*name|surname|candidate\s*name|student\s*name|person\s*name)/.test(joined)) {
                headerRowIndex = i;
                detectedHeaders = row;
                break;
              }
            }

            // If headers are found, extract names from rows below
            if (headerRowIndex !== -1) {
              const dataRows = jsonData.slice(headerRowIndex + 1);
              const names = extractNamesFromTable(detectedHeaders, dataRows);
              allNames.push(...names);
            }
          }
        });

        resolve(allNames);
      } catch (error) {
        console.error('Excel processing error:', error);
        reject(error);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read Excel file'));
    reader.readAsArrayBuffer(file);
  });
};

  const processPdfFile = async (file) => {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const allNames = [];

  let anyTableDetected = false;

  const fallbackNameExtract = (lineText) => {
  const parts = lineText.trim().split(/\s+/);

  // Typical pattern: [seat_no] [first_name middle_name last_name] [PRN]
    if (parts.length >= 4 && /^[Ss]\d{9,}$/.test(parts[0]) && /^[A-Z0-9]{8,}$/.test(parts.at(-1))) {
        const nameParts = parts.slice(1, -1); // Remove seat_no and PRN
        const fullName = nameParts.join(' ');
        return parseFullName(fullName);
    }

    // Fallback if no match
    return null;
    };

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const content = await page.getTextContent();
    
    // Group text items by y position (lines of text)
    const rows = {};
    for (let item of content.items) {
      const y = Math.floor(item.transform[5]); // y position
      if (!rows[y]) rows[y] = [];
      rows[y].push(item.str);
    }

    const sortedLines = Object.keys(rows).sort((a, b) => b - a).map(y => rows[y]);

    // Look for header lines with "name" in any form
    let tableMode = false;
    let headers = [];
    let tableRows = [];

    for (const line of sortedLines) {
      const joined = line.join(' ').toLowerCase();
      if (!tableMode && /(full\s*name|first\s*name|last\s*name|surname|candidate\s*name)/.test(joined)) {
        headers = line;
        tableMode = true;
        continue;
      }

      if (tableMode) {
        if (line.length < 2) {
          tableMode = false;
          continue;
        }
        tableRows.push(line);
      }
    }

    if (headers.length && tableRows.length) {
      const names = extractNamesFromTable(headers, tableRows);
      if (names.length > 0) {
        allNames.push(...names);
        anyTableDetected = true;
      }
    }

    if(!anyTableDetected){
        for(const line of sortedLines) {
            const lineText = line.join(' ').trim();
            const parsed = fallbackNameExtract(lineText);
            if (parsed) {
                allNames.push(parsed);
            }
        }
    }
  }

  return allNames;
};

  const processWordFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const arrayBuffer = e.target.result;
          const htmlResult = await mammoth.convertToHtml({ arrayBuffer });
          const doc = new DOMParser().parseFromString(htmlResult.value, 'text/html');
          const tables = doc.querySelectorAll('table');
          const allNames = [];



          tables.forEach((table, tableIndex) => {

            const rows = table.querySelectorAll('tr');
            if (rows.length < 2) return;
            
            const headers = Array.from(rows[0].querySelectorAll('td, th')).map(cell => cell.textContent.trim());

            
            for (let i = 1; i < rows.length; i++) {
              const row = Array.from(rows[i].querySelectorAll('td, th')).map(cell => cell.textContent.trim());
              const names = extractNamesFromTable(headers, [row]);
              allNames.push(...names);
            }
          });

          resolve(allNames);
        } catch (error) {
          console.error('Word processing error:', error);
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read Word file'));
      reader.readAsArrayBuffer(file);
    });
  };

  const handleFileUpload = async (uploadedFiles) => {

    try {
      const allNames = [];

      for (const file of uploadedFiles) {
        const fileType = file.type;
        const fileName = file.name.toLowerCase();
        if (fileType.includes('sheet') || fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
          allNames.push(...await processExcelFile(file));
        } else if (fileType.includes('word') || fileName.endsWith('.docx') || fileName.endsWith('.doc')) {
          allNames.push(...await processWordFile(file));
        } else if (fileType === "application/pdf" || fileName.endsWith('.pdf')) {
          allNames.push(...await processPdfFile(file));
        }

      }

      const uniqueNames = allNames.filter((name, index, self) =>
        index === self.findIndex(n => n.full.toLowerCase() === name.full.toLowerCase())
      );

      return {success: true, names: uniqueNames}
    } catch (err) {
      return {success: false, error: err}
    }
  };


export {handleFileUpload};
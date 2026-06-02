<template>
  <Button variant="outline" size="sm" @click="download" title="Descargar listado completo" class="text-xs">
    <span v-html="xlsIconPath" class="inline-block mr-2 icon"></span>
    Descargar
  </Button>
</template>

<script setup lang="ts">
import Button from '../ui/Button/Button.vue';
import { completeSvgIcon } from '../ui/Icon/icons';

const props = defineProps<{
  list: any[];
  listName?: string;
  candidateName?: string;
}>();

const columnNames: { [key: string]: string } = {
  title: 'Título',
  year: 'Año',
  status: 'Estado'
};

const xlsIconPath = completeSvgIcon.find(icon => icon.name === 'xls')?.path;

// ── ZIP (stored, no compression) ─────────────────────────────────────────────

const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1;
    t[i] = c;
  }
  return t;
})();

function crc32(data: Uint8Array): number {
  let c = 0xFFFFFFFF;
  for (let i = 0; i < data.length; i++) c = CRC_TABLE[(c ^ data[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xFFFFFFFF) >>> 0;
}

function le16(n: number) { return new Uint8Array([n & 0xff, (n >> 8) & 0xff]); }
function le32(n: number) { return new Uint8Array([n & 0xff, (n >> 8) & 0xff, (n >> 16) & 0xff, (n >> 24) & 0xff]); }

function concat(...parts: Uint8Array[]): Uint8Array {
  const total = parts.reduce((s, p) => s + p.length, 0);
  const out = new Uint8Array(total);
  let off = 0;
  for (const p of parts) { out.set(p, off); off += p.length; }
  return out;
}

function buildZip(files: { name: string; content: string }[]): Uint8Array {
  const enc = new TextEncoder();
  const entries: Uint8Array[] = [];
  const cdEntries: Uint8Array[] = [];
  let offset = 0;

  for (const f of files) {
    const name = enc.encode(f.name);
    const data = enc.encode(f.content);
    const crc = crc32(data);
    const size = data.length;

    const localHeader = concat(
      new Uint8Array([0x50, 0x4b, 0x03, 0x04]),
      le16(20), le16(0x800), le16(0),
      le16(0), le16(0),
      le32(crc), le32(size), le32(size),
      le16(name.length), le16(0)
    );
    const entry = concat(localHeader, name, data);
    entries.push(entry);

    cdEntries.push(concat(
      new Uint8Array([0x50, 0x4b, 0x01, 0x02]),
      le16(20), le16(20), le16(0x800), le16(0),
      le16(0), le16(0),
      le32(crc), le32(size), le32(size),
      le16(name.length), le16(0), le16(0),
      le16(0), le16(0), le32(0),
      le32(offset),
      name
    ));

    offset += entry.length;
  }

  const cd = concat(...cdEntries);
  const eocd = concat(
    new Uint8Array([0x50, 0x4b, 0x05, 0x06]),
    le16(0), le16(0),
    le16(files.length), le16(files.length),
    le32(cd.length), le32(offset),
    le16(0)
  );

  return concat(...entries, cd, eocd);
}

// ── OOXML ─────────────────────────────────────────────────────────────────────

function xmlEsc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function toCol(n: number): string {
  return (n >= 26 ? toCol(Math.floor(n / 26) - 1) : '') + String.fromCharCode(65 + n % 26);
}

function buildXlsx(sheetName: string, data: (string | number | null)[][], colWidths?: number[]): Uint8Array {
  const numRows = data.length;
  const numCols = Math.max(0, ...data.map(r => r.length));
  const dim = numRows && numCols ? `A1:${toCol(numCols - 1)}${numRows}` : 'A1';
  const colsXml = colWidths?.length
    ? `<cols>${colWidths.map((w, i) => w ? `<col min="${i+1}" max="${i+1}" width="${w}" customWidth="1"/>` : '').join('')}</cols>`
    : '';

  const rows = data.map((row, ri) => {
    const cells = row.map((val, ci) => {
      const ref = `${toCol(ci)}${ri + 1}`;
      if (val === null || val === undefined || val === '') return `<c r="${ref}"/>`;
      if (typeof val === 'number') return `<c r="${ref}"><v>${val}</v></c>`;
      return `<c r="${ref}" t="inlineStr"><is><t>${xmlEsc(String(val))}</t></is></c>`;
    }).join('');
    return `<row r="${ri + 1}">${cells}</row>`;
  }).join('');

  const sheet1 = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>`
    + `<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">`
    + `<dimension ref="${dim}"/>`
    + colsXml
    + `<sheetData>${rows}</sheetData>`
    + `</worksheet>`;

  const styles = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>`
    + `<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">`
    + `<fonts count="1"><font><sz val="11"/><name val="Calibri"/></font></fonts>`
    + `<fills count="2"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill></fills>`
    + `<borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders>`
    + `<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>`
    + `<cellXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/></cellXfs>`
    + `<cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>`
    + `</styleSheet>`;

  const wb = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>`
    + `<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">`
    + `<sheets><sheet name="${xmlEsc(sheetName || 'Sheet1')}" sheetId="1" r:id="rId1"/></sheets>`
    + `</workbook>`;

  const ct = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>`
    + `<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">`
    + `<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>`
    + `<Default Extension="xml" ContentType="application/xml"/>`
    + `<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>`
    + `<Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`
    + `<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>`
    + `</Types>`;

  const rels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>`
    + `<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">`
    + `<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>`
    + `</Relationships>`;

  const wbRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>`
    + `<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">`
    + `<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>`
    + `<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>`
    + `</Relationships>`;

  return buildZip([
    { name: '[Content_Types].xml', content: ct },
    { name: '_rels/.rels', content: rels },
    { name: 'xl/workbook.xml', content: wb },
    { name: 'xl/_rels/workbook.xml.rels', content: wbRels },
    { name: 'xl/styles.xml', content: styles },
    { name: 'xl/worksheets/sheet1.xml', content: sheet1 },
  ]);
}

// ── Download ──────────────────────────────────────────────────────────────────

const sanitize = (val: any): string | number | null => {
  if (typeof val === 'string') return val.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '').replace(/\r?\n|\r/g, ' ').trim();
  if (typeof val === 'number') return val;
  return null;
};

const download = () => {
  if (!props.list || props.list.length === 0) return;

  const columnKeys = Object.keys(props.list[0]);
  const headerRow = columnKeys.map(k => columnNames[k] || k);
  const dataRows = props.list.map(item => columnKeys.map(k => sanitize(item[k])));

  const numCols = columnKeys.length;
  const allData: (string | number | null)[][] = [];

  if (props.candidateName) {
    allData.push([`Candidato: ${props.candidateName}`, ...Array(numCols - 1).fill('')]);
    allData.push(Array(numCols).fill(''));
  }
  allData.push(headerRow);
  allData.push(...dataRows);

  const buf = buildXlsx(props.listName || 'Datos', allData, [40, 0, 15]);
  const blob = new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${props.listName || 'exportar'}.xlsx`;
  a.click();
  URL.revokeObjectURL(url);
};
</script>

<style scoped>
:deep(.icon svg) {
  width: 24px;
  height: 24px;
}
</style>

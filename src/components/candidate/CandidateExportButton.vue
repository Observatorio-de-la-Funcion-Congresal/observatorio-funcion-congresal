<template>
  <Button variant="outline" size="sm" @click="download" title="Descargar listado completo" class="text-xs">
    <span v-html="xlsIconPath" class="inline-block mr-2 icon"></span>
    Descargar
  </Button>
</template>

<script setup lang="ts">
import { sanitize, buildXlsx } from '../../lib/export-xls.ts';
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
  const blob = new Blob([buf as any], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
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

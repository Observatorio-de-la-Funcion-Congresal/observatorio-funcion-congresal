<template>
  <Button variant="outline" size="sm" @click="download" title="Descargar listado completo" class="text-xs">
    <span v-html="xlsIconPath" class="inline-block mr-2 icon"></span>
    Descargar
  </Button>
</template>

<script setup lang="ts">
import Button from '../ui/Button/Button.vue';
import { completeSvgIcon } from '../ui/Icon/icons';
import { createXlsx } from '@litejs/xlsx';

const props = defineProps<{
  list: any[];
  listName?: string;
}>();

const columnNames: { [key: string]: string } = {
  title: 'Título',
  year: 'Año',
  status: 'Estado'
}

const xlsIconPath = completeSvgIcon.find(icon => icon.name === 'xls')?.path;

declare global {
  interface Window {
    global: Window & typeof globalThis;
  }
}
if (typeof window !== "undefined") {
  window.global = window;
}

const download = async () => {
  if (!props.list || props.list.length === 0) {
    console.warn('No data available to export');
    return;
  }

  try {
    // Obtener las columnas del primer elemento
    const firstItem = props.list[0];
    const columnKeys = Object.keys(firstItem);
    const columnNamesMapped = columnKeys.map(key => columnNames[key] || key);

    // Crear fila de encabezados
    const headerRow = columnNamesMapped;

    // Convertir datos a filas
    const dataRows = props.list.map(item =>
      columnKeys.map(key => item[key])
    );

    // Crear el archivo Excel
    const fileAsUint8Array = await createXlsx({
      sheets: [{
        name: props.listName,
        freeze: { rows: 1, cols: 0 },
        data: [headerRow, ...dataRows]
      }]
    });

    // Descargar el archivo
    const blob = new Blob([fileAsUint8Array as any], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${props.listName || 'export'}.xlsx`;
    link.click();
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error exporting to Excel:', error);
  }
}

</script>

<style scoped>
:deep(.icon svg) {
  width: 24px;
  height: 24px;
}
</style>
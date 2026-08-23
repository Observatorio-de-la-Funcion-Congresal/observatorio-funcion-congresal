<template>
  <div class="bg-white rounded-2xl shadow-md p-6 mb-8">
    <h2 class="text-xl font-bold text-primary-black-obs mb-5">{{ title }}</h2>

    <div v-if="showFilters" class="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-5">
      <div class="flex flex-col gap-2">
        <span class="text-sm text-primary-gray-obs">Buscar</span>
        <input
          v-model="query"
          type="search"
          placeholder="Por nombre o N° de ley"
          class="h-12 rounded-xl border-2 border-gray-200 px-4 text-sm focus:outline-none focus:border-primary-blue-obs"
        />
      </div>
      <div class="flex flex-col gap-2">
        <span class="text-sm text-primary-gray-obs">Comisión</span>
        <select v-model="commissionFilter" class="h-12 rounded-xl border-2 border-gray-200 px-4 text-sm text-primary-black-obs focus:outline-none focus:border-primary-blue-obs">
          <option value="">Selecciona</option>
          <option v-for="c in commissionOptions" :key="c" :value="c">{{ c }}</option>
        </select>
      </div>
      <div class="flex flex-col gap-2">
        <span class="text-sm text-primary-gray-obs">Bancada</span>
        <select v-model="factionFilter" class="h-12 rounded-xl border-2 border-gray-200 px-4 text-sm text-primary-black-obs focus:outline-none focus:border-primary-blue-obs">
          <option value="">Selecciona</option>
          <option v-for="f in factionOptions" :key="f" :value="f">{{ f }}</option>
        </select>
      </div>
      <div class="flex flex-col gap-2">
        <span class="text-sm text-primary-gray-obs">Estado</span>
        <select v-model="statusFilter" class="h-12 rounded-xl border-2 border-gray-200 px-4 text-sm text-primary-black-obs focus:outline-none focus:border-primary-blue-obs">
          <option value="">Selecciona</option>
          <option v-for="s in statusOptions" :key="s" :value="s">{{ statusLabels[s] ?? s }}</option>
        </select>
      </div>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-gray-100 text-left text-primary-gray-obs">
            <th class="py-2 pr-3 font-medium">N°</th>
            <th class="py-2 pr-3 font-medium">Título</th>
            <th class="py-2 pr-3 font-medium">Comisión</th>
            <th class="py-2 pr-3 font-medium">Bancada</th>
            <th class="py-2 pr-3 font-medium">Fecha de presentación</th>
            <th class="py-2 pr-3 font-medium">Estado</th>
            <th class="py-2 pr-3 font-medium">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="record in filteredRecords" :key="`${record.id}-${record.title}`" class="border-b border-gray-50">
            <td class="py-3 pr-3 text-primary-blue-obs font-medium whitespace-nowrap">{{ record.id }}</td>
            <td class="py-3 pr-3 text-primary-black-obs">{{ record.title }}</td>
            <td class="py-3 pr-3 text-primary-black-obs whitespace-nowrap">{{ record.commission }}</td>
            <td class="py-3 pr-3 text-primary-black-obs whitespace-nowrap">{{ record.faction }}</td>
            <td class="py-3 pr-3 text-primary-gray-obs whitespace-nowrap">{{ record.date }}</td>
            <td class="py-3 pr-3 whitespace-nowrap">
              <span :class="`text-xs font-medium px-3 py-1 rounded-full ${statusStyles[record.status]}`">
                {{ statusLabels[record.status] }}
              </span>
            </td>
            <td class="py-3 pr-3 whitespace-nowrap">
              <a :href="record.downloadUrl" title="Descargar" class="inline-flex items-center gap-1 text-primary-blue-obs hover:underline">
                <span v-html="downloadIcon" class="w-4 h-4 inline-block"></span>
                Descargar
              </a>
            </td>
          </tr>
        </tbody>
      </table>

      <p v-if="filteredRecords.length === 0" class="text-center text-primary-gray-obs py-8">
        No se encontraron resultados con los filtros aplicados.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import downloadIcon from '../../assets/icons/download.svg?raw';

export interface ActivityRecord {
  id: string;
  title: string;
  commission: string;
  faction: string;
  date: string;
  status: 'Approved' | 'Rejected' | 'Archived' | 'In commission';
  downloadUrl: string;
}

const props = withDefaults(defineProps<{
  title: string;
  records: ActivityRecord[];
  showFilters?: boolean;
  commissionOptions?: string[];
  factionOptions?: string[];
  statusOptions?: ActivityRecord['status'][];
}>(), {
  showFilters: true,
  commissionOptions: () => [],
  factionOptions: () => [],
  statusOptions: () => ['Approved', 'Rejected', 'Archived', 'In commission'],
});

const statusStyles: Record<ActivityRecord['status'], string> = {
  Approved: 'bg-light-green-obs text-green-obs',
  Rejected: 'bg-sky-red-obs text-red-obs',
  Archived: 'bg-gray-100 text-primary-gray-obs',
  'In commission': 'bg-yellow-obs text-darken-yellow-obs',
};

const statusLabels: Record<ActivityRecord['status'], string> = {
  Approved: 'Aprobado',
  Rejected: 'Rechazado',
  Archived: 'Archivado',
  'In commission': 'En comisión',
};

const query = ref('');
const commissionFilter = ref('');
const factionFilter = ref('');
const statusFilter = ref('');

const filteredRecords = computed(() => {
  if (!props.showFilters) return props.records;

  const q = query.value.trim().toLowerCase();

  return props.records.filter((record) => {
    const matchesQuery = q === '' || record.title.toLowerCase().includes(q) || record.id.toLowerCase().includes(q);
    const matchesCommission = commissionFilter.value === '' || record.commission === commissionFilter.value;
    const matchesFaction = factionFilter.value === '' || record.faction === factionFilter.value;
    const matchesStatus = statusFilter.value === '' || record.status === statusFilter.value;
    return matchesQuery && matchesCommission && matchesFaction && matchesStatus;
  });
});
</script>

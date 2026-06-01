<template>
  <div class="bg-white rounded-2xl shadow-md p-6">
    <div class="flex justify-between items-center mb-5">
      <h2 class="text-2xl font-bold text-primary-black-obs">
        Mociones {{ period }}
      </h2>
      <CandidateExportButton :list="motionsFormatted" list-name="Mociones" />
    </div>

    <!-- Summary row -->
    <div class="grid grid-cols-2 md:grid-cols-3 gap-3 mb-5">
      <div class="bg-sky-blue-obs rounded-xl p-4 border border-light-blue-obs">
        <p class="text-sm text-primary-black-obs mb-1">Presentados</p>
        <p class="text-3xl font-bold text-primary-blue-obs">{{ motions.presented }}</p>
      </div>
      <div class="bg-light-green-obs rounded-xl p-4 border border-light-blue-obs">
        <p class="text-sm text-primary-black-obs mb-1">Aprobados</p>
        <p class="text-3xl font-bold text-green-obs">{{ motions.approved }}</p>
      </div>
      <div class="bg-yellow-obs rounded-xl p-4 border border-light-blue-obs">
        <p class="text-sm text-primary-black-obs mb-1">Tasa de aprobación</p>
        <p class="text-3xl font-bold text-darken-yellow-obs">{{ motions.approval_rate }}%</p>
      </div>
    </div>

    <!-- Motion list with accordion animation -->
    <div 
      class="overflow-hidden transition-all duration-300 ease-out max-w-full"
    >
      <div class="flex flex-col divide-y divide-gray-100">
        <div 
          v-for="motion in displayedMotions" 
          :key="`${motion.year}-${motion.title}`" 
          class="flex items-start justify-between py-3 gap-3 flex-col md:flex-row md:items-center"
        >
          <div class="min-w-0">
            <p class="text-sm font-medium text-primary-black-obs md:truncate" :title="motion.title">
              {{ motion.title }}
            </p>
            <p class="text-xs text-primary-gray-obs mt-0.5">{{ motion.year }}</p>
          </div>
          <span 
            :class="`text-xs font-medium px-3 py-1 rounded-full shrink-0 ${statusStyles[motion.status] ?? statusStyles['Archivado']}`"
          >
            {{ motion.status }}
          </span>
        </div>
      </div>
    </div>

    <!-- Ver más button - inline style -->
    <div v-if="motions.list.length > 10" class="mt-4">
      <button
        @click="showAll = !showAll"
        class="text-sm font-medium text-primary-blue-obs cursor-pointer underline border-b-2 border-primary-blue-obs py-1 px-0 hover:text-dark-blue-obs hover:border-dark-blue-obs transition-colors"
      >
        {{ showAll ? 'Ver menos' : 'Ver más' }}
      </button>
    </div>

    <!-- Author / Adherent cards -->
    <div class="grid grid-cols-2 gap-3 mt-5">
      <div class="bg-sky-blue-obs rounded-xl p-6 border border-light-blue-obs">
        <p class="text-sm text-dark-blue-obs mb-1 font-semibold">Como Autor</p>
        <p class="text-3xl font-bold text-dark-blue-obs font-inter">{{ motions.as_author }}</p>
        <p class="text-xs text-primary-black-obs mt-1">
          Mociones presentadas con autoría principal
        </p>
      </div>
      <div class="bg-yellow-obs rounded-xl p-6 border border-yellow-100">
        <p class="text-sm text-darken-yellow-obs mb-1 font-semibold">Como Adherente</p>
        <p class="text-3xl font-bold text-darken-yellow-obs font-inter">{{ motions.as_adherent }}</p>
        <p class="text-xs text-primary-black-obs mt-1">
          Mociones donde figura como co-autor
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, type ComputedRef } from 'vue';
import CandidateExportButton from './CandidateExportButton.vue';

interface Motion {
  title: string;
  year: number;
  status: 'Aprobado' | 'En comisión' | 'Archivado';
}

interface Motions {
  presented: number;
  approved: number;
  approval_rate: number;
  as_author: number;
  as_adherent: number;
  list: Motion[];
}

const props = withDefaults(
  defineProps<{
    motions: Motions;
    period?: string;
  }>(),
  {
    period: '2021 – 2025'
  }
);

const showAll = ref(false);

const statusStyles: Record<Motion['status'], string> = {
  'Aprobado': 'bg-light-green-obs text-green-obs',
  'En comisión': 'bg-yellow-100 text-[#92400E]',
  'Archivado': 'bg-gray-100 text-primary-gray-obs',
};

const motionsFormatted: ComputedRef<Motion[]> = computed(() =>
  props.motions.list.map((motion) => ({
    ...motion,
    status: `${motion.status.charAt(0).toUpperCase()}${motion.status.slice(1).toLowerCase()}` as Motion['status'],
  }))
);

const displayedMotions: ComputedRef<Motion[]> = computed(() =>
  showAll.value ? motionsFormatted.value : motionsFormatted.value.slice(0, 10)
);
</script>

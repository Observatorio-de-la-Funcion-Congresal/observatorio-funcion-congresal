<template>
  <a v-if="href" :href="href" :target="target" :class="classes" :id="id" :rel="rel">
    <slot />
  </a>
  <button v-else :type="type" :class="classes" :id="id">
    <slot />
  </button>
</template>

<script setup lang="ts">
  import { variants, sizes, base } from './button';
  import type { Props } from './button';

  const {
    href,
    variant = 'primary',
    size = 'md',
    class: className = '',
    type = 'button',
    target,
    id,
    rel
  } = defineProps<Props>();

  const classes = [base, variants[variant], sizes[size], className].join(' ');
</script>

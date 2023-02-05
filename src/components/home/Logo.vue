<script setup lang="ts">
import { computed } from 'vue'
import { useNow } from '@vueuse/core'

import LogoFull from '../../assets/PorePriorityFull.svg?component'
import LogoFullPride from '../../assets/PorePriorityFullPride.svg?component'

const now = useNow()
const Logo = computed(() => now.value.getMonth() === 5 ? LogoFullPride : LogoFull)
</script>

<template>
	<Logo alt="PorePriority" class="logo" />
</template>

<style lang="scss" scoped>
.logo {
	color: var(--logo-text-color);
}
</style>

<template>
	<div class="no-auth-wrapper">
		<div class="noauth-container">
			<Logo width="400" height="117" />
			<div class="message is-info" v-if="motd !== ''">
				<div class="message-header">
					<p>{{ $t('misc.info') }}</p>
				</div>
				<div class="message-body">
					{{ motd }}
				</div>
			</div>
			<slot/>
		</div>
	</div>
</template>

<script setup>
import Logo from '@/components/home/Logo.vue'
import {useStore} from 'vuex'
import {computed} from 'vue'

const store = useStore()
const motd = computed(() => store.state.config.motd)
</script>

<style lang="scss" scoped>
.no-auth-wrapper {
	background: url('@/assets/llama.svg') no-repeat bottom left fixed $light-background;
	min-height: 100vh;
}

.noauth-container {
	max-width: 450px;
	width: 100%;
	margin: 0 auto;
	padding: 1rem;
}
</style>
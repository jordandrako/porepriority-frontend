<template>
	<div class="content has-text-centered">
		<h2 v-if="salutation">{{ salutation }}</h2>

		<message variant="danger" v-if="deletionScheduledAt !== null" class="mb-4">
			{{
				$t('user.deletion.scheduled', {
					date: formatDateShort(deletionScheduledAt),
					dateSince: formatDateSince(deletionScheduledAt),
				})
			}}
			<router-link :to="{name: 'user.settings', hash: '#deletion'}">
				{{ $t('user.deletion.scheduledCancel') }}
			</router-link>
		</message>
		<add-task
			@taskAdded="updateTaskList"
			class="is-max-width-desktop"
		/>
		<template v-if="!hasTasks && !loading">
			<template v-if="defaultNamespaceId > 0">
				<p class="mt-4">{{ $t('home.list.newText') }}</p>
				<x-button
					:to="{ name: 'list.create', params: { namespaceId: defaultNamespaceId } }"
					:shadow="false"
					class="ml-2"
				>
					{{ $t('home.list.new') }}
				</x-button>
			</template>
			<p class="mt-4" v-if="migratorsEnabled">
				{{ $t('home.list.importText') }}
			</p>
			<x-button
				v-if="migratorsEnabled"
				:to="{ name: 'migrate.start' }"
				:shadow="false">
				{{ $t('home.list.import') }}
			</x-button>
		</template>
		<div v-if="listHistory.length > 0" class="is-max-width-desktop has-text-left mt-4">
			<h3>{{ $t('home.lastViewed') }}</h3>
			<ListCardGrid :lists="listHistory" v-cy="'listCardGrid'" />
		</div>
		<ShowTasks
			v-if="hasLists"
			class="show-tasks"
			:key="showTasksKey"
		/>
	</div>
</template>

<script lang="ts" setup>
import {ref, computed} from 'vue'

import Message from '@/components/misc/message.vue'
import ShowTasks from '@/views/tasks/ShowTasks.vue'
import ListCardGrid from '@/components/list/partials/ListCardGrid.vue'
import AddTask from '@/components/tasks/add-task.vue'

import {getHistory} from '@/modules/listHistory'
import {parseDateOrNull} from '@/helpers/parseDateOrNull'
import {formatDateShort, formatDateSince} from '@/helpers/time/formatDate'
import {useDaytimeSalutation} from '@/composables/useDaytimeSalutation'

import {useBaseStore} from '@/stores/base'
import {useListStore} from '@/stores/lists'
import {useConfigStore} from '@/stores/config'
import {useNamespaceStore} from '@/stores/namespaces'
import {useAuthStore} from '@/stores/auth'
import {useTaskStore} from '@/stores/tasks'
import type {IList} from '@/modelTypes/IList'

const salutation = useDaytimeSalutation()

const baseStore = useBaseStore()
const authStore = useAuthStore()
const configStore = useConfigStore()
const namespaceStore = useNamespaceStore()
const listStore = useListStore()
const taskStore = useTaskStore()

const listHistory = computed(() => {
	// If we don't check this, it tries to load the list background right after logging out	
	if(!authStore.authenticated) {
		return []
	}
	
	return getHistory()
		.map(l => listStore.getListById(l.id))
		.filter((l): l is IList => l !== null)
})

const migratorsEnabled = computed(() => configStore.availableMigrators?.length > 0)
const hasTasks = computed(() => baseStore.hasTasks)
const defaultNamespaceId = computed(() => namespaceStore.namespaces?.[0]?.id || 0)
const hasLists = computed(() => namespaceStore.namespaces?.[0]?.lists.length > 0)
const loading = computed(() => taskStore.isLoading)
const deletionScheduledAt = computed(() => parseDateOrNull(authStore.info?.deletionScheduledAt))

// This is to reload the tasks list after adding a new task through the global task add.
// FIXME: Should use pinia (somehow?)
const showTasksKey = ref(0)

function updateTaskList() {
	showTasksKey.value++
}
</script>

<style scoped lang="scss">
.show-tasks {
	margin-top: 2rem;
}
</style>
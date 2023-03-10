<template>
	<dropdown>
		<template #trigger="triggerProps">
			<slot name="trigger" v-bind="triggerProps">
				<BaseButton class="dropdown-trigger" @click="triggerProps.toggleOpen">
					<icon icon="ellipsis-h" class="icon"/>
				</BaseButton>
			</slot>
		</template>

		<template v-if="isSavedFilter(list)">
			<dropdown-item
				:to="{ name: 'filter.settings.edit', params: { listId: list.id } }"
				icon="pen"
			>
				{{ $t('menu.edit') }}
			</dropdown-item>
			<dropdown-item
				:to="{ name: 'filter.settings.delete', params: { listId: list.id } }"
				icon="trash-alt"
			>
				{{ $t('misc.delete') }}
			</dropdown-item>
		</template>

		<template v-else-if="list.isArchived">
			<dropdown-item
				:to="{ name: 'list.settings.archive', params: { listId: list.id } }"
				icon="archive"
			>
				{{ $t('menu.unarchive') }}
			</dropdown-item>
		</template>
		<template v-else>
			<dropdown-item
				:to="{ name: 'list.settings.edit', params: { listId: list.id } }"
				icon="pen"
			>
				{{ $t('menu.edit') }}
			</dropdown-item>
			<dropdown-item
				v-if="backgroundsEnabled"
				:to="{ name: 'list.settings.background', params: { listId: list.id } }"
				icon="image"
			>
				{{ $t('menu.setBackground') }}
			</dropdown-item>
			<dropdown-item
				:to="{ name: 'list.settings.share', params: { listId: list.id } }"
				icon="share-alt"
			>
				{{ $t('menu.share') }}
			</dropdown-item>
			<dropdown-item
				:to="{ name: 'list.settings.duplicate', params: { listId: list.id } }"
				icon="paste"
			>
				{{ $t('menu.duplicate') }}
			</dropdown-item>
			<dropdown-item
				:to="{ name: 'list.settings.archive', params: { listId: list.id } }"
				icon="archive"
			>
				{{ $t('menu.archive') }}
			</dropdown-item>
			<Subscription
				class="has-no-shadow"
				:is-button="false"
				entity="list"
				:entity-id="list.id"
				:model-value="list.subscription"
				@update:model-value="setSubscriptionInStore"
				type="dropdown"
			/>
			<dropdown-item
				:to="{ name: 'list.settings.delete', params: { listId: list.id } }"
				icon="trash-alt"
				class="has-text-danger"
			>
				{{ $t('menu.delete') }}
			</dropdown-item>
		</template>
	</dropdown>
</template>

<script setup lang="ts">
import {ref, computed, watchEffect, type PropType} from 'vue'

import BaseButton from '@/components/base/BaseButton.vue'
import Dropdown from '@/components/misc/dropdown.vue'
import DropdownItem from '@/components/misc/dropdown-item.vue'
import Subscription from '@/components/misc/subscription.vue'
import type {IList} from '@/modelTypes/IList'
import type {ISubscription} from '@/modelTypes/ISubscription'

import {isSavedFilter} from '@/services/savedFilter'
import {useConfigStore} from '@/stores/config'
import {useListStore} from '@/stores/lists'
import {useNamespaceStore} from '@/stores/namespaces'

const props = defineProps({
	list: {
		type: Object as PropType<IList>,
		required: true,
	},
})

const listStore = useListStore()
const namespaceStore = useNamespaceStore()
const subscription = ref<ISubscription | null>(null)
watchEffect(() => {
	subscription.value = props.list.subscription ?? null
})

const configStore = useConfigStore()
const backgroundsEnabled = computed(() => configStore.enabledBackgroundProviders?.length > 0)

function setSubscriptionInStore(sub: ISubscription) {
	subscription.value = sub
	const updatedList = {
		...props.list,
		subscription: sub,
	}
	listStore.setList(updatedList)
	namespaceStore.setListInNamespaceById(updatedList)
}
</script>
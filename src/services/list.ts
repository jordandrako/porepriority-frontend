import AbstractService from './abstractService'
import ListModel from '@/models/list'
import type {IList} from '@/modelTypes/IList'
import TaskService from './task'
import {colorFromHex} from '@/helpers/color/colorFromHex'

export default class ListService extends AbstractService<IList> {
	constructor() {
		super({
			create: '/namespaces/{namespaceId}/lists',
			get: '/lists/{id}',
			getAll: '/lists',
			update: '/lists/{id}',
			delete: '/lists/{id}',
		})
	}

	modelFactory(data) {
		return new ListModel(data)
	}

	beforeUpdate(model) {
		if(typeof model.tasks !== 'undefined') {
			const taskService = new TaskService()
			model.tasks = model.tasks.map(task => {
				return taskService.beforeUpdate(task)
			})
		}
		
		if(typeof model.hexColor !== 'undefined') {
			model.hexColor = colorFromHex(model.hexColor)
		}
		
		return model
	}

	beforeCreate(list) {
		list.hexColor = colorFromHex(list.hexColor)
		return list
	}

	async background(list: Pick<IList, 'id' | 'backgroundInformation'>) {
		if (list.backgroundInformation === null) {
			return ''
		}

		const response = await this.http({
			url: `/lists/${list.id}/background`,
			method: 'GET',
			responseType: 'blob',
		})
		return window.URL.createObjectURL(new Blob([response.data]))
	}

	async removeBackground(list: Pick<IList, 'id'>) {
		const cancel = this.setLoading()

		try {
			const response = await this.http.delete(`/lists/${list.id}/background`, list)
			return response.data
		} finally {
			cancel()
		}
	}
}
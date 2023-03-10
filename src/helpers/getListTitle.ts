import {i18n} from '@/i18n'
import type {IList} from '@/modelTypes/IList'

export function getListTitle(l: IList) {
	if (l.id === -1) {
		return i18n.global.t('list.pseudo.favorites.title')
	}
	return l.title
}

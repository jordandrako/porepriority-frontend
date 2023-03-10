import UserShareBaseModel from './userShareBase'

import type {IUserList} from '@/modelTypes/IUserList'
import type {IList} from '@/modelTypes/IList'

// This class extends the user share model with a 'rights' parameter which is used in sharing
export default class UserListModel extends UserShareBaseModel implements IUserList {
	listId: IList['id'] = 0

	constructor(data: Partial<IUserList>) {
		super(data)
		this.assignData(data)
	}
}
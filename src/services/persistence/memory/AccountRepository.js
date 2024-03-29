import AccountModel from "../../../models/AccountModel";

class AccountRepository {
    constructor() {
        this.items = [];
    }

    /**
     * @param {AccountModel[]} items
     * @returns {Promise}
     */
    async persist(items) {
        this.items = items;
    }

    async getItems() {
        return Promise.resolve(this.items);
    }
}

export default AccountRepository;
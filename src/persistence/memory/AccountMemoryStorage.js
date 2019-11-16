import AccountModel from "../../models/AccountModel";

class AccountMemoryStorage {
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
}

export default AccountMemoryStorage;
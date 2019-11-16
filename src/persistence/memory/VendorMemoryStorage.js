import VendorModel from "../../models/VendorModel";

class VendorMemoryStorage {
    constructor() {
        this.items = [];
    }

    /**
     * @param {VendorModel[]} vendors
     * @returns {Promise}
     */
    async persist(items) {
        this.items = items;        
    }
}

export default VendorMemoryStorage;
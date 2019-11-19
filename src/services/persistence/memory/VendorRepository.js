import VendorModel from "../../../models/VendorModel";

class VendorRepository {
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

    async getItems() {
        return Promise.resolve(this.items);
    }
}

export default VendorRepository;
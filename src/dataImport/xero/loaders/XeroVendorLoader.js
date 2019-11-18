import XeroConnection from '../XeroConnection';
import VendorModel from '../../../models/VendorModel';

class XeroVendorLoader {
    /**
     * @param {XeroConnection} connection
     * @returns {Promise<VendorModel>}
     */
    async load(connection) {
        const response = await connection.client.contacts.get({ where: 'IsSupplier=True' });

        let data;

        if (!response.Contacts) {
            data = [];
        }
        else {
            data = response.Contacts.map((contact) => new VendorModel(
                contact.ContactID,
                contact.Name,
                contact.ContactStatus,
                new Date(contact.UpdatedDateUTC.match(/\d+/)[0] * 1)
            ));
        }

        return data;
    }
}

export default XeroVendorLoader;
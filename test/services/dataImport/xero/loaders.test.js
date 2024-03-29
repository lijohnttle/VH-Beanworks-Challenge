import JestMock from 'jest-mock';
import { XeroAccountLoader, XeroVendorLoader } from '../../../../src/services/dataImport/xero/loaders';

describe('loading data from Xero', () => {
    [0, 3].forEach(accountCount =>
        it(`loaded accounts count === sent accounts count (${accountCount})`, async () => {
            const accountsResponse = generateAccountsResponse(accountCount);
            const getAccountsMock = JestMock.fn(() => Promise.resolve(accountsResponse));
            const connection = {
                client: {
                    accounts: {
                        get: getAccountsMock
                    }
                }
            };
            const loader = new XeroAccountLoader();


            const accounts = await loader.load(connection);


            expect(getAccountsMock.mock.calls.length).toBe(1);
            expect(accounts.length).toBe(accountsResponse.Accounts.length);
        })
    );

    [0, 3].forEach(vendorCount =>
        it(`loaded vendors count === sent vendors count (${vendorCount})`, async () => {
            const vendorsResponse = generateVendorsResponse(vendorCount);
            const getVendorsMock = JestMock.fn(() => Promise.resolve(vendorsResponse));
            const connection = {
                client: {
                    contacts: {
                        get: getVendorsMock
                    }
                }
            };
            const loader = new XeroVendorLoader();


            const vendors = await loader.load(connection);


            expect(getVendorsMock.mock.calls.length).toBe(1);
            expect(vendors.length).toBe(vendorsResponse.Contacts.length);
        })
    );
});

function generateAccountsResponse(count) {
    const response = {
        Accounts: []
    };

    for (let i = 0; i < count; i++) {
        response.Accounts.push({
            AccountID: i.toString(),
            Name: 'Account ' + i,
            Status: 'ACTIVE',
            UpdatedDateUTC: '/Date(1573892371417+0000)/'
        });
    }

    return response;
}

function generateVendorsResponse(count) {
    const response = {
        Contacts: []
    };

    for (let i = 0; i < count; i++) {
        response.Contacts.push({
            ContactID: i.toString(),
            Name: 'Vendor ' + i,
            ContactStatus: 'ACTIVE',
            UpdatedDateUTC: '/Date(1573892371417+0000)/'
        });
    }

    return response;
}
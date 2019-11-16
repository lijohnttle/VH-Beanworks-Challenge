import loaders from '../../../src/integrations/xero/loaders';
import JestMock from 'jest-mock';

describe('Loaders', () => {
    [0, 3].forEach(accountCount =>
        it(`should test that account models count === received accounts count (${accountCount})`, async () => {
            const cccountsResponse = generateAccountsResponse(accountCount);
            const getAccountsMock = JestMock.fn(() => Promise.resolve(cccountsResponse));
            const connection = {
                client: {
                    accounts: {
                        get: getAccountsMock
                    }
                }
            };

            const accounts = await loaders.accountLoader.load(connection);

            expect(getAccountsMock.mock.calls.length).toBe(1);
            expect(accounts.length).toBe(cccountsResponse.Accounts.length);
    }));

    [0, 3].forEach(vendorCount =>
        it(`should test that vendor models count === received vendors count (${vendorCount})`, async () => {
            const vendorsResponse = generateVendorsResponse(vendorCount);
            const getVendorsMock = JestMock.fn(() => Promise.resolve(vendorsResponse));
            const connection = {
                client: {
                    contacts: {
                        get: getVendorsMock
                    }
                }
            };

            const vendors = await loaders.vendorLoader.load(connection);

            expect(getVendorsMock.mock.calls.length).toBe(1);
            expect(vendors.length).toBe(vendorsResponse.Contacts.length);
    }));
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
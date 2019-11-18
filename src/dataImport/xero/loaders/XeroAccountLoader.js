import XeroConnection from '../XeroConnection';
import AccountModel from '../../../models/AccountModel';

class XeroAccountLoader {
    /**
     * @param {XeroConnection} connection
     * @returns {Promise<AccountModel[]>}
     */
    async load(connection) {
        const response = await connection.client.accounts.get();
        
        let data;

        if (!response.Accounts) {
            data = [];
        }
        else {
            data = response.Accounts.map((account) => new AccountModel(
                account.AccountID,
                account.Name,
                account.Status,
                new Date(account.UpdatedDateUTC.match(/\d+/)[0] * 1)
            ));
        }

        return data;
    }
}

export default XeroAccountLoader;
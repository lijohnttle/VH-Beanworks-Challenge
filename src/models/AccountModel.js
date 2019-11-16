class AccountModel {
    constructor(accountID, name, status, updatedDateUTC) {
        this.accountID = accountID;
        this.name = name;
        this.status = status;
        this.updatedDateUTC = updatedDateUTC;
    }
}

export default AccountModel;
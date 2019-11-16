import XeroAccountLoader from "./XeroAccountLoader";
import XeroVendorLoader from './XeroVendorLoader';

export default {
    accountLoader: new XeroAccountLoader(),
    vendorLoader: new XeroVendorLoader()
};
const { billing: { billingModel } } = require("../../../Models/Extractor/index")

const createBillingData = async (body) => {
    try {
        const newBilling = new billingModel(body);
        const createdBilling = await newBilling.save();
        return createdBilling;
    } catch (err) {
        throw err;
    }
};

const getBillingData = async (query) => {
    try {
        const billing = await billingModel.findOne(query);
        return billing;
    } catch (err) {
        throw err;
    }
};

const getBillingDataList = async (query) => {
    try {
        const billing = await billingModel.find(query);
        return billing;
    } catch (err) {
        throw err;
    }
};

const updateBillingData = async (billingId, updatedData) => {
    try {
        const updatedBilling = await billingModel.findByIdAndUpdate(
            billingId,
            updatedData,
            { new: true }
        );
        return updatedBilling;
    } catch (err) {
        throw err;
    }
};

const deleteBillingData = async (billingId) => {
    try {
        const deletedBilling = await billingModel.findByIdAndDelete(billingId);
        return deletedBilling;
    } catch (err) {
        throw err;
    }
};

module.exports = { createBillingData, getBillingData, updateBillingData, deleteBillingData, getBillingDataList }
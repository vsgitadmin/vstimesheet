const { response: { billingResponse } } = require('../../Classes/index');
const { createBillingData, getBillingData, updateBillingData, deleteBillingData, getBillingDataList } = require('../ControllerFunction/Billing');

const createBillingController = async (req, res) => {
  try {
    const response = await createBillingData(req.body);
    res.status(200).json(new billingResponse("Billing data created", response, false));
  } catch (err) {
    res.status(400).json(new billingResponse(err.message, null, true));
  }
};

const getBillingDataController = async (req, res) => {
  try {
    const response = await getBillingData(req.query);
    res.status(200).json(new billingResponse("Fetched billing data", response, false));
  } catch (err) {
    res.status(400).json(new billingResponse(err.message, null, true));
  }
};

const getBillingDataListController = async (req, res) => {
    try {
      const response = await getBillingDataList(req.query);
      res.status(200).json(new billingResponse("Fetched billing data", response, false));
    } catch (err) {
      res.status(400).json(new billingResponse(err.message, null, true));
    }
  };

const updateBillingDataController = async (req, res) => {
  try {
    const response = await updateBillingData(req.query.id, req.body);
    res.status(200).json(new billingResponse("Billing data updated", response, false));
  } catch (err) {
    res.status(400).json(new billingResponse(err.message, null, true));
  }
};

const deleteBillingDataController = async (req, res) => {
  try {
    const response = await deleteBillingData(req.query.id);
    res.status(200).json(new billingResponse("Billing data deleted", response, false));
  } catch (err) {
    res.status(400).json(new billingResponse(err.message, null, true));
  }
};

module.exports = {
  createBillingController,
  getBillingDataController,
  updateBillingDataController,
  deleteBillingDataController,
  getBillingDataListController
};

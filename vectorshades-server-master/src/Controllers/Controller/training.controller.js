const { response: { TrainingResponse } } = require("../../Classes/index");
const {
  createTraining,
  getTrainingById,
  getAllTrainings,
  searchTrainings,
  getTrainingsAssignedToUser,
  getTrainingsAssignedByUser,
  getCompletedTrainings,
  getIncompleteTrainings,
  completeTraining,
  editTraining,
  deleteTraining,
  changeStatus,
  getTrainingDashboard,
  getHrTrainingCount
} = require("../ControllerFunction/Training/index");

const createTrainingController = async (req, res) => {
  const response = await createTraining(req.body, req.headers.data)
    .then((data) => new TrainingResponse("Training has been created successfully", data, true))
    .catch((error) => new TrainingResponse(error.message, null, false));
  res.status(response.ok ? 200 : 400).json(response);
};

const getTrainingController = async (req, res) => {
  const trainingId = req.query.id;
  const response = await getTrainingById(trainingId)
    .then((data) => new TrainingResponse(`Successfully fetched training ${trainingId}`, { data }, true))
    .catch((error) => new TrainingResponse(error.message, null, false));
  res.status(response.ok ? 200 : 400).json(response);
};

const getAllTrainingsController = async (req, res) => {
  const response = await getAllTrainings(req.query.page)
    .then((data) => new TrainingResponse("Successfully fetched all trainings", data, true))
    .catch((error) => new TrainingResponse(error.message, null, false));
  res.status(response.ok ? 200 : 400).json(response);
};

const getHrTrainingHrCountController = async (req, res) => {
  const response = await getHrTrainingCount()
    .then((data) => new TrainingResponse(`Successfully fetched training count`, data, true))
    .catch((error) => new TrainingResponse(error.message, null, false));
  res.status(response.ok ? 200 : 400).json(response);
}

const searchTrainingsController = async (req, res) => {
  const response = await searchTrainings(req.query.query, req.headers.data.id)
    .then((data) => new TrainingResponse("Aggregated search results successfully", data, true))
    .catch((error) => new TrainingResponse(error.message, null, false));
  res.status(response.ok ? 200 : 400).json(response);
};

const getTrainingsAssignedToUserController = async (req, res) => {
  const response = await getTrainingsAssignedToUser(req.headers.data, req.query.page)
    .then((data) => new TrainingResponse("Successfully fetched trainings assigned to the user", data, true))
    .catch((error) => new TrainingResponse(error.message, null, false));
  res.status(response.ok ? 200 : 400).json(response);
};

const getTrainingsAssignedByUserController = async (req, res) => {
  const response = await getTrainingsAssignedByUser(req.headers.data, req.query.page)
    .then((data) => new TrainingResponse("Successfully fetched trainings assigned by the user", data, true))
    .catch((error) => new TrainingResponse(error.message, null, false));
  res.status(response.ok ? 200 : 400).json(response);
};

const getAllCompletedTrainingsController = async (req, res) => {
  const response = await getCompletedTrainings(req.query.page)
    .then((data) => new TrainingResponse("Successfully fetched all completed trainings", data, true))
    .catch((error) => new TrainingResponse(error.message, null, false));
  res.status(response.ok ? 200 : 400).json(response);
};

const getAllIncompleteTrainingsController = async (req, res) => {
  const response = await getIncompleteTrainings(req.query.page)
    .then((data) => new TrainingResponse("Successfully fetched all incomplete trainings", data, true))
    .catch((error) => new TrainingResponse(error.message, null, false));
  res.status(response.ok ? 200 : 400).json(response);
};

const getAssignedCompletedTrainingsController = async (req, res) => {
  const response = await getCompletedTrainings(req.query.page, req.headers.data.id)
    .then((data) => new TrainingResponse("Successfully fetched all completed trainings", data, true))
    .catch((error) => new TrainingResponse(error.message, null, false));
  res.status(response.ok ? 200 : 400).json(response);
};

const getAssignedIncompleteTrainingsController = async (req, res) => {
  const response = await getIncompleteTrainings(req.query.page, req.headers.data.id)
    .then((data) => new TrainingResponse("Successfully fetched all incomplete trainings", data, true))
    .catch((error) => new TrainingResponse(error.message, null, false));
  res.status(response.ok ? 200 : 400).json(response);
};


const completeTrainingController = async (req, res) => {
  const response = await completeTraining(req.query.id)
    .then((data) => new TrainingResponse("Successfully marked the training as completed", data, true))
    .catch((error) => new TrainingResponse(error.message, null, false));
  res.status(response.ok ? 200 : 400).json(response);
};

const editTrainingController = async (req, res) => {
  const response = await editTraining(req.query.id, req.body)
    .then((data) => new TrainingResponse("Successfully edited the training details", data, true))
    .catch((error) => new TrainingResponse(error.message, null, false));
  res.status(response.ok ? 200 : 400).json(response);
};

const deleteTrainingController = async (req, res) => {
  const response = await deleteTraining(req.query.id)
    .then((data) => new TrainingResponse("Successfully deleted the training", data, true))
    .catch((error) => new TrainingResponse(error.message, null, false));
  res.status(response.ok ? 200 : 400).json(response);
};

const changeStatusController = async (req, res) => {
  const response = await changeStatus(req.query.id, req.query.status)
    .then((data) => new TrainingResponse("Successfully changed the status", data, true))
    .catch((error) => new TrainingResponse(error.message, null, false));
  res.status(response.ok ? 200 : 400).json(response);
};

const getTrainingDashboardController = async (req, res) => {
  const response = await getTrainingDashboard(req.headers.data.id)
    .then((data) => new TrainingResponse("Successfully fetched training dashboard", data, true))
    .catch((error) => new TrainingResponse(error.message, null, false));
  res.status(response.ok ? 200 : 400).json(response);
};

module.exports = {
  createTrainingController,
  getTrainingController,
  getAllTrainingsController,
  searchTrainingsController,
  getTrainingsAssignedToUserController,
  getTrainingsAssignedByUserController,
  getAllCompletedTrainingsController,
  getAllIncompleteTrainingsController,
  getAssignedCompletedTrainingsController,
  getAssignedIncompleteTrainingsController,
  completeTrainingController,
  editTrainingController,
  deleteTrainingController,
  getTrainingDashboardController,
  changeStatusController,
  getHrTrainingHrCountController
};

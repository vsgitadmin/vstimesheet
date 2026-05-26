const { Router } = require("express");
const {
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
  changeStatusController,
  getTrainingDashboardController,
  getHrTrainingHrCountController,
} = require("../../Controllers/Controller/training.controller");

const router = Router();

router.post("/create", createTrainingController);
router.get("/get", getTrainingController);
router.get("/all", getAllTrainingsController);
router.get("/assigned", getTrainingsAssignedToUserController);
router.get("/assigned/completed", getAssignedCompletedTrainingsController);
router.get("/assigned/incomplete", getAssignedIncompleteTrainingsController);
router.get("/created", getTrainingsAssignedByUserController);
router.get("/completed", getAllCompletedTrainingsController);
router.get("/incomplete", getAllIncompleteTrainingsController);
router.patch("/complete", completeTrainingController);
router.patch("/edit", editTrainingController);
router.delete("/delete", deleteTrainingController);
router.patch("/change-status", changeStatusController);
router.get("/dashboard", getTrainingDashboardController);
router.get("/search", searchTrainingsController);
router.get("/get/count", getHrTrainingHrCountController);

module.exports = router;

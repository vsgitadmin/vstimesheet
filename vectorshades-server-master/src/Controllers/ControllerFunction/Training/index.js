const {
  training: { TrainingModel },
} = require("../../../Models/Extractor/index");

const TRAININGS_PER_PAGE = 3;

const createTraining = (body, user) => {
  try {
    const details = { ...body, assignedBy: user.name, assignedById: user.id };
    const training = new TrainingModel(details);
    return training.save();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getTrainingById = (id) => {
  try {
    return TrainingModel.findById(id);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getAllTrainings = (page) => {
  try {
    page = (page != null && page >= 1 ? page : 1) - 1;
    return TrainingModel.find()
      .limit(TRAININGS_PER_PAGE)
      .skip(page * TRAININGS_PER_PAGE)
      .sort({ dueDate: -1 });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getHrTrainingCount = async () => {
  try {
    return (await TrainingModel.find().count())
  } catch (error) {
    console.error(error);
    throw error;
  }
}

const searchTrainings = async (searchQuery, id) => {
  try {
    // return TrainingModel.aggregate([{
    //   $match: {
    //     $and: [{
    //       $or: [
    //         { assignedTo: { $in: [id] } },
    //         { assignedById: id },
    //       ],
    //     }, {
    //       $or: [
    //         { name: { $regex: searchQuery, $options: "i" } },
    //         { description: { $regex: searchQuery, $options: "i" } },
    //       ],
    //     }],
    //   },
    // }, { $limit: TRAININGS_PER_PAGE }]);
    let trainings = await TrainingModel.find({})
    trainings = trainings.filter((t) => {
      return t.name.toLocaleLowerCase().includes(searchQuery.toLocaleLowerCase()) || t.description.toLocaleLowerCase().includes(searchQuery.toLocaleLowerCase())
    })

    return trainings
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getTrainingsAssignedToUser = (user, page) => {
  try {
    page = (page != null && page >= 1 ? page : 1) - 1;
    return TrainingModel.find({ assignedTo: user.id })
      .limit(TRAININGS_PER_PAGE)
      .skip(page * TRAININGS_PER_PAGE)
      .sort({ dueDate: -1 });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getTrainingsAssignedByUser = (user, page) => {
  try {
    page = (page != null && page >= 1 ? page : 1) - 1;
    return TrainingModel.find({ assignedById: user.id })
      .limit(TRAININGS_PER_PAGE)
      .skip(page * TRAININGS_PER_PAGE)
      .sort({ dueDate: -1 });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getCompletedTrainings = (page, assignedTo = null) => {
  try {
    page = (page != null && page >= 1 ? page : 1) - 1;
    const query = {
      completed: true,
      ...(assignedTo ? { assignedTo } : {}),
    };
    return TrainingModel.find(query)
      .limit(TRAININGS_PER_PAGE)
      .skip(page * TRAININGS_PER_PAGE)
      .sort({ dueDate: -1 });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getIncompleteTrainings = (page, assignedTo = null) => {
  try {
    page = (page != null && page >= 1 ? page : 1) - 1;
    const query = {
      completed: false,
      ...(assignedTo ? { assignedTo } : {}),
    };
    return TrainingModel.find(query)
      .limit(TRAININGS_PER_PAGE)
      .skip(page * TRAININGS_PER_PAGE)
      .sort({ dueDate: -1 });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const completeTraining = (id) => {
  try {
    return TrainingModel.findByIdAndUpdate(id, {
      $set: { completed: true, active: false },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const editTraining = (id, body) => {
  try {
    return TrainingModel.findByIdAndUpdate(id, { $set: body });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const deleteTraining = (id) => {
  try {
    return TrainingModel.deleteOne({ _id: id });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const changeStatus = async (id, status) => {
  try {
    if (status == null) {
      throw { message: "Invalid status: Status must be a boolean" };
    }
    const now = new Date();
    // If the training is active, just store when it became active.
    if (status === true) {
      await TrainingModel.findByIdAndUpdate(id, {
        $set: { active: status, lastActive: now },
      });
      return {};
    }
    // Otherwise, update the time spent on the training too.
    const result = await TrainingModel.findById(id);
    const timeSpent = Math.trunc((now - result.lastActive) / 1000) +
      result.timeSpent;
    await TrainingModel.findByIdAndUpdate(id, {
      $set: { active: status, lastActive: now, timeSpent },
    });
    return {};
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getTrainingDashboard = async (id) => {
  try {
    const [
      completedTrainings,
      incompleteTrainings,
      trainingTypeCounts,
    ] = await Promise.all([
      TrainingModel.find({ assignedTo: id, completed: true })
        .sort({ dueDate: -1 }),
      TrainingModel.find({ assignedTo: id, completed: false })
        .sort({ dueDate: -1 }),
      TrainingModel.aggregate([{ $match: { assignedTo: { $in: [id] } } }])
        .sortByCount("type"),
    ]);
    return {
      completedTrainings,
      incompleteTrainings,
      trainingTypeCounts: trainingTypeCounts.reduce(
        (prev, current) => ({ ...prev, [current._id]: current.count }),
        {},
      ),
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = {
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
  getHrTrainingCount,
  getTrainingDashboard,
};

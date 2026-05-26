const { employee: { employeeModel } } = require('../../Models/Extractor/index');
const { updatePunchInStateFunction } = require('../ControllerFunction/Employees/index');

/**
 * Handles the 'updateID' event from the client.
 * Associates a user with a socket ID. Automatic logout on disconnect is disabled.
 */
const updateSocketId = async ({ user, id }) => {
    await employeeModel.updateOne({ _id: user }, { $set: { socket: id, online: true } });
    await updatePunchInStateFunction({ id: user }, { status: true }).catch((err) => { console.log(err); });
};

const functions = [['updateID', updateSocketId]];

/**
 * Sets up all event listeners for a new socket connection.
 * @param {object} socket - The socket.io socket object.
 */
const establishSocketEvents = (socket) => {
    functions.forEach(([event, func]) => {
        socket.on(event, func);
    });

    socket.on('disconnect', async () => {
        try {
            const emp = await employeeModel.findOne({ socket: socket.id }).select('_id');
            if (emp) {
                console.log(`User ${emp._id} disconnected (socket logout disabled).`);
            }
        } catch (error) {
            console.error('Error during socket disconnect handling:', error);
        }
    });
};

module.exports = establishSocketEvents;

const AsyncLoop = (data, callback, currentIndex = 0) => {
    return new Promise((resolve) => {
        processData(data, callback, currentIndex, resolve);
    });
};

const processData = async (data, callback, currentIndex, onDone) => {
    let obj = data[currentIndex];
    if (obj) {
        await callback(obj);
        processData(data, callback, currentIndex + 1, onDone);
    } else {
        onDone();
    }
};

export default AsyncLoop;

class SocketManager {
    static instance = null;
    io = null;
  
    static getInstance() {
      if (!SocketManager.instance) {
        SocketManager.instance = new SocketManager();
      }
      return SocketManager.instance;
    }
  
    setIo(io) {
      this.io = io;
    }
  
    getIo() {
      return this.io;
    }
  }

module.exports = SocketManager;

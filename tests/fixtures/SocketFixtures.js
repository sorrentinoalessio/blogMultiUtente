import ioClient from 'socket.io-client'

class SocketFixtures {
    resultSynchronizer = {
        _interval: null,
        _i: 0,
        reset() {
            this._i = 0;
            clearInterval(this._interval);
        },
        increment() {
            this._i++;
        },
        get() {
            return this._i;
        },
        async wait(targetCount, maxCount = 10) {
            return new Promise((resolve, reject) => {
                let internalCounter = 0;
                this._interval = setInterval(() => {
                    if (this.get() === targetCount) {
                        this.reset();
                        resolve();
                    }
                    if (internalCounter === maxCount && this.get() < targetCount) {
                        this.reset();
                        reject(false)
                    }
                    internalCounter++;
                }, 200);
            });
        }
    };
    createClient() {
        return ioClient('http://localhost:3001/todolist', {
            transports: ['websocket'],
            autoConnect: false

        });

    }


}
export default new SocketFixtures();

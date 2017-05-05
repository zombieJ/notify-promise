require("setimmediate");

class NotifyPromise {
	promise: Promise<any>;
	done: boolean = false;
	__notifyList: Array<(value: any, index: number) => void> = [];
	__notifyIndex: number = 0;

	constructor(func: ((resolve: Function, reject: Function, notify: Function) => NotifyPromise) | Promise<any>) {
		if (typeof func === 'function') {
			this.promise = new Promise((resolve, reject) => {
				const doOperation = (operate) => (
					(value) => {
						this.done = true;

						setImmediate(() => {
							operate(value);
						});
					}
				);

				func(doOperation(resolve), doOperation(reject), this.doNotify);
			});
		} else {
			this.promise = func;
		}
	}

	then = (onResolve: (value?: any) => NotifyPromise, onReject: (value?: any) => NotifyPromise) => {
		const nextPromise: Promise<any> = this.promise.then(onResolve, onReject);
		const instance = new NotifyPromise(nextPromise);
		instance.__notifyList = this.__notifyList;
		return instance;
	};

	catch = (onReject: (value?: any) => NotifyPromise) => {
		const nextPromise: Promise<any> = this.promise.catch(onReject);
		const instance = new NotifyPromise(nextPromise);
		instance.__notifyList = this.__notifyList;
		return instance;
	};

	doNotify = (message: any) => {
		if (this.done) return;

		setImmediate(() => {
			this.__notifyList.forEach(func => {
				func(message, this.__notifyIndex);
			});

			this.__notifyIndex += 1;
		});
	};

	notify = (func: (value: any, index: number) => void) => {
		const instance = new NotifyPromise(this.promise);
		instance.__notifyList = this.__notifyList;
		instance.__notifyList.push(func);
		return instance;
	};
}

export default NotifyPromise;

import { assert } from 'chai';
import NotifyPromise from '../js/index';

describe('Notify Promise', () => {
	it('normal promise: resolve', () => {
		const promise = new NotifyPromise((resolve) => {
			setTimeout(resolve, 100);
		});

		assert.isTrue(promise instanceof NotifyPromise);

		return promise;
	});

	it('normal promise: reject', () => {
		const promise = new NotifyPromise((resolve, reject) => {
			setTimeout(reject, 100);
		});
		assert.isTrue(promise instanceof NotifyPromise);

		const promise2 = promise.catch(() => {
			return 'good';
		});
		assert.isTrue(promise2 instanceof NotifyPromise);

		const promise3 = promise2.then((value) => {
			assert.equal(value, 'good');
		});
		assert.isTrue(promise3 instanceof NotifyPromise);

		return promise3;
	});

	it.only('notify', () => {
		const promise = new NotifyPromise((resolve, reject, notify) => {
			notify('do notify');
			notify('next notify');
			resolve('done');
			notify('should not notify');
		});
		assert.isTrue(promise instanceof NotifyPromise);

		const promise2 = promise.notify((message, index) => {
			if (index === 0) assert.equal(message, 'do notify');
			if (index === 1) assert.equal(message, 'next notify');
		});
		assert.isTrue(promise2 instanceof NotifyPromise);

		const promise3 = promise2.then((value) => {
			assert.equal(value, 'done');
		});
		assert.isTrue(promise3 instanceof NotifyPromise);

		return promise;
	});
});

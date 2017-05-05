# notify-promise
Wrap `Promise` to support notify.

## Install
```bash
npm install notify-promise
```

### Usage
```javascript
import NotifyPromise from 'notify-promise';
const promise = new NotifyPromise((resolve, reject, notify) => {
	notify('message 1');
	notify({ context: 'this is an object!' });
	resolve();
	notify('notify will not trigger when promise finished');
});
  
promise.then(() => {
	console.log('done');
}).notify((message, index) => {
	console.log(`[${index}] Message:`, message);
});
  
// 'message 1'
// { context: 'this is an object!' }
// 'done'
```

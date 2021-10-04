class Emitter {
	constructor() {
		this.events = {};
	}

	on(event, callback) {
		this.events[event] = this.events[event] || [];
		this.events[event].push(callback);
	}

	emit(event, ...args) {
		if(this.events.hasOwnProperty(event)) {
			this.events[event].forEach(e => e(...args));
		}
	}
}
import EventEmitter from "events";

class App extends EventEmitter {
	#index = 0;
	#prevented = false;
	#history = [];
	#preventBack = 0;
	#preventForward = 0;
	#override = false;

	constructor() {
		super();
		this.#index = isNaN(history.state?.index) ? 0 : history.state.index;
		this.#history[this.#index] = history.state || {
			index: this.#index,
			state: {
				url: location.pathname,
				scrollX: window.scrollX,
				scrollY: window.scrollY,
				data: {}
			}
		};
		window.addEventListener("scroll", () => {
			try {
				this.#history[this.#index].state.scrollX = window.scrollX;
				this.#history[this.#index].state.scrollY = window.scrollY;
				history.replaceState(this.#history[this.#index], "", this.#history[this.#index].state.url);
			} catch {}
		});
		window.addEventListener("popstate", (e) => {
			var _back = false;
			if (!e.state?.index) _back = true;
			else if (e.state.index < this.#index) _back = true;
			else if (e.state.index >= this.#index) _back = false;
			this.#index = e.state?.index ?? 0;
			if (_back && this.preventBack > 0 && this.#override === false) {
				this.#prevented = "back";
				this.forceForward(1);
				return;
			}
			if (!_back && this.preventForward > 0 && this.#override === false) {
				this.#prevented = "forward";
				this.forceBack(1);
				return;
			}
			this.emit("better-state-change", {
				back: this.#prevented === "back" || (this.#prevented !== "forward" && _back === true),
				forward: this.#prevented === "forward" || (this.#prevented !== "back" && _back === false),
				prevented: this.#prevented !== false,
				forced: this.#override === true,
				state: e.state?.state ?? {}
			});
			this.#prevented = false;
			this.#override = false;
		});
	}

	get preventBack() {
		return this.#preventBack > 0;
	}

	set preventBack(v) {
		if (v) this.#preventBack++;
		else this.#preventBack--;
	}

	resetPreventBack() {
		this.#preventBack = 0;
	}

	get preventForward() {
		return this.#preventForward > 0;
	}

	set preventForward(v) {
		if (v) this.#preventForward++;
		else this.#preventForward--;
	}

	resetPreventForward() {
		this.#preventForward = 0;
	}

	get history() {
		return this.#history;
	}

	get state() {
		return this.#history[this.#index].state;
	}

	forceForward = (internal) => {
		this.#override = internal || true;
		history.go(1);
	};

	forceBack = (internal) => {
		this.#override = internal || true;
		history.go(-1);
	};

	replaceState = (url, data) => {
		this.#history[this.#index].state.url = url;
		this.#history[this.#index].state.data = data;
		history.replaceState(this.#history[this.#index], "", this.#history[this.#index].state.url);
		return this.state;
	};

	pushState = (url, data) => {
		this.#history[++this.#index] = {
			index: this.#index,
			state: {
				url: url,
				scrollY: window.scrollY,
				scrollX: window.scrollX,
				data: data
			}
		};
		history.pushState(this.#history[this.#index], "", url);
		return this.state;
	};
}

export default new App();

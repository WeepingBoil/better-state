class App {
	#index = 0;
	#prevented = false;
	#history = [];
	#preventBack = 0;
	#preventForward = 0;
	#override = false;
	#listeners = [];
	#id = 0;
	#lastPop = null;
	verbose = false;

	constructor() {
		if (this.verbose) console.log("better-state");
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
				history.replaceState(this.#history[this.#index], "", location.pathname);
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

			this.#lastPop = {
				back: this.#prevented === "back" || (this.#prevented !== "forward" && _back === true),
				forward: this.#prevented === "forward" || (this.#prevented !== "back" && _back === false),
				prevented: this.#prevented !== false,
				forced: this.#override === true,
				state: e.state?.state ?? {},
				actualState: e
			};

			for (var listener of this.#listeners) {
				listener.fn(this.#lastPop);
			}

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
		return this.#history[this.#index]?.state ?? null;
	}

	get lastPop() {
		return this.#lastPop;
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
		if (data) this.#history[this.#index].state.data = data;
		if (this.verbose) console.log("better-state-replace", this.#history[this.#index], url);

		history.replaceState(this.#history[this.#index], "", url);
		return this.state;
	};

	onPopState = (fn) => {
		this.#listeners.push({ id: ++this.#id, fn: fn });
		return this.#id;
	};

	offPopState = (x) => {
		if (x) this.#listeners.splice(this.#listeners.map((v) => v.id).indexOf(x), 1);
		else this.#listeners = [];
	};

	pushState = (url, data) => {
		this.#history[++this.#index] = {
			index: this.#index,
			state: {
				url: url,
				scrollY: 0,
				scrollX: 0,
				data: data
			}
		};
		if (this.verbose) console.log("better-state-push", this.#history[this.#index], url);
		history.pushState(this.#history[this.#index], "", url);
		return this.state;
	};
}

export default new App();

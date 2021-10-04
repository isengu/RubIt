class RubIt extends Emitter {
	constructor(args) {
		super();
		if(args instanceof Object){
			this.args = args;
		}
		else {
			console.log('Your format is wrong! Please pass arguments in an object.');
		}
		this.build();
		this.style();
		this.init();
		this.pressed = false;
		this.position = [0, 0];
	}

	build() {
		this.el_main = document.createElement('div');
		this.el_main.classList.add('rubit_main');
		this.el_area = document.createElement('div');
		this.el_area.classList.add('rubit_area');
		this.el_container = document.createElement('div');
		this.el_container.classList.add('rubit_container');
		this.el_outer = document.createElement('div');
		this.el_outer.classList.add('rubit_outer');
		this.el_inner = document.createElement('div');
		this.el_inner.classList.add('rubit_inner');

		this.el_outer.appendChild(this.el_inner);
		this.el_container.appendChild(this.el_outer);
		this.el_area.appendChild(this.el_container);
		this.el_main.appendChild(this.el_area);
		if(this.args.container_id) {
			document.getElementById(this.args.container_id).appendChild(this.el_main);
		}
		else {
			document.body.appendChild(this.el_main);
		}
	}

	style() {
		this.el_outer.style.width = `${this.args.outer_rad}px`;
		this.el_outer.style.height = `${this.args.outer_rad}px`;
		this.el_inner.style.width = `${this.args.inner_rad}px`;
		this.el_inner.style.height = `${this.args.inner_rad}px`;
		this.el_inner.style.top = `calc(50% - ${this.args.inner_rad/2}px)`;
		this.el_inner.style.left = `calc(50% - ${this.args.inner_rad/2}px)`;
	}

	init() {
		const _mouseDown = this.mouseDown.bind(this);
		const _mouseMove = this.mouseMove.bind(this);
		const _mouseUp = this.mouseUp.bind(this);
		document.addEventListener('mousedown', _mouseDown);
		document.addEventListener('mousemove', _mouseMove);
		document.addEventListener('mouseup', _mouseUp);

		document.addEventListener('touchstart', _mouseDown);
		document.addEventListener('touchmove', _mouseMove);
		document.addEventListener('touchend', _mouseUp);

		const container = this.el_container.getBoundingClientRect();

		this.center = new Vector(container.left + this.args.outer_rad/2,
								container.top + this.args.outer_rad/2);
		this.inner = new Vector(0, 0);
	}

	dynamic(e) {
		let x, y;
		if(e.changedTouches) {
			y = e.changedTouches[0].pageY;
			x = e.changedTouches[0].pageX;
		}
		else {
			y = e.pageY;
			x = e.pageX;
		}
		const top = y - this.el_main.offsetTop - this.el_container.offsetHeight/2;
		const left = x - this.el_main.offsetLeft - this.el_container.offsetWidth/2;
		this.el_container.style.top = `${top}px`;
		this.el_container.style.left = `${left}px`;

		const container = this.el_container.getBoundingClientRect();
		this.center.set(container.left + this.args.outer_rad/2,
						container.top + this.args.outer_rad/2);
	}

	mouseDown(e) {
		e.preventDefault();
		this.pressed = true;

		if(this.args.type === 'dynamic') this.dynamic(e);
		this.el_inner.style.transition = 'none';
		
		this.mouseMove(e);
	}
	mouseMove(e) {
		e.preventDefault();
		if(this.pressed) {
			let x, y;
			if(e.changedTouches) {
				x = e.changedTouches[0].pageX;
				y = e.changedTouches[0].pageY;
			}
			else {
				x = e.pageX;
				y = e.pageY;
			}

			this.inner.set(x, y);
			const resVec = Vector.sub(this.center, this.inner);
			resVec.limit(this.args.outer_rad/2);
			
			this.el_inner.style.top = `calc(50% - ${resVec.y+this.args.inner_rad/2}px)`;
			this.el_inner.style.left = `calc(50% - ${resVec.x+this.args.inner_rad/2}px)`;

			const moveX = resVec.x / this.args.outer_rad;
			const moveY = resVec.y / this.args.outer_rad;
			
			this.position = [moveX, moveY];
			this.emit('move', moveX, moveY);
		}
	}
	mouseUp(e) {
		e.preventDefault();
		this.pressed = false;
		
		this.el_inner.style.transition = 'all .1s ease-out 0s';
		this.el_inner.style.top = `calc(50% - ${0+this.args.inner_rad/2}px)`;
		this.el_inner.style.left = `calc(50% - ${0+this.args.inner_rad/2}px)`;
		
		this.position = [0, 0];
		this.emit('move', 0, 0);
	}
}
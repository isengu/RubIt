class RubIt extends Emitter {
	constructor(args) {
		super();
		this.args = {
			container_id: args.container_id || false,
			type: args.type || 'dynamic',
			area_width: args.area_width || 'auto',
			area_height: args.area_height || 'auto',
			outer_rad: args.outer_rad || '100px',
			inner_rad: args.inner_rad || '60px',
			outer_bg: args.outer_bg || 'radial-gradient(#56CCF2 0%, #2F80ED 100%)',
			outer_border: args.outer_border || 'none',
			inner_bg: args.inner_bg || 'radial-gradient(#56CCF2 0%, #2F80ED 100%)',
			inner_border: args.inner_border || '1px solid #2F80ED'
		};
		this.build();
		this.stylize();
		this.init();
		this.pressed = false;
	}

	build() {
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
		if(this.args.container_id) {
			document.getElementById(this.args.container_id).appendChild(this.el_area);
		}
		else {
			document.body.appendChild(this.el_area);
		}
	}

	stylize() {
		const area = {
					'position': 'relative',
					// 'overflow': 'hidden',
					'width': this.args.area_width,
					'height': this.args.area_height,
					'box-sizing': 'border-box',
		}
		const container = {
					'position': 'relative',
					'display': 'inline-block',
					'box-sizing': 'border-box',
		}
		const outer = {
					'position': 'relative',
					'display': 'flex',
					'justify-content': 'center',
					'align-items': 'center',
					'border': this.args.outer_border,
					'background': this.args.outer_bg,
					'border-radius': '50%',
					'width': this.args.outer_rad,
					'height': this.args.outer_rad,
					'box-sizing': 'border-box',
		}
		const inner = {
					'position': 'relative',
					'border': this.args.inner_border,
					'background': this.args.inner_bg,
					'border-radius': '50%',
					'width': this.args.inner_rad,
					'height': this.args.inner_rad,
					'box-sizing': 'border-box',
		}
		this.applyStyle(area, this.el_area);
		this.applyStyle(container, this.el_container);
		this.applyStyle(outer, this.el_outer);
		this.applyStyle(inner, this.el_inner);
	}

	applyStyle(styles, element) {
		for(const key in styles) {
			element.style[key] = styles[key];
		}
	}

	init() {
		const _mouseDown = this.mouseDown.bind(this);
		const _mouseMove = this.mouseMove.bind(this);
		const _mouseUp = this.mouseUp.bind(this);
		document.addEventListener('mousedown', _mouseDown);
		document.addEventListener('mousemove', _mouseMove);
		document.addEventListener('mouseup', _mouseUp);
		document.addEventListener('touchstart', _mouseDown);
		document.addEventListener('touchmove', _mouseMove, { passive: false });
		document.addEventListener('touchend', _mouseUp);

		const top = this.el_container.offsetTop;
		const left = this.el_container.offsetLeft;

		this.center = new Vector(left, top);
		this.inner = new Vector(0, 0);
	}
	
	dynamic(e) {
		// pageX and pageY are coords. of mouse relative to the entire document
		// x and y are coords. of mouse relative to the viewport
		let x, y;
		if(e.changedTouches) {
			y = e.changedTouches[0].pageY - window.scrollY;
			x = e.changedTouches[0].pageX - window.scrollX;
		}
		else {
			y = e.pageY - window.scrollY;
			x = e.pageX - window.scrollX;
		}
		const area = this.el_area.getBoundingClientRect();
		const top = y - area.top - this.el_container.offsetHeight / 2;
		const left = x - area.left - this.el_container.offsetWidth / 2;

		this.el_container.style.top = `${top}px`;
		this.el_container.style.left = `${left}px`;

		this.center.set(left, top);
		this.emit('reposition');
	}
	
	mouseDown(e) {
		e.preventDefault();
		this.pressed = true;

		if(this.args.type === 'dynamic') this.dynamic(e);
		this.el_inner.style.transition = 'none';
		
		this.mouseMove(e);
		this.emit('press');
	}

	mouseMove(e) {
		e.preventDefault();
		if(this.pressed) {
			// pageX and pageY are coords. of mouse relative to the entire document
			// x and y are coords. of mouse relative to the viewport
			let x, y;
			if (e.changedTouches) {
				y = e.changedTouches[0].pageY - window.scrollY;
				x = e.changedTouches[0].pageX - window.scrollX;
			}
			else {
				y = e.pageY - window.scrollY;
				x = e.pageX - window.scrollX;
			}
			const area = this.el_area.getBoundingClientRect();
			const container = this.el_container.getBoundingClientRect();
			const top = y - area.top - container.height / 2;
			const left = x - area.left - container.width / 2;
			
			this.inner.set(left, top);
			const resVec = Vector.sub(this.inner, this.center)
										.limit(container.width / 2);
			
			this.el_inner.style.top = `${resVec.y}px`;
			this.el_inner.style.left = `${resVec.x}px`;

			const moveX = resVec.x / (container.width / 2);
			const moveY = -resVec.y / (container.height / 2);
			const data = {
				x: moveX,
				y: moveY,
				distance: Math.sqrt(moveX ** 2 + moveY ** 2),
				angle: Math.atan2(moveY, moveX) * 180 / Math.PI
			}
			
			this.emit('move', data);
		}
	}

	mouseUp(e) {
		e.preventDefault();
		this.pressed = false;
		
		this.el_inner.style.transition = 'all .1s ease-out 0s';
		this.el_inner.style.top = `0px`;
		this.el_inner.style.left = `0px`;
		
		this.emit('move', {
			x: 0,
			y: 0,
			distance: 0,
			angle: 0
		});
		this.emit('release');
	}
}
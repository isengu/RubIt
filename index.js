const rub_it = new RubIt({
					container_id: 'joy',
					type: 'dynamic',
					area_width: 300,
					area_height: 300,
					outer_rad: 100,
					inner_rad: 60,
				});

rub_it.on('move', update);

function update(x, y) {
	document.getElementById('pos').innerHTML = `x: ${x}	y: ${y}`;
}
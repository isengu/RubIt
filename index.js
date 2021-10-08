const rubit = new RubIt({
	container_id: 'container',
	type: 'dynamic',
	area_width: 'auto',
	area_height: 'auto',
	outer_rad: '100px',
	inner_rad: '60px',
	outer_bg: 'radial-gradient(#56CCF2 0%, #2F80ED 100%)',
	outer_border: 'none',
	inner_bg: 'radial-gradient(#56CCF2 0%, #2F80ED 100%)',
	inner_border: '1px solid #2F80ED'
});

rubit.on('move', update);

function update(data) {
	document.getElementById('pos').innerHTML = `X: ${data.x}	Y: ${data.y}`;
	console.log(data);
}
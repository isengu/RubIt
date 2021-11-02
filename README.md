# RubIt

RubIt `/rʌbɪt/` is a virtual joystick for web apps.

## Demo

[Check it out](https://dolmushcu.github.io/RubIt/)

## How to use

First of all you should add the js library to your page. `rubit.min.js` is the minified version of the library, you could use it.

```html
<script type="text/javascript" src="rubit.min.js"></script>
```

After that add the container which will contain the joystick. Container must have an `id` that you will pass as an argument when defining the joystick.

```html
<div id="container_id"></div>
```

Than you can define the joystick. Options that are passed when defining the joystick will be explained in the following sections.

```javascript
const rubit = new RubIt({
  container_id: 'container_id',
  type: 'dynamic',
  area_width: '300px',
  area_height: '300px',
  outer_rad: '100px',
  inner_rad: '60px',
  outer_bg: 'radial-gradient(#56CCF2 0%, #2F80ED 100%)',
  outer_border: 'none',
  inner_bg: 'radial-gradient(#56CCF2 0%, #2F80ED 100%)',
  inner_border: '1px solid #2F80ED'
});
```

Now you can specify a callback to be called on a certain event. Events will be explained in the following sections.

```javascript
rubit.on('move', function(data) {
  console.log(`x: ${data.x}, y: ${data.y}`);
});
```

## Options
These are the options that are passed when defining the joystick.

- `container_id` is the id of the element which contains the joystick.
- `type` indicates the type of joystick.
    - static : The joystick is stationary.
    - dynamic : The joystick is repositioning every time the user starting a touch. 
- `area_width` is the width of the area that the joystick is constrained with.
- `area_height` is the height of the area that the joystick is constrained with.
- `outer_rad` is the radius of outer circle of joystick.
- `inner_rad` is the radius of inner circle of joystick.
- `outer_bg` is the background of outer circle of joystick.
- `outer_border` is the border of outer circle of joystick.
- `inner_bg` is the background of inner circle of joystick.
- `inner_border` is the border of inner circle of joystick.

P.S. Options that are related to css passed directly. So you should pass values of those (like `width` and `height`) as a string and put unit values like `px, em, ...`

Here is a sample on how should option values be:

```javascript
{
  container_id: 'container_id',
  type: 'dynamic',
  area_width: '300px',
  area_height: '300px',
  outer_rad: '100px',
  inner_rad: '60px',
  outer_bg: 'radial-gradient(#56CCF2 0%, #2F80ED 100%)',
  outer_border: 'none',
  inner_bg: 'radial-gradient(#56CCF2 0%, #2F80ED 100%)',
  inner_border: '1px solid #2F80ED'
}
```

## Events
Events are used for invoke a callback when a certain event happend. Let's say you want to add a callback when user moves the joystick, you can do it with `on` method. Exp: `rubit.on('move', callback)`

### Move
It's fired when user moves the sliding part of the joystick. Callback is invoked with an argument like below:
```
{
  distance: normalized distance between center of the joystick and the sliding part of it,
  x: x coord. of distance,
  y: y coord. of distance,
  angle: heading angle of sliding part of joystick
}
```

### Press
It's fired when user starts a new touch.

### Release
It's fired when user release a touch.

### Reposition
It's fired when joystick repositioned.

## TODO
- [ ] Keyboard controls
- [ ] Multiple joystick support
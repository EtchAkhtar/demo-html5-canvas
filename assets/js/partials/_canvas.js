/*
 * Author: Etch Akhtar
 * Version: 1.0
 * Created Date: 23rd July 2016
 * Copyright (c) Etch Akhtar
 *
 * Canvas related
 */

$(document).ready(function() {

	var line, isDown, isMoving, mode, addedLine;
	var canvas = new fabric.Canvas('canvas');
	canvas.perPixelTargetFind = true;
	canvas.targetFindTolerance = 4;

	/*
	 *  Make delete button delete selected objects
	 */
	$('html').keyup(function(e){
	    if(e.keyCode === 46 || e.keyCode === 8) {
	        deleteSelectedObjects(true);
	    }
	});

	/*
	 * Trap menu button click events
	 */
	$('.menu').click(function() {
		// Set all to off and only enable this one
		$('.menu').removeClass('on');
		$(this).addClass('on');
	});

	$('#select').click(function() {
		mode='select';
		makeSelectable(true);
	});

	$('#draw').click(function() {
		mode='draw';
		makeSelectable(false);
	});

	$('#deleteSelected').click(function() {
		deleteSelectedObjects();
	});

	$('#deleteAll').click(function() {
		deleteAllObjects();
	});

	/*
	 * Initialize the pointer on mouse down
	 */
	canvas.on('mouse:down', function(o) {
		isDown = true;
		isMoving = false;
		var pointer = canvas.getPointer(o.e);
		var points = [ pointer.x, pointer.y, pointer.x, pointer.y ];

		if(mode === 'draw') {
			// Setup line but don't draw unless we are sure this isn't a text element
			line = new fabric.Line(points, {
				strokeWidth: 2,
				stroke: $("#colorpicker").spectrum("get"),
				originX: 'center',
				originY: 'center',
			    selectable: false
			});

			addedLine = false;
		}
	});

	/*
	 * Draw the line and update canvas in real-time
	 */
	canvas.on('mouse:move', function(o) {
		if (!isDown) { return; }
		isMoving = true;
		var pointer = canvas.getPointer(o.e);

		if (mode === 'draw') {
			if (!addedLine) {
				canvas.add(line); // TODO: Even if adding only text element, a line is added to canvas we'll never see, FIX THIS
				addedLine = true;
			}
			line.set({ x2: pointer.x, y2: pointer.y });
			canvas.renderAll();
		}
	});

	/*
	 * Draw either line or text depending on if mouse was moved, save state to local storage
	 * For text, ask user what text and draw arrow marker
	 */
	canvas.on('mouse:up', function(o) {
		if (isMoving && mode === 'draw') {
			// Line
			// make sure we're in drawing mode, because if reloading browser and 1st action is moving object, line wont exist
			line.setCoords();
		}
		else if (mode === 'draw') {
			// Text
			var txt = prompt('Add text');

			if (txt !== null && txt !== '') {
				var pointer = canvas.getPointer(o.e);
				var text = new fabric.Text(txt, {
					left: pointer.x - 25,
					top: pointer.y - 50,
					fontSize: 20,
					fill: $("#colorpicker").spectrum("get"),
				    selectable: false
				});
				canvas.add(text);

				_createLineArrow([pointer.x - 50, pointer.y - 50, pointer.x - 5, pointer.y - 5]);
			}
		}

		save();
		isDown = false;
		isMoving = false;
	});

	/*
	 * Create line for arrow head
	 */
	function _createLineArrow(points) {
		var line = new fabric.Line(points, {
			strokeWidth: 5,
			stroke: '#7db9e8',
			originX: 'center',
			originY: 'center',
			selectable: false
		});

		var triangle = _createArrowHead(points);

		var group = new fabric.Group([ line, triangle ], {
			selectable: false
		});

		canvas.add(group);
		canvas.renderAll();
	}

	/*
	 * Return a triangle head for the arrow
	 */
	function _createArrowHead(points) {
		var headLength = 15,

			x1 = points[0],
			y1 = points[1],
			x2 = points[2],
			y2 = points[3],

			dx = x2 - x1,
			dy = y2 - y1,

			angle = Math.atan2(dy, dx);

		angle *= 180 / Math.PI;
		angle += 90;

		var triangle = new fabric.Triangle({
			angle: angle,
			fill: '#207cca',
			top: y2,
			left: x2,
			height: headLength,
			width: headLength,
			originX: 'center',
			originY: 'center',
			selectable: false
		});

		return triangle;
	}

	/*
	 * Remove all selected objects from the canvas and save state to local storage
	 */
	function deleteSelectedObjects(delButton) {
		var activeObject = canvas.getActiveObject(), activeGroup = canvas.getActiveGroup();
		if (activeObject && confirm('Are you sure you want to delete the selected object')) {
			canvas.remove(activeObject);
			save();
		}
		else if (activeGroup && confirm('Are you sure you want to delete the selected objects?')) {
			var objectsInGroup = activeGroup.getObjects();
			canvas.discardActiveGroup();

			objectsInGroup.forEach(function(object) {
				canvas.remove(object);
			});
			save();
		}
		else if (!delButton) {
			// Don't show this if we are deleting with the keyboard
			alert('There are no objects selected');
		}

	}

	/*
	 * Clear the canvas and save state to local storage
	 */
	function deleteAllObjects() {
		var objects = canvas.getObjects();
		if (!objects.length) {
			alert('There are no objects to delete');
		}
		else if (confirm('Are you sure you want to delete all objects?')) {
			canvas.clear();
			save();
		}
	}

	/*
	 * Enable/disable the ability to select objects depending on which mode we're in
	 */
	function makeSelectable(selectable) {
		canvas.selection = selectable;
		canvas.forEachObject(function(o) {
			o.selectable = selectable;
		});

		if (!selectable) {
			canvas.deactivateAll(); // Unhighlight any selections
		}

		canvas.renderAll();
	}

	/*
	 * Save state to local storage
	 */
	function save() {
		var json = JSON.stringify(canvas);
		localStorage.canvasApp = json;
	}

	/*
	 * Load state from local storage
	 */
	function load() {
		canvas.loadFromJSON(localStorage.canvasApp);
		canvas.renderAll();
	}


	/*
	 * initialize our canvas
	 */
	load(); // Load from LocalStorage
	$('#draw').click(); // Start from drawing mode

});

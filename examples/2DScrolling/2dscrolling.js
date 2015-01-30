'use strict';

/*
Copyright 2015 Ralph Thomas

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

//
// 2D scrolling is interesting because we need to use one simulation for
// motion under friction. If we tried to use two simulations (one for x
// and one for y) then motion along one axis would stop before motion
// along the other.
//
// So we create one Friction simulation with the full velocity and then
// wrap it with objects that extract the x and y components out.
//
function ExtractAxis(simulation, multiplier, start) {
    this._simulation = simulation;
    this._multiplier = multiplier;
    this._startX = start;
}
ExtractAxis.prototype.x = function(dt) {
    return this._startX + this._simulation.x(dt) * this._multiplier;
}
ExtractAxis.prototype.dx = function() {
    return this._simulation.dx() * this._multiplier;
}
ExtractAxis.prototype.done = function() { return this._simulation.done(); }

function TwoDScrollingDemo(element) {
    var largeScrollableLayer = document.createElement('div');
    largeScrollableLayer.className = 'large-scrollable-layer';

    element.appendChild(largeScrollableLayer);

    this._largeScrollableLayer = largeScrollableLayer;
    this._x = 0;
    this._y = 0;
    this._update();

    // For this example we use Hammer.js to provide gesture input. It breaks
    // out separate x and y velocity and is composable (where the toy touch.js
    // abstraction isn't).
    var hammer = new Hammer.Manager(element);
    hammer.add(new Hammer.Pan({ direction: Hammer.DIRECTION_ALL }));
    hammer.on("panstart panmove panend pancancel", this.onPan.bind(this));
}
TwoDScrollingDemo.prototype.onPan = function(e) {
    e.preventDefault();
    if (e.type == 'panstart') {
        if (this._animation) {
            this._animation.cancel();
            this._animation = null;
        }
        this._startX = this._x;
        this._startY = this._y;
        // Hammer reports the delta from the mousedown position, not from when it decides
        // to issue a panstart which gives us a discontinuity. So remember the delta here
        // so we can offset it.
        this._triggerDeltaX = e.deltaX;
        this._triggerDeltaY = e.deltaY;
    } else if (e.type == 'panmove') {
        this._x = this._startX + e.deltaX - this._triggerDeltaX;
        this._y = this._startY + e.deltaY - this._triggerDeltaY;
        this._update();
    } else if (e.type == 'panend') {
        // Create a new friction simulation
        var simulation = new Gravitas.Friction(0.001);
        simulation.set(0, e.velocity * -1000);
        // Wrap the simulation with the two objects that are going to extract
        // the x and y values for us.
        this._xSimulation = new ExtractAxis(simulation, e.velocityX / e.velocity, this._x);
        this._ySimulation = new ExtractAxis(simulation, e.velocityY / e.velocity, this._y);

        this._animation = Gravitas.createAnimation(simulation, this._update.bind(this));
    }
}
TwoDScrollingDemo.prototype._update = function() {
    if (this._animation) {
        this._x = this._xSimulation.x();
        this._y = this._ySimulation.x();
    }
    // Assign the position to the scrolling layer.
    this._largeScrollableLayer.style.transform = 'translate3D(' + this._x + 'px, ' + this._y + 'px, 0)';
}

window.addEventListener('load', function() { new TwoDScrollingDemo(document.getElementById('2DScrollingExample')); }, false);

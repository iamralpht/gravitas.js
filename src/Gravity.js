'use strict';
/*
Copyright 2014 Ralph Thomas

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

/***
 * Gravity physics simulation. This actually just simulates
 * Newton's second law, F=ma integrated to x' = x + v*t + 0.5*a*t*t.
 *
 * Note that gravity is never done, so we pass in an explicit termination point beyond which we
 * declare ourselves "done".
 */
function Gravity(acceleration, terminate) {
    this._acceleration = acceleration;
    this._terminate = terminate;

    this._x = 0;
    this._v = 0;
    this._a = acceleration;
    this._startTime = 0;
}
Gravity.prototype.set = function(x, v) {
    this._x = x;
    this._v = v;
    this._startTime = (new Date()).getTime();
}
Gravity.prototype.x = function(dt) {
    var t = (new Date()).getTime();
    if (dt == undefined) dt = (t - this._startTime) / 1000.0;
    return this._x + this._v * dt + 0.5 * this._a * dt * dt;
}
Gravity.prototype.dx = function() {
    var t = (new Date()).getTime();
    var dt = (t - this._startTime) / 1000.0;

    return this._v + dt * this._a;
}
Gravity.prototype.done = function() {
    return Math.abs(this.x()) > this._terminate;
}
Gravity.prototype.reconfigure = function(a) {
    this.set(this.x(), this.dx());
    this._a = a;
}
Gravity.prototype.configuration = function() {
    var self = this;
    return [
        { label: 'Acceleration', read: function() { return self._a; }, write: this.reconfigure.bind(this), min: -3000, max: 3000 }
    ];
}

module.exports = Gravity;


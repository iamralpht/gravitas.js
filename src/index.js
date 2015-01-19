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

var Gravitas = {
    // Basic essentials.
    Spring: require('./Spring.js'),
    Gravity: require('./Gravity.js'),
    Friction: require('./Friction.js'),
    // Composites.
    GravityWithBounce: require('./GravityWithBounce.js'),
    Fall: require('./Fall.js'),
    // Utilities
    createAnimation: require('./CreateAnimation.js')
}

module.exports = Gravitas;

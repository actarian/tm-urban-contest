/**
 * @license tm-urban-contest v1.0.0
 * (c) 2021 Luca Zampetti <lzampetti@gmail.com>
 * License: MIT
 */

(function(f){typeof define==='function'&&define.amd?define(f):f();}((function(){'use strict';function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}var UrbanEnter = /*#__PURE__*/function () {
  function UrbanEnter(node) {
    this.node = node;
    this.currentStep = 0;
    this.onScroll = this.onScroll.bind(this);
    window.addEventListener('scroll', this.onScroll);
    this.onScroll();
  }

  var _proto = UrbanEnter.prototype;

  _proto.destroy = function destroy() {
    window.removeEventListener('scroll', this.onScroll);
  };

  _proto.onScroll = function onScroll() {
    var h = window.innerHeight;
    var node = this.node;
    var rect = node.getBoundingClientRect();
    var pow = Math.max(0, Math.min(1, 1 - (rect.top - h / 2) / (h / 2)));

    if (pow > 0) {
      node.classList.add('enter');
    } else {
      node.classList.remove('enter');
    }
  };

  UrbanEnter.init = function init() {
    return this.items = Array.prototype.slice.call(document.querySelectorAll('[urban-enter]')).map(function (node) {
      return new UrbanEnter(node);
    });
  };

  UrbanEnter.destroy = function destroy() {
    return this.items.forEach(function (item) {
      return item.destroy();
    });
  };

  return UrbanEnter;
}();

_defineProperty(UrbanEnter, "items", []);var UrbanForm = /*#__PURE__*/function () {
  function UrbanForm(node) {
    var _this = this;

    this.node = node;
    this.currentStep = 0;
    this.onNext = this.onNext.bind(this);
    this.onPrev = this.onPrev.bind(this);
    var steps = this.steps = Array.prototype.slice.call(node.querySelectorAll('.steps__item'));
    var nexts = this.nexts = Array.prototype.slice.call(node.querySelectorAll('.btn--next'));
    nexts.forEach(function (next) {
      next.addEventListener('click', _this.onNext);
    });
    var prevs = this.prevs = Array.prototype.slice.call(node.querySelectorAll('.btn--prev'));
    prevs.forEach(function (prev) {
      prev.addEventListener('click', _this.onPrev);
    });
    this.update();
  }

  var _proto = UrbanForm.prototype;

  _proto.destroy = function destroy() {
    var _this2 = this;

    var nexts = this.nexts;
    nexts.forEach(function (next) {
      next.removeEventListener('click', _this2.onNext);
    });
    var prevs = this.prevs;
    prevs.forEach(function (prev) {
      prev.removeEventListener('click', _this2.onPrev);
    });
  };

  _proto.update = function update() {
    var _this3 = this;

    this.steps.forEach(function (step, i) {
      i === _this3.currentStep ? step.classList.add('active') : step.classList.remove('active');
    });
  };

  _proto.onNext = function onNext() {
    if (this.currentStep < 3) {
      this.currentStep++;
    }

    this.update();
  };

  _proto.onPrev = function onPrev() {
    if (this.currentStep > 0) {
      this.currentStep--;
    }

    this.update();
  };

  UrbanForm.init = function init() {
    return this.items = Array.prototype.slice.call(document.querySelectorAll('[urban-form]')).map(function (node) {
      return new UrbanForm(node);
    });
  };

  UrbanForm.destroy = function destroy() {
    return this.items.forEach(function (item) {
      return item.destroy();
    });
  };

  return UrbanForm;
}();

_defineProperty(UrbanForm, "items", []);var UrbanVideo = /*#__PURE__*/function () {
  function UrbanVideo(node) {
    this.node = node;
    this.onClick = this.onClick.bind(this);
    node.addEventListener('click', this.onClick);
  }

  var _proto = UrbanVideo.prototype;

  _proto.destroy = function destroy() {
    var node = this.node;
    node.removeEventListener('click', this.onClick);
  };

  _proto.onClick = function onClick() {
    var node = this.node;
    var video = node.querySelector('video');

    if (video.paused) {
      video.play();
      node.classList.add('playing');
    } else {
      video.pause();
      node.classList.remove('playing');
    }
  };

  UrbanVideo.init = function init() {
    return this.items = Array.prototype.slice.call(document.querySelectorAll('[urban-video]')).map(function (node) {
      return new UrbanVideo(node);
    });
  };

  UrbanVideo.destroy = function destroy() {
    return this.items.forEach(function (item) {
      return item.destroy();
    });
  };

  return UrbanVideo;
}();

_defineProperty(UrbanVideo, "items", []);document.addEventListener('DOMContentLoaded', function () {
  var enters = UrbanEnter.init();
  var forms = UrbanForm.init();
  var videos = UrbanVideo.init();
});
/*
// FORM WIZARD

const steps = Array.prototype.slice.call(document.querySelectorAll('.steps__item'));

let currentStep = -1;

const onUpdateStep = () => {
	steps.forEach((step, i) => {
		i === currentStep ? step.classList.add('active') : step.classList.remove('active');
	});
}

const onNextStep = () => {
	if (currentStep < 3) {
		currentStep++;
	}
	onUpdateStep();
}

const onPrevStep = () => {
	if (currentStep > 0) {
		currentStep--;
	}
	onUpdateStep();
}

const nexts = Array.prototype.slice.call(document.querySelectorAll('.btn--next'));
nexts.forEach(next => {
	next.addEventListener('click', onNextStep);
});

const prevs = Array.prototype.slice.call(document.querySelectorAll('.btn--prev'));
prevs.forEach(prev => {
	prev.addEventListener('click', onPrevStep);
});

onNextStep();
*/})));
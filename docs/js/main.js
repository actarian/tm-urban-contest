/**
 * @license tm-urban-contest v1.0.0
 * (c) 2021 Luca Zampetti <lzampetti@gmail.com>
 * License: MIT
 */

(function(g,f){typeof exports==='object'&&typeof module!=='undefined'?f(require('rxcomp'),require('rxcomp-form'),require('rxjs/operators'),require('rxjs')):typeof define==='function'&&define.amd?define(['rxcomp','rxcomp-form','rxjs/operators','rxjs'],f):(g=typeof globalThis!=='undefined'?globalThis:g||self,f(g.rxcomp,g.rxcomp.form,g.rxjs.operators,g.rxjs));}(this,(function(rxcomp, rxcompForm, operators, rxjs){'use strict';function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
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
}

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  subClass.__proto__ = superClass;
}

function _readOnlyError(name) {
  throw new Error("\"" + name + "\" is read-only");
}var AppComponent = /*#__PURE__*/function (_Component) {
  _inheritsLoose(AppComponent, _Component);

  function AppComponent() {
    return _Component.apply(this, arguments) || this;
  }

  var _proto = AppComponent.prototype;

  _proto.onInit = function onInit() {
    var _getContext = rxcomp.getContext(this),
        node = _getContext.node;

    node.classList.remove('hidden');
  };

  return AppComponent;
}(rxcomp.Component);
AppComponent.meta = {
  selector: '[app-component]'
};var DROPDOWN_ID = 1000000;
var DropdownDirective = /*#__PURE__*/function (_Directive) {
  _inheritsLoose(DropdownDirective, _Directive);

  function DropdownDirective() {
    return _Directive.apply(this, arguments) || this;
  }

  var _proto = DropdownDirective.prototype;

  _proto.onInit = function onInit() {
    var _this = this;

    var _getContext = rxcomp.getContext(this),
        node = _getContext.node;

    var trigger = node.getAttribute('dropdown-trigger');
    this.trigger = trigger ? node.querySelector(trigger) : node;
    this.opened = null;
    this.onClick = this.onClick.bind(this);
    this.onDocumentClick = this.onDocumentClick.bind(this);
    this.openDropdown = this.openDropdown.bind(this);
    this.closeDropdown = this.closeDropdown.bind(this);
    this.addListeners();
    DropdownDirective.dropdown$.pipe(operators.takeUntil(this.unsubscribe$)).subscribe(function (id) {
      // console.log('DropdownDirective', id, this['dropdown-item']);
      if (_this.id === id) {
        node.classList.add('dropped');
      } else {
        node.classList.remove('dropped');
      }
    });
  };

  _proto.onClick = function onClick(event) {
    var _getContext2 = rxcomp.getContext(this),
        node = _getContext2.node;

    if (this.opened === null) {
      this.openDropdown();
    } else {
      var dropdownItemNode = node.querySelector('[dropdown-item]'); // console.log('dropdownItemNode', dropdownItemNode);

      if (!dropdownItemNode) {
        // if (this.trigger !== node) {
        this.closeDropdown();
      }
    }
  };

  _proto.onDocumentClick = function onDocumentClick(event) {
    var _getContext3 = rxcomp.getContext(this),
        node = _getContext3.node;

    var clickedInside = node === event.target || node.contains(event.target);

    if (!clickedInside) {
      this.closeDropdown();
    }
  };

  _proto.openDropdown = function openDropdown() {
    if (this.opened === null) {
      this.opened = true;
      this.addDocumentListeners();
      DropdownDirective.dropdown$.next(this.id);
      this.dropped.next(this.id);
    }
  };

  _proto.closeDropdown = function closeDropdown() {
    if (this.opened !== null) {
      this.removeDocumentListeners();
      this.opened = null;

      if (DropdownDirective.dropdown$.getValue() === this.id) {
        DropdownDirective.dropdown$.next(null);
        this.dropped.next(null);
      }
    }
  };

  _proto.addListeners = function addListeners() {
    this.trigger.addEventListener('click', this.onClick);
  };

  _proto.addDocumentListeners = function addDocumentListeners() {
    document.addEventListener('click', this.onDocumentClick);
  };

  _proto.removeListeners = function removeListeners() {
    this.trigger.removeEventListener('click', this.onClick);
  };

  _proto.removeDocumentListeners = function removeDocumentListeners() {
    document.removeEventListener('click', this.onDocumentClick);
  };

  _proto.onDestroy = function onDestroy() {
    this.removeListeners();
    this.removeDocumentListeners();
  };

  DropdownDirective.nextId = function nextId() {
    return DROPDOWN_ID++;
  };

  _createClass(DropdownDirective, [{
    key: "id",
    get: function get() {
      return this.dropdown || this.id_ || (this.id_ = DropdownDirective.nextId());
    }
  }]);

  return DropdownDirective;
}(rxcomp.Directive);
DropdownDirective.meta = {
  selector: '[dropdown]',
  inputs: ['dropdown', 'dropdown-trigger'],
  outputs: ['dropped']
};
DropdownDirective.dropdown$ = new rxjs.BehaviorSubject(null);var DropdownItemDirective = /*#__PURE__*/function (_Directive) {
  _inheritsLoose(DropdownItemDirective, _Directive);

  function DropdownItemDirective() {
    return _Directive.apply(this, arguments) || this;
  }

  var _proto = DropdownItemDirective.prototype;

  _proto.onInit = function onInit() {
    var _this = this;

    var _getContext = rxcomp.getContext(this),
        node = _getContext.node;

    node.classList.add('dropdown-item');
    DropdownDirective.dropdown$.pipe(operators.takeUntil(this.unsubscribe$)).subscribe(function (id) {
      // console.log('DropdownItemDirective', id, this['dropdown-item']);
      if (_this.id === id) {
        node.classList.add('dropped');
      } else {
        node.classList.remove('dropped');
      }
    });
  };

  _createClass(DropdownItemDirective, [{
    key: "id",
    get: function get() {
      return this['dropdown-item'];
    }
  }]);

  return DropdownItemDirective;
}(rxcomp.Directive);
DropdownItemDirective.meta = {
  selector: '[dropdown-item], [[dropdown-item]]',
  inputs: ['dropdown-item']
};var Utils = /*#__PURE__*/function () {
  function Utils() {}

  Utils.merge = function merge(target, source) {
    var _this = this;

    if (typeof source === 'object') {
      Object.keys(source).forEach(function (key) {
        var value = source[key];

        if (typeof value === 'object' && !Array.isArray(value)) {
          target[key] = _this.merge(target[key], value);
        } else {
          target[key] = value;
        }
      });
    }

    return target;
  };

  return Utils;
}();var environmentServed = {
  flags: {
    production: true
  },
  markets: ['IT', 'EU', 'AM', 'AS', 'IN'],
  defaultMarket: 'IT',
  currentMarket: 'IT',
  languages: ['it', 'en', 'de', 'ch'],
  defaultLanguage: 'it',
  currentLanguage: 'it',
  api: '/Client/docs/api',
  assets: '/Client/docs/',
  workers: {
    image: '/Client/docs/js/workers/image.service.worker.js',
    prefetch: '/Client/docs/js/workers/prefetch.service.worker.js'
  },
  githubDocs: 'https://raw.githubusercontent.com/actarian/giorgetti/main/docs/',
  slug: {
    configureProduct: "/Client/docs/products-configure.html",
    reservedArea: "/Client/docs/reserved-area.html"
  },
  template: {
    modal: {
      userModal: '/template/modals/user-modal.cshtml',
      projectsRegistrationModal: '/template/modals/projects-registration-modal.cshtml',
      materialsModal: '/template/modals/materials-modal.cshtml',
      marketsAndLanguagesModal: '/template/modals/markets-and-languages-modal.html'
    }
  },
  googleMaps: {
    apiKey: 'AIzaSyDvGw6iAoKdRv8mmaC9GeT-LWLPQtA8p60'
  },
  thron: {
    clientId: ''
  }
};var environmentStatic = {
  flags: {
    production: false
  },
  markets: ['IT', 'EU', 'AM', 'AS', 'IN'],
  defaultMarket: 'IT',
  currentMarket: 'IT',
  languages: ['it', 'en', 'de', 'ch'],
  defaultLanguage: 'it',
  currentLanguage: 'it',
  api: '/giorgetti/api',
  assets: '/giorgetti/',
  workers: {
    image: './js/workers/image.service.worker.js',
    prefetch: './js/workers/prefetch.service.worker.js'
  },
  githubDocs: 'https://raw.githubusercontent.com/actarian/giorgetti/main/docs/',
  slug: {
    configureProduct: "/giorgetti/products-configure.html",
    reservedArea: "/giorgetti/reserved-area.html"
  },
  template: {
    modal: {
      userModal: '/giorgetti/user-modal.html',
      projectsRegistrationModal: '/giorgetti/projects-registration-modal.html',
      materialsModal: '/giorgetti/materials-modal.html',
      marketsAndLanguagesModal: '/giorgetti/markets-and-languages-modal.html'
    }
  },
  googleMaps: {
    apiKey: 'AIzaSyAIsa4g8z-HPPwohsf8jzVTbKw-DiI8k5w'
  },
  thron: {
    clientId: ''
  }
};var NODE = typeof module !== 'undefined' && module.exports;
var PARAMS = NODE ? {
  get: function get() {}
} : new URLSearchParams(window.location.search);
var DEBUG =  PARAMS.get('debug') != null;
var BASE_HREF = NODE ? null : document.querySelector('base').getAttribute('href');
var HEROKU = NODE ? false : window && window.location.host.indexOf('herokuapp') !== -1;
var STATIC = NODE ? false : HEROKU || window && (window.location.port === '48481' || window.location.port === '5000' || window.location.port === '6443' || window.location.host === 'actarian.github.io');
var DEVELOPMENT = NODE ? false : window && ['localhost', '127.0.0.1', '0.0.0.0'].indexOf(window.location.host.split(':')[0]) !== -1;
var PRODUCTION = !DEVELOPMENT;
var ENV = {
  STATIC: STATIC,
  DEVELOPMENT: DEVELOPMENT,
  PRODUCTION: PRODUCTION
};
var Environment = /*#__PURE__*/function () {
  var _proto = Environment.prototype;

  _proto.getAbsoluteUrl = function getAbsoluteUrl(path, params) {
    var url = "" + window.location.origin + path; // let url = `${window.location.protocol}//${window.location.host}${path}`;

    Object.keys(params).forEach(function (key) {
      url = url.replace("$" + key, params[key]);
    });
    return url;
  };

  _proto.getPath = function getPath(path) {
    return this.isLocal(path) ? this.href + path : path;
  };

  _proto.isLocal = function isLocal(path) {
    return path.indexOf('://') === -1;
  };

  _createClass(Environment, [{
    key: "STATIC",
    get: function get() {
      return ENV.STATIC;
    },
    set: function set(STATIC) {
      ENV.STATIC = STATIC === true || STATIC === 'true';
      console.log('Environment.STATIC.set', ENV.STATIC);
    }
  }, {
    key: "href",
    get: function get() {
      if (HEROKU) {
        return this.githubDocs;
      } else {
        return BASE_HREF;
      }
    }
  }]);

  function Environment(options) {
    if (options) {
      Object.assign(this, options);
    }
  }

  return Environment;
}();
var defaultOptions = {
  port: 5000,
  flags: {
    production: false,
    heroku: HEROKU
  },
  slug: {},
  markets: ['IT', 'EU', 'AM', 'AS', 'IN'],
  defaultMarket: 'IT',
  currentMarket: 'IT',
  languages: ['it', 'en'],
  defaultLanguage: 'it',
  currentLanguage: 'it',
  labels: {
    select: 'Seleziona',
    browse: 'Sfoglia',
    cancel: 'Annulla',
    error_email: 'Email non valida',
    error_match: 'I campi non corrispondono',
    error_required: 'Campo obbligatorio',
    loading: 'caricamento',
    remove: 'Rimuovi',
    required: 'Richiesto',
    select_file: 'Seleziona il file',
    update: 'Aggiorna',
    upload: 'Carica',
    drag_and_drop_images: 'Drag And Drop your images here'
  }
};
var environmentOptions = window.STATIC ? environmentStatic : environmentServed;
var options = Object.assign(defaultOptions, environmentOptions);
options = Utils.merge(options, window.environment);
var environment = new Environment(options);
console.log('environment', environment);var EnvPipe = /*#__PURE__*/function (_Pipe) {
  _inheritsLoose(EnvPipe, _Pipe);

  function EnvPipe() {
    return _Pipe.apply(this, arguments) || this;
  }

  EnvPipe.transform = function transform(keypath) {
    var env = environment;
    var keys = keypath.split('.');
    var k = keys.shift();

    while (keys.length > 0 && env[k]) {
      env = env[k];
      k = keys.shift();
    }

    var value = env[k] || null;
    return value;
  };

  return EnvPipe;
}(rxcomp.Pipe);
EnvPipe.meta = {
  name: 'env'
};var FlagPipe = /*#__PURE__*/function (_Pipe) {
  _inheritsLoose(FlagPipe, _Pipe);

  function FlagPipe() {
    return _Pipe.apply(this, arguments) || this;
  }

  FlagPipe.transform = function transform(key) {
    var flags = environment.flags;
    return flags[key] || false;
  };

  return FlagPipe;
}(rxcomp.Pipe);
FlagPipe.meta = {
  name: 'flag'
};/*
['quot', 'amp', 'apos', 'lt', 'gt', 'nbsp', 'iexcl', 'cent', 'pound', 'curren', 'yen', 'brvbar', 'sect', 'uml', 'copy', 'ordf', 'laquo', 'not', 'shy', 'reg', 'macr', 'deg', 'plusmn', 'sup2', 'sup3', 'acute', 'micro', 'para', 'middot', 'cedil', 'sup1', 'ordm', 'raquo', 'frac14', 'frac12', 'frac34', 'iquest', 'Agrave', 'Aacute', 'Acirc', 'Atilde', 'Auml', 'Aring', 'AElig', 'Ccedil', 'Egrave', 'Eacute', 'Ecirc', 'Euml', 'Igrave', 'Iacute', 'Icirc', 'Iuml', 'ETH', 'Ntilde', 'Ograve', 'Oacute', 'Ocirc', 'Otilde', 'Ouml', 'times', 'Oslash', 'Ugrave', 'Uacute', 'Ucirc', 'Uuml', 'Yacute', 'THORN', 'szlig', 'agrave', 'aacute', 'atilde', 'auml', 'aring', 'aelig', 'ccedil', 'egrave', 'eacute', 'ecirc', 'euml', 'igrave', 'iacute', 'icirc', 'iuml', 'eth', 'ntilde', 'ograve', 'oacute', 'ocirc', 'otilde', 'ouml', 'divide', 'oslash', 'ugrave', 'uacute', 'ucirc', 'uuml', 'yacute', 'thorn', 'yuml', 'amp', 'bull', 'deg', 'infin', 'permil', 'sdot', 'plusmn', 'dagger', 'mdash', 'not', 'micro', 'perp', 'par', 'euro', 'pound', 'yen', 'cent', 'copy', 'reg', 'trade', 'alpha', 'beta', 'gamma', 'delta', 'epsilon', 'zeta', 'eta', 'theta', 'iota', 'kappa', 'lambda', 'mu', 'nu', 'xi', 'omicron', 'pi', 'rho', 'sigma', 'tau', 'upsilon', 'phi', 'chi', 'psi', 'omega', 'Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta', 'Iota', 'Kappa', 'Lambda', 'Mu', 'Nu', 'Xi', 'Omicron', 'Pi', 'Rho', 'Sigma', 'Tau', 'Upsilon', 'Phi', 'Chi', 'Psi', 'Omega'];
['"', '&', ''', '<', '>', ' ', '¡', '¢', '£', '¤', '¥', '¦', '§', '¨', '©', 'ª', '«', '¬', '­', '®', '¯', '°', '±', '²', '³', '´', 'µ', '¶', '·', '¸', '¹', 'º', '»', '¼', '½', '¾', '¿', 'À', 'Á', 'Â', 'Ã', 'Ä', 'Å', 'Æ', 'Ç', 'È', 'É', 'Ê', 'Ë', 'Ì', 'Í', 'Î', 'Ï', 'Ð', 'Ñ', 'Ò', 'Ó', 'Ô', 'Õ', 'Ö', '×', 'Ø', 'Ù', 'Ú', 'Û', 'Ü', 'Ý', 'Þ', 'ß', 'à', 'á', 'ã', 'ä', 'å', 'æ', 'ç', 'è', 'é', 'ê', 'ë', 'ì', 'í', 'î', 'ï', 'ð', 'ñ', 'ò', 'ó', 'ô', 'õ', 'ö', '÷', 'ø', 'ù', 'ú', 'û', 'ü', 'ý', 'þ', 'ÿ', '&', '•', '°', '∞', '‰', '⋅', '±', '†', '—', '¬', 'µ', '⊥', '∥', '€', '£', '¥', '¢', '©', '®', '™', 'α', 'β', 'γ', 'δ', 'ε', 'ζ', 'η', 'θ', 'ι', 'κ', 'λ', 'μ', 'ν', 'ξ', 'ο', 'π', 'ρ', 'σ', 'τ', 'υ', 'φ', 'χ', 'ψ', 'ω', 'Α', 'Β', 'Γ', 'Δ', 'Ε', 'Ζ', 'Η', 'Θ', 'Ι', 'Κ', 'Λ', 'Μ', 'Ν', 'Ξ', 'Ο', 'Π', 'Ρ', 'Σ', 'Τ', 'Υ', 'Φ', 'Χ', 'Ψ', 'Ω'];
*/

var HtmlPipe = /*#__PURE__*/function (_Pipe) {
  _inheritsLoose(HtmlPipe, _Pipe);

  function HtmlPipe() {
    return _Pipe.apply(this, arguments) || this;
  }

  HtmlPipe.transform = function transform(value) {
    if (value) {
      value = value.replace(/&#(\d+);/g, function (m, n) {
        return String.fromCharCode(parseInt(n));
      });
      var escapes = ['quot', 'amp', 'apos', 'lt', 'gt', 'nbsp', 'iexcl', 'cent', 'pound', 'curren', 'yen', 'brvbar', 'sect', 'uml', 'copy', 'ordf', 'laquo', 'not', 'shy', 'reg', 'macr', 'deg', 'plusmn', 'sup2', 'sup3', 'acute', 'micro', 'para', 'middot', 'cedil', 'sup1', 'ordm', 'raquo', 'frac14', 'frac12', 'frac34', 'iquest', 'Agrave', 'Aacute', 'Acirc', 'Atilde', 'Auml', 'Aring', 'AElig', 'Ccedil', 'Egrave', 'Eacute', 'Ecirc', 'Euml', 'Igrave', 'Iacute', 'Icirc', 'Iuml', 'ETH', 'Ntilde', 'Ograve', 'Oacute', 'Ocirc', 'Otilde', 'Ouml', 'times', 'Oslash', 'Ugrave', 'Uacute', 'Ucirc', 'Uuml', 'Yacute', 'THORN', 'szlig', 'agrave', 'aacute', 'atilde', 'auml', 'aring', 'aelig', 'ccedil', 'egrave', 'eacute', 'ecirc', 'euml', 'igrave', 'iacute', 'icirc', 'iuml', 'eth', 'ntilde', 'ograve', 'oacute', 'ocirc', 'otilde', 'ouml', 'divide', 'oslash', 'ugrave', 'uacute', 'ucirc', 'uuml', 'yacute', 'thorn', 'yuml', 'amp', 'bull', 'deg', 'infin', 'permil', 'sdot', 'plusmn', 'dagger', 'mdash', 'not', 'micro', 'perp', 'par', 'euro', 'pound', 'yen', 'cent', 'copy', 'reg', 'trade', 'alpha', 'beta', 'gamma', 'delta', 'epsilon', 'zeta', 'eta', 'theta', 'iota', 'kappa', 'lambda', 'mu', 'nu', 'xi', 'omicron', 'pi', 'rho', 'sigma', 'tau', 'upsilon', 'phi', 'chi', 'psi', 'omega', 'Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta', 'Iota', 'Kappa', 'Lambda', 'Mu', 'Nu', 'Xi', 'Omicron', 'Pi', 'Rho', 'Sigma', 'Tau', 'Upsilon', 'Phi', 'Chi', 'Psi', 'Omega'];
      var unescapes = ['"', '&', '\'', '<', '>', ' ', '¡', '¢', '£', '¤', '¥', '¦', '§', '¨', '©', 'ª', '«', '¬', '­', '®', '¯', '°', '±', '²', '³', '´', 'µ', '¶', '·', '¸', '¹', 'º', '»', '¼', '½', '¾', '¿', 'À', 'Á', 'Â', 'Ã', 'Ä', 'Å', 'Æ', 'Ç', 'È', 'É', 'Ê', 'Ë', 'Ì', 'Í', 'Î', 'Ï', 'Ð', 'Ñ', 'Ò', 'Ó', 'Ô', 'Õ', 'Ö', '×', 'Ø', 'Ù', 'Ú', 'Û', 'Ü', 'Ý', 'Þ', 'ß', 'à', 'á', 'ã', 'ä', 'å', 'æ', 'ç', 'è', 'é', 'ê', 'ë', 'ì', 'í', 'î', 'ï', 'ð', 'ñ', 'ò', 'ó', 'ô', 'õ', 'ö', '÷', 'ø', 'ù', 'ú', 'û', 'ü', 'ý', 'þ', 'ÿ', '&', '•', '°', '∞', '‰', '⋅', '±', '†', '—', '¬', 'µ', '⊥', '∥', '€', '£', '¥', '¢', '©', '®', '™', 'α', 'β', 'γ', 'δ', 'ε', 'ζ', 'η', 'θ', 'ι', 'κ', 'λ', 'μ', 'ν', 'ξ', 'ο', 'π', 'ρ', 'σ', 'τ', 'υ', 'φ', 'χ', 'ψ', 'ω', 'Α', 'Β', 'Γ', 'Δ', 'Ε', 'Ζ', 'Η', 'Θ', 'Ι', 'Κ', 'Λ', 'Μ', 'Ν', 'Ξ', 'Ο', 'Π', 'Ρ', 'Σ', 'Τ', 'Υ', 'Φ', 'Χ', 'Ψ', 'Ω'];
      var rx = new RegExp("(&" + escapes.join(';)|(&') + ";)", 'g');
      value = value.replace(rx, function () {
        for (var i = 1; i < arguments.length; i++) {
          if (arguments[i]) {
            // console.log(arguments[i], unescapes[i - 1]);
            return unescapes[i - 1];
          }
        }
      }); // console.log(value);

      return value;
    }
  };

  return HtmlPipe;
}(rxcomp.Pipe);
HtmlPipe.meta = {
  name: 'html'
};var IdDirective = /*#__PURE__*/function (_Directive) {
  _inheritsLoose(IdDirective, _Directive);

  function IdDirective() {
    return _Directive.apply(this, arguments) || this;
  }

  var _proto = IdDirective.prototype;

  _proto.onChanges = function onChanges() {
    var _getContext = rxcomp.getContext(this),
        node = _getContext.node;

    node.setAttribute('id', this.id);
  };

  return IdDirective;
}(rxcomp.Directive);
IdDirective.meta = {
  selector: '[id]',
  inputs: ['id']
};var LabelForDirective = /*#__PURE__*/function (_Directive) {
  _inheritsLoose(LabelForDirective, _Directive);

  function LabelForDirective() {
    return _Directive.apply(this, arguments) || this;
  }

  var _proto = LabelForDirective.prototype;

  _proto.onChanges = function onChanges() {
    var _getContext = rxcomp.getContext(this),
        node = _getContext.node;

    node.setAttribute('for', this.labelFor);
  };

  return LabelForDirective;
}(rxcomp.Directive);
LabelForDirective.meta = {
  selector: '[labelFor]',
  inputs: ['labelFor']
};var LabelPipe = /*#__PURE__*/function (_Pipe) {
  _inheritsLoose(LabelPipe, _Pipe);

  function LabelPipe() {
    return _Pipe.apply(this, arguments) || this;
  }

  LabelPipe.transform = function transform(key) {
    var labels = LabelPipe.labels_;
    return labels[key] || key; // `#${key}#`;
  };

  LabelPipe.getKeys = function getKeys() {
    for (var _len = arguments.length, keys = new Array(_len), _key = 0; _key < _len; _key++) {
      keys[_key] = arguments[_key];
    }

    return LabelPipe.transform(keys.map(function (x) {
      return x.replace('-', '_');
    }).join('_'));
  };

  LabelPipe.setLabels = function setLabels() {
    var LABELS = Utils.merge({
      select: 'Seleziona',
      browse: 'Sfoglia',
      cancel: 'Annulla',
      error_email: 'Email non valida',
      error_match: 'I campi non corrispondono',
      error_required: 'Campo obbligatorio',
      loading: 'caricamento',
      remove: 'Rimuovi',
      required: 'Richiesto',
      select_file: 'Seleziona il file',
      update: 'Aggiorna',
      upload: 'Carica',
      drag_and_drop_images: 'Drag And Drop your images here'
    }, environment.labels);
    this.labels_ = LABELS;
  };

  return LabelPipe;
}(rxcomp.Pipe);
LabelPipe.setLabels();
LabelPipe.meta = {
  name: 'label'
};var TitleDirective = /*#__PURE__*/function (_Directive) {
  _inheritsLoose(TitleDirective, _Directive);

  function TitleDirective() {
    return _Directive.apply(this, arguments) || this;
  }

  _createClass(TitleDirective, [{
    key: "title",
    set: function set(title) {
      if (this.title_ !== title) {
        this.title_ = title;

        var _getContext = rxcomp.getContext(this),
            node = _getContext.node;

        title ? node.setAttribute('title', title) : node.removeAttribute('title');
      }
    },
    get: function get() {
      return this.title_;
    }
  }]);

  return TitleDirective;
}(rxcomp.Directive);
TitleDirective.meta = {
  selector: '[[title]]',
  inputs: ['title']
};var factories = [DropdownDirective, DropdownItemDirective, IdDirective, LabelForDirective, TitleDirective];
var pipes = [EnvPipe, FlagPipe, HtmlPipe, LabelPipe];
var CommonModule = /*#__PURE__*/function (_Module) {
  _inheritsLoose(CommonModule, _Module);

  function CommonModule() {
    return _Module.apply(this, arguments) || this;
  }

  return CommonModule;
}(rxcomp.Module);
CommonModule.meta = {
  imports: [],
  declarations: [].concat(factories, pipes),
  exports: [].concat(factories, pipes)
};var ControlComponent = /*#__PURE__*/function (_Component) {
  _inheritsLoose(ControlComponent, _Component);

  function ControlComponent() {
    return _Component.apply(this, arguments) || this;
  }

  var _proto = ControlComponent.prototype;

  _proto.onChanges = function onChanges() {
    var _getContext = rxcomp.getContext(this),
        node = _getContext.node; // console.log(this, node, this.control);


    var control = this.control;
    var flags = control.flags;
    Object.keys(flags).forEach(function (key) {
      flags[key] ? node.classList.add(key) : node.classList.remove(key);
    });
  };

  return ControlComponent;
}(rxcomp.Component);
ControlComponent.meta = {
  selector: '[control]',
  inputs: ['control']
};var ControlCheckboxComponent = /*#__PURE__*/function (_ControlComponent) {
  _inheritsLoose(ControlCheckboxComponent, _ControlComponent);

  function ControlCheckboxComponent() {
    return _ControlComponent.apply(this, arguments) || this;
  }

  var _proto = ControlCheckboxComponent.prototype;

  _proto.onInit = function onInit() {
    this.label = this.label || 'label';
  };

  _proto.setTouched = function setTouched(event) {
    this.control.touched = true;
  };

  return ControlCheckboxComponent;
}(ControlComponent);
ControlCheckboxComponent.meta = {
  selector: '[control-checkbox]',
  inputs: ['control', 'label'],
  template:
  /* html */
  "\n\t\t<div class=\"group--checkbox\" [class]=\"{ required: control.validators.length }\">\n\t\t\t<input type=\"checkbox\" class=\"control\" [id]=\"control.name\" [formControl]=\"control\" [value]=\"true\" />\n\t\t\t<label [labelFor]=\"control.name\" (click)=\"setTouched($event)\">\n\t\t\t\t<svg class=\"icon icon--checkbox\"><use xlink:href=\"#checkbox\"></use></svg>\n\t\t\t\t<svg class=\"icon icon--checkbox-checked\"><use xlink:href=\"#checkbox-checked\"></use></svg>\n\t\t\t\t<span [innerHTML]=\"label | html\"></span>\n\t\t\t</label>\n\t\t\t<span class=\"required__badge\" [innerHTML]=\"'required' | label\"></span>\n\t\t</div>\n\t\t<errors-component [control]=\"control\"></errors-component>\n\t"
};var KeyboardService = /*#__PURE__*/function () {
  function KeyboardService() {}

  KeyboardService.keydown$ = function keydown$() {
    if (!this.keydown$_) {
      this.keydown$_ = rxjs.fromEvent(window, 'keydown').pipe(operators.shareReplay(1));
    }

    return this.keydown$_;
  };

  KeyboardService.keyup$ = function keyup$() {
    if (!this.keyup$_) {
      this.keyup$_ = rxjs.fromEvent(window, 'keyup').pipe(operators.shareReplay(1));
    }

    return this.keyup$_;
  };

  KeyboardService.keys$ = function keys$() {
    var _this = this;

    if (!this.keys$_) {
      this.keys$_ = rxjs.merge(this.keydown$(), this.keyup$()).pipe(operators.map(function (event) {
        var keys = _this.keys;

        if (event.type === 'keydown') {
          keys[event.key] = true;
        } else {
          delete keys[event.key];
        }

        return _this.keys;
      }), operators.startWith(this.keys), operators.shareReplay(1));
    }

    return this.keys$_;
  };

  KeyboardService.key$ = function key$() {
    if (!this.key$_) {
      var regexp = /\w/;
      this.key$_ = this.keydown$().pipe(operators.filter(function (event) {
        return event.key && event.key.match(regexp);
      }), operators.map(function (event) {
        return event.key;
      }), operators.shareReplay(1));
    }

    return this.key$_;
  };

  KeyboardService.typing$ = function typing$() {
    if (!this.typing$_) {
      var typing = '',
          to;
      this.typing$_ = this.key$().pipe(operators.map(function (key) {
        if (to) {
          clearTimeout(to);
        }

        typing += key;
        to = setTimeout(function () {
          typing = '';
        }, 1500);
        return typing;
      }), operators.shareReplay(1));
    }

    return this.typing$_;
  };

  return KeyboardService;
}();

_defineProperty(KeyboardService, "keys", {});var ControlCustomSelectComponent = /*#__PURE__*/function (_ControlComponent) {
  _inheritsLoose(ControlCustomSelectComponent, _ControlComponent);

  function ControlCustomSelectComponent() {
    return _ControlComponent.apply(this, arguments) || this;
  }

  var _proto = ControlCustomSelectComponent.prototype;

  _proto.onInit = function onInit() {
    var _this = this;

    this.label = this.label || 'label';
    this.dropped = false;
    this.dropdownId = DropdownDirective.nextId();
    KeyboardService.typing$().pipe(operators.takeUntil(this.unsubscribe$)).subscribe(function (word) {
      _this.scrollToWord(word);
    });
  };

  _proto.scrollToWord = function scrollToWord(word) {
    // console.log('ControlCustomSelectComponent.scrollToWord', word);
    var items = this.control.options || [];
    var index = -1;

    for (var i = 0; i < items.length; i++) {
      var x = items[i];

      if (x.name.toLowerCase().indexOf(word.toLowerCase()) === 0) {
        // console.log(word, x.name);
        index = i;
        break;
      }
    }

    if (index !== -1) {
      var _getContext = rxcomp.getContext(this),
          node = _getContext.node;

      var dropdown = node.querySelector('.dropdown');
      var navDropdown = node.querySelector('.nav--dropdown');
      var item = navDropdown.children[index];
      dropdown.scrollTo(0, item.offsetTop);
    }
  };

  _proto.setOption = function setOption(item) {
    // console.log('setOption', item, this.isMultiple);
    var value;

    if (this.isMultiple) {
      var _value = this.control.value || [];

      var index = _value.indexOf(item.id);

      if (index !== -1) {
        // if (value.length > 1) {
        _value.splice(index, 1); // }

      } else {
        _value.push(item.id);
      }

      _value = (_readOnlyError("value"), _value.length ? _value.slice() : null);
    } else {
      value = item.id; // DropdownDirective.dropdown$.next(null);
    }

    this.control.value = value;
    this.change.next(value);
  };

  _proto.hasOption = function hasOption(item) {
    if (this.isMultiple) {
      var values = this.control.value || [];
      return values.indexOf(item.id) !== -1;
    } else {
      return this.control.value === item.id;
    }
  };

  _proto.getLabel = function getLabel() {
    var value = this.control.value;
    var items = this.control.options || [];

    if (this.isMultiple) {
      value = value || [];

      if (value.length) {
        return value.map(function (v) {
          var item = items.find(function (x) {
            return x.id === v || x.name === v;
          });
          return item ? item.name : '';
        }).join(', ');
      } else {
        return this.select || 'select'; // LabelPipe.transform('select');
      }
    } else {
      var item = value ? items.find(function (x) {
        return x.id === value || x.name === value;
      }) : null;

      if (item) {
        return item.name;
      } else {
        return this.select || 'select'; // LabelPipe.transform('select');
      }
    }
  };

  _proto.onDropped = function onDropped($event) {
    // console.log('ControlCustomSelectComponent.onDropped', id);
    if (this.dropped && $event === null) {
      this.control.touched = true;
    }

    this.dropped = $event === this.dropdownId;
  };

  _createClass(ControlCustomSelectComponent, [{
    key: "isMultiple",
    get: function get() {
      return this.multiple && this.multiple !== false && this.multiple !== 'false';
    }
  }]);

  return ControlCustomSelectComponent;
}(ControlComponent);
ControlCustomSelectComponent.meta = {
  selector: '[control-custom-select]',
  outputs: ['change'],
  inputs: ['control', 'label', 'multiple', 'select'],
  template:
  /* html */
  "\n\t\t<div class=\"group--form--select\" [class]=\"{ required: control.validators.length, multiple: isMultiple }\" [dropdown]=\"dropdownId\" (dropped)=\"onDropped($event)\">\n\t\t\t<label [innerHTML]=\"label\"></label>\n\t\t\t<span class=\"required__badge\" [innerHTML]=\"'required' | label\"></span>\n\t\t\t<div class=\"group--control-select\">\n\t\t\t\t<span class=\"control--custom-select\" [innerHTML]=\"getLabel() | label\"></span>\n\t\t\t\t<svg class=\"caret-down\"><use xlink:href=\"#caret-down\"></use></svg>\n\t\t\t</div>\n\t\t</div>\n\t\t<errors-component [control]=\"control\"></errors-component>\n\t\t<div class=\"dropdown\" [dropdown-item]=\"dropdownId\">\n\t\t\t<div class=\"category\" [innerHTML]=\"label\"></div>\n\t\t\t<ul class=\"nav--dropdown\" [class]=\"{ multiple: isMultiple }\">\n\t\t\t\t<li (click)=\"setOption(item)\" [class]=\"{ empty: item.id == null }\" *for=\"let item of control.options\">\n\t\t\t\t\t<span [class]=\"{ active: hasOption(item) }\" [innerHTML]=\"item.name | label\"></span>\n\t\t\t\t</li>\n\t\t\t</ul>\n\t\t</div>\n\t"
};var ControlFileComponent = /*#__PURE__*/function (_ControlComponent) {
  _inheritsLoose(ControlFileComponent, _ControlComponent);

  function ControlFileComponent() {
    return _ControlComponent.apply(this, arguments) || this;
  }

  var _proto = ControlFileComponent.prototype;

  _proto.onInit = function onInit() {
    this.label = this.label || 'label';
    this.labels = window.labels || {};
    this.file = null;
    this.onReaderComplete = this.onReaderComplete.bind(this);
  };

  _proto.onInputDidChange = function onInputDidChange(event) {
    var input = event.target;
    var file = input.files[0];
    this.file = {
      name: file.name,
      lastModified: file.lastModified,
      lastModifiedDate: file.lastModifiedDate,
      size: file.size,
      type: file.type
    };
    var reader = new FileReader();
    reader.addEventListener('load', this.onReaderComplete);
    reader.readAsDataURL(file); // reader.readAsArrayBuffer() // Starts reading the contents of the specified Blob, once finished, the result attribute contains an ArrayBuffer representing the file's data.
    // reader.readAsBinaryString() // Starts reading the contents of the specified Blob, once finished, the result attribute contains the raw binary data from the file as a string.
    // reader.readAsDataURL() // Starts reading the contents of the specified Blob, once finished, the result attribute contains a data: URL representing the file's data.
    // reader.readAsText() // Starts reading the contents of the specified Blob, once finished, the result attribute contains the contents of the file as a text string. An optional encoding name can be specified.
  };

  _proto.onReaderComplete = function onReaderComplete(event) {
    var content = event.target.result;
    this.file.content = content;
    this.control.value = this.file; // console.log('ControlFileComponent.onReaderComplete', this.file);
    // image/*,
  };

  return ControlFileComponent;
}(ControlComponent);
ControlFileComponent.meta = {
  selector: '[control-file]',
  inputs: ['control', 'label'],
  template:
  /* html */
  "\n\t\t<div class=\"group--control group--control--file\" [class]=\"{ required: control.validators.length }\">\n\t\t\t<input name=\"file\" type=\"file\" id=\"picture\" accept=\".jpg,.jpgeg,.png,.tiff\" class=\"control--file\" (change)=\"onInputDidChange($event)\" />\n\t\t\t<div class=\"control\" [innerHTML]=\"file?.name || ('select_file' | label)\"></div>\n\t\t\t<button type=\"button\" class=\"btn btn--file\" [innerHTML]=\"'upload' | label\"></button>\n\t\t\t<span class=\"required__badge\" [innerHTML]=\"'required' | label\"></span>\n\t\t</div>\n\t\t<errors-component [control]=\"control\"></errors-component>\n\t"
};var ControlTextComponent = /*#__PURE__*/function (_ControlComponent) {
  _inheritsLoose(ControlTextComponent, _ControlComponent);

  function ControlTextComponent() {
    return _ControlComponent.apply(this, arguments) || this;
  }

  var _proto = ControlTextComponent.prototype;

  _proto.onInit = function onInit() {
    this.label = this.label || 'label';
    this.disabled = this.disabled || false;
  };

  return ControlTextComponent;
}(ControlComponent);
ControlTextComponent.meta = {
  selector: '[control-text]',
  inputs: ['control', 'label', 'disabled'],
  template:
  /* html */
  "\n\t\t<div class=\"group--control\" [class]=\"{ required: control.validators.length, disabled: disabled }\">\n\t\t\t<label [innerHTML]=\"label\"></label>\n\t\t\t<span class=\"required__badge\" [innerHTML]=\"'required' | label\"></span>\n\t\t\t<input type=\"text\" class=\"control\" [formControl]=\"control\" [placeholder]=\"label\" [disabled]=\"disabled\" />\n\t\t</div>\n\t\t<errors-component [control]=\"control\"></errors-component>\n\t"
};var ErrorsComponent = /*#__PURE__*/function (_ControlComponent) {
  _inheritsLoose(ErrorsComponent, _ControlComponent);

  function ErrorsComponent() {
    return _ControlComponent.apply(this, arguments) || this;
  }

  var _proto = ErrorsComponent.prototype;

  _proto.getLabel = function getLabel(key, value) {
    var label = LabelPipe.transform("error_" + key);
    return label;
  };

  return ErrorsComponent;
}(ControlComponent);
ErrorsComponent.meta = {
  selector: 'errors-component',
  inputs: ['control'],
  template:
  /* html */
  "\n\t<div class=\"inner\" [style]=\"{ display: control.invalid && control.touched ? 'block' : 'none' }\">\n\t\t<div class=\"error\" *for=\"let [key, value] of control.errors\">\n\t\t\t<span [innerHTML]=\"getLabel(key, value)\"></span>\n\t\t\t<!-- <span class=\"key\" [innerHTML]=\"key\"></span> <span class=\"value\" [innerHTML]=\"value | json\"></span> -->\n\t\t</div>\n\t</div>\n\t"
};var TestComponent = /*#__PURE__*/function (_Component) {
  _inheritsLoose(TestComponent, _Component);

  function TestComponent() {
    return _Component.apply(this, arguments) || this;
  }

  var _proto = TestComponent.prototype;

  _proto.onTest = function onTest(event) {
    this.test.next(event);
  };

  _proto.onReset = function onReset(event) {
    this.reset.next(event);
  };

  return TestComponent;
}(rxcomp.Component);
TestComponent.meta = {
  selector: 'test-component',
  inputs: ['form'],
  outputs: ['test', 'reset'],
  template:
  /* html */
  "\n\t<div class=\"test-component\" *if=\"!('production' | flag)\">\n\t\t<div class=\"test-component__title\">development mode</div>\n\t\t<code [innerHTML]=\"form.value | json\"></code>\n\t\t<button type=\"button\" class=\"btn--submit\" (click)=\"onTest($event)\"><span>test</span></button>\n\t\t<button type=\"button\" class=\"btn--submit\" (click)=\"onReset($event)\"><span>reset</span></button>\n\t</div>\n\t"
};var factories$1 = [ControlCheckboxComponent, ControlCustomSelectComponent, ControlFileComponent, ControlTextComponent, ErrorsComponent, TestComponent];
var pipes$1 = [];
var ControlsModule = /*#__PURE__*/function (_Module) {
  _inheritsLoose(ControlsModule, _Module);

  function ControlsModule() {
    return _Module.apply(this, arguments) || this;
  }

  return ControlsModule;
}(rxcomp.Module);
ControlsModule.meta = {
  imports: [],
  declarations: [].concat(factories$1, pipes$1),
  exports: [].concat(factories$1, pipes$1)
};var UrbanEnterComponent = /*#__PURE__*/function (_Component) {
  _inheritsLoose(UrbanEnterComponent, _Component);

  function UrbanEnterComponent() {
    return _Component.apply(this, arguments) || this;
  }

  var _proto = UrbanEnterComponent.prototype;

  _proto.onInit = function onInit() {
    var _getContext = rxcomp.getContext(this),
        node = _getContext.node;

    this.node = node;
    this.onScroll = this.onScroll.bind(this);
    window.addEventListener('scroll', this.onScroll);
    this.onScroll();
  };

  _proto.onDestroy = function onDestroy() {
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

  return UrbanEnterComponent;
}(rxcomp.Component);
UrbanEnterComponent.meta = {
  selector: '[urban-enter]'
};var HttpService = /*#__PURE__*/function () {
  function HttpService() {}

  HttpService.http$ = function http$(method, url, data, format, userPass) {
    var _this = this;

    if (userPass === void 0) {
      userPass = null;
    }

    var methods = ['POST', 'PUT', 'PATCH'];
    var response_ = null; // url = this.getUrl(url, format);

    var options = {
      method: method,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: methods.indexOf(method) !== -1 ? JSON.stringify(data) : undefined
    };

    if (userPass) {
      // options.mode = 'no-cors';
      options.credentials = 'include';
      userPass = window.btoa(userPass);
      options.headers['Authorization'] = "Basic " + userPass;
    }

    options.headers = new Headers(options.headers);
    return rxjs.from(fetch(url, options).then(function (response) {
      response_ = response; // console.log(response);

      try {
        var contentType = response.headers.get('content-type');
        var typedResponse;

        if (contentType && contentType.indexOf('application/json') !== -1) {
          typedResponse = response.json();
        } else {
          typedResponse = response.text();
        }

        if (response.ok) {
          return typedResponse;
        } else {
          return typedResponse.then(function (data) {
            return Promise.reject(data);
          });
        }
      } catch (error) {
        if (response.ok) {
          console.warn('HttpService.http$', 'Cannot parse response');
          return Promise.resolve();
        } else {
          return Promise.reject(error);
        }
      }
    })).pipe(operators.catchError(function (error) {
      return rxjs.throwError(_this.getError(error, response_));
    }));
  }
  /*
  // !!! todo mapping response.data
  static http$(method, url, data, format = 'json') {
  	const methods = ['POST', 'PUT', 'PATCH'];
  	const body = (data && methods.indexOf(method) !== -1) ? JSON.stringify(data) : undefined;
  	const queryString = (data && methods.indexOf(method) !== -1) ? Object.keys(data).map(function(key) {
  		return key + '=' + encodeURI(data[key]);
  	}).join('&') : undefined;
  	if (queryString) {
  		url = `${url}?${queryString}`;
  	}
  	let response_ = null;
  	return from(fetch(url, {
  		method: method,
  		headers: {
  			'Accept': 'application/json',
  			'Content-Type': 'application/json',
  		},
  		body: body,
  	}).then((response) => {
  		response_ = new HttpResponse(response);
  		try {
  			const contentType = response.headers.get('content-type');
  			let typedResponse;
  			if (contentType && format === 'json' && contentType.indexOf('application/json') !== -1) {
  				typedResponse = response.json();
  			} else if (format === 'blob') {
  				typedResponse = response.blob();
  			} else {
  				typedResponse = response.text();
  			}
  			return typedResponse.then(data => {
  				response_.data = data;
  				if (response.ok) {
  					return Promise.resolve(response_);
  				} else {
  					return Promise.reject(response_);
  				}
  			});
  		} catch(error) {
  			if (response.ok) {
  				console.warn('HttpService.http$', 'Cannot parse response');
  				return Promise.resolve(response_);
  			} else {
  				return Promise.reject(this.getError(error, response_));
  			}
  		}
  	})).pipe(
  		catchError(error => {
  			return throwError(this.getError(error, response_));
  		}),
  	);
  }
  */
  ;

  HttpService.get$ = function get$(url, data, format) {
    var query = this.query(data);
    return this.http$('GET', "" + url + query, undefined, format);
  };

  HttpService.delete$ = function delete$(url) {
    return this.http$('DELETE', url);
  };

  HttpService.post$ = function post$(url, data) {
    return this.http$('POST', url, data);
  };

  HttpService.put$ = function put$(url, data) {
    return this.http$('PUT', url, data);
  };

  HttpService.patch$ = function patch$(url, data) {
    return this.http$('PATCH', url, data);
  };

  HttpService.query = function query(data) {
    return ''; // todo
  };

  HttpService.getError = function getError(object, response) {
    var error = typeof object === 'object' ? object : {};

    if (!error.status) {
      error.status = response ? response.status : 0;
    }

    if (!error.statusCode) {
      error.statusCode = response ? response.status : 0;
    }

    if (!error.statusMessage) {
      error.statusMessage = response ? response.statusText : object;
    } // console.log('HttpService.getError', error, object);


    return error;
  };

  return HttpService;
}();var DATE_REGEXP = new RegExp(/^(\d{1,2})[\/|\-|\s](\d{1,2})[\/|\-|\s](\d{4})$/);
function AgeValidator(years) {
  return new rxcompForm.FormValidator(function (value) {
    if (!value) {
      return null;
    }

    var date;

    if (value instanceof Date) {
      date = value;
    } else {
      var match = DATE_REGEXP.exec(value);

      if (!match) {
        return null;
      }

      date = new Date(match[2] + "/" + match[1] + "/" + match[3]);
    }

    var now = new Date();

    if (now.getFullYear() - date.getFullYear() > years || now.getFullYear() - date.getFullYear() == years && now.getMonth() - date.getMonth() > 0 || now.getFullYear() - date.getFullYear() == years && now.getMonth() - date.getMonth() == 0 && now.getDate() - date.getDate() >= 0) {
      return null;
    } else {
      return {
        age: years
      };
    }
  });
}var DATE_REGEXP$1 = new RegExp(/^(\d{1,2})[\/|\-|\s](\d{1,2})[\/|\-|\s](\d{4})$/);

function isValidDate(value, match) {
  try {
    return Date.parse(value) !== NaN;
  } catch (_) {
    try {
      return Date.parse(match[2] + "/" + match[1] + "/" + match[3]) !== NaN;
    } catch (_) {
      return false;
    }
  }
}

function BirthDateValidator() {
  return new rxcompForm.FormValidator(function (value) {
    if (!value) {
      return null;
    }

    if (value instanceof Date) {
      return null;
    }

    var match = DATE_REGEXP$1.exec(value);
    return match && isValidDate(value, match) ? null : {
      birthDate: {
        valid: false
      }
    };
  });
}var FormService = /*#__PURE__*/function () {
  function FormService() {}

  FormService.toSelectOptions = function toSelectOptions(options) {
    options = options.slice().map(function (x) {
      return {
        id: x.value,
        name: x.label
      };
    });
    options.unshift({
      id: null,
      name: 'select'
    });
    return options;
  };

  return FormService;
}();var DATE_REGEXP$2 = new RegExp(/^(\d{1,2})[\/|\-|\s](\d{1,2})[\/|\-|\s](\d{4})$/);
var UrbanFormComponent = /*#__PURE__*/function (_Component) {
  _inheritsLoose(UrbanFormComponent, _Component);

  function UrbanFormComponent() {
    return _Component.apply(this, arguments) || this;
  }

  var _proto = UrbanFormComponent.prototype;

  _proto.onInit = function onInit() {
    var _this = this;

    var _getContext = rxcomp.getContext(this),
        node = _getContext.node;

    this.node = node;
    this.currentStep = 0;
    this.error = null;
    this.success = false;
    this.busy = false;
    var form = this.form = new rxcompForm.FormGroup({
      step0: new rxcompForm.FormGroup({
        picture: new rxcompForm.FormControl(null, [rxcompForm.Validators.RequiredValidator()])
      }),
      step1: new rxcompForm.FormGroup({
        firstName: new rxcompForm.FormControl(null, [rxcompForm.Validators.RequiredValidator()]),
        lastName: new rxcompForm.FormControl(null, [rxcompForm.Validators.RequiredValidator()]),
        birthDate: new rxcompForm.FormControl(null, [rxcompForm.Validators.RequiredValidator(), BirthDateValidator(), AgeValidator(14)]),
        telephone: new rxcompForm.FormControl(null, [rxcompForm.Validators.RequiredValidator()]),
        email: new rxcompForm.FormControl(null, [rxcompForm.Validators.RequiredValidator(), rxcompForm.Validators.EmailValidator()]),
        address: new rxcompForm.FormControl(null, [rxcompForm.Validators.RequiredValidator()]),
        city: new rxcompForm.FormControl(null, [rxcompForm.Validators.RequiredValidator()]),
        province: new rxcompForm.FormControl(null, [rxcompForm.Validators.RequiredValidator()]),
        userName: new rxcompForm.FormControl(null, [rxcompForm.Validators.RequiredValidator()]),
        category: new rxcompForm.FormControl(null, [rxcompForm.Validators.RequiredValidator()])
      }),
      step2: new rxcompForm.FormGroup({
        parentFirstName: new rxcompForm.FormControl(null, [rxcompForm.Validators.RequiredValidator()]),
        parentLastName: new rxcompForm.FormControl(null, [rxcompForm.Validators.RequiredValidator()]),
        parentIdCard: new rxcompForm.FormControl(null, [rxcompForm.Validators.RequiredValidator()]),
        parentTelephone: new rxcompForm.FormControl(null, [rxcompForm.Validators.RequiredValidator()]),
        parentEmail: new rxcompForm.FormControl(null, [rxcompForm.Validators.RequiredValidator(), rxcompForm.Validators.EmailValidator()])
      }),
      step3: new rxcompForm.FormGroup({
        rulesChecked: new rxcompForm.FormControl(null, [rxcompForm.Validators.RequiredTrueValidator()]),
        privacyChecked: new rxcompForm.FormControl(null, [rxcompForm.Validators.RequiredTrueValidator()])
      }),
      checkRequest: window.antiforgery,
      checkField: ''
    });
    var controls = this.controls = form.controls;
    var province = controls.step1.controls.province;
    province.options = FormService.toSelectOptions(window.province.options);
    var category = controls.step1.controls.category;
    category.options = FormService.toSelectOptions(window.category.options);
    form.changes$.pipe(operators.takeUntil(this.unsubscribe$)).subscribe(function (_) {
      _this.pushChanges();
    });
  };

  _proto.onNext = function onNext(event) {
    var group = this.controls["step" + this.currentStep];

    if (!group.valid) {
      Object.keys(group.controls).forEach(function (key) {
        group.controls[key].touched = true;
      }); // group.touched = true;

      return;
    } // console.log('onNext', this.currentStep, this.form);


    if (this.currentStep === 1 && this.isOfAge || this.currentStep === 2) {
      this.currentStep = 3;
      window.dataLayer.push({
        'event': 'step accettazione benvenuto'
      });
    } else if (this.currentStep === 1 && !this.isOfAge) {
      this.currentStep = 2;
      window.dataLayer.push({
        'event': 'step responsabilita genitoriale'
      });
    } else if (this.currentStep < 3) {
      this.currentStep++;
      window.dataLayer.push({
        'event': 'step form dati'
      });
    }

    group = this.controls["step" + this.currentStep];
    group.touched = false;
    this.pushChanges();
    this.scrollToTop();
  };

  _proto.onPrev = function onPrev() {
    if (this.currentStep > 0) {
      this.currentStep--;
    }

    this.pushChanges();
    this.scrollToTop();
  };

  _proto.scrollToTop = function scrollToTop() {
    var _getContext2 = rxcomp.getContext(this),
        node = _getContext2.node;

    var stepsNode = node.querySelector('.steps--form');
    stepsNode.scrollIntoView({
      behavior: 'smooth'
    });
  };

  _proto.onSubmit = function onSubmit(model) {
    var _this2 = this;

    var form = this.form; // console.log('UrbanFormComponent.onSubmit', form.value, form);

    if (form.controls.step0.valid && form.controls.step1.valid && (this.isOfAge || form.controls.step2.valid) && form.controls.step3.valid) {
      form.submitted = true;
      var payload = Object.assign({
        checkRequest: form.value.checkRequest,
        checkField: form.value.checkField
      }, form.value.step0, form.value.step1, form.value.step2, form.value.step3);
      this.busy = true;
      this.pushChanges();
      HttpService.post$('https://contest.tau-marin.it/', payload).pipe(operators.first(), operators.finalize(function (_) {
        _this2.busy = false;

        _this2.pushChanges();
      })).subscribe(function (_) {
        _this2.success = true;
        window.location.href = window.category.options.find(function (option) {
          return option.value === form.value.step1.category;
        }).url;
      }, function (error) {
        console.log('UrbanFormComponent.error', error);
        _this2.error = error;

        _this2.pushChanges();
      });
    } else {
      form.touched = true;
    }
  };

  _proto.onTest = function onTest() {
    var form = this.form;
    var controls = this.controls;
    var province = controls.step1.controls.province.options.length > 1 ? controls.step1.controls.province.options[1].id : null;
    var category = controls.step1.controls.category.options.length > 1 ? controls.step1.controls.category.options[1].id : null;
    form.patch({
      step1: {
        firstName: 'Jhon',
        lastName: 'Appleseed',
        birthDate: '22/04/1976',
        telephone: '0721 411112',
        email: 'jhonappleseed@gmail.com',
        address: 'Strada della Campanara, 15',
        city: 'Pesaro',
        province: province,
        userName: 'jappleseed',
        category: category
      },
      step3: {
        rulesChecked: true,
        privacyChecked: true
      },
      checkRequest: window.antiforgery,
      checkField: ''
    });
  };

  _createClass(UrbanFormComponent, [{
    key: "isOfAge",
    get: function get() {
      var birthDateValue = this.form.controls.step1.controls.birthDate.value;

      if (!birthDateValue) {
        return false;
      } else {
        var match = DATE_REGEXP$2.exec(birthDateValue);

        if (!match) {
          return false;
        } else {
          var date = new Date(match[2] + "/" + match[1] + "/" + match[3]);
          var now = new Date();

          if (now.getFullYear() - date.getFullYear() > 18 || now.getFullYear() - date.getFullYear() == 18 && now.getMonth() - date.getMonth() > 0 || now.getFullYear() - date.getFullYear() == 18 && now.getMonth() - date.getMonth() == 0 && now.getDate() - date.getDate() >= 0) {
            return true;
          } else {
            return false;
          }
        }
      }
    }
  }]);

  return UrbanFormComponent;
}(rxcomp.Component);
UrbanFormComponent.meta = {
  selector: '[urban-form]'
};var UrbanVideoComponent = /*#__PURE__*/function (_Component) {
  _inheritsLoose(UrbanVideoComponent, _Component);

  function UrbanVideoComponent() {
    return _Component.apply(this, arguments) || this;
  }

  var _proto = UrbanVideoComponent.prototype;

  _proto.onInit = function onInit() {
    var _getContext = rxcomp.getContext(this),
        node = _getContext.node;

    this.node = node;
    this.onClick = this.onClick.bind(this);
    node.addEventListener('click', this.onClick);
  };

  _proto.onDestroy = function onDestroy() {
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

  return UrbanVideoComponent;
}(rxcomp.Component);
UrbanVideoComponent.meta = {
  selector: '[urban-video]'
};var AppModule = /*#__PURE__*/function (_Module) {
  _inheritsLoose(AppModule, _Module);

  function AppModule() {
    return _Module.apply(this, arguments) || this;
  }

  return AppModule;
}(rxcomp.Module);
AppModule.meta = {
  imports: [rxcomp.CoreModule, rxcompForm.FormModule, CommonModule, ControlsModule],
  declarations: [UrbanEnterComponent, UrbanFormComponent, UrbanVideoComponent],
  bootstrap: AppComponent
};rxcomp.Browser.bootstrap(AppModule);})));
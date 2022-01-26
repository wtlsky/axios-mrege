import browserAdapter from 'axios/lib/adapters/xhr';
import nodeAdapter from 'axios/lib/adapters/http';
import md5 from 'md5';

function _typeof(obj) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  }, _typeof(obj);
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
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
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit(arr, i) {
  var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];

  if (_i == null) return;
  var _arr = [];
  var _n = true;
  var _d = false;

  var _s, _e;

  try {
    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _createForOfIteratorHelper(o, allowArrayLike) {
  var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];

  if (!it) {
    if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
      if (it) o = it;
      var i = 0;

      var F = function () {};

      return {
        s: F,
        n: function () {
          if (i >= o.length) return {
            done: true
          };
          return {
            done: false,
            value: o[i++]
          };
        },
        e: function (e) {
          throw e;
        },
        f: F
      };
    }

    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  var normalCompletion = true,
      didErr = false,
      err;
  return {
    s: function () {
      it = it.call(o);
    },
    n: function () {
      var step = it.next();
      normalCompletion = step.done;
      return step;
    },
    e: function (e) {
      didErr = true;
      err = e;
    },
    f: function () {
      try {
        if (!normalCompletion && it.return != null) it.return();
      } finally {
        if (didErr) throw err;
      }
    }
  };
}

function getQuery(url) {
  var query = {};
  var urlParams = new URLSearchParams(new URL(url).search);
  window.urlParams = urlParams;
  urlParams.forEach(function (value, key) {
    return query[key] = value;
  });
  return query;
}
/**
 * 解包formData数据，生成唯一ID
 * @param {*} form 表单数据
 */

function parseFormData(form) {
  var data = {};

  var _iterator = _createForOfIteratorHelper(form.entries()),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var _step$value = _slicedToArray(_step.value, 2),
          key = _step$value[0],
          val = _step$value[1];

      if (val instanceof Blob) {
        // todo 构造blob唯一ID
        data[key] = "".concat(val.size).concat(val.type || 'text');
      } else {
        data[key] = val;
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  return JSON.stringify(data);
}
function isFormData(data) {
  return data instanceof FormData;
}
/**
 * 获取当前执行环境的 origin
 * @returns 
 */

function getOrigin() {
  var isBrowser = typeof window !== 'undefined';

  if (isBrowser) {
    var local = new URL(location.href);
    return local.origin;
  }

  return 'http://127.0.0.1';
}

var Merge = /*#__PURE__*/function () {
  function Merge(config) {
    var _this = this;

    _classCallCheck(this, Merge);

    this.config = config;
    this.createHash();
    this.promise = new Promise(function (resolve, reject) {
      _this.resolve = resolve;
      _this.reject = reject;
    });
  }

  _createClass(Merge, [{
    key: "createHash",
    value: function createHash() {
      var _this$config = this.config,
          url = _this$config.url,
          method = _this$config.method,
          data = _this$config.data,
          params = _this$config.params,
          baseURL = _this$config.baseURL;

      if (!baseURL || !/^http(s)?/.test(baseURL)) {
        baseURL = getOrigin();
      }

      if (!/^http(s)?/.test(url)) {
        url = baseURL + url;
      }

      var _URL = new URL(url);

      var query = getQuery(url); // 从地址上提取 query 参数

      if (_typeof(data) === 'object' && !isFormData(data)) {
        data = JSON.stringify(data);
      }

      if (isFormData(data)) {
        data = parseFormData(data);
      }

      var origin = {
        url: _URL.origin + _URL.pathname,
        method: method.toUpperCase(),
        data: data,
        params: params,
        query: query
      };
      var hash = md5(JSON.stringify(origin)).toUpperCase();
      this.id = hash;
    }
  }]);

  return Merge;
}();

function dispatchAdapter(customAdapter) {
  var mergeQueue = this.mergeQueue;
  var ignoreQueue = this.ignoreQueue;
  var adapter = customAdapter || typeof window !== 'undefined' ? browserAdapter : nodeAdapter;
  return function dispathAxiosMerge(config) {
    var merge = new Merge(config);

    if (config.ignoreMerge) {
      // if request config has ignoreMerge field will append to ignore queue.
      ignoreQueue.set(merge.id, merge);
    }

    if (!mergeQueue.has(merge.id)) {
      // 请求队列中不存在该请求
      adapter(config).then(function (response) {
        if (!ignoreQueue.has(merge.id)) {
          mergeQueue.resolve(merge.id, response);
        } else {
          merge.resolve(response);
        }
      })["catch"](function (error) {
        if (!ignoreQueue.has(merge.id)) {
          mergeQueue.reject(merge.id, error);
        } else {
          merge.reject(error);
        }
      });
    }

    if (!ignoreQueue.has(merge.id)) {
      mergeQueue.add(merge); // 向队列添加合并请求
    }

    return merge.promise;
  };
}

var MergeQueue = /*#__PURE__*/function () {
  function MergeQueue() {
    _classCallCheck(this, MergeQueue);

    this.map = {};
  }

  _createClass(MergeQueue, [{
    key: "add",
    value: function add(merge) {
      var mergeId = merge.id;

      if (!this.map[mergeId]) {
        this.map[mergeId] = [];
      }

      this.map[mergeId].push(merge);
    }
  }, {
    key: "resolve",
    value: function resolve(mergeId, data) {
      var list = this.map[mergeId] || [];

      while (list.length) {
        var merge = list.pop();
        merge.resolve(data);
      }

      this.map[mergeId] = [];
    }
  }, {
    key: "reject",
    value: function reject(mergeId, error) {
      var list = this.map[mergeId] || [];

      while (list.length) {
        var merge = list.pop();
        merge.reject(error);
      }

      this.map[mergeId] = [];
    }
  }, {
    key: "has",
    value: function has(mergeId) {
      return this.map[mergeId] && this.map[mergeId].length > 0;
    }
  }]);

  return MergeQueue;
}();

var AxiosMerge = /*#__PURE__*/function () {
  function AxiosMerge(instance, customAdapter) {
    _classCallCheck(this, AxiosMerge);

    this.mergeQueue = new MergeQueue();
    this.ignoreQueue = new Map();
    instance.defaults.adapter = dispatchAdapter.call(this, customAdapter);
  }

  _createClass(AxiosMerge, [{
    key: "ignore",
    value: function ignore(config) {
      var merge = new Merge(config);
      this.ignoreQueue.set(merge.id, merge);
      return merge;
    }
  }]);

  return AxiosMerge;
}();

export { Merge, AxiosMerge as default };
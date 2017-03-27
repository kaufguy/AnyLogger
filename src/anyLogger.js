/**
 * Created by guy.kaufman on 25/03/2017.
 */

define(function() {

	var loggers = {};
	var consts = {};
	var loggerCount = 0;

	var defaultMessageFormatter = function(message, data) {
		if (data) {
			if (data.scope) {
				message = "[" + data.scope + "]" + message;
			}
			if (data.module) {
				message = "[" + data.module + "]" + message;
			}
		}
		return message;
	};

	// CreateConsoleHandler returns a window console handler object;
	var createConsoleHandler = function () {
		return {
			type: 'console',
			write: (typeof console === "undefined") ? function () { /* no console */ } :
				function (message, level) {
					var handler;
					if (level === consts.logLevels.WARN && console.warn) {
						handler = console.warn;
					} else if (level === consts.logLevels.ERROR && console.error) {
						handler = console.error;
					} else if (level === consts.logLevels.INFO && console.info) {
						handler = console.info;
					} else if (level === consts.logLevels.DEBUG && console.debug) {
						handler = console.debug;
					} else if (level === consts.logLevels.TIME && console.time && console.timeEnd) {
						if (typeof message === 'string') {
							handler = console.time;
						}
						else {
							handler = console.timeEnd;
						}
					}
					if (handler) {
						handler.call(console, message);
					}
				}
		};
	};

	var createHtmlHandler = function(settings)
	{
		var logContainer;
		var logTable;
		var logBody;
		var sortable;
		var order = 0;

		var createSortable = function()
		{
			// ** taken from 'https://github.com/HubSpot/sortable'
			/*Copyright (C) 2013 Adam Schwartz, http://adamschwartz.co

			Permission is hereby granted, free of charge, to any person obtaining a copy
			of this software and associated documentation files (the "Software"), to deal
			in the Software without restriction, including without limitation the rights
			to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
			copies of the Software, and to permit persons to whom the Software is
			furnished to do so, subject to the following conditions:

			The above copyright notice and this permission notice shall be included in
			all copies or substantial portions of the Software.

			THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
			IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
			FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
			AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
			LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
			OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
			THE SOFTWARE.*/
			// ** sortable.js content -- START
			var SELECTOR, addEventListener, clickEvents, numberRegExp, sortable, touchDevice, trimRegExp;

			SELECTOR = 'table[data-sortable]';

			numberRegExp = /^-?[£$¤]?[\d,.]+%?$/;

			trimRegExp = /^\s+|\s+$/g;

			clickEvents = ['click'];

			touchDevice = 'ontouchstart' in document.documentElement;

			if (touchDevice) {
				clickEvents.push('touchstart');
			}

			addEventListener = function(el, event, handler) {
				if (el.addEventListener != null) {
					return el.addEventListener(event, handler, false);
				} else {
					return el.attachEvent("on" + event, handler);
				}
			};

			sortable = {
				init: function(options) {
					var table, tables, _i, _len, _results;
					if (options == null) {
						options = {};
					}
					if (options.selector == null) {
						options.selector = SELECTOR;
					}
					tables = document.querySelectorAll(options.selector);
					_results = [];
					for (_i = 0, _len = tables.length; _i < _len; _i++) {
						table = tables[_i];
						_results.push(sortable.initTable(table));
					}
					return _results;
				},
				initTable: function(table) {
					var i, th, ths, _i, _len, _ref;
					if (((_ref = table.tHead) != null ? _ref.rows.length : void 0) !== 1) {
						return;
					}
					if (table.getAttribute('data-sortable-initialized') === 'true') {
						return;
					}
					table.setAttribute('data-sortable-initialized', 'true');
					ths = table.querySelectorAll('th');
					for (i = _i = 0, _len = ths.length; _i < _len; i = ++_i) {
						th = ths[i];
						if (th.getAttribute('data-sortable') !== 'false') {
							sortable.setupClickableTH(table, th, i);
						}
					}
					return table;
				},
				setupClickableTH: function(table, th, i) {
					var eventName, onClick, type, _i, _len, _results;
					type = sortable.getColumnType(table, i);
					onClick = function(e) {
						var compare, item, newSortedDirection, position, row, rowArray, sorted, sortedDirection, tBody, ths, value, _compare, _i, _j, _k, _l, _len, _len1, _len2, _len3, _len4, _m, _ref, _ref1;
						if (e.handled !== true) {
							e.handled = true;
						} else {
							return false;
						}
						sorted = this.getAttribute('data-sorted') === 'true';
						sortedDirection = this.getAttribute('data-sorted-direction');
						if (sorted) {
							newSortedDirection = sortedDirection === 'ascending' ? 'descending' : 'ascending';
						} else {
							newSortedDirection = type.defaultSortDirection;
						}
						ths = this.parentNode.querySelectorAll('th');
						for (_i = 0, _len = ths.length; _i < _len; _i++) {
							th = ths[_i];
							th.setAttribute('data-sorted', 'false');
							th.removeAttribute('data-sorted-direction');
						}
						this.setAttribute('data-sorted', 'true');
						this.setAttribute('data-sorted-direction', newSortedDirection);
						tBody = table.tBodies[0];
						rowArray = [];
						if (!sorted) {
							if (type.compare != null) {
								_compare = type.compare;
							} else {
								_compare = function(a, b) {
									return b - a;
								};
							}
							compare = function(a, b) {
								if (a[0] === b[0]) {
									return a[2] - b[2];
								}
								if (type.reverse) {
									return _compare(b[0], a[0]);
								} else {
									return _compare(a[0], b[0]);
								}
							};
							_ref = tBody.rows;
							for (position = _j = 0, _len1 = _ref.length; _j < _len1; position = ++_j) {
								row = _ref[position];
								value = sortable.getNodeValue(row.cells[i]);
								if (type.comparator != null) {
									value = type.comparator(value);
								}
								rowArray.push([value, row, position]);
							}
							rowArray.sort(compare);
							for (_k = 0, _len2 = rowArray.length; _k < _len2; _k++) {
								row = rowArray[_k];
								tBody.appendChild(row[1]);
							}
						} else {
							_ref1 = tBody.rows;
							for (_l = 0, _len3 = _ref1.length; _l < _len3; _l++) {
								item = _ref1[_l];
								rowArray.push(item);
							}
							rowArray.reverse();
							for (_m = 0, _len4 = rowArray.length; _m < _len4; _m++) {
								row = rowArray[_m];
								tBody.appendChild(row);
							}
						}
						if (typeof window['CustomEvent'] === 'function') {
							return typeof table.dispatchEvent === "function" ? table.dispatchEvent(new CustomEvent('Sortable.sorted', {
								bubbles: true
							})) : void 0;
						}
					};
					_results = [];
					for (_i = 0, _len = clickEvents.length; _i < _len; _i++) {
						eventName = clickEvents[_i];
						_results.push(addEventListener(th, eventName, onClick));
					}
					return _results;
				},
				getColumnType: function(table, i) {
					var row, specified, text, type, _i, _j, _len, _len1, _ref, _ref1, _ref2;
					specified = (_ref = table.querySelectorAll('th')[i]) != null ? _ref.getAttribute('data-sortable-type') : void 0;
					if (specified != null) {
						return sortable.typesObject[specified];
					}
					_ref1 = table.tBodies[0].rows;
					for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
						row = _ref1[_i];
						text = sortable.getNodeValue(row.cells[i]);
						_ref2 = sortable.types;
						for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
							type = _ref2[_j];
							if (type.match(text)) {
								return type;
							}
						}
					}
					return sortable.typesObject.alpha;
				},
				getNodeValue: function(node) {
					var dataValue;
					if (!node) {
						return '';
					}
					dataValue = node.getAttribute('data-value');
					if (dataValue !== null) {
						return dataValue;
					}
					if (typeof node.innerText !== 'undefined') {
						return node.innerText.replace(trimRegExp, '');
					}
					return node.textContent.replace(trimRegExp, '');
				},
				setupTypes: function(types) {
					var type, _i, _len, _results;
					sortable.types = types;
					sortable.typesObject = {};
					_results = [];
					for (_i = 0, _len = types.length; _i < _len; _i++) {
						type = types[_i];
						_results.push(sortable.typesObject[type.name] = type);
					}
					return _results;
				}
			};

			sortable.setupTypes([
				{
					name: 'numeric',
					defaultSortDirection: 'descending',
					match: function(a) {
						return a.match(numberRegExp);
					},
					comparator: function(a) {
						return parseFloat(a.replace(/[^0-9.-]/g, ''), 10) || 0;
					}
				}, {
					name: 'date',
					defaultSortDirection: 'ascending',
					reverse: true,
					match: function(a) {
						return !isNaN(Date.parse(a));
					},
					comparator: function(a) {
						return Date.parse(a) || 0;
					}
				}, {
					name: 'alpha',
					defaultSortDirection: 'ascending',
					match: function() {
						return true;
					},
					compare: function(a, b) {
						return a.localeCompare(b);
					}
				}
			]);
			return sortable;

			// ** sortable.js content -- END
		};

		var sortTable = function(column)
		{
			logTable.tHead.getElementsByTagName('th')[column].click();
		}

		var filterTable = function(filterValue)
		{
			var td;
			var remainedRowsCount = 0;
			var filter;
			if (typeof filterValue === 'string')
			{
				filter = filterValue;
			}
			else
			{
				var input = document.getElementById("logTableFilter");
				filter = input.value;
			}
			filter = filter.toUpperCase();
			var tr = logBody.getElementsByTagName("tr");

			// Loop through all table rows, and hide those who don't match the search query
			for (var i = 0; i < tr.length; i++) {
				td = tr[i].getElementsByTagName("td");
				for (var j = 0; j < td.length; j++) {
					if (td[j]) {
						if (td[j].innerHTML.toUpperCase().indexOf(filter) > -1) {
							tr[i].style.display = "";
							remainedRowsCount++;
							break;
						} else if (j ===  td.length - 1){
							tr[i].style.display = "none";
						}
					}
				}
			}
			return remainedRowsCount;
		}

		var createTable = function()
		{
			var tableStyle = document.createElement('style');
			logContainer.appendChild(tableStyle);
			tableStyle.innerHTML =
				"#logTable{border-collapse: collapse; height: 100%; width: 100%; display: block; overflow: auto;}" +
				".log-table-row td{border: 1px solid black;} " +
				".log-table-row:nth-child(even){background-color: #d3d3d3}" +
				".log-table-row:hover {background-color: #ffffe0}" +
				".log-table-header {background-color: #90ee90;}" +
				".log-table-header th[data-sortable='false']{cursor: auto;}" +
				".log-table-header th{border: 1px solid black; cursor: pointer;}" +
				".log-table-header th[data-sorted='true']:after {visibility: visible;}" +
				".log-table-header th[data-sorted-direction='descending']:after {border-top-color: inherit;margin-top: 8px;}" +
				".log-table-header th[data-sorted-direction='ascending']:after {border-bottom-color: inherit;margin-top: 3px;}" +
				".log-table-header th:after {content: ''; visibility: hidden;	display: inline-block; vertical-align: inherit; height: 0; width: 0; border-width: 5px;	border-style: solid; border-color: transparent;	margin-right: 1px; margin-left: 10px; float: right;}" +
				"#logTableFilter {font-size: 16px; padding: 5px 5px 5px 10px; border: 1px solid #ddd; margin: 0 0 12px 0;}" +
				"#logTableClear {padding: 4px 32px; display: inline-block; cursor: pointer; font-size: 16px; margin: 0 16px 12px 0}"

			var logTableClear = document.createElement('button');
			logTableClear.innerHTML = 'Clear'
			logTableClear.setAttribute('id', 'logTableClear');
			logTableClear.addEventListener("click", clearTable);
			logContainer.appendChild(logTableClear);

			var logTableFilter = document.createElement('input');
			logTableFilter.setAttribute('type', 'text');
			logTableFilter.setAttribute('id', 'logTableFilter');
			logTableFilter.setAttribute('placeholder', 'Filter');
			logTableFilter.addEventListener("keyup", filterTable);
			logContainer.appendChild(logTableFilter);

			logTable = document.createElement('table');
			logTable.id = "logTable";
			logTable.innerHTML = '<thead class="log-table-header"><tr><th>Order</th><th>Module</th><th>Scope</th><th style="width:100%;">Message</th><th>Level</th></tr></thead><tbody class="log-table-body"></tbody>'
			logContainer.appendChild(logTable);
			logBody = logTable.tBodies[0];
			sortable = createSortable();
			sortable.initTable(logTable);
		}

		var clearTable = function()
		{
			order = 0;
			logBody.innerHTML = '';
		}

		var parseNotUndefined = function(str)
		{
			if (str)
			{
				return str;
			}
			return '';
		}

		var drawTableRow = function(module, scope, message, level)
		{
			var newRow = logBody.insertRow(-1);
			newRow.className = 'log-table-row';
			newRow.innerHTML = '<td>' + order + '</td><td>' + parseNotUndefined(module) + '</td><td>' + parseNotUndefined(scope) + '</td><td>' + message + '</td><td>' + level.name + '</td>';
			order++;
		}

		if (settings && settings.container)
		{
			logContainer = settings.container;
		}
		else
		{
			logContainer = document.createElement('div');
			logContainer.style['width'] = '100%';
			logContainer.style['z-index'] = '9999999';
			document.body.appendChild(logContainer);
		}
		createTable();


		return {
			type: 'html',
			write: function(message, level, data) {
				drawTableRow(data.module, data.scope, message, level)
			},
			sort: sortTable,
			filter: filterTable,
			clear: clearTable
		};
	}

	var AnyLogger = function(config) {
		this.settings = {};
		this.handlers = [];
		this.capturedLogs = [];
		this.id = config.id;

		if (config.captureLogs)
		{
			this.captureLogs(true)
		}
		if (config.handlers)
		{
			if (config.handlers.constructor === Array) {
				config.handlers.forEach(function(handler)
				{
					if (typeof handler === 'function')
					{
						this.handlers.push({type: 'custom', write: handler});
					}
					else {
						this.handlers.push(handler);
					}
				}.bind(this));

			}
		}
		if (config.logToConsole != false)
		{
			this.handlers.push(createConsoleHandler());
		}
		if (config.logToHtml)
		{
			this.handlers.push(createHtmlHandler({container: config.logToHtml.container}));
		}
		if (config.formatter)
		{
			this.formatter = config.formatter;
		} else if (config.useFormatter != false) {
			this.formatter = defaultMessageFormatter;
		}
		if (config.logLevel)
		{
			this.logLevel(config.logLevel.toUpperCase());
		}
		else
		{
            this.logLevel(consts.defaultLogLevel);
        }
		if (config.module)
		{
			this.settings.module = config.module;
		}
		if (config.collectConsoleLogs)
		{
			collectConsoleLogs.call(this);
		}
	};

	var prototype = AnyLogger.prototype;

	// Changes the instance logging level and returns the logging level.
	prototype.logLevel = function (newLevel) {
		if (typeof newLevel === 'string' && newLevel in consts.logLevels) //case string as an input
		{
			this.settings.logLevel = consts.logLevels[newLevel];
		}
		else if (newLevel && newLevel.name in consts.logLevels) //case object as an input
		{
			this.settings.logLevel = consts.logLevels[newLevel.name];
		}
		return this.settings.logLevel.name;
	};

	prototype.captureLogs = function(capture)
	{
		this.settings.captureLogs = capture;
	}

	prototype.debug = function (message, data) {
		this.trigger(message, consts.logLevels.DEBUG, data);
	};

	prototype.info = function (message, data) {
		this.trigger(message, consts.logLevels.INFO, data);
	};

	prototype.warn = function (message, data) {
		this.trigger(message, consts.logLevels.WARN, data);
	};

	prototype.error = function (message, data) {
		this.trigger(message, consts.logLevels.ERROR, data);
	};

	prototype.time = function (message, data) {
		this.trigger(message, consts.logLevels.TIME, data);
	};

	prototype.timeEnd = function (message, data) {
		this.trigger([ message, 'end' ], consts.logLevels.TIME, data);
	};

	prototype.trigger = function (message, level, data) {
		if (message && enabledFor.call(this,level))
		{
			var parsedData = data || {};
			parsedData.module = this.settings.module;
			if (this.formatter && !isCollected(data)) //don't format collected message
			{
				var formatterData = data || {};
				formatterData.module = this.settings.module;
				message = this.formatter(message, parsedData);
			}
			if (this.handlers && this.handlers.constructor === Array) {
				this.handlers.forEach(function(handler)
				{
					if (!isCollected(data) || handler.type != 'console') { //don't log to console messages that were collected from there.
						handler.write(message, level, parsedData);
					}
				});
			}
			if (this.settings.captureLogs)
			{
				this.capturedLogs.push({
					message: message,
					level: level,
					data: data,
					date: new Date()
				})
			}
		}

	};

	prototype.dumpArray = function()
	{
		return this.capturedLogs;
	};

	prototype.getHandlerByType = function (type) {
		var handlerRet;
		this.handlers.some(function (handler) {
			if (handler.type === type)
			{
				handlerRet = handler;
				return true;
			}
		});
		return handlerRet;
	}

	var collectConsoleLogs = function() {
		var self = this;
		if (console.log) {
			var oldLog = console.log;
			console.log = function (message) {
				self.trigger(message, consts.logLevels.DEBUG, {collected: true})
				oldLog.apply(console, arguments);
			}
		}
		if (console.debug) {
			var oldDebug = console.debug;
			console.debug = function (message) {
				self.trigger(message, consts.logLevels.DEBUG, {collected: true})
				oldDebug.apply(console, arguments);
			}
		}
		if (console.info) {
			var oldInfo = console.info;
			console.info = function (message) {
				self.trigger(message, consts.logLevels.INFO, {collected: true})
				oldInfo.apply(console, arguments);
			}
		}
		if (console.time) {
			var oldTime = console.time;
			console.time = function (message) {
				self.trigger(message, consts.logLevels.TIME, {collected: true})
				oldTime.apply(console, arguments);
			}
		}
		if (console.timeEnd) {
			var oldTimeEnd = console.timeEnd;
			console.timeEnd = function (message) {
				self.trigger(message, consts.logLevels.TIME, {collected: true})
				oldTimeEnd.apply(console, arguments);
			}
		}
		if (console.warn)
		{
			var oldWarn = console.warn;
			console.warn = function(message){
				self.trigger(message, consts.logLevels.WARN, {collected: true})
				oldWarn.apply(console, arguments);
			}
		}
		if (console.error) {
			var oldError = console.error;
			console.error = function (message) {
				self.trigger(message, consts.logLevels.ERROR, {collected: true})
				oldError.apply(console, arguments);
			}
		}
	}

	var isCollected = function(data)
	{
		return data && data.collected;
	}

	var enabledFor = function (level) {
		var logLevel = this.settings.logLevel;
		return level.value >= logLevel.value;
	};

	var create = function(config)
	{
		if (!config)
		{
			config = {id: 'logger' + loggerCount};
		}
		else if (!config.id)
		{
			config.id = 'logger' + loggerCount;
		}
		var logger = new AnyLogger(config);
		loggers[logger.id] = logger;
        loggerCount++;
		return logger;
	};

	var getLoggerById = function (id) {
		return loggers[id]
    }

    consts.logLevels = {};
    consts.logLevels.DEBUG = {value: 1, name: 'DEBUG'};
    consts.logLevels.INFO = {value: 2, name: 'INFO'};
    consts.logLevels.TIME = {value: 3, name: 'TIME'};
    consts.logLevels.WARN = {value: 4, name: 'WARN'};
    consts.logLevels.ERROR = {value: 5, name: 'ERROR'};
    consts.logLevels.FATAL = {value: 9, name: 'FATAL'};
    consts.logLevels.OFF = {value: 10, name: 'OFF'};
    consts.defaultLogLevel = consts.logLevels.OFF;

    return {
		create: create,
		getLoggerById: getLoggerById,
		consts: consts
    };

});

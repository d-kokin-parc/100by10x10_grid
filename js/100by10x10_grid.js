/**
 * Позволяет добавлять на любую страницу нашу сетку 10x10 пикселей (квадратами
 * по 100 пикселей). Сетка управляемая, можно её двигать и всячески настраивать.
 */
;(function(document, options) {

	var documentBody = document.getElementsByTagName('body')[0];

	/**
	 * Объект сетки
	 */
	var Grid = function(container, options) {

		var Grid = function(container, options) {
			this.grid = null; // DOM-элемент сетки
			this.gridStyles = null; // DOM-элемент стилей сетки

			this.options = options || {};

			this.initialize.apply(this, [options]);
		};

		$.extend(Grid.prototype, {

			/**
			 * Таблица соответствий кодов нажимаемых на клавиатуре клавиш
			 * предполагаемым действиям с таблицей
			 */
			keymap: {
				37: this.moveLeft,
				38: this.moveUp,
				39: this.moveRight,
				40: this.moveDown,
				27: this.removeGrid
			},

			/**
			 * Конструктор
			 */
			initialize: function(options) {
				this
					.addGrid()
					.bindGrid();
			},

			/**
			 * Добавляет сетку на страницу
			 */
			addGrid: function() {
				if (!this.grid) {
					var gridContainer = document.createElement('div');

					gridContainer.className = 'da-grid';
					documentBody.appendChild(gridContainer);

					this.grid = gridContainer;

					this.appendStyles();
				}

				return this;
			},

			/**
			 * Добавляет стили для сетки
			 */
			appendStyles: function() {
				var head = document.getElementsByTagName('head'),
					stylesElement;

				if (!this.gridStyles) {
					if (this.options.styles) {
						stylesElement = document.createElement('style');
						stylesElement.type = 'text/css';
						if (stylesElement.styleSheet) {
							stylesElement.styleSheet.cssText = this.options.styles;
						} else {
							stylesElement.appendChild(document.createTextNode(this.options.styles));
						}

						if (head && head[0]) {
							head[0].appendChild(stylesElement);
						} else {
							documentBody.write('<style type="text/css">' + this.options.styles + '</styles>');
						}
					}

					this.gridStyles = stylesElement;
				}

				return this;
			},

			/**
			 * Навешивает события на сетку
			 */
			bindGrid: function() {
				$.attachEventHandler(document, 'keydown', function(event) {
					var keyCode = event.keyCode;

					if (this.keymap[keyCode] && typeof this.keymap[keyCode] === 'function') {
						this.keymap[keyCode]();
					}
				}, this);

				return this;
			},

			/**
			 * Удаляет сетку
			 */
			removeGrid: function() {
				console.log('Grid removed');
			}

		});

		return new Grid(container, options);

	};



	/**
	 * Наш собственный ручной "jQuery" с блекджеком и маркитантками
	 */
	var $ = function() {

		/**
		 * Применяет контекст к методу
		 * @param {!Object} obj - контекст
		 * @param {function(?Object)} method - метод
		 * @return {Object}
		 */
		var _contextOf = function(obj, method) {
				return function() {
					method.apply(obj, arguments);
				};
			},

			/**
			 * Итератор по объекту
			 * @param {!Object} obj - объект
			 * @param {function(?Object)} method - метод для итерирования
			 * @param {?Object} context - контекст выполнения итератора
			 */
			_each = function(obj, iterator, context) {
				var breaker = {};

				for (var key in obj) {
					if (hasOwnProperty.call(obj, key)) {
						if (iterator.call(context, obj[key], key, obj) === breaker) return;
					}
				}
			};

		return {

			/**
			 * Расширяет текущий объект данными объекта-источника
			 * @param {!Object} obj - источник
			 */
			extend: function(obj) {
				_each(Array.prototype.slice.call(arguments, 1), function(source) {
					for (var prop in source) {
						if (source[prop] !== void 0) obj[prop] = source[prop];
					}
				});

				return obj;
			},

			/**
			 * Навешивает событие, сохраняя контекст
			 * @param {!Object} element - элемент-источник события
			 * @param {string} eventString - имя события
			 * @param {function(?Object)} - обработчик события
			 * @param {?Object} - контекст выполнения обработчика
			 */
			attachEventHandler: function(element, eventString, handler, context) {
				if (typeof context != 'undefined' && context) {
					if (element.addEventListener) { // W3C DOM
						element.addEventListener(eventString, _contextOf(context, handler), false);
					} else if (element.attachEvent) {// IE DOM
						element.attachEvent('on' + eventString, _contextOf(context, handler));
					}
				} else {
					if (element.addEventListener) {// W3C DOM
						element.addEventListener(eventString, handler, false);
					} else if (element.attachEvent) {// IE DOM
						element.attachEvent('on' + eventString, handler);
					}
				}
			}

		}

	}();
	
	// Создадим новый объект сетки
	return new Grid(documentBody, options);

}(document,

	/**
	 * Объект настроек для букмарклета
	 */
	{
		// Стили для сетки
		styles: '.da-grid { background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAABBElEQVR42u3XwQ2AIBAEQCrA2KT9d4CoBcAD8BLG5H77usFLNuXjLCbOvCD1S62p3yU3PwcEiBwQIHJAgMgBAWKBv4A8YRNjPpD250UPyPUsGQgQIECAyAEBYtFAgABZDKKpa+r+ECcLiBwQIBYNBAgQIECAaOpGU3ey5IAAsWggQIAAAQIECBBNXVOXc7KAWDQQIECAAAECBAgQTd1o6k6WRQMBAgQIECBAgAABIqepa+rFH+JkAbFoIECAAAECBIgcEE3daOpOlkUDAQIECBAgQOSAAAGiqWvqXr6TBQQIECBAgGyfAwIECBBN3Uxv6l50nBwQIHJAgMgBASIHBIgFrs7diccA287A5QoAAAAASUVORK5CYII=); position: absolute; top: 0; left: 0; right: 0; bottom: 0; z-index: 999 }'
	}
));
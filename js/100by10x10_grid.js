/**
 * Позволяет добавлять на любую страницу нашу сетку 10x10 пикселей (квадратами
 * по 100 пикселей). Сетка управляемая, можно её двигать и всячески настраивать.
 * 
 * Добавляется на страницу с помощью вот такой ссылки
 * javascript:(function(){_my_script=document.createElement('SCRIPT');_my_script.type='text/javascript';_my_script.src='https://github.com/d-kokin-parc/100by10x10_grid/raw/master/js/100by10x10_grid.js';document.getElementsByTagName('head')[0].appendChild(_my_script);})();
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
			 * Координаты сетки
			 */
			coords: {
				x: 0,
				y: 0
			},

			/**
			 * Таблица соответствий кодов нажимаемых на клавиатуре клавиш
			 * предполагаемым действиям с таблицей
			 */
			keymap: {
				37: 'moveLeft',
				38: 'moveUp',
				39: 'moveRight',
				40: 'moveDown',
				27: 'removeGrid'
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
			 * Перерисовывает сетку
			 */
			redrawGrid: function() {
				if (this.grid) {
					this.grid.style.backgroundPosition = this.coords.x + 'px ' + this.coords.y + 'px';
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

					$.preventDefault(event);

					if (this.keymap[keyCode] && typeof this[this.keymap[keyCode]] === 'function') {
						this[this.keymap[keyCode]]();
					}

					// Не могу разобраться почему обработчик на самом деле не детачится
					if (keyCode == 29) {
						$.detachEventHandler(document, 'keydown', arguments.callee);
					}
				}, this);

				return this;
			},

			/**
			 * Удаляет сетку
			 */
			removeGrid: function() {
				// Чистим DOM и память
				this.gridStyles && this.gridStyles.parentNode.removeChild(this.gridStyles);
				this.grid && container.removeChild(this.grid);

				this.gridStyles = this.grid = null;
			},

			/**
			 * 
			 * Управление сеткой
			 * 
			 */

			// TODO: Неплохо-бы тут впихнуть работу с координатами через сеттеры

			/**
			 * Двигает сетку влево на 1 пиксель
			 */
			moveLeft: function() {
				this.coords.x--;
				this.redrawGrid();
			},

			/**
			 * Двигает сетку вправо на 1 пиксель
			 */
			moveRight: function() {
				this.coords.x++;
				this.redrawGrid();
			},

			/**
			 * Двигает сетку вверх на 1 пиксель
			 */
			moveUp: function() {
				this.coords.y--;
				this.redrawGrid();
			},

			/**
			 * Двигает сетку вниз на 1 пиксель
			 */
			moveDown: function() {
				this.coords.y++;
				this.redrawGrid();
			},

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
			 * @param {function(?Object)} handler - обработчик события
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
			},

			/**
			 * Удаляет обработчик события с заданного элемента
			 * @param {!Object} element - элемент-источник события
			 * @param {string} eventString - имя события
			 * @param {function(?Object)} handler - обработчик события
			 */
			detachEventHandler: function(element, eventString, handler) {
				if (element.removeEventListener) {
					element.removeEventListener(eventString, handler, false);
				} else if (element.detachEvent) {
					element.detachEvent('on' + eventString, handler);
				}
			},

			/**
			 * Предотвращает стандартное действие события
			 * @param {!Object} e - событие
			 */
			preventDefault: function(e) {
				e = e || win.event;
				if (e.preventDefault) {
					e.preventDefault();
				}
				e.returnValue = false; // IE
			},

			/**
			 * Останавливает всплытие события
			 * @param {!Object} e - событие
			 */
			stopEventPropagation: function(e) {
				e = e || win.event;

				if (e.stopPropagation) {
					e.stopPropagation();
				}
				e.cancelBubble = true; // IE
			},

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
		styles: '.da-grid { background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAABBElEQVR42u3XwQ2AIBAEQCrA2KT9d4CoBcAD8BLG5H77usFLNuXjLCbOvCD1S62p3yU3PwcEiBwQIHJAgMgBAWKBv4A8YRNjPpD250UPyPUsGQgQIECAyAEBYtFAgABZDKKpa+r+ECcLiBwQIBYNBAgQIECAaOpGU3ey5IAAsWggQIAAAQIECBBNXVOXc7KAWDQQIECAAAECBAgQTd1o6k6WRQMBAgQIECBAgAABIqepa+rFH+JkAbFoIECAAAECBIgcEE3daOpOlkUDAQIECBAgQOSAAAGiqWvqXr6TBQQIECBAgGyfAwIECBBN3Uxv6l50nBwQIHJAgMgBASIHBIgFrs7diccA287A5QoAAAAASUVORK5CYII=); position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 999 }'
	}
));
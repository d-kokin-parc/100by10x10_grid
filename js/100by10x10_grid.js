/**
 * Позволяет добавлять на любую страницу нашу сетку 10x10 пикселей (квадратами
 * по 100 пикселей). Сетка управляемая, можно её двигать и всячески настраивать.
 */
;(function(document, options) {

	var documentBody = document.getElementsByTagName('body')[0],
		gridElement,
		stylesElement,

		/**
		 * Добавляет контейнер для сетки на страницу
		 */
		appendGridContainer = function() {
			var gridContainer = document.createElement('div');

			gridContainer.className = 'da-grid';
			documentBody.appendChild(gridContainer);

			return gridContainer;
		},

		/**
		 * Добавляет стили для сетки
		 */
		appendStyles = function() {
			var head = document.getElementsByTagName('head'),
				stylesElement;

			if (options.styles) {
				stylesElement = document.createElement('style');
				stylesElement.type = 'text/css';
				if (stylesElement.styleSheet) {
					stylesElement.styleSheet.cssText = options.styles;
				} else {
					stylesElement.appendChild(document.createTextNode(options.styles));
				}

				if (head && head[0]) {
					head[0].appendChild(stylesElement);
				} else {
					documentBody.write('<style type="text/css">' + options.styles + '</styles>');
				}
			}

			return stylesElement;
		};

	gridElement = appendGridContainer();
	stylesElement = appendStyles();

}(document,

	/**
	 * Объект настроек для букмарклета
	 */
	{
		// Стили для сетки
		styles: '.da-grid { background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAABBElEQVR42u3XwQ2AIBAEQCrA2KT9d4CoBcAD8BLG5H77usFLNuXjLCbOvCD1S62p3yU3PwcEiBwQIHJAgMgBAWKBv4A8YRNjPpD250UPyPUsGQgQIECAyAEBYtFAgABZDKKpa+r+ECcLiBwQIBYNBAgQIECAaOpGU3ey5IAAsWggQIAAAQIECBBNXVOXc7KAWDQQIECAAAECBAgQTd1o6k6WRQMBAgQIECBAgAABIqepa+rFH+JkAbFoIECAAAECBIgcEE3daOpOlkUDAQIECBAgQOSAAAGiqWvqXr6TBQQIECBAgGyfAwIECBBN3Uxv6l50nBwQIHJAgMgBASIHBIgFrs7diccA287A5QoAAAAASUVORK5CYII=); position: absolute; top: 0; left: 0; right: 0; bottom: 0; z-index: 999 }'
	}
));
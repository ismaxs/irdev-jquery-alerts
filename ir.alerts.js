/** 
	----------------------------------------------------------
	Plugin para creacion de alertas personalizables

				Autor: 		Ismael Rodriguez # IRDEV
				Version: 	v0.2 alpha # 16-04-2013
				Licencia: 	MIT
				Contacto: 	ismaxs@gmail.com
				Info: 		www.irdev.com
	----------------------------------------------------------
*/
(function($){

	var plugin = {};

	var defaults = {
		// GENERAL
		alertSelectorID: null,
		type: 'info', // info, warning, error
		position: null, // tray, top-left, top-right
		cssClass: null,
		openEasing: '',
		closeEasing: '',
		showDuration: 500,
		hideDuration: 500,
		autoCloseTime: null,
		message: '',
		
		// CALLBACKS
		onAlertShowInit: function() {},
		onAlertShowEnd: function() {},
		onAlertHideInit: function() {},
		onAlertHideEnd: function() {}
	}

	$.fn.irAlert = function(options){

		if(this.length == 0) return this;

		// soporte para multiples elementos (instancias del plugin)
		if(this.length > 1){
			this.each(function(){$(this).irAlert(options)});
			return this;
		}

		// creamos un namespace que sera usado por el plugin
		var alert = {};
		// establecemos una referencia al elemento spoiler
		var elm = this;
		plugin.elm = this;

		/**
		 * ===================================================================================
		 * = FUNCIONES PRIVADAS
		 * ===================================================================================
		 */

		 /**
		 * Inicializa el namespace con las opciones que serán usadas por el plugin
		 */
		var init = function(){
			// mezclamos las opciones por defecto con las opciones del user
			alert.settings = $.extend({}, defaults, options);

			// Modificaciones en DOM & CSS
			setup();
		}

		/**
		 * Modificaciones en DOM & CSS
		 */
		var setup = function() {
			// Definimos el contenedor de la alerta
			alert.container = $("<div class='ir-alert ir-alert-hidden'></div>");
			// Comprobamos si es autoClose
			if (alert.settings.autoCloseTime == null){
				alert.closeButton = $("<span class='ir-alert-closebutton'>x</span>");
				alert.closeButton.appendTo(alert.container);
				// Asignamos los eventos al boton de cierre
				alert.closeButton.bind('click', clickClose);
			} else {
				// Definimos el temporizador
				setAutoClose();
			}
			// Comprobamos el tipo de alert y asignamos el css
			if (alert.settings.type != null){
				setAlertType();
			}
			// Establecemos la posicion
			setAlertPosition();
			// Establecemos el contenedor de la alerta
			alert.messageContainer = $("<div class='ir-alert-messageContainer'></div>)");
			// Comprobamos si se ha establecido un mensaje
			if (alert.settings.message != null){
				alert.messageContainer.html(alert.settings.message);
			}
			// Agregamos el contenido a la alerta
			alert.container.append(alert.messageContainer);
		}

		/**
		 * Establece el tipo de alerta
		 */
		var setAlertType = function() {
			switch(alert.settings.type)
			{
				case 'info':
					alert.container.addClass('ir-alert-type-info');
					break;
				case 'warning':
					alert.container.addClass('ir-alert-type-warning');
					break;
				case 'error':
					alert.container.addClass('ir-alert-type-error');
					break;
			}
		}

		/**
		 * Establece la posicion de la alerta
		 */
		var setAlertPosition = function() {
			// Comprobamos si va en un selector definido
			if (alert.settings.alertSelectorID == null) {
				// Comprobamos la posicion de la alerta y asignamos el css
				if (alert.settings.position != null){
					switch(alert.settings.position)
					{
						case 'tray':
						  	alert.container.addClass('ir-alert-position-tray');
						  	break;
						case 'topleft':
						  	alert.container.addClass('ir-alert-position-topleft');
						 	break;
						case 'topright':
						  	alert.container.addClass('ir-alert-position-topright');
						  	break;
						default:
							alert.container.addClass('ir-alert-position-topright');
					}
				} else {
					// No tiene posicion ni selector, lo añadimos a continuacion del elemento padre
					alert.container.insertAfter(elm);
				}
			} else {
				// Añadimos el contenedor al selector asignado
				alert.container.appendTo("#" + alert.settings.alertSelectorID);
			}
		}

		/**
		 * Configura el temporizador de cierre
		 */
		var setAutoClose = function() {

		}

		/**
		 * Click en el boton de cierre
		 *
		 * @param e (event) 
		 *  - DOM event object
		 */
		var clickClose = function(e) {
			// on Init Close
			alert.settings.onAlertHideInit();
			// Comprobamos el tipo de animacion
			if (alert.settings.closeEasing === "slide") {
				elm.slideUp(alert.settings.closeDuration, alert.settings.onAlertHideEnd);
			} else if (spoiler.settings.closeEasing === "fade") {
				elm.fadeOut(alert.settings.closeDuration, alert.settings.onAlertHideEnd);
			} else {
				elm.hide(alert.settings.closeDuration, alert.settings.onAlertHideEnd);
			}
			e.preventDefault();
		}

		/**
		 * ===================================================================================
		 * = FUNCIONES PUBLICAS
		 * ===================================================================================
		 */
		
		/**
		 * Muestra el contenido del spoiler
		 *
		 * @param content (string) 
		 *  - string
		 */
		elm.setContent = function(content){
			alert.settings.message = content;
			alert.messageContainer.html(alert.settings.message);
		}

		/**
		 * Establece el tipo de alerta
		 *
		 * @param alertType (string) 
		 *  - info, warning, error
		 */
		elm.setType = function(alertType){
			if (alertType === 'info' || alertType === 'warning' || alertType === 'error') {
				alert.settings.type = alertType;
				alert.container.removeAttr('class').addClass('ir-alert');
				setAlertType();
				setAlertPosition();
			}
		}

		/**
		 * Establece la posicion
		 *
		 * @param alertType (string) 
		 *  - info, warning, error
		 */
		elm.setPosition = function(alertPosition){
			if (alertPosition === 'tray' || alertPosition === 'topleft' || alertPosition === 'topright') {
				alert.settings.alertSelectorID = null;
				alert.settings.position = alertPosition;
				setAlertPosition();
			}
		}

		/**
		 * Oculta la alerta
		 *
		 * @param useSettings (boolean) 
		 *  - si true, utiliza la configuracion establecida previamente al componente
		 */
		elm.hideNow = function(useSettings){
			if (useSettings === true){

			} else {
				alert.container.hide();
			}	
		}

		/**
		 * Muestra la alerta
		 *
		 * @param useSettings (boolean) 
		 *  - si true, utiliza la configuracion establecida previamente al componente
		 */
		elm.showNow = function(useSettings){
			if (useSettings === true){

			} else {
				alert.container.show();
			}
		}

		init();
		
		// devolvemos el objeto jQuery actual
		return this;
	}
})(jQuery);
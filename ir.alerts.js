/** 
	----------------------------------------------------------
	Plugin para creacion de alertas personalizables

				Autor: 		Ismael Rodriguez # IRDEV
				Version: 	v0.7 beta # 27-05-2013
				License: 	-
				Contacto: 	ismaxs@gmail.com
				Info: 		I´m developing my website
	----------------------------------------------------------
*/

(function($){

	var plugin = {};

	var defaults = {
		// GENERAL
		alertSelectorID: null,	// ID selector where alert show
		type: 'info', 			// info, warning, error, success
		position: null, 		// trayleft, trayright, topleft, topright, 
		cssClass: null,			// custom css for alert container
		openEasing: '', 		// slide, fade, _blank= '' 
		closeEasing: '',		// slide, fade, _blank= ''
		showDuration: 500,		// time in miliseconds 
		hideDuration: 500,		// time in miliseconds
		autoCloseTime: null,	// time in miliseconds, null if manual close
		message: '',			// set message for alert
		showIcon: true,			// boolean for show or not show
		
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
		// establecemos una referencia al elemento alerta
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
			alert.container = $("<div class='ir-alert'></div>");
			// Comprobamos si es autoClose
			if (alert.settings.autoCloseTime == null){
				alert.closeButton = $("<span class='ir-alert-closebutton'>x</span>");
				alert.closeButton.appendTo(alert.container);
				// Asignamos los eventos al boton de cierre
				alert.closeButton.bind('click', clickClose);
			} else {
				// es autoclose, creamos el contenedor de la progress bar
				alert.progressContainer = $("<div></div>").attr({class: 'ir-progress'});
			}
			// Comprobamos el tipo de alert y asignamos el css
			if (alert.settings.type != null){
				setAlertType();
			}
			// Establecemos la posicion
			setAlertPosition();
			// Estructura de la alerta
			alert.contentStruct = $("<div class='ir-alert-content'></div>");
			alert.contentStruct.appendTo(alert.container);
			if (alert.settings.showIcon) {
				setAlertIcon(alert.contentStruct);
			}
			// Establecemos el contenedor de la alerta
			alert.messageContainer = $("<div class='ir-alert-messageContainer'></div>)");
			// Comprobamos si se ha establecido un mensaje
			if (alert.settings.message != null){
				alert.messageContainer.html(alert.settings.message);
			}
			// Agregamos el contenido a la alerta
			alert.messageContainer.appendTo(alert.contentStruct);
			if (alert.settings.autoCloseTime != null) {
				// Agregamos la progress bar
				alert.progressContainer.insertAfter(alert.contentStruct);
				// añadimos la clase de animacion (progress bar)
				setupPogressBarCss();
			}
		}

		/**
		 * Añade la clase css que mostrará la animacion css para la barra de progreso
		 * teniendo en cuenta el tiempo definido de autocierre 
		 */
		var setupPogressBarCss = function() {
			var css = '\
				.ir-alert.ir-alert-active .ir-progress {\
					-webkit-animation: runProgress alert.settings.autoCloseTimems linear forwards 0.8s;\
					-moz-animation: runProgress alert.settings.autoCloseTimems linear forwards 0.8s;\
					-o-animation: runProgress alert.settings.autoCloseTimems linear forwards 0.8s;\
					-ms-animation: runProgress alert.settings.autoCloseTimems linear forwards 0.8s;\
					animation: runProgress alert.settings.autoCloseTimems linear forwards 0.8s;\
				}\ ';

			css = css.replace(/alert.settings.autoCloseTime/g, alert.settings.autoCloseTime);
			$('head').append('<style type="text/css"> '+ css +' </style>');
		}

		/**
		 * Establece el icono de la alerta
		 */
		var setAlertIcon = function(parent) {
			alert.iconContainer = $("<div class='ir-alert-icon'></div>");
			switch(alert.settings.type)
			{
				case 'info':
					alert.iconContainer.addClass('ir-alert-icon-info');
					break;
				case 'warning':
					alert.iconContainer.addClass('ir-alert-icon-warning');
					break;
				case 'error':
					alert.iconContainer.addClass('ir-alert-icon-error');
					break;
				case 'success':
					alert.iconContainer.addClass('ir-alert-icon-success');
					break;
			}
			alert.iconContainer.appendTo(parent);
		}

		/**
		 * Modifica la imagen
		 */
		var changeAlertIcon = function(type) {
			if (type == 'error' || type == 'warning' || type == 'success' || type == 'info') {
				alert.iconContainer.removeAttr("class").addClass('ir-alert-icon ir-alert-icon-' + type);
			}
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
				case 'success':
					alert.container.addClass('ir-alert-type-success');
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
						case 'trayleft':
						  	alert.container.addClass('ir-alert-position-trayleft');
						  	break;
						case 'topleft':
						  	alert.container.addClass('ir-alert-position-topleft');
						 	break;
						case 'topright':
						  	alert.container.addClass('ir-alert-position-topright');
						  	break;
						case 'trayright':
							alert.container.addClass('ir-alert-position-trayright');
							break;
					}
					// Agregamos la alerta al body
					alert.container.appendTo("body");
					// Setup animation with scroll
					setupAlertAnimationScroll();
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
		 * Anima el contenedor de la alerta acorde al movimiento del scroll
		 */
		var setupAlertAnimationScroll = function() {
			$(window).scroll(function () {
				// TODO
			});
		}

		/**
		 * Click en el boton de cierre
		 *
		 * @param e (event) 
		 *  - DOM event object
		 */
		var clickClose = function(e) {
			hideAlert();
			e.preventDefault();
		}

		/**
		 * Muestra la alerta
		 */
		var showAlert = function() {
			alert.container.stop().hide();
			alert.settings.onAlertShowInit();
			// Comprobamos el tipo de animacion
			if (alert.settings.closeEasing === "slide") {
				alert.container.slideDown(alert.settings.showDuration, alert.settings.onAlertShowEnd);
			} else if (alert.settings.closeEasing === "fade") {
				alert.container.fadeIn(alert.settings.showDuration, alert.settings.onAlertShowEnd);
			} else {
				alert.container.show(alert.settings.showDuration, alert.settings.onAlertShowEnd);
			}
			// Autoclose
			if (alert.settings.autoCloseTime != null) {
				// css animacion
				alert.container.addClass('ir-alert-active');
				alert.container.delay(alert.settings.autoCloseTime);
				elm.delay(alert.settings.autoCloseTime).hideNow(true);
			}
		}

		/**
		 * Oculta la alerta
		 */
		var hideAlert = function() {
			// on Init Close
			alert.settings.onAlertHideInit();
			// Comprobamos el tipo de animacion
			if (alert.settings.closeEasing === "slide") {
				alert.container.slideUp(alert.settings.closeDuration, alert.settings.onAlertHideEnd);
			} else if (alert.settings.closeEasing === "fade") {
				alert.container.fadeOut(alert.settings.closeDuration, alert.settings.onAlertHideEnd);
			} else {
				alert.container.hide(alert.settings.closeDuration, alert.settings.onAlertHideEnd);
			}
		}

		/**
		 * ===================================================================================
		 * = FUNCIONES PUBLICAS
		 * ===================================================================================
		 */
		
		/**
		 * Muestra el contenido de la alerta
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
			if (alertType === 'info' || alertType === 'warning' || alertType === 'error' || alertType === 'success') {
				alert.settings.type = alertType;
				alert.container.removeAttr('class').addClass('ir-alert');
				setAlertType();
				setAlertPosition();
				changeAlertIcon(alertType);
			}
		}

		/**
		 * Establece la posicion
		 *
		 * @param alertPosition (string) 
		 *  - trayleft, trayright, topleft, topright
		 */
		elm.setPosition = function(alertPosition){
			if (alertPosition === 'trayleft' || alertPosition === 'trayright' || alertPosition === 'topleft' 
				|| alertPosition === 'topright') {
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
				hideAlert();
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
				showAlert();
			} else {
				alert.container.show();
			}
		}

		init();
		
		// devolvemos el objeto jQuery actual
		return this;
	}
})(jQuery);
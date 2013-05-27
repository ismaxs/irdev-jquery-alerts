irAlerts - irdev-jquery-alerts
==============================

#irALerts 0.7 Beta
##The fully-loaded, responsive jQuery alerts component

Written by: Ismael Rodriguez - I´m building my website!!

###License
Not yet

##Installation

###Step 1: Link required files

First and most important, the jQuery library needs to be included (no need to download - link directly from Google). Next, download the package from this site and link the irAlert CSS file (for the theme) and the irAlert Javascript file.

```html
<!-- jQuery library (served from Google) -->
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
<!-- irAlerts Javascript file -->
<script src="/irAlerts.js"></script>
<!-- irAlerts CSS file -->
<link href="/irAlerts.css" rel="stylesheet" />
```

###Step 2: Create HTML markup

Create a `<div id="selectorID"></div>` element.

```html
<div id="selectorID"></div>
```

###Step 3: Call the irAlert

Call .irAlert() on `<div id="selectorID"></div>`.

```javascript
$(document).ready(function(){
  $('#selectorID').irAlert();
});
```

##Configuration options

###General

**Another container for alert**  
The alert will be inside this
```
default: 'null'  
options: 'anotherSelectorID'
```

**type**  
type of alert
```
default: 'info'  
options: 'info', 'warning', 'error', 'success'
```

**position**  
Screen position for the alert (not in selectorID) will be append on body
```
default: 'null'  
options: 'trayleft', 'trayright', 'topleft', 'topright'
```

**cssClass**  
Additional CSS class for alert container
```
default: 'null'
options: any CSS Class in your custom css styles
```

**openEasing**  
Show effect transition for the alert
```
default: ''  
options: 'slide', 'fade'
```

**closeEasing**  
Hide effect transition for the alert
```
default: ''  
options: 'slide', 'fade'
```

**showDuration**  
Time for show transition effect (in ms)
```
default: 500  
options: any number in ms
```

**hideDuration**  
Time for hide transition effect (in ms)
```
default: 500  
options: any number in ms
```

**autoCloseTime**  
The alert is automatically hidden in the selected time showing a progress bar animated using CSS3 (in ms).<br />Note: This overrides the manual close button !
```
default: null  
options: any number in ms
```

**message**  
Text to display the alert (can be HTML)
```
default: ''  
options: any text
```

**showIcon**  
Controls whether the alert displays the icon for the selected alert type
```
default: true  
options: boolean (true / false)
```

###Callbacks

**onAlertShowInit**  
-
```
default: function(){}  
options: function(){ // your code here }
```

**onAlertShowEnd**  
-
```
default: function(){}  
options: function(){ // your code here }
```

**onAlertHideInit**  
-
```
default: function(){}  
options: function(){ // your code here }
```

**onAlertHideEnd**  
-
```
default: function(){}  
options: function(){ // your code here }
```

###Public methods

**setContent**  
-
```
example:  
alert = $('selectorID').irAlert();
alert.setContent('Your Text or HTML code here!!');
```

**setType**  
-
```
example:  
alert = $('selectorID').irAlert();
alert.setType('alertType'); <-- options: 'info', 'warning', 'error', 'success'
```

**setPosition**  
-
```
example:  
alert = $('selectorID').irAlert();
alert.setPosition('alertPosition'); <-- options: 'trayleft', 'trayright', 'topleft', 'topright'
```

**hideNow**  
-
```
example:  
alert = $('selectorID').irAlert();
alert.hideNow(true); <-- options: boolean true / false
```

**showNow**  
-
```
example:  
alert = $('selectorID').irAlert();
alert.showNow(true); <-- options: boolean true / false
```

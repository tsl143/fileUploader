# fileUploader
A small vanilla JS utility which modifies the way you upload file. Before uploading it to server, you can preview the file(right now only image preview available). This plugin accepts a target element(can be a div, button anything), on click of which browse file popup is shown, after successful upload it returns a File object with data URL and other file attributes.

* * *

### Features

*   No dependency, pure Javascript plugin
*   Preview file before submitting to server
*   File Validations
*   Mounts on any element, doesn't require file input type
*   Customizable callback functions
*   Customizable preview popoup

* * *

### Getting Started

include library in your HTML
```
<script src="../dist/script.js"> </script></pre>
```

Initialize the library on your target element
```
const divv = new FileUpload({
    targetElement: 'imageUpload',
    vaildFiles: ['html','png'],
    onSuccess: onSuccess,
    onError: onError,
});
```
Only mandatory parameter is `targetElement` which is the `id` of the element on which you want to mount the plugin

other accepted options are 
```
        'onSuccess': function expecting file object as parameter as 
                        {
                            dataUrl: "data:application/x-javascript;base64",
                            lastModified: 1506169036000,
                            name: "script.js",
                            size: 17,
                            type: "application/x-javascript"
                        }
        'onError': function expecting error message as parameter
        'onFail': function expecting fail message as parameter
        'maxSize' maximum file size allowed in `MB` default is 2MB
        'debug': Boolean- shows console messages
        'onClose' hook function called when preview popup is closed
        'vaildFiles': accepts an array of valid file extensions eg `['png', 'jpg']`
        'overLayClass': CSS class of screen overlay for preview 
        'popupClass': CSS class of popup for preview
```

Feel free to file issues in case you find one :)
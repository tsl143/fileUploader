# fileUploader
A small vanilla JS utility which modifies the way you upload file. Before uploading it to server, you can preview the file(right now only image preview available). This plugin accepts a target element(can be a div, button anything), on click of which browse file popup is shown, after successful upload it returns a File object with data URL and other file attributes.

Demo - [fileUplaoder Demo](https://tsl143.github.io/fileUploader/demo/)

* * *

### Features

*   No dependency, pure Javascript plugin
*   Uploads file to given URL, returns dataURL if no actionURL provided
*   Preview file before submitting
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
    actionURL: 'https://www.example.com/uploadURL'
    vaildFiles: ['html','png'],
    onSuccess: onSuccess,
    onError: onError,
});
```
Only mandatory parameter is `targetElement` which is the `id` of the element on which you want to mount the plugin.
`actionURL` is mandatory if you want to upload file to any server, if not provided it will return `dataURL` of file in onSuccess callback.

other accepted options are 
```
        'onSuccess': callback function which recieves file object as parameter
                        {
                            dataUrl: "data:application/x-javascript;base64",
                            lastModified: 1506169036000,
                            name: "script.js",
                            size: 17,
                            type: "application/x-javascript",
                            userData: <optional>
                        }
        'onError': callback function which recieves error message as parameter
        'onFail': callback function which recieves fail message as parameter
        'maxSize' maximum file size allowed in `MB` default is 2MB
        'debug': Boolean- shows console messages
        'onClose' hook function called when preview popup is closed
        'vaildFiles': accepts an array of valid file extensions eg `['png', 'jpg']`
        'overLayClass': CSS class of screen overlay for preview 
        'popupClass': CSS class of popup for preview
        'actionURL': upload URL for the file/ returns dataURL if no actionURL provided
        'userData': optional data if you want to send with file
```

Example for how sever side should be handled, this is in PHP just for reference, it can be any server-side language.

```
<?php
    header("Access-Control-Allow-Origin: *");
    $filePath = $_SERVER['DOCUMENT_ROOT']."uploads/";
    $fileData = $_POST['dataUrl'];
    if($_POST['userData']){
        $filePath .= $_POST['userData'];
    }
    $filePath = $filePath.$_POST['name'];
    $data = explode('base64,',$fileData);
    $data = str_replace(' ', '+', $data[1]);
    $data = base64_decode($data);
    $success = file_put_contents($filePath, $data);
    print $success ? $filePath : 'Unable to save the file.';
?>
```

Feel free to file issues in case you find one :)

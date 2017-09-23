class FileUpload {
    constructor(obj) {
        this.targetElement = obj.targetElement;
        this.onSuccess = obj.onSuccess;
        this.onError = obj.onError;
        this.onFail = obj.onFail;
        this.maxSize = obj.maxSize;
        this.debug = obj.debug;
        this.onClose = obj.onClose;
        this.vaildFiles = obj.vaildFiles;
        this.overLayClass = obj.overLayClass;
        this.popupClass = obj.popupClass;
        this.file = {};
        this.fileType = '';
        this.overlayStyle = `
        background: rgba(0,0,0,0.6);
        bottom: 0;
        left: 0;
        position: fixed;
        right: 0;
        top: 0;
        z-index: 9999;
        `;
        this.popupStyle = `
        background: #fff;
        border: 2px solid #888;
        left: 25%;
        max-height:50%;
        overflow: scroll;
        position: absolute;
        top: 25%;
        white-space: pre;
        width: 50%;
        word-wrap: break-word
        `;
        this.imageStyle = `
        height: auto;
        width: 100%;
        `;
        this.setListener();
    }

    //Adds listener to target element
    setListener() {
        this.checkParams();
        document.getElementById(this.targetElement).addEventListener('click', () => {
            this.createFileElement()
        })
    }

    //check if all required parameters supplied and are valid
    checkParams() {
        if(!this.targetElement)
            throw new Error(`Target should not be empty`);
        if (!this.isString(this.targetElement))
            throw new TypeError(`Target should be a String`);
        if (this.onSuccess && !this.isFunction(this.onSuccess))
            throw new TypeError(`onSuccess should be a Function`);
        if (this.onError && !this.isFunction(this.onError))
            throw new TypeError(`onError should be a Function`);
        if (this.onFail && !this.isFunction(this.onFail))
            throw new TypeError(`onFail should be a Function`);
        if (this.onClose && !this.isFunction(this.onClose))
            throw new TypeError(`onClose should be a Function`);
        if (this.vaildFiles && !Array.isArray(this.vaildFiles))
            throw new TypeError(`vaildFiles should be an Array`);
        if (this.maxSize && this.isString(this.maxSize))
            throw new TypeError(`maxSize should be a String`);
        if (this.overLayClass && this.isString(this.overLayClass))
            throw new TypeError(`overLayClass should be a String`);
        if (this.popupClass && this.isString(this.popupClass))
            throw new TypeError(`popupClass should be a String`);

        return true;
    }

    //creates an orphan file element and triggers click event which opens browse dialog 
    //after file selection chnage event triggers parseUpload
    createFileElement() {
        const fileElement = document.createElement('input');
        fileElement.setAttribute('type','file');
        fileElement.setAttribute('onchange',this.startReading);
        fileElement.addEventListener('change', e => {
            const file = e.target.files[0];
            this.parseUpload(file);
        })
        fileElement.click();
        //added return to complete test case
        return fileElement;
    }

    //validates file and reads the file returns dataurl in success or error on fail
    parseUpload(file) {
        this.getFileDetails(file);

        if(!this.fileValidation(file))
            return false;
        
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = this.handleUploadSuccess.bind(this);
        reader.onerror = this.handleFail.bind(this);
    }

    //renders a preview if type is image, triggers sendReponse
    handleUploadSuccess(data) {

        const previewDiv = this.createPreview();

        if(this.fileType=='image')
            previewDiv.children[0].children[0].src = data.target.result;
        else
            previewDiv.children[0].textContent = 'No Preview Available';
        
        previewDiv.addEventListener('click',()=>{
            this.handleClose(previewDiv)
        })
        document.body.appendChild(previewDiv);
        
        this.sendReponse(data.target.result);
    }

    //returns final response object back
    sendReponse(dataUrl) {
        const response = {
            dataUrl,
            name: this.file.name,
            size: this.file.size,
            type: this.file.type,
            lastModified: this.file.lastModified,
        }

        if(typeof this.onSuccess ==='function') this.onSuccess(response)
    }

    //removes preview div and triggers user supplied onclose action
    handleClose(previewDiv) {
        if (previewDiv) document.body.removeChild(previewDiv);
        if(typeof this.onClose ==='function') this.onClose.call()
    }

    //triggers user supplied onFail action
    handleFail (err) {
        if(typeof (this.onFail) ==='function') 
            this.onFail(err)
        this.log(err)
    }
    
    //returns HTMLDivObject with complete popup structure
    createPreview() {
        const previewOverlayDiv = document.createElement('div');
        const previewDiv = document.createElement('div');
        const previewImg = document.createElement('img');
        previewOverlayDiv.style.cssText = this.overlayStyle;
        previewOverlayDiv.className = this.overLayClass || '';
        previewDiv.style.cssText = this.popupStyle;
        previewDiv.className = this.popupClass || '';
        previewImg.style.cssText = this.imageStyle;
        previewDiv.appendChild(previewImg)
        previewOverlayDiv.appendChild(previewDiv)
    
        return previewOverlayDiv;
    }

    getFileDetails(file) {
        this.file = file;
        this.fileType = file.type.split('/')[0];
    }

    //check for file validations for now just size and type
    fileValidation(file) {
        if(file.size > this.mbToBytes()){
            this.handleValidationError('File size Exceed')
            return false
        } else if(!this.matchFileType(file)){
            this.handleValidationError('Not a valid File type')
            return false
        }
        return true;
    }

    //triggers user supplied onError action
    handleValidationError(msg) {
        if(this.onError)
            this.onError(msg)
        else
            this.justAlert(msg)
    }

    matchFileType(file) {
        if(!this.vaildFiles)
            return true

        const validExtensions = this.vaildFiles.join('|');
        const validFileRegex = new RegExp(`(.*?)\.(${validExtensions})$`);
        if(file.name.match(validFileRegex))
            return true;
        else
            return false;
    }

    justAlert(msg) {
        this.log(msg)
        alert(msg);
    }

    isFunction (value) {
        return toString.call(value) === '[object Function]' || typeof value === 'function'
    }

    isString (value) {
        return typeof value === 'string'
    }

    mbToBytes() {
        const maxSize = this.maxSize || 2
        return maxSize*1000000
    }

    log(err) {
        if (this.debug)
            console.log(err)
    }
}
window.module = window.module || {};
module.exports = FileUpload;

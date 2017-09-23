const FileUpload = require('../dist/script');

describe('FileUpload', () => {

    //set up the dummy imageupload element on which the library will be targetted
    const fileUploadDiv = document.createElement('div');
    fileUploadDiv.setAttribute('id','imageUpload');
    document.body.appendChild(fileUploadDiv)

    const params = {
        targetElement: 'imageUpload',
        vaildFiles: ['html','png'],
        onSuccess: msg => console.log(msg),
        onError: msg => console.log(msg),
        onFail: msg => console.log(msg),
        onClose: () => console.log('Job Done'),
        maxSize: 3,
        debug: true
    }
    const handle = new FileUpload(params);

    //setup fake file
    const fakeFile = new Blob(['testfile.png'], { type: 'image/png' });
    fakeFile.lastModified = 1505998858000;
    fakeFile.name = "testfile.png";

    const fakeDiv = document.createElement('div')

    it('checks all input parameters', () => {
        expect(handle.checkParams()).toBe(true);
    });

    it('checks getFileDetails', () => {
        handle.getFileDetails(fakeFile);

        expect(handle.file).toMatchObject(fakeFile);
        expect(handle.fileType).toEqual('image');
    });

    it('checks fileValidation', () => {

        expect(handle.fileValidation(fakeFile)).toBeTruthy();

        const largeFakeFile = Object.assign( {}, fakeFile); 
        largeFakeFile.size = 100000000;
        expect(handle.fileValidation(largeFakeFile)).toBeFalsy();
    });

    it('checks matchFileType', () => {

        expect(handle.matchFileType(fakeFile)).toBeTruthy();

        const jpgFakeFile = Object.assign( {}, fakeFile); 
        jpgFakeFile.name = 'test.jpg';
        expect(handle.matchFileType(jpgFakeFile)).toBeFalsy();
    });

    it('checks createPreview', () => {
        
        const testDiv = handle.createPreview();
        expect(testDiv).toMatchObject(fakeDiv);
    });

    it('checks sendResponse', () => {

        const spy = jest.spyOn(handle, 'onSuccess');
        handle.sendReponse({})
        expect(spy).toHaveBeenCalled();
    });

    it('checks handleValidationError', () => {
        //with error function passed in parameter
        const spy = jest.spyOn(handle, 'onError');
        handle.handleValidationError('some-error')
        expect(spy).toHaveBeenCalled();
        //without error function passed in parameter
        const newParams = Object.assign( {}, params );
        delete(newParams.onError)
        const newHandle = new FileUpload(newParams)
        const newSpy = jest.spyOn(newHandle, 'justAlert');
        newHandle.handleValidationError('some-error')
        expect(newSpy).toHaveBeenCalled();
    });

    it('checks justAlert', () => {
        const spy = jest.spyOn(handle, 'log');
        const alertSpy = jest.spyOn(window, 'alert');
        handle.justAlert('random-message')
        expect(spy).toHaveBeenCalled()
        expect(alertSpy).toHaveBeenCalled()
    });

    it('checks isFunction', () => {
        const dummyFunction = () => 123;
        expect(handle.isFunction(dummyFunction)).toBeTruthy();
        expect(handle.isFunction('dummyString')).toBeFalsy();
    });

    it('checks isString', () => {
        expect(handle.isString('dummyString')).toBeTruthy();
        expect(handle.isFunction(123)).toBeFalsy();
    });

    it('checks mbToBytes', () => {
        expect(handle.mbToBytes()).toBe(3000000);
        const newParams = Object.assign( {}, params );
        delete(newParams.maxSize)
        const newHandle = new FileUpload(newParams)
        expect(newHandle.mbToBytes()).toBe(2000000);
    });

    it('checks setListener', () => {
        const spy = jest.spyOn(handle, 'createFileElement');
        fileUploadDiv.click();
        expect(spy).toHaveBeenCalled();   
    });

    it('checks handleClose', () => {
        const spy = jest.spyOn(handle, 'onClose');
        handle.handleClose();
        expect(spy).toHaveBeenCalled();   
    });

    it('checks handleFail', () => {
        const spy = jest.spyOn(handle, 'onFail');
        handle.handleFail('failmsg');
        expect(spy).toHaveBeenCalled();

        const newParams = Object.assign( {}, params );
        delete(newParams.onFail)
        const spyLog = jest.spyOn(handle, 'log');
        const newHandle = new FileUpload(newParams)
        newHandle.handleFail('test');
        expect(spyLog).toHaveBeenCalled();
    });

    it('checks handleUploadSuccess', () => {
        const result = { target: { result: 'done'} };
        const spy = jest.spyOn(handle, 'sendReponse');
        handle.handleUploadSuccess(result);
        expect(document.body.children.length).toBeGreaterThan(1)
        expect(spy).toHaveBeenCalled();
    });

    it('checks createFileElement', () => {
        const spy = jest.spyOn(handle, 'parseUpload');
        const fileElement =  handle.createFileElement();
        //dispatch change event for file element
        const evt = document.createEvent("HTMLEvents");
        evt.initEvent("change", false, true);
        fileElement.dispatchEvent(evt)
        expect(spy).toHaveBeenCalled(); 
    });

    it('checks parseUpload', () => {
         fakeFile.size = 100000000;
         expect(handle.parseUpload(fakeFile)).toBeFalsy();
    });
});

/* START - Callback Functions */
function AppConfigData(data) {
    console.log(data);
}

function BarcodeData(barcode, type, typeText) {
    addCard('Barcode', `Barcode: ${barcode} Type: ${type} - ${typeText}` , 'primary');
}

function GpsEventData(data){
    console.log(data);
}

function KeyboardEventData(device, action, keyCode){
    console.log(device);
    console.log(action);
    console.log(keyCode);
}

function QuantumIQData(key, value) {
    console.log(key);
    console.log(value);
}

function fusionReady() {
    
}

/* END - Callback Functions */

function debugSuccess() {
    FusionProvider.request('get', '/api/debug/success').then(r => {
        console.log(r);
    }).catch(any => {
        console.log("Error");
        console.log(any);
    });
}

function debugError() {
    FusionProvider.request('get', '/api/debug/error').then(r => {
        console.log(r);
    }).catch(any => {
        console.log("Error");
        console.log(any);
    });
}

function debugException() {
    FusionProvider.request('get', '/api/debug/exception').then(r => {
        console.log(r);
    }).catch(any => {
        console.log("Error");
        console.log(any);
    });
}
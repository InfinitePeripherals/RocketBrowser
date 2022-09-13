/**
 * @file - RocketBrowser.js
 * @name - Rocket Browser
 * @version - Version 1.0.0
 * 
 * @author - Created by Infinite Peripherals
 * @copyright - Copyright © 2022 Infinite Peripherals Inc. All rights reserved.
 * 
 */

var FusionProvider = (function () {
    function FusionProvider(http) {
        this.http = http;
    }

    Object.defineProperty(FusionProvider, "data", {
        get: function () {
            return window['fusionData'];
        },
        enumerable: true,
        configurable: true
    });
    FusionProvider.registerResponseHandler = function () {
        window['fusionReady'] = FusionProvider.handleReady;
        window['fusionResponse'] = FusionProvider.handleResponse;
    };
    FusionProvider.ready = function () {
        return new Promise(function (resolve, reject) {
            if (FusionProvider.isReady) {
                resolve(true);
            }
            else {
                FusionProvider.readyPromise = { resolve: resolve };
            }
        });
    };
    FusionProvider.handleReady = function () {
        FusionProvider.isReady = true;
        if (FusionProvider.readyPromise) {
            FusionProvider.readyPromise.resolve(true);
        }
    };
    Object.defineProperty(FusionProvider, "baseUrl", {
        get: function () {
            var url = FusionProvider.data.baseUrl;
            if (url.endsWith('/')) {
                url = url.substring(0, url.length - 1);
            }
            return url;
        },
        enumerable: true,
        configurable: true
    });
    FusionProvider.getDefaultHeaders = function () {
        return { 'Content-Type': 'application/json' };
    };
    FusionProvider.innerHttpRequest = function (method, url, headers, body) {
        url = FusionProvider.baseUrl + url;
        // create the Angular Headers object
        var httpHeaders = new __WEBPACK_IMPORTED_MODULE_2__angular_common_http__["c" /* HttpHeaders */]();
        for (var _i = 0, _a = Object.keys(headers); _i < _a.length; _i++) {
            var key = _a[_i];
            httpHeaders = httpHeaders.set(key, headers[key]);
        }
        // perform the HTTP request
        switch (method) {
            case HttpVerb.Get:
                return this.http.get(url, { headers: httpHeaders }).toPromise();
            default:
                return this.http.post(url, body, { headers: httpHeaders }).toPromise();
        }
    };
    FusionProvider.jsRequest = function (data) {
        var requestFunc = window['fusionRequest'];
        if (requestFunc) {
            requestFunc(data);
        }
    };
    /** Send a request to the Fusion API. **/
    FusionProvider.request = function (method, path, requestBody, headers) {
        var _this = this;
        if (headers === void 0) { headers = FusionProvider.getDefaultHeaders(); }

        // send the request to the Javascript server
        FusionProvider.requestCount++;
        var request_1 = {
            requestId: "ID_" + FusionProvider.requestCount,
            verb: method,
            path: path,
            headers: headers,
            body: requestBody
        };
        FusionProvider.jsRequest(request_1);
        return new Promise(function (resolve, reject) {
            FusionProvider.promiseStack[request_1.requestId] = { request: request_1, resolve: resolve, reject: reject };
        }).then(function (response) {
            // check for error message (where HTTP status code is 200 but the API responded with an error message)
            var errorMessage = _this.getErrorMessage(response.data);
            if (errorMessage) {
                console.error("Fusion API error: " + errorMessage);
            }
            return response.data;
        });
    };
    FusionProvider.handleResponse = function (response) {
        // resolve or reject the stacked promise
        var promise = FusionProvider.promiseStack[response.requestId];
        var request = promise.request;
        if (response.statusCode === 200) {
            promise.resolve(response);
        }
        else {
            promise.reject(response.data);
        }
        // remove the promise from the stack
        delete FusionProvider.promiseStack[response.requestId];
    };
    /** Returns the error message from the provided response. */
    FusionProvider.getErrorMessage = function (response) {
        if (response.summary && response.summary.isError) {
            return response.summary.description;
        }
        return undefined;
    };
    FusionProvider.requestCount = 0;
    FusionProvider.promiseStack = {};
    FusionProvider.isReady = false;
    FusionProvider.registerResponseHandler();

    return FusionProvider;
}());

var RocketBrowser = new function () {
    this.ERR_UNSUPPORTED = 1;
    this.ERR_USER_CANCEL = 2;
    this.ERR_TIMEOUT = 3;
    this.ERR_FAILED = 4;

    this.OrientationMasks = {
        Portrait: 6,
        PortraitHomeDown: 2,
        PortraitHomeUp: 4,
        Landscape: 24,
        LandscapeRight: 8,
        LandscapeLeft: 16,
        All: 30
    };

    this.Folder = {
        NONE: 0,
        TEMP: 1,
        DOCUMENTS: 2,
    };

    this.ImageSource = {
        PHOTOLIBRARY: 0,
        SAVEDPHOTOALBUM: 1
    };


    /**
     * @class AppConfig
     * @classdesc Functions to get App Configuration settings
     */
    this.AppConfig = new function () {

        /**
        * Get Application Config Dictionary
        * @memberof AppConfig
        */
        this.details = function () {
            return FusionProvider.request('get', '/api/appconfig/details');
        }

        /**
        * Get the boolean value from AppConfig key
        * @memberof AppConfig
        * @param {string} key - AppConfig Key
        */
        this.getBool = function (key) {
            return FusionProvider.request('post', '/api/appconfig/get/bool', { key: key });
        }

        /**
        * Set the boolean value AppConfig based on key
        * @memberof AppConfig
        * @param {string} key - AppConfig Key
        * @param {bool} value - AppConfig Value
        */
        this.getBool = function (key, value) {
            return FusionProvider.request('post', '/api/appconfig/set/bool', {
                key: key,
                value: value
            });
        }

        /**
        * Get the int value from AppConfig key
        * @memberof AppConfig
        * @param {string} key - AppConfig Key
        */
        this.getInt = function (key) {
            return FusionProvider.request('post', '/api/appconfig/get/int', { key: key });
        }

        /**
        * Set the int value AppConfig based on key
        * @memberof AppConfig
        * @param {string} key - AppConfig Key
        * @param {int} value - AppConfig Value
        */
        this.setInt = function (key, value) {
            return FusionProvider.request('post', '/api/appconfig/set/int', {
                key: key,
                value: value
            });
        }

        /**
      * Get the string value from AppConfig key
      * @memberof AppConfig
      * @param {string} key - AppConfig Key
      */
        this.getString = function (key) {
            return FusionProvider.request('post', '/api/appconfig/get/string', { key: key });
        }

        /**
        * Set the string value AppConfig based on key
        * @memberof AppConfig
        * @param {string} key - AppConfig Key
        * @param {string} value - AppConfig Value
        */
        this.setString = function (key, value) {
            return FusionProvider.request('post', '/api/appconfig/set/string', {
                key: key,
                value: value
            });
        }
    }

    this.BarcodeScanType = {
        "CODE39": 1,
        "CODABAR": 2,
        "CODE128": 3,
        "D25": 4,
        "IATA": 5,
        "I25": 6,
        "CODE93": 7,
        "UPCA": 8,
        "UPCE0": 9,
        "EAN8": 10,
        "EAN13": 11,
        "CODE11": 12,
        "CODE49": 13,
        "MSI": 14,
        "EAN128": 15,
        "UPCE1": 16,
        "PDF": 17,
        "CODE16K": 18,
        "CODE39_FULL_ASCII": 19,
        "UPCD": 20,
        "TRIOPTIC": 21,
        "BOOKLAND": 22,
        "COUPON": 23,
        "NW_7": 24,
        "ISBT_128": 25,
        "MICRO_PDF": 26,
        "DATAMATRIX": 27,
        "QRCODE": 28,
        "MICRO_PDF_CCA": 29,
        "POSTNET": 30,
        "PLANET": 31,
        "CODE32": 32,
        "ISBT_128_CON": 33,
        "POSTAL_JAP": 34,
        "POSTAL_AUS": 35,
        "POSTAL_DUTCH": 36,
        "MAXICODE": 37,
        "POSTAL_CAD": 38,
        "POSTAL_UK": 39,
        "MACRO_PDF": 40,
        "MICRO_QRCODE": 44,
        "AZTEC": 45,
        "GS1_DATABAR": 48,
        "RSS_LIMITED": 49,
        "GS1_DATABAR_EXP": 50,
        "SCANLET": 55,
        "UPCA+2": 72,
        "UPCE0+2": 73,
        "EAN8+2": 74,
        "EAN13+2": 75,
        "UPCE1+2": 80,
        "CCA_EAN128": 81,
        "CCA_EAN13": 82,
        "CCA_EAN8": 83,
        "CCA_RSS_EXP": 84,
        "CCA_RSS_LIM": 85,
        "CCA_RSS_14": 86,
        "CCA_UPCA": 87,
        "CCA_UPCE": 88,
        "CCC_EAN128": 89,
        "TLC39": 90,
        "CCB_EAN128": 97,
        "CCB_EAN13": 98,
        "CCB_EAN8": 99,
        "CCB_RSS_EXP": 100,
        "CCB_RSS_LIM": 101,
        "CCB_RSS_14": 102,
        "CCB_UPCA": 103,
        "CCB_UPCE": 104,
        "SIGNATURE": 105,
        "MATRIX_25": 113,
        "C25": 114
    };

    /**
     * @class Barcode
     * @classdesc Functions to handle and control compatible barcode scanners attached to the device.
     * <br><br>
     * QBrowser automatically sends barcodes to the function, specified in app settings (barcodeFunction). The format of this function is: function BarcodeData(barcode, type, typeText)<br><br>
     * Parameters:
     * - barcode(string) - barcode data
     * - type(integer) - barcode type number, as returned by the barcode engine (i.e. 13 - refer to QBrowser.BarcodeScanType for complete listing)
     * - typeText(string) - barcode type converted to string for easy display (i.e. "EAN-13")
     */
    this.Barcode = new function () {
        /**
         * Helper function to simulate a barcode scan for testing purposes. The simulated barcode is sent just like normal a scanned one will be.
         * @memberof Barcode
         * @param {string} barcode - Optional barcode string, you can pass null for default one
         * @param {number} type - Optional barcode type or null for EAN-13
         */
        this.simulate = function (barcode, type) {
            FusionProvider.request('post', '/api/barcode/simulate', { barcode: barcode, type: type }).then(success => {
                return true;
            }).catch(error => {
                return false
            });
        };

        /**
        * Starts the scan capability of the barcode engine
        * @memberof Barcode
        * @param {number} deviceIndex - Barcode Device Index (default = 0)
        */
        this.startScan = function (index = 0) {
            FusionProvider.request('post', '/api/barcode/start', { index: index }).then(success => {
                return true;
            }).catch(error => {
                return false
            });
        }

        /**
        * Stops the scan capability of the barcode engine
        * @memberof Barcode
        * @param {number} deviceIndex - Barcode Device Index (default = 0)
        */
        this.stopScan = function (index = 0) {
            FusionProvider.request('post', '/api/barcode/stop', { index: index }).then(success => {
                return true;
            }).catch(error => {
                return false
            });
        }
    };

    /**
    * @class Browser
    * @classdesc Functions to handle and control browser.
    */
    this.Browser = new function () {
        /**
         * Redirect browser to previous url
         * @memberof Browser
         */
        this.back = function () {
            window.history.back()
        };

        /**
         * Redirect browser to url
         * @memberof Browser
         * @param {string} url - Url to redirect to
         */
        this.redirect = function (url) {
            window.location.href = url;
        };
    }


    /**
     * @class Device
     * @classdesc Functions to get device specific information
     */
    this.Device = new function () {
        /**
         * Returns information about the current device such as its name, model, system version
         * @memberof Device
         */
        this.details = function () {
            return FusionProvider.request('get', '/api/device/details')
        };

        /**
        * Returns information about the current battery level
        * @memberof Device
        */
        this.getBatteryLevel = function () {
            return FusionProvider.request('get', '/api/device/battery');
        };

        /**
        * Returns information about the current display brightness
        * @memberof Device
        */
        this.getBrightness = function () {
            return FusionProvider.request('get', '/api/device/brightness');
        };

        /**
        * Sets the display brightness
        * @memberof Device
        * @param {number} percentage - Brightness percentage 0-100
        */
        this.setBrightness = function (percentage) {
            return FusionProvider.request('post', '/api/device/brightness', { percentage: percentage });
        };

        /**
        * Returns information about the current volume
        * @memberof Device
        */
        this.getVolume = function () {
            return FusionProvider.request('get', '/api/device/volume');
        };

        /**
        * Sets the device volume
        * @memberof Device
        * @param {number} percentage - Volume percentage 0-100
        */
        this.setVolume = function (percentage) {
            return FusionProvider.request('post', '/api/device/volume', { percentage: percentage });
        };

        /**
        * Exits the application
        * @memberof Device
        */
        this.exit = function () {
            return FusionProvider.request('get', '/api/device/exit');
        };
    };

    /**
     * @class GPS
     * @classdesc Functions for location tracking.
     */
    this.GPS = new function () {

        /**
         * Starts the generation of updates that report the userâ€™s current location
         * @memberof GPS
         * @param {number} locationAccuracy - Accuracy of the location data that your app wants to receive
         * @param {number} distanceFilter - Minimum distance (measured in meters) a device must move horizontally before an update event is generated
         */
        this.startMonitoring = function (locationAccuracy = 0, distanceFilter = 0) {

            return FusionProvider.request('post', '/api/gps/startMonitoring', {
                accuracy: locationAccuracy,
                distance: distanceFilter
            });
        }

        /**
         * Starts the generation of updates based on significant location changes
         * @memberof GPS
         */
        this.getLocation = function () {
            return FusionProvider.request('get', '/api/gps/location');
        }

        /**
         * Stops the generation of location updates
         * @memberof GPS
         */
        this.stopMonitoring = function () {
            return FusionProvider.request('get', '/api/gps/stopMonitoring');
        }
    }


    /**
     * @class Image
     * @classdesc Functions to take, import and handle images
     */
    this.Image = new function () {
        /**
         * Uses device's camera to capture an image and send it back
         * @memberof Image
         */
        this.fromCamera = function (index = 0) {
            return FusionProvider.request('post', '/api/image/capture', { index: index })
        };
    };
};

/*************************************************
 * Helper function that gets the function's name
 *************************************************/
function GetFunctionName(name) {
    if (name && typeof name == "function") {
        name = name.toString()
        name = name.substr("function ".length);
        name = name.substr(0, name.indexOf("("));
    }
    else {
        if (!name)
            name = "";
    }

    return name;
}

/*
 * Main function that sends function calls from QBrowser.js to the native browser
 */
function NativeCall(functionName, args, callbacks, settings) {
    console.log("Function: " + functionName + " not implimented");
};

var _printImageData;

/*
 * Helper function that converts image data to Base64
 */
function getBase64Image(img) {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    var dataURL = canvas.toDataURL("image/png");

    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}

/*
 * Helper function that converts image data to Base64
 */
function createUUID() {
    return 'EB-xxxxxxxxxxxxxyxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}


/*
 * Helper function that converts image data to Base64
 */
function parseObjectToHTML(o, parent = '') {

    var results = ``;
    for (const key in o) {
        if (typeof o[key] === "object") {
            if (parent !== '')
                parent = `${parent}.{key}`;
            else
                parent = `${key}.`;

            results += parseObjectToHTML(o[key], parent);
            parent = '';
        }
        else {
            results += `${parent}${key}: ${o[key]}<br />`;
        }
    }

    return results;
}


/* START - Callback Functions */
function AppConfigData(data) {
    console.log(`AppConfigData: ${JSON.stringify(data)}`);
}

function BarcodeData(barcode, type, typeText) {
    console.log(`BarcodeData: ${barcode} ${type}, ${typeText}`);
}

function Base64ImageData(base64) {
    console.log(`Base64ImageEvent: ${base64}`);
}

function GpsEventData(data) {
    console.log(`GpsEventData: ${JSON.stringify(data)}`);
}

function KeyboardEventData(device, action, keyCode) {
    console.log(`KeyboardEventData: ${device} ${action}, ${keyCode}`);
}

function fusionReady() {
    console.log(`Fusion Ready`);
}
/* END - Callback Functions */
// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,
    token : '810cb754eaef90fe8c49dee9510be98234c5401f',
   // api_url : 'http://localhost:8000/'
    // token : '8b670713a2a9e075cfb0c9c47d4eaa5410abece6',
     api_url : 'https://mars-web-app.azurewebsites.net/'

};

/* ng build --aot=false --build-optimizer=false
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.

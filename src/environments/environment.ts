// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  //googleSheetsApiKey: 'AIzaSyD-Nkv-g1682kKdauukFPmOCNaQk0wP540',
  googleSheetsApiKey: 'AIzaSyAvqWemL3ZgyGK0EHvOh25EvX_WKah91J8',
  characters: {
    //spreadsheetId: '1gSc_7WCmt-HuSLX01-Ev58VsiFuhbpYVo8krbPCvvqA',
    spreadsheetId: '1Izn-Yhce09XRRNnPYLKTJ4SpbMrJRTVe2N_z53kP-1s',
    worksheetName: 'Characters',
  },
};

const columnDefs =[
    {headerName: 'Hash', field: 'hash', width: 80, maxWidth: 90},
    {headerName: 'Tag', field: 'tag', width: 150},
    {headerName: 'Commit', field: 'commitMessage', width: 200},
    {headerName: 'Operation', width: 90, maxWidth: 100, cellRenderer(params) {
        const url = encodeURI('command:extension.deleteGitTag?' +  JSON.stringify([params.data.tag]))
        return '<a class="delete" href="'+ url +'">DELETE</a>';
    }}
]

const gridOptions = {
    enableColResize: true,
    autoSizePadding: 20,
    columnDefs: columnDefs,
    rowData: rows
}

const eGridDiv = document.querySelector('#container');

const grid = new agGrid.Grid(eGridDiv, gridOptions);
gridOptions.api.sizeColumnsToFit()


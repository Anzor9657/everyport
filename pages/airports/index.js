$(document).ready(() => {
    // Elements
    const $search = $('#search');
    const $tbody = $('#tbody');

    // Variabes
    const tableData = [
        { id: 1, code: 'Code', city: 'City1', name: 'Name', info: 'Info' },
        { id: 2, code: 'Code', city: 'City2', name: 'Name', info: 'Info' }
    ];
    let toRenderTable = []

    // Functions
    function fillTable(items) {
        $tbody.empty();
        for (const item of items) {
            $tbody.append(`
            <tr id="${item.id}">
                <td>${item.code}</td>
                <td>${item.city}</td>
                <td>${item.name}</td>
                <td>${item.info}</td>
            </tr>`);
        }
    };

    function searchHandler(event) {
        const { value } = event.target;
        toRenderTable = tableData.filter((item) => item.city.toLowerCase().includes(value));
        fillTable(toRenderTable);
    };

    // Handlers
    $search.on('input', searchHandler);
    fillTable(tableData);
})
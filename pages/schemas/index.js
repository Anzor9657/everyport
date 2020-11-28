$(document).ready(() => {
    // Elements
    const $search = $('#search');
    const $tbody = $('#tbody');
    // Variabes
    const tableData = [
        { id: 1, code: 'Code', city: 'City1', name: 'Name', status: 100 },
        { id: 2, code: 'Code', city: 'City2', name: 'Name', status: 50 }
    ];
    let toRenderTable = [];

    // Functions
    function fillTable(items) {
        $tbody.empty();
        for (const item of items) {
            $tbody.append(`
            <tr id="${item.id}">
                <td>${item.code.toUpperCase()}</td>
                <td>${item.city}</td>
                <td>${item.name}</td>
                <td>
                    <span class="badge white ${item.status > 50 ? 'back-gray-dark' : 'back-red'}">
                        ${item.status}%
                    </span>
                </td>
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

    // init
    fillTable(tableData);
})
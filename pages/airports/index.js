$(document).ready(() => {
    // Elements
    const $search = $('#search');
    const $clearSearchBtn = $('#clearSearchBtn');
    const $tbody = $('#tbody');
    const $newAirportForm = $('#newAirportForm');
    const $photoPreview = $('#photoPreview');
    const $terminalRows = $('#terminalRows');
    const $addAirportTerminal = $('#addAirportTerminal');

    // Variabes
    const tableData = [
        { id: 1, code: 'AER', city: 'Сочи', name: 'Международный аэропорт', status: 100 },
        { id: 2, code: 'DME', city: 'Москва', name: 'Домодедово', status: 60 },
        { id: 3, code: 'SVO', city: 'Москва', name: 'Шереметьево', status: 30 },
    ];

    let toRenderTable = [];
    let formData = {
        code: '',
        city: '',
        name: '',
        photo: null,
        terminals: [{
            terminal: '',
            coordinates: '',
            floors: '',
        }],
        publishInApp: false
    };

    // Functions
    function init() {
        fillTable(tableData);
        renderTerminaleRows();
    }

    function fillTable(items) {
        $tbody.empty();
        let tableRows = '';
        for (const item of items) {
            tableRows += `
            <tr id="${item.id}">
                <td>${item.code.toUpperCase()}</td>
                <td>${item.city}</td>
                <td>${item.name}</td>
                <td>
                    <span class="badge white ${item.status > 50 ? 'back-gray-dark' : 'back-red'}">
                        ${item.status}%
                    </span>
                </td>
            </tr>`;
        }
        $tbody.append(tableRows);
    };

    function searchHandler(event) {
        const { value } = event.target;
        toRenderTable = tableData.filter((item) => item.city.toLowerCase().includes(value.toLowerCase()));
        fillTable(toRenderTable);
    };

    function clearSearch() {
        $search.val('');
        fillTable(tableData);
    }

    function renderTerminaleRows() {
        $terminalRows.empty();
        const rows = formData.terminals.map((row, index) => `
            <div class="row mt-3" id="row-${index}">
                <div class="col">
                    <input type="text" class="form-control" value="${row.terminal}" name="terminal">
                </div>
                <div class="col">
                    <input type="text" class="form-control" value="${row.coordinates}" name="coordinates">
                </div>
                <div class="col">
                    <input type="text" class="form-control" value="${row.floors}" name="floors">
                </div>
                <img src="../../assets/icons/Delete.svg" class="icon font-size-base hovered mr-2 ml-2 ${formData.terminals.length > 1 ? '' : 'd-none'}">
            </div>
        `);
        $terminalRows.append(rows.join(''));
    }

    function fileReader([file]) {
        if (file) {
            formData.photo = file;
            fr = new FileReader();
            fr.onload = function(e) {
                $photoPreview.attr('src', e.target.result);
                $('label[for="photoInput"]').text(file.name);
            }
            fr.readAsDataURL(file);
        }
    }

    function formChangesHadler(event) {
        const { target: { name, value } } = event;
        switch (name) {
            case 'photo':
                fileReader(event.target.files);
                break;
            case 'publishInApp':
                formData[name] = event.target.checked;
                break;
            default:
                formData[name] = value;
        };
    }

    function terminalRowsHandler(event) {
        const { target: { name, value } } = event;
        const [, index] = $(event.target).parent().parent().attr('id').split('-')
        formData.terminals[index][name] = value;
        event.stopPropagation();
    }

    function addTerminalRow() {
        formData.terminals.push({
            terminal: '',
            coordinates: '',
            floors: '',
        });
        renderTerminaleRows();
    }

    function deleteTerminalRow(event) {
        const [, id] = $(event.target).parent().attr('id').split('-');
        formData.terminals = formData.terminals.filter((row, index) => index !== Number(id));
        renderTerminaleRows();
    }

    function formSubmitHandler(event) {
        console.log(formData);
        event.preventDefault();
    }

    function formReset(event) {
        formData = {
            code: '',
            city: '',
            name: '',
            photo: null,
            terminals: [{
                terminal: '',
                coordinates: '',
                floors: '',
            }],
            publishInApp: false
        };
        $photoPreview.attr('src', '../../assets/images/default-image.png');
        $('label[for="photoInput"]').text('Выберите файл');
        renderTerminaleRows()
    }

    // Handlers
    $search.on('input', searchHandler);
    $clearSearchBtn.on('click', clearSearch);
    $newAirportForm
        .on('submit', formSubmitHandler)
        .on('reset', formReset)
        .on('input', formChangesHadler);
    $terminalRows
        .on('input', terminalRowsHandler)
        .on('click', 'img', deleteTerminalRow);
    $addAirportTerminal
        .on('click', addTerminalRow);

    // Init
    init();
})
$(document).ready(() => {
    // Elements
    const $search = $('#search');
    const $tbody = $('#tbody');
    const $newAirportForm = $('#newAirportForm');
    const $photoPreview = $('#photoPreview');
    const $terminalRows = $('#terminalRows');
    const $addAirportTerminal = $('#addAirportTerminal');

    // Variabes
    const tableData = [
        { id: 1, code: 'Code', city: 'City1', name: 'Name', info: 'Info' },
        { id: 2, code: 'Code', city: 'City2', name: 'Name', info: 'Info' }
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
            floor: '',
        }],
        publishInApp: false
    };

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
                    <input type="text" class="form-control" value="${row.floor}" name="floor">
                </div>
                <img src="../../assets/icons/airport/Delete.svg" class="icon font-size-base hovered mr-2 ml-2 ${formData.terminals.length > 1 ? '' : 'd-none'}">
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
            floor: '',
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
                floor: '',
            }],
            publishInApp: false
        };
        $photoPreview.attr('src', '../../assets/images/default-image.png');
        $('label[for="photoInput"]').text('Выберите файл');
        renderTerminaleRows()
    }

    // Handlers
    $search.on('input', searchHandler);
    $newAirportForm
        .on('submit', formSubmitHandler)
        .on('reset', formReset)
        .on('input', formChangesHadler);
    $terminalRows
        .on('input', terminalRowsHandler)
        .on('click', 'img', deleteTerminalRow);
    $addAirportTerminal
        .on('click', addTerminalRow);
    // init
    fillTable(tableData);
    renderTerminaleRows();
})
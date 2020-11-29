$(document).ready(() => {
    // Elements
    const $search = $('#search');
    const $clearSearchBtn = $('#clearSearchBtn');
    const $tbody = $('#tbody');
    const $terminalTabs = $('#terminalTabs');
    const $floorSchemas = $('#floorSchemas');
    const $saveBtn = $('#saveBtn');

    // Variabes
    const tableData = [{
            id: 1,
            code: 'AER',
            city: 'Сочи',
            name: 'Международный аэропорт',
            status: 100,
            photo: null,
            terminals: [{
                    terminal: 'A',
                    coordinates: 'XCF7+F2, Россия',
                    floors: '5',
                },
                {
                    terminal: 'B',
                    coordinates: 'XCF7+F2, Россия',
                    floors: '2',
                },
                {
                    terminal: 'C',
                    coordinates: 'XCF7+F2, Россия',
                    floors: '3',
                }
            ],
            publishInApp: false,
        },
        {
            id: 2,
            code: 'DME',
            city: 'Москва',
            name: 'Домодедово',
            status: 60,
            photo: null,
            terminals: [{
                    terminal: 'A',
                    coordinates: 'XCF7+F2, Россия',
                    floors: '2',
                },
                {
                    terminal: 'B',
                    coordinates: 'XCF7+F2, Россия',
                    floors: '5',
                },
                {
                    terminal: 'C',
                    coordinates: 'XCF7+F2, Россия',
                    floors: '3',
                }
            ],
            publishInApp: false,
        },
        {
            id: 3,
            code: 'SVO',
            city: 'Москва',
            name: 'Шереметьево',
            status: 30,
            photo: null,
            terminals: [{
                    terminal: 'A',
                    coordinates: 'XCF7+F2, Россия',
                    floors: '3',
                },
                {
                    terminal: 'B',
                    coordinates: 'XCF7+F2, Россия',
                    floors: '4',
                },
                {
                    terminal: 'C',
                    coordinates: 'XCF7+F2, Россия',
                    floors: '5',
                }
            ],
            publishInApp: false,
        },
    ];
    let toRenderTable = [];
    let airportId;
    let selectedTab = 0;

    // Functions
    function init() {
        setContentHeader();
        renderTabs();
        renderFloorSchemas();
        fillTable(tableData);
    }

    function setContentHeader() {
        const queryParams = new URLSearchParams(window.location.search);
        for (const [key, val] of queryParams) {
            if (key === 'id') {
                airportId = Number(val)
            }
        };
        const row = tableData.find((item) => item.id === airportId)
        if (row) {
            $('.page-title h4 span').append(` - ${row.name}`)
        }
    }

    function fillTable(items) {
        $tbody.empty();
        let tableRows = '';
        for (const item of items) {
            tableRows += `
            <tr id="row-${item.id}" class="row-hovered">
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

    function rowClickHandler() {
        const [, rowId] = $(this).attr('id').split('-');
        const hrefArray = location.href.split('/');
        hrefArray[hrefArray.length - 1] = 'form.html';
        location.href = `${hrefArray.join('/')}?id=${rowId}`;
    }

    function renderTabs() {
        $terminalTabs.empty();
        const row = tableData.find((item) => item.id === airportId)
        if (row) {
            const terminalRows = row.terminals.map((item, index) => `
                <li class="nav-item">
                    <a class="nav-link ${!index ? 'active' : ''} font-700" href="#" id="tab-${index}">
                        Терминал ${item.terminal}
                        <span class="badge white back-gray-dark">40%</span>
                    </a>
                </li>
                `)
            $terminalTabs.append(terminalRows.join(''));
        }
    }

    function renderFloorSchemas() {
        $floorSchemas.empty();
        const row = tableData.find((item) => item.id === airportId);
        if (row) {
            const terminal = row.terminals[selectedTab];
            let floorSchemaInputs = '';
            for (let i = 0; i < Number(terminal.floors); i += 1) {
                let labelText = 'Выберите файл';
                if (terminal.floorSchemas && terminal.floorSchemas[`floorChema${i + 1}`]) {
                    labelText = terminal.floorSchemas[`floorChema${i + 1}`].name;
                };
                floorSchemaInputs += `
                <div class="col-lg-6 form-group">
                    <label class="font-500">Этаж ${i + 1}</label>
                    <div class="custom-file font-500">
                        <input type="file" accept="image/*" class="custom-file-input" id="floorChema${i + 1}" lang="ru">
                        <label class="custom-file-label font-500" for="floorChema${i + 1}">${labelText}</label>
                    </div>
                </div>`;
            };
            $floorSchemas.append(floorSchemaInputs);
        }
    }

    function tabClickHandler() {
        const [, tabId] = $(this).attr('id').split('-');
        if (selectedTab !== Number(tabId)) {
            selectedTab = Number(tabId);
            $terminalTabs.find('.active').removeClass('active');
            $(this).addClass('active');
            renderFloorSchemas();
        }
    }

    function fileInputHandler(event) {
        const schemaKey = $(event.target).prop('id');
        const [, terminalId] = $terminalTabs.find('.active').prop('id').split('-')
        const row = tableData.find((item) => item.id === airportId);
        if (row) {
            const [file] = event.target.files;
            tableData.forEach((item) => {
                if (item.id === airportId) {
                    if (!item.terminals[terminalId].floorSchemas) {
                        item.terminals[terminalId].floorSchemas = {};
                    }
                    item.terminals[terminalId].floorSchemas[schemaKey] = file;
                }
            });
            $(`label[for="${schemaKey}"]`).text(file.name);
        }
    }

    function saveSchemas(event) {
        console.table(tableData);
    }

    // Handlers
    $search.on('input', searchHandler);
    $clearSearchBtn.on('click', clearSearch);
    $tbody.on('click', 'tr', rowClickHandler);
    $terminalTabs.on('click', 'a', tabClickHandler);
    $floorSchemas.on('input', fileInputHandler);
    $saveBtn.on('click', saveSchemas);

    // Init
    init();
})
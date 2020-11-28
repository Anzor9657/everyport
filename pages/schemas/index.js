$(document).ready(() => {
    // Elements
    const $search = $('#search');
    const $tbody = $('#tbody');
    const $terminalTabs = $('#terminalTabs');
    const $floorSchemas = $('#floorSchemas');

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
                    floorss: '3',
                },
                {
                    terminal: 'B',
                    coordinates: 'XCF7+F2, Россия',
                    floorss: '4',
                },
                {
                    terminal: 'C',
                    coordinates: 'XCF7+F2, Россия',
                    floorss: '5',
                }
            ],
            publishInApp: false,
        },
    ];
    let toRenderTable = [];
    let airportId;

    // Functions
    function init() {
        setContentHeader();
        renderTabs();
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
        for (const item of items) {
            $tbody.append(`
            <tr id="row-${item.id}" class="row-hovered">
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

    function renderTabs() {
        const row = tableData.find((item) => item.id === airportId)
        if (row) {
            const terminalRows = row.terminals.map((item, index) => `
                <li class="nav-item">
                    <a class="nav-link ${!index ? 'active' : ''} font-700" href="#">
                        Терминал ${item.terminal}
                        <span class="badge white back-gray-dark">40%</span>
                    </a>
                </li>
                `)
            $terminalTabs.append(terminalRows.join(''));
        }
    }

    function searchHandler(event) {
        const { value } = event.target;
        toRenderTable = tableData.filter((item) => item.city.toLowerCase().includes(value));
        fillTable(toRenderTable);
    };

    function rowClickHandler(event) {
        const [, rowId] = $(this).attr('id').split('-');
        const hrefArray = location.href.split('/');
        hrefArray[hrefArray.length - 1] = 'form.html';
        location.href = `${hrefArray.join('/')}?id=${rowId}`;
    }

    // Handlers
    $search.on('input', searchHandler);
    $tbody.on('click', 'tr', rowClickHandler)

    // Init
    init();
})
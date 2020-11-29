$(document).ready(() => {
    // Elements
    const $search = $('#search');
    const $clearSearchBtn = $('#clearSearchBtn');
    const $tbody = $('#tbody');
    const $langTabs = $('#langTabs');
    const $categorySelect = $('#categorySelect');
    const $form = $('#form');
    const $saveBtn = $('#saveBtn');

    // Variabes
    let serviceId;
    const formData = {
        category: 5,
        name: '',
        visibilities: [],
        openIn: '',
        generalDescription: false,
        content: [],
        isCatalog: false,
        isType: false,
        icon: null,
    }
    const categories = [{
            id: 1,
            name: 'Ожидание',
            usedServices: [2, 3, 4, 6],
        },
        {
            id: 2,
            name: 'Багаж',
            usedServices: [11, 12, 13, 14, 15, 16],
        },
        {
            id: 3,
            name: 'Еда и покупки',
        },
        {
            id: 4,
            name: 'Комфорт',
        },
        {
            id: 5,
            name: 'Транспорт',
        },
        {
            id: 6,
            name: 'Службы аэропорта',
        },
        {
            id: 7,
            name: 'Инфраструктура',
        },
    ];
    const services = [
        { id: 1, name: "COVID", categoryId: 1, visibilities: [1, 2] },
        { id: 2, name: "Fast Track", categoryId: 1, visibilities: [1, 2] },
        { id: 3, name: "Wi-Fi", categoryId: 1, visibilities: [1] },
        { id: 4, name: "Зарядка телефона", categoryId: 1, visibilities: [1, 2] },
        { id: 5, name: "Для пассажиров с детьми", categoryId: 1, visibilities: [1] },
        { id: 5, name: "Пеленальные комнаты", categoryId: 1, visibilities: [2] },
        { id: 5, name: "Комнаты матери и ребенка", categoryId: 1, visibilities: [2] },
        { id: 5, name: "Детские комнаты", categoryId: 1, visibilities: [2] },
        { id: 6, name: "Cпециальная помощь", categoryId: 1, visibilities: [1, 2] },
        { id: 7, name: "Часовни", categoryId: 1, visibilities: [2] },
        { id: 8, name: "Музеи", categoryId: 1, visibilities: [2] },
        { id: 9, name: "Почта", categoryId: 1, visibilities: [2] },
        { id: 10, name: "Турагентства", categoryId: 1, visibilities: [2] },
        { id: 11, name: "Упаковка багажа", categoryId: 2, visibilities: [1, 2] },
        { id: 12, name: "Самостоятельная сдача багажа", categoryId: 2, visibilities: [1, 2] },
        { id: 13, name: "Розыск багажа", categoryId: 2, visibilities: [1, 2] },
        { id: 14, name: "Камера хранения", categoryId: 2, visibilities: [1, 2] },
        { id: 15, name: "Багажные тележки", categoryId: 2, visibilities: [1, 2] },
        { id: 16, name: "Бюро находок", categoryId: 2, visibilities: [1, 2] },
    ];
    const visibilities = [{
            id: 1,
            name: 'Услуги'
        },
        {
            id: 2,
            name: 'Карта'
        },
    ];
    const langs = [{ id: 1, name: 'ru' }, { id: 2, name: 'en' }];

    // Functions
    function init() {
        setContentHeader();
        fillTable(categories);
        renderTabs();
        fillCategoriesSelect();
    }

    function setContentHeader() {
        const queryParams = new URLSearchParams(window.location.search);
        let textToRender = '';
        for (const [key, val] of queryParams) {
            if (key === 'id') {
                serviceId = Number(val);
                const row = services.find((item) => item.id === serviceId);
                if (row) {
                    textToRender = row.name;
                }
            } else {
                textToRender = ' - Добавить';
            }
        };
        if (textToRender) {
            $('.page-title h4 span').append(` - ${textToRender}`);
        }
    }

    function fillTable(items) {
        $tbody.empty();
        let tableRows = '';
        for (const category of items) {
            if (category.usedServices) {
                for (const usedServices of category.usedServices) {
                    const serviceInfo = services.find((service) => service.id === usedServices);
                    let visibilityArray = [];
                    if (serviceInfo && serviceInfo.visibilities) {
                        for (const usedVisibilities of serviceInfo.visibilities) {
                            const visibilityInfo = visibilities.find((visibility) => visibility.id === usedVisibilities);
                            visibilityArray.push(visibilityInfo.name);
                        }
                    }
                    tableRows += `
                        <tr id="row-${serviceInfo.id}" class="row-hovered">
                            <td>${category.name}</td>
                            <td>${serviceInfo.name}</td>
                            <td>${visibilityArray.join(', ')}</td>
                        </tr>`;
                }
            }
        }
        $tbody.append(tableRows);
    }

    function searchHandler(event) {
        const { value } = event.target;
        const toRenderTable = categories.filter((category) => category.name.toLowerCase().includes(value.toLowerCase()));
        fillTable(toRenderTable);
    }

    function clearSearch() {
        $search.val('');
        fillTable(categories);
    }

    function rowClickHandler() {
        const [, rowId] = $(this).attr('id').split('-');
        const hrefArray = location.href.split('/');
        hrefArray[hrefArray.length - 1] = 'form.html';
        location.href = `${hrefArray.join('/')}?id=${rowId}`;
    }

    function renderTabs() {
        $langTabs.empty();
        const tabs = langs.map((item, index) => `
                <li class="nav-item">
                    <a class="nav-link ${!index ? 'active' : ''} font-700 text-uppercase" href="#" id="tab-${item.id}">
                        ${item.name}
                    </a>
                </li>`)
        $langTabs.append(tabs.join(''));
    }

    function fillCategoriesSelect() {
        $categorySelect.empty();
        let renderOptions = '';
        for (const category of categories) {
            renderOptions += `<option value="category-${category.id}" class="${category.id === formData.category ? 'active' : ''}">${category.name}</option>`;
        }
        $categorySelect.append(renderOptions);
        $categorySelect.val(`category-${formData.category}`);
    }

    function formInputHandler(event) {
        const { target: { name, value } } = event;
        switch (name) {
            case 'category':
                const [, id] = value.split('-');
                formData[name] = Number(id);
                break;
            case 'publishInApp':
                formData[name] = event.target.checked;
                break;
            default:
                formData[name] = value;
        };
        console.log(value)
    }

    function saveForm(event) {
        console.log(formData);
    }


    // Handlers
    $search.on('input', searchHandler);
    $clearSearchBtn.on('click', clearSearch);
    $tbody.on('click', 'tr', rowClickHandler);
    $form.on('input', formInputHandler);

    $saveBtn.on('click', saveForm);

    // Init
    init();
})
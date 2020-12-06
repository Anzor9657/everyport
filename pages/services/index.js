$(document).ready(() => {

    // Elements
    const $search = $('#search');
    const $clearSearchBtn = $('#clearSearchBtn');
    const $tbody = $('#tbody');
    const $langTabs = $('#langTabs');
    const $categorySelect = $('#categorySelect');
    const $visibilitySelect = $('#visibilitySelect');
    const $categoriesSelect = $('#categoriesSelect');
    const $propsSelect = $('#propsSelect');
    const $contentSelect = $('#contentSelect');
    const $funcsSelect = $('#funcsSelect');


    const $form = $('form');

    // Variabes
    class FormData {
        _category
        _name
        _visibilities = []
        _openIn
        _browserLink
        _generalDescriptionStatus = false
        _categoriesStatus = false
        _propertiesStatus = false
        _companyStatus = false
        _categories = []
        _properties = []
        _content = []
        _functions = []
        _icon

        constructor(props) {
            for (const [key, val] of Object.entries(props)) {
                this[`_${key}`] = val;
                if (typeof val === 'boolean') {
                    $(`[name='${key}']`).prop('checked', val);
                    if (key === 'generalDescriptionStatus') {
                        $('#editDescription').parent().removeClass('d-none');
                    }
                } else if (key === 'openIn') {
                    $('#openIn').append(`
                        <div class="form-check form-check-inline">
                            <label class="form-check-label">
                                <input type="radio" class="form-check-input-styled" value="app" name="openIn" ${val === 'app' ? 'checked' : ''} data-fouc>
                                в приложении
                            </label>
                        </div>
                        <div class="form-check form-check-inline">
                            <label class="form-check-label">
                                <input type="radio" class="form-check-input-styled" value="frame" name="openIn" ${val === 'frame' ? 'checked' : ''} data-fouc>
                                в фрейме
                            </label>
                        </div>
                        <div class="form-check form-check-inline">
                            <label class="form-check-label">
                                <input type="radio" class="form-check-input-styled" value="browser" name="openIn" ${val === 'browser' ? 'checked' : ''} data-fouc>
                                в браузере
                            </label>
                        </div>`);
                    $('#browserLinkInput').parent().removeClass('d-none');
                    $('.hide-if-browser').addClass('hide-before-browser');
                } else {
                    $(`[name='${key}']`).val(val);
                }
            }
        }

        get category() {
            return this._category;
        }
        set category({ value }) {
            this._category = Number(value);
            this._content = [];
            fillContentSelect();
        }
        get name() {
            return this._name;
        }
        set name({ value }) {
            this._name = value;
        }
        get visibilities() {
            return this._visibilities;
        }
        set visibilities(target) {
            this._visibilities = $visibilitySelect.val();
        }
        get openIn() {
            return this._openIn;
        }
        set openIn({ value }) {
            this._openIn = value;
            if (value === 'browser') {
                $('#browserLinkInput').parent().removeClass('d-none');
                $('.hide-if-browser').addClass('hide-before-browser');
            } else {
                $('#browserLinkInput').parent().addClass('d-none');
                $('.hide-if-browser').removeClass('hide-before-browser');
                this._browserLink = null
                $('#browserLinkInput').val('')
            }
        }
        get browserLink() {
            return this._browserLink;
        }
        set browserLink({ value }) {
            this._browserLink = value;
        }
        get generalDescriptionStatus() {
            return this._generalDescriptionStatus;
        }
        set generalDescriptionStatus({ checked }) {
            this._generalDescriptionStatus = checked;
            if (checked) {
                $('#editDescription').parent().removeClass('d-none');
            } else {
                $('#editDescription').parent().addClass('d-none');
            }
        }
        get categoriesStatus() {
            return this._categoriesStatus;
        }
        set categoriesStatus({ checked }) {
            this._categoriesStatus = checked;
            if (checked) {
               $categoriesSelect.parent().removeClass('d-none');
            } else {
               $categoriesSelect.parent().addClass('d-none');
            }
        }
        get propertiesStatus() {
            return this._propertiesStatus;
        }
        set propertiesStatus({ checked }) {
            this._propertiesStatus = checked;
            if (checked) {
                $propsSelect.parent().removeClass('d-none');
            } else {
                $propsSelect.parent().addClass('d-none');
                this._properties = [];
            }
        }
        get companyStatus() {
            return this._companyStatus;
        }
        set companyStatus({ checked }) {
            this._companyStatus = checked;
            if (checked) {
                $funcsSelect.parent().removeClass('d-none');
            } else {
                $funcsSelect.parent().addClass('d-none');
                this._functions = [];
            }
        }
        get _categories() {
            return this._categories;
        }
        set _categories(target) {
            const value = $categoriesSelect.val()
            this._categories = value;
        }
        get _properties() {
            return this._properties;
        }
        set _properties(target) {
            const value = $propSelect.val()
            this._properties = value;
        }
        get content() {
            return this._content;
        }
        set content(target) {
            const value = $contentSelect.val()
            this._content = value;
        }
        get _functions() {
            return this._functions;
        }
        set _functions(target) {
            const value = $funcSelect.val()
            this._functions = value;
        }
        get isCatalog() {
            return this._isCatalog;
        }
        set isCatalog({ checked }) {
            this._isCatalog = checked;
        }
        get icon() {
            return this._icon;
        }
        set icon({ files }) {
            this._icon = files[0];
            $('label[for=iconInput').text(this._icon.name);
            fileReader(this._icon);
        }
    }
    const tableData = [{
        id: 1,
        category: 1,
        name: 'Выбрана категория 1',
        visibilities: [1, 2],
        openIn: 'app',
        browserLink: null,
        generalDescriptionStatus: true,
        categoriesStatus: false,
        propertiesStatus: false,
        companyStatus: false,
        categories: [],
        properties: [],
        content: [],
        functions: [],
        icon: null 
    },
    {
        id: 2,
        category: 1,
        name: 'Выбрана категория 2',
        visibilities: [1, 2],
        openIn: 'frame',
        browserLink: null,
        generalDescriptionStatus: false,
        categoriesStatus: false,
        propertiesStatus: false,
        companyStatus: true,
        categories: [],
        properties: [],
        content: [],
        functions: [],
        icon: null 
    },
    {
        id: 3,
        category: 1,
        name: 'Выбрана категория 3',
        visibilities: [1],
        openIn: 'browser',
        browserLink: 'http://www.google.com',
        generalDescriptionStatus: true,
        categoriesStatus: false,
        propertiesStatus: false,
        companyStatus: false,
        categories: [],
        properties: [],
        content: [],
        functions: [],
        icon: null 
    },
    {
        id: 4,
        category: 2,
        name: 'Выбрана категория 4',
        visibilities: [2],
        openIn: 'app',
        browserLink: null,
        generalDescriptionStatus: true,
        categoriesStatus: false,
        propertiesStatus: false,
        companyStatus: false,
        categories: [],
        properties: [],
        content: [],
        functions: [],
        icon: null 
    },
    {
        id: 5,
        category: 2,
        name: 'Выбрана категория 5',
        visibilities: [1, 2],
        openIn: 'app',
        browserLink: null,
        generalDescriptionStatus: true,
        categoriesStatus: false,
        propertiesStatus: false,
        companyStatus: false,
        categories: [],
        properties: [],
        content: [],
        functions: [],
        icon: null 
    },
    {
        id: 6,
        category: 2,
        name: 'Выбрана категория 6',
        visibilities: [1],
        openIn: 'app',
        browserLink: null,
        generalDescriptionStatus: false,
        categoriesStatus: true,
        propertiesStatus: false,
        companyStatus: true,
        categories: [],
        properties: [],
        content: [],
        functions: [],
        icon: null 
    }];
    let formData = null;
    const categories = [{
            id: 1,
            name: 'Ожидание',
        },
        {
            id: 2,
            name: 'Багаж',
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
    const serviceGroups = [
        { id: 1, name: 'Кафе и рестораны' },
        { id: 2, name: 'Магазины' },
    ]
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
        { id: 17, name: "Кафе", groupId: 1, categoryId: 3, visibilities: [1, 2] },
        { id: 18, name: "Фастфуд", groupId: 1, categoryId: 3, visibilities: [1, 2] },
        { id: 19, name: "Аптеки", groupId: 2, categoryId: 3, visibilities: [1, 2] },
        { id: 20, name: "Сувениры", groupId: 2, categoryId: 3, visibilities: [1, 2] },
        { id: 21, name: "Цветы", groupId: 2, categoryId: 3, visibilities: [1, 2] },
        { id: 22, name: "Заказ с доставкой", categoryId: 3, visibilities: [1, 2] },
        { id: 23, name: "Обмен валют", categoryId: 3, visibilities: [1, 2] },
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
        fillTable(tableData);
        renderTabs();
        fillCategoriesSelect();
        fillVisibilitiesSelect();
        fillContentSelect();
    }

    function setContentHeader() {
        const queryParams = new URLSearchParams(window.location.search);
        let textToRender = '';
        for (const [key, val] of queryParams) {
            if (key === 'id') {
                tableItemId = Number(val);
                const tableItem = tableData.find((item) => item.id === tableItemId);
                if (tableItem.id) {
                    textToRender = tableItem.name;
                    formData = new FormData(tableItem);
                }
            } else {
                textToRender = 'Добавить';
                formData = new FormData();
            }
        };
        if (textToRender) {
            $('.page-title h4 span').append(` - ${textToRender}`);
        }
    }

    function fillTable(rows) {
        $tbody.empty();
        let tableRows = '';
        for (const row of rows) {
            if (row) {
                const visibilityArray = [];
                const category = categories.find((item) => item.id === row.category);
                for (const visibility of visibilities) {
                    if (row.visibilities.includes(visibility.id)) {
                        visibilityArray.push(visibility.name);
                    }
                }
                tableRows += `
                    <tr id="${row.id}" class="row-hovered">
                        <td>${category.name}</td>
                        <td>${row.name}</td>
                        <td>${visibilityArray.join(', ')}</td>
                    </tr>`;
            }
        }
        $tbody.append(tableRows);
    }

    function searchHandler(event) {
        const { value } = event.target;
        const toRenderTable = tableData.filter((row) => row.name.toLowerCase().includes(value.toLowerCase()));
        fillTable(toRenderTable);
    }

    function clearSearch() {
        $search.val('');
        fillTable(categories);
    }

    function rowClickHandler() {
        const rowId = $(this).attr('id');
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

    function fileReader(file) {
        if (file) {
            fr = new FileReader();
            fr.onload = function(e) {
                $('#iconPreview').attr('src', e.target.result);
                $('#iconPreview').removeClass('d-none');
            }
            fr.readAsDataURL(file);
        } else {
            $('#iconPreview').addClass('d-none');
        }
    }

    function fillCategoriesSelect() {
        $categorySelect.empty();
        let renderOptions = '';
        for (const category of categories) {
            renderOptions += `<option value="${category.id}">${category.name}</option>`;
        }
        $categorySelect.append(renderOptions);
        $categorySelect.val(formData.category);
    }

    function fillVisibilitiesSelect() {
        $visibilitySelect.empty();
        let renderOptions = '';
        for (const visibility of visibilities) {
            renderOptions += `<option value="${visibility.id}">${visibility.name}</option>`;
        }
        $visibilitySelect.append(renderOptions);
        $visibilitySelect.val(formData.visibilities);
    }

    function fillContentSelect() {
        $contentSelect.empty();
        const selectedCategory = formData.category ? categories.find((category) => category.id === formData.category) : null;
        let rowToRender = '';
        let lastGroupId = null;
        for (const service of services) {
            if (selectedCategory) {
                if (service.categoryId === selectedCategory.id) {
                    if (service.groupId) {
                        const group = serviceGroups.find((item) => item.id === service.groupId);
                        if (lastGroupId) {
                            if (lastGroupId === group.id) {
                                rowToRender += `<option value="${service.id}">${service.name}</option>`;
                            } else {
                                rowToRender += `
                                </optgroup>
                                <optgroup label="${group.name}">
                                <option value="${service.id}">${service.name}</option>`;
                                lastGroupId = group.id;
                            }
                        } else {
                            rowToRender += `
                            <optgroup label="${group.name}">
                            <option value="${service.id}">${service.name}</option>`;
                            lastGroupId = group.id;
                        }
                    } else {
                        if (lastGroupId) {
                            rowToRender += `
                            </optgroup>
                            <option value="${service.id}">${service.name}</option>`;
                            lastGroupId = null;
                        } else {
                            rowToRender += `<option value="${service.id}">${service.name}</option>`;
                        }
                    }
                }
            }
        };
        $contentSelect.append(rowToRender);
        $contentSelect.val(formData.content);
    }

    function fillFormValues() {}

    function formInputHandler({ target }) {
        formData[target.name] = target;
    }

    function formBtnHandler(event) {
        console.log(formData)
        event.preventDefault();
    }


    // Handlers
    $search.on('input', searchHandler);
    $clearSearchBtn.on('click', clearSearch);
    $tbody.on('click', 'tr', rowClickHandler);
    $form
        .on('input', formInputHandler)
        .on('change', 'select', formInputHandler)
        .on('click', 'button', formBtnHandler);

    // Init
    init();
})
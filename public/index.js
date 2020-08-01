if (document.readyState !== 'loading') {
    initTable();
} else {
    document.addEventListener('DOMContentLoaded', function () {
        initTable();
    });
}

function initTable() {
    fetch('/getAll')
        .then(response => response.json())
        .then(data => loadHTMLTable(data['data']))
}



document.querySelector('table tbody').addEventListener('click', function (event) {
    if (event.target.className === "delete-row-btn btn waves-effect waves-lightbtn-small") {
        deleteRowById(event.target.dataset.id);
    }
    if (event.target.className === "edit-row-btn btn waves-effect waves-lightbtn-small") {
        handleEditRow(event.target.dataset.id);
    }
});

const updateBtn = document.querySelector('#update-row-btn')
const searchBtn = document.querySelector('#search-btn')

searchBtn.onclick = function () {
    const searchValue = document.querySelector('#search-input').value;
    if(searchValue === ''){
        initTable()
    }else{
        fetch('/search/' + searchValue)
            .then(response => response.json())
            .then(data => loadHTMLTable(data['data']))
    } 
}

function deleteRowById(id) {
    fetch('/delete/' + id, {
        method: 'DELETE'
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                fetch('/getAll')
                    .then(response => response.json())
                    .then(data => {
                        M.toast({
                            html: 'Deleted en entry',
                            displayLength: 1000
                        })
                        loadHTMLTable(data['data'])
                    })
            }
        });
}


function handleEditRow(id) {
    const updateSection = document.querySelector('#update-row')
    updateSection.hidden = false
    document.querySelector('#update-name-input').dataset.id = id;
    document.querySelector('#update-name-input').value = ''

}


updateBtn.onclick = function () {
    const updateNameInput = document.querySelector('#update-name-input');

    if(updateNameInput.value === ''){
        M.toast({
            html: 'Field cant be empty',
            displayLength: 1000
        })
    }else{

        fetch('/update', {
            method: 'PATCH',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                id: updateNameInput.dataset.id,
                name: updateNameInput.value.substring(0 ,30)
            })
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    const updateSection = document.querySelector('#update-row')
                    updateSection.hidden = true
                    initTable()
                }
            })
    }
    
}



const addBtn = document.querySelector('#add-name-btn')


addBtn.onclick = function () {
    const nameInput = document.querySelector('#name-input')
    const name = nameInput.value.substring(0, 30)
    nameInput.value = ''
    fetch('/insert', {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({ name })
    })
        .then(response => response.json())
        .then(data => insertRowIntoTable(data['data']))
}


function insertRowIntoTable(data) {
    const table = document.querySelector('table tbody')
    const isTableEmpty = table.querySelector('.no-data')

    let tableHtml = '<tr>'

    for (var key in data) {
        if (data.hasOwnProperty(key)) {
            if (key === 'dateAdded') {
                data[key] = new Date(data[key]).toLocaleString()
            }
            tableHtml += `<td>${data[key]}</td>`
        }
    }

    tableHtml += `<td>
            <button  class="delete-row-btn btn waves-effect waves-lightbtn-small" data-id=${data.id}>Delete</button>
        </td>`
    tableHtml += `<td>
            <button  class="edit-row-btn btn waves-effect waves-lightbtn-small" data-id=${data.id}>Edit</button>
        </td>`

    tableHtml += '</tr>'

    if (isTableEmpty) {
        table.innerHTML = tableHtml
    } else {
        const newRow = table.insertRow()
        newRow.innerHTML = tableHtml
    }
}



function loadHTMLTable(data) {
    const table = document.querySelector('table tbody')

    if (data.length === 0) {
        table.innerHTML = "<tr><td class=\"no-data\" colspan =\"5\">Nothing here...</td></tr>"
        return
    }

    let tableHtml = ''

    data.forEach(function ({ id, name, date_added }) {
        tableHtml += '<tr>'
        tableHtml += `<td>${id}</td>`
        tableHtml += `<td>${name}</td>`
        tableHtml += `<td>${new Date(date_added).toLocaleString()}</td>`
        tableHtml += `<td>
            <button  class="delete-row-btn btn waves-effect waves-lightbtn-small" data-id=${id}>Delete</button>
        </td>`
        tableHtml += `<td>
            <button  class="edit-row-btn btn waves-effect waves-lightbtn-small" data-id=${id}>Edit</button>
        </td>`
        tableHtml += '</tr>'
    })


    table.innerHTML = tableHtml
}
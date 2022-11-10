const sortByValue = document.querySelector("#inputSortBy")
const searchTextValue = document.querySelector("#inputSearchText")
const radioAsc = document.querySelector("#radioAsc")
const content = document.querySelector(".content")
const getAllDataButton = document.querySelector("#getAllDataButton")
const searchDataButton = document.querySelector("#searchDataButton")
const saveDataButton = document.querySelector("#saveDataButton")

let dataArray = sessionStorage.getItem("data") || []
const obj = {}

const URL = "http://localhost:8000/"
const HEADER = {
    "Content-Type": "application/json;charset=utf-8",
    "Access-Control-Allow-Origin": "*"
}

window.onload = () => {
    content.innerHTML = dataArray
}

const getAllData = async () => {

    try {
        blockButton()

        const resp = await fetch(`${URL}data/all`, {
            method: "GET"
        })

        const result = await resp.json()
        dataArray = result.data
        content.innerHTML = dataArray
        dataArray = JSON.parse(dataArray)

    } catch (err) {
        new Error(err)
    }
}

const searchData = () => {

    try {
        blockButton()

        const sortDir = radioAsc.checked ? "asc" : "desc"
        content.innerHTML = ""

        obj.sortBy = sortByValue.value
        obj.searchText = searchTextValue.value
        obj.sortDir = sortDir
        console.log(obj)
        dataArray = searchTransactions(dataArray, obj)

        dataArray.forEach(el => {
            const resultElement = document.createElement("div")
            resultElement.classList.add("resultElement")
            resultElement.innerText = JSON.stringify(el)
            content.appendChild(resultElement)
        })

        sessionStorage.setItem("data", JSON.stringify(dataArray))

    } catch (err) {

    }
}


const saveData = async () => {

    try {
        blockInterface("gray")
        content.innerHTML = ""

        const loader = document.createElement("div")
        loader.classList.add("lds-dual-ring")
        content.appendChild(loader)

        const resp = await fetch(`${URL}data`, {
            method: "POST",
            headers: HEADER,
            body: JSON.stringify({
                sortBy: obj.sortBy,
                sortDir: obj.sortDir,
                searchText: obj.searchText,
                searchResult: JSON.stringify(dataArray)
            })
        })

        const result = await resp.json()

        if (result.data.success) {

            const dataSave = document.createElement("div")

            dataSave.innerText = "Данные сохранены"
            content.appendChild(dataSave)

            setTimeout( () => {
                dataSave.remove()
            },3000)
            blockInterface("green")
            loader.remove()
        }

    } catch (err) {
        new Error(err)
    }
}

const blockButton = () => {

    searchDataButton.disabled = !searchDataButton.disabled
    saveDataButton.disabled = !saveDataButton.disabled

    searchDataButton.style.background = "gray"
    saveDataButton.style.background = "gray"

    setTimeout( ()=> {
        searchDataButton.disabled = !searchDataButton.disabled
        saveDataButton.disabled = !saveDataButton.disabled

        searchDataButton.style.background = "green"
        saveDataButton.style.background = "green"

    } , 5000)
}

const blockInterface = (color) => {
    searchDataButton.disabled = !searchDataButton.disabled
    saveDataButton.disabled = !saveDataButton.disabled
    getAllDataButton.disabled = !getAllDataButton.disabled

    searchDataButton.style.background = color
    saveDataButton.style.background = color
    getAllDataButton.style.background = color
}


const searchTransactions = (arr, obj) => {

    if (!obj.sortBy && !obj.searchText) {
        return arr
    }

    const searchTextFunc = (el, field) => {
        let flag = false

        for (let i = 0; i < el.split.length; i++) {
            flag = el.split[i].accountName === obj[field]
            if (flag) {
                return true
            }
        }

        return flag;
    }

    let newArr = arr.filter(el => {
        return searchTextFunc(el, "searchText")
    })

    if (!obj.hasOwnProperty("sortBy")) {
        return newArr
    }

    newArr = _.orderBy(newArr, [obj.sortBy], [obj.sortDir])

    return newArr
}





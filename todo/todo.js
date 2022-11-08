let dataArray = sessionStorage.getItem("data") || []
const content = document.querySelector(".content")

const sortByValue = document.querySelector("#sortByInput")
const searchTextValue = document.querySelector("#searchTextInput")
const radioAsk = document.querySelector("#radioAsk")
const radioDesk = document.querySelector("#radioDesk")
const searchButton = document.querySelector("#searchButton")
const saveDataButton = document.querySelector("#saveDataButton")
const getAllDataButton = document.querySelector("#getAllDataButton")

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
        const resp = await fetch(`${URL}data/all`, {
            method: "GET"
        })
        const result = await resp.json()
        dataArray = result.data
        content.innerHTML = dataArray
        dataArray = JSON.parse(dataArray)
        blockButton()
    } catch (err) {
        new Error(err)
    }
}

const searchData = () => {

    try {
        let sortDir = radioAsk.checked ? "ask" : "desc"

        content.innerHTML = ""

        obj.sortBy = sortByValue.value;
        obj.sortDir = sortDir;
        obj.searchText = searchTextValue.value;
        obj.searchResult = dataArray;
        console.log(obj)
        dataArray = searchTransactions(dataArray, obj)
        dataArray.forEach(el => {
            let task = document.createElement("div")
            task.classList.add("element")
            task.innerText = JSON.stringify(el)
            content.appendChild(task)
        })

        sessionStorage.setItem("data", JSON.stringify(dataArray))

    } catch (err) {
        new Error(err)
    }

}

const blockButton = () => {
    searchButton.disabled = !searchButton.disabled
    saveDataButton.disabled = !saveDataButton.disabled
    searchButton.classList.add("disabled")
    saveDataButton.classList.add("disabled")

    setTimeout(() => {
        searchButton.classList.remove("disabled")
        saveDataButton.classList.remove("disabled")
        searchButton.disabled = !searchButton.disabled
        saveDataButton.disabled = !saveDataButton.disabled
    }, 5000)
}

const blockInterface = (control) => {
    searchButton.disabled = !searchButton.disabled
    saveDataButton.disabled = !saveDataButton.disabled
    getAllDataButton.disabled = !getAllDataButton.disabled

    searchButton.classList[control]("disabled")
    saveDataButton.classList[control]("disabled")
    getAllDataButton.classList[control]("disabled")
}

const saveData = async () => {

    try {
        blockInterface("add")
        const loader = document.createElement("div")
        loader.classList.add("lds-dual-ring")
        content.appendChild(loader)
        dataArray = JSON.stringify(dataArray)

        const resp = await fetch(`${URL}data`, {
            method: "POST",
            headers: HEADER,
            body: JSON.stringify({
                sortBy: obj.sortBy,
                sortDir: obj.sortDir,
                searchText: obj.searchText,
                searchResult: dataArray
            })
        })

        if (resp) {
            loader.remove()
            blockInterface("remove")
        }

        const result = await resp.json()
        const saveComplete = document.createElement("div")
        saveComplete.innerText = "Данные успешно сохранены"

        if (result) {
            content.appendChild(saveComplete)
        }

        setTimeout(() => {
            saveComplete.remove()
        }, 3000)

    } catch (err) {
        new Error(err)
    }
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
let dataArray = sessionStorage.getItem("data") || []
const content = document.querySelector(".content")
const URL = "http://localhost:8000/"
const HEADER = {
    "Content-Type": "application/json;charset=utf-8",
    "Access-Control-Allow-Origin": "*"
}
window.onload = () => {
    content.innerHTML = dataArray
}

let obj = {
    sortBy : String,
    sortDir : String,
    searchText : String,
    searchResult : String
}

const getAllData = async () => {
    try {
        const resp = await fetch(`${URL}all/data`, {
            method: "GET"
        })
        const result = await resp.json()
        dataArray = result.data
        content.innerHTML = dataArray
        blockButton(false, "disabled")
    } catch (err) {
        new Error(err)
    }
}


const searchData = () => {
    let sortByValue = document.querySelector("#sortByInput").value
    let searchTextValue = document.querySelector("#searchTextInput").value
    let radioAsk = document.querySelector("#radioAsk")
    let radioDesk = document.querySelector("#radioDesk")
    let sortDir = ""
    if (radioAsk.checked) {
        sortDir = "ask"
    } else if (radioDesk.checked) {
        sortDir = "desc"
    }
    dataArray =  JSON.parse(dataArray)
    obj = {
        sortBy : sortByValue,
        sortDir : sortDir,
        searchText : searchTextValue,
        searchResult : dataArray
    }
    content.innerHTML = ""

    dataArray = searchTransactions(dataArray, obj)
    dataArray.forEach(el => {
        let task = document.createElement("div")
        task.classList.add("element")
        task.innerText = JSON.stringify(el)
        content.appendChild(task)
    })


    sessionStorage.setItem("data", JSON.stringify(dataArray))
}

const blockButton = (flag, state) => {
    const searchButton = document.querySelector("#searchButton")
    const saveDataButton = document.querySelector("#saveDataButton")
    const getAllDataButton = document.querySelector("#getAllDataButton")
    searchButton.disabled = !searchButton.disabled
    saveDataButton.disabled = !saveDataButton.disabled
    searchButton.classList.add(state)
    saveDataButton.classList.add(state)
    if (flag) {
        getAllDataButton.disabled = !getAllDataButton.disabled
        getAllDataButton.classList.add(state)
    }
    if (!flag) {
        setTimeout(() => {
            if (flag) {
                getAllDataButton.classList.remove(state)
                getAllDataButton.disabled = false
            }
            searchButton.classList.remove(state)
            saveDataButton.classList.remove(state)
            searchButton.disabled = !searchButton.disabled
            saveDataButton.disabled = !saveDataButton.disabled
        }, 5000)
    }

}

const saveData = async () => {
    try {
        blockButton(true, "disabled")

        const loader = document.createElement("div")
        loader.classList.add("lds-dual-ring")
        content.appendChild(loader)
        dataArray = JSON.stringify(dataArray)

        const resp = await fetch(`${URL}data` , {
            method: "POST",
            headers: HEADER,
            body: JSON.stringify({
                sortBy : obj.sortBy,
                sortDir : obj.sortDir,
                searchText : obj.searchText,
                searchResult : dataArray
            })
        })
        if (resp) {
            loader.remove()
            blockButton()
        }
        const result = await resp.json()
        const saveComplete = document.createElement("div")
        saveComplete.innerText = "Данные успешно сохранены"

        if (result) {
            content.appendChild(saveComplete)
        }
        setTimeout(()=> {
            saveComplete.remove()
        }, 3000)

    } catch (err) {
        new Error(err)
    }
}


const searchTransactions = (arr, obj) => {

    const keys = Object.keys(obj)

    if (keys.length === 0) {
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


   /* const valueSort =

    newArr.sort((a, b) => {
        let aBiggerThanB = a[valueSort] > b[valueSort]
        const compareCondition = isAsk ? aBiggerThanB : !aBiggerThanB;

        return compareCondition ? 1 : -1
    })*/


    return newArr
}
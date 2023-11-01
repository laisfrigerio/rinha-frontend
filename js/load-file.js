const input = document.querySelector('form input')
const label = document.querySelector('form label')
const errorFile = document.querySelector('.error')

const main = document.querySelector('main')
const jsonTree = document.querySelector('#json-tree')

const PER_PAGE = 100
const START_PAGE = 0
const pagination = { perPage: PER_PAGE, currentPage: START_PAGE }

let tree = null

if (typeof(worker) == "undefined") {
  var worker = new Worker("./worker/render-file-content.js");
}

const enableInput = () => {
  input.disabled = false
  label.classList.remove("disabled")
}

const disableInput = () => {
  input.disabled = false
  label.classList.add("disabled")
}

const showError = () => {
  label.textContent = "Load JSON"
  errorFile.classList.add("show")
}

const hideError = () => {
  errorFile.classList.remove("show")
}

input.addEventListener("change", function () {
  const [ file ] = this.files
  const { name, type } = file

  if (type !== "application/json") {
    showError()
    return
  }

  disableInput()
  hideError()

  label.textContent = name

  if (file) {
    worker.postMessage(file)
  }
})

worker.addEventListener('message', function(e) {
  try {
    const data = e.data

    if (data.error && data.error === "Invalid JSON") {
      throw new Error("Invalid JSON")
    }

    main.classList.add("hidden")

    tree = new Tree(jsonTree, data, pagination)
    tree.render()
  } catch (ex) {
    showError()
    enableInput()
  }
})

// Attach a scroll event listener to the list container
window.addEventListener("scroll", function () {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement

  if (scrollTop + clientHeight >= scrollHeight) {
    console.log(scrollTop + clientHeight >= scrollHeight)
    pagination.currentPage += 1
    tree.render()
  }
})

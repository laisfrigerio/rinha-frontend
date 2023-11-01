const renderFileContent = (file) => {
  if (file) {
    const reader = new FileReader()

    reader.onload = function (event) {
      try {
        const jsonText = event.target.result
        const data = JSON.parse(jsonText)
        postMessage(data)
      } catch (ex) {
        postMessage({ error: "Invalid JSON" })
      }
    }

    reader.readAsText(file)
  }
}

addEventListener('message', function(e) {
  const file = e.data
  renderFileContent(file)
})

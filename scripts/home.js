
let importBox = document.getElementById('import')

;['dragover', 'drop', 'dragenter', 'dragleave'].forEach(event => {
    window.addEventListener(event, preventDefaults, false)
})
  
function preventDefaults (e) {
    e.preventDefault()
    e.stopPropagation()
}

;['dragenter', 'dragover'].forEach(event => {
    window.addEventListener(event, highlight, false)
})
  
;['dragleave', 'drop'].forEach(event => {
    window.addEventListener(event, unhighlight, false)
})
  
function highlight(e) {importBox.classList.remove('inactive')}
function unhighlight(e) {importBox.classList.add('inactive')}

window.addEventListener('drop', handleDrop, false)

function handleDrop(e) {
  let dt = e.dataTransfer
  let files = dt.files

  handleFiles(files)
}

function handleFiles(files) {
    ([...files]).forEach(console.log)
}
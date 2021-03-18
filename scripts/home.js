
const importBox = document.getElementById('import')
const files = document.getElementById('files')

importBox.addEventListener('click', () => {
    files.click()
})

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
  const files = e.dataTransfer.files

  handleFiles(files)
}

function handleFiles(files) {
    ([...files]).forEach(parseFile)
}

function parseFile(file) {
    const reader = new FileReader()
    reader.onload = event => matchSkills(event.target.result)
    reader.onerror = error => console.error(error)

    reader.readAsText(file)
}

function matchSkills(chatlog) {
    const pattern = /(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}) \[System\] \[\] You have gained (\d\.*\d*) (.+)/g

    let matches, skills = []
    while (matches = pattern.exec(chatlog))
        skills.push(matches[3])

    skills = skills.map(skill => skill.remove("experience in your ").remove(" skill"))
    console.log(skills)
}

String.prototype.remove = function(str) { return this.replace(str, "") }

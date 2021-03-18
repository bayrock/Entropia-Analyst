
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
    reader.onload = event => readSkills(event.target.result)
    reader.onerror = error => console.error(error)

    reader.readAsText(file)
}

function readSkills(chatlog) {
    const pattern = /(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}) \[System\] \[\] You have gained (\d\.*\d*) (.+)/g

    // Match the skill gains
    let matches, startDate, skillLabels = [], skillGains = []
    while (matches = pattern.exec(chatlog)) {
        if (!startDate)
            startDate = matches[1]

        skillGains.push(matches[2])
        skillLabels.push(matches[3])
    }

    skillLabels = skillLabels.map(skill => skill.remove("experience in your ").remove(" skill"))
    
    // Calculate the totals
    let gain, total, skillData = {}
    skillLabels.forEach((label, key) => {
        gain = parseFloat(skillGains[key])
        total = skillData[label]
        skillData[label] = total? total + gain : 0 + gain
        //console.log(label, skillGains[key])
    })

    // Log skill data to console
    const length = Object.keys(skillData).length
    for (const skill in skillData) {
        total = skillData[skill].toFixed(4)
        console.log(`%c${skill}:%c ${total}`, "font-weight:bold;", "font-weight:normal;")
    }

    console.log(`%cShowing ${length} gains since ${startDate}`, "font-weight:bold;color:green;")
}

String.prototype.remove = function(str) { return this.replace(str, "") }

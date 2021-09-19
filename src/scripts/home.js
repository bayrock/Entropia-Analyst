
//import {createChart} from './chart.js'

const importBox = document.getElementById('import')
const input = document.getElementById('files')
const skillList = document.getElementById('skills')
const slogan = document.getElementById('slogan')

importBox.addEventListener('click', () => {
    input.click()
})

input.addEventListener('change', function () {
    handleFiles(this.files)
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

function createSkill(label, gain) {
    let element = document.createElement('div')
    let icon = label.toLowerCase().replace(/\s/g, "_")
    element.classList.add('skill-well')
    element.innerHTML = `<img src="img/skills/${icon}.jpg" class="skill-icon"><div class="skill-label">${label}</div><div class="skill-gain">${gain}</div>`
    
    return element
}

function getOverallPercentage(gain, overall) {
    let ratio = (gain / overall) * 100
    return [ratio.toFixed(), 100 - ratio.toFixed()]
}

function getSortedData(skillData) {
    let sorted = []
    for (const skill in skillData)
        sorted.push({label: skill, gain: skillData[skill]})

    sorted.sort((a, b) => {return b.gain - a.gain})
    return sorted
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

    skillLabels = skillLabels.map(skill => skill.remove('experience in your ').remove(' skill'))
    
    // Calculate the totals
    let overall = 0
    let gain, total, skillData = {}
    skillLabels.forEach((label, key) => {
        gain = parseFloat(skillGains[key])
        overall += gain

        total = skillData[label]
        skillData[label] = total? total + gain : 0 + gain
        //console.log(label, skillGains[key])
    })

    // Log skill data to console
    const length = Object.keys(skillData).length
    getSortedData(skillData).forEach((skill) => {
        total = skill.gain.toFixed(2)
        
        let skillElement = createSkill(skill.label, total)
        let percentage = getOverallPercentage(total, overall)
        //console.warn(`Percentage: ${percentage[0]}% and ${percentage[1]}%`)

        skillElement.setAttribute('style', `background: linear-gradient(90deg, #1A1A2E80 ${percentage[1]}%, #0F3460 ${percentage[0]}%);`)
        skillList.appendChild(skillElement)

        console.log(`%c${skill.label}:%c ${total}`, 'font-weight:bold;', 'font-weight:normal;')
    })

    //let chart = createChart(...args)
    slogan.innerHTML = `Showing <span class="accent">${length}</span> skills since <span class="accent">${startDate.split(" ")[0]}</span>`
    importBox.style.display = 'none'
    console.log(`%cShowing ${length} gains since ${startDate}`, 'font-weight:bold;color:green;')
    console.log(`Overall: ${overall.toFixed(2)}`)
}

String.prototype.remove = function(str) { return this.replace(str, '') }

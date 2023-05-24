let my = {}

function init() {
    let version = '0.01'
    my.wd = 360
    my.ht = 450
    my.winLens = [{
        name: '3',
        len: 3
    }, {
        name: '4',
        len: 4
    }, {
        name: '5',
        len: 5
    }, ]
    my.bdSzs = [{
        name: '3',
        sz: 3
    }, {
        name: '4',
        sz: 4
    }, {
        name: '5',
        sz: 5
    }, {
        name: '6',
        sz: 6
    }, {
        name: '7',
        sz: 7
    }, {
        name: '8',
        sz: 8
    }, ]
    my.replaceQ = false
    my.playerTypes = [{
        name: 'Human',
        aiQ: false
    }, {
        name: 'Computer (Beginner)',
        aiQ: true,
        levelMax: 1,
        timeMax: 3000
    }, {
        name: 'Computer (Medium)',
        aiQ: true,
        levelMax: 3,
        timeMax: 3000
    }, {
        name: 'Computer (Challenging)',
        aiQ: true,
        levelMax: 4,
        timeMax: 10000
    }, {
        name: 'Computer (Hard)',
        aiQ: true,
        levelMax: 6,
        timeMax: 10000
    }, ]
    my.players = [{
        name: 'O',
        type: my.playerTypes[0],
        score: 0
    }, {
        name: 'X',
        type: my.playerTypes[0],
        score: 0
    }, ]
    my.playerN = 0
    my.playerStartN = 0
    this.clrs = [
        ['Blue', '#0000FF'],
        ['Red', '#FF0000'],
        ['Black', '#000000'],
        ['Green', '#00cc00'],
        ['Orange', '#FFA500'],
        ['Slate Blue', '#6A5ACD'],
        ['Lime', '#00FF00'],
        ['Spring Green', '#00FF7F'],
        ['Teal', '#008080'],
        ['Gold', '#ffd700'],
        ['Med Purple', '#aa00aa'],
        ['Light Blue', '#ADD8E6'],
        ['Navy', '#000080'],
        ['Purple', '#800080'],
        ['Dark SeaGreen', '#8FBC8F'],
    ]
    my.clrNum = 0
    my.AI = new AI()
    my.interactQ = false
    let s = ''
    my.sndHome = document.domain == 'localhost' ? '/mathsisfun/images/sounds/' : '/images/sounds/'
    s += '<audio id="sndWin" src="' + my.sndHome + 'yes2.mp3" preload="auto"></audio>'
    s += '<audio id="sndDrop" src="' + my.sndHome + 'click1.mp3" preload="auto"></audio>'
    s += '<audio id="sndDraw" src="' + my.sndHome + 'wibble.mp3" preload="auto"></audio>'
    my.snds = []
    s += '<div id="main" style="position:relative; width:' + my.wd + 'px; min-height:' + my.ht + 'px; background-xnor: white; margin:auto; display:block; border: 1px solid black; border-radius: 10px;">'
    s += '<div id="top" style="font: 24px Arial; text-align:center; margin-top:3px; height:34px">'
    s += '<div id="btns" style="position:absolute; left: 3px; font: 18px Arial;">'
    s += '<button id="optBtn" type="button" style="z-index:2;" class="btn" onclick="optPop()">Options</button>'
    s += '<button id="newBtn" type="button" style="z-index:2;" class="btn" onclick="gameNew()">New Game</button>'
    my.soundQ = true
    s += '&nbsp;'
    s += soundBtnHTML()
    s += '</div>'
    s += '<div id="scores" style="position:absolute; right: 3px; font: bold 24px Arial;" onclick="start()">'
    s += '</div>'
    s += '</div>'
    s += '<div id="msg" style="font:  24px Arial; color:#FE0000; text-align:center; margin-top:5px;">Player X</div>'
    s += '<div id="board" style=""></div>'
    s += wrap({
        id: 'optPop',
        tag: 'div'
    })
    s += '<canvas id="timercanvas" width="100" height="100" style="z-index:2;  width:100px;"></canvas>'
    s += wrap({
        cls: 'copyrt',
        pos: 'abs',
        style: 'left:5px; bottom:3px'
    }, `v${version}`)
    s += '</div>'
    docInsert(s)
    my.optPop = new Pop('optPop', [{
        txt: '&#x2714;',
        fn: gameNew
    }, {
        txt: '&#x2718;'
    }])
    my.optPop.htmlSet(optPopHTML())
    my.optPop.open()
}

function gameNew() {
    my.winLen = my.winLenUI.sel.len
    my.bdSz = my.bdSzUI.sel.sz
    console.log('bdSz,winLen', my.bdSz, my.winLen)
    for (let i = 0; i < my.players.length; i++) {
        let n = my.playerUIs[i].n
        my.players[i].type = my.playerTypes[n]
        console.log('my.players', my.players[i])
    }
    let myNode = document.getElementById('board')
    while (myNode.firstChild) {
        myNode.removeChild(myNode.firstChild)
    }
    my.boxWd = Math.min(70, Math.min(my.wd, my.ht - 90) / my.bdSz)
    console.log('my', my)
    bdDraw()
    my.playerN = my.playerStartN
    msg(my.players[my.playerN].name + "'s Turn")
    if (my.players[my.playerN].type.aiQ) {
        console.log('gameNew ai move')
        let xn = getRandomInt(0, my.bdSz - 1)
        let yn = getRandomInt(0, my.bdSz - 1)
        let tile = my.bd[xn][yn]
        tile.playerN = my.playerN
        tile.draw()
        turnNext(tile)
    }
    my.interactQ = true
    my.playerStartN = 1 - my.playerStartN
}

function msg(s) {
    document.getElementById('msg').innerHTML = s
}

function bdDraw() {
    my.borderTp = 75
    my.borderLt = (my.wd - my.bdSz * my.boxWd) / 2
    my.bd = []
    for (let xn = 0; xn < my.bdSz; xn++) {
        my.bd[xn] = []
        for (let yn = 0; yn < my.bdSz; yn++) {
            let tile = new Tile(my.boxWd, my.boxWd, boxLeft(xn), boxTop(yn))
            tile.xn = xn
            tile.yn = yn
            my.bd[xn][yn] = tile
        }
    }
}

function boxLeft(xn) {
    return my.borderLt + my.boxWd * xn
}

function boxTop(yn) {
    return my.borderTp + my.boxWd * yn
}

function turnNext(me) {
    let line = winLine(bdSimple(), me.xn, me.yn, my.playerN)
    if (line.length > 0) {
        msg(my.players[my.playerN].name + ' wins!')
        soundPlay('sndWin')
        my.interactQ = false
        winShow(line)
        my.players[my.playerN].score++
            let s = ''
        for (let i = 0; i < my.players.length; i++) {
            let p = my.players[i]
            s += p.name + ':' + p.score + ' '
        }
        document.getElementById('scores').innerHTML = s
    } else {
        if (gameOverQ(bdSimple())) {
            soundPlay('sndDraw')
            msg('DRAW!')
            my.interactQ = false
        } else {
            soundPlay('sndDrop')
            my.playerN = 1 - my.playerN
            console.log('Change Player to:', my.players[my.playerN])
            let msgStr = my.players[my.playerN].name + "'s Turn"
            if (my.players[my.playerN].type.aiQ) {
                my.interactQ = false
                msgStr += ' (wait)'
                setTimeout(aiDo, 300)
            }
            msg(msgStr)
        }
    }
}

function aiDo() {
    let move = my.AI.moveBest(bdSimple(), my.playerN)
    console.log('AI.moveBest = ', move)
    let tile = my.bd[move[0]][move[1]]
    tile.playerN = my.playerN
    tile.draw()
    turnNext(tile)
    my.interactQ = true
}

function winShow(line) {
    for (let i = 0; i < line.length; i++) {
        let pos = line[i]
        my.bd[pos[0]][pos[1]].win()
    }
}

function winLine(bd, xn, yn, playerN) {
    let dirs = [
        [1, 0],
        [0, 1],
        [1, 1],
        [1, -1],
    ]
    for (let i = 0; i < dirs.length; i++) {
        let dir = dirs[i]
        for (let j = 1 - my.winLen; j < my.winLen; j++) {
            let sttxn = xn + dir[0] * j
            let sttyn = yn + dir[1] * j
            let s = ''
            let winQ = true
            let line = []
            for (let k = 0; k < my.winLen; k++) {
                let xi = sttxn + dir[0] * k
                let yi = sttyn + dir[1] * k
                line.push([xi, yi])
                s += '(' + xi + ',' + yi + ',' + bdPlayer(bd, xi, yi) + ')'
                if (bdPlayer(bd, xi, yi) != playerN) {
                    winQ = false
                    continue
                }
            }
            if (winQ) {
                return line
            }
        }
    }
    return []
}

function bdPlayer(bd, xn, yn) {
    if (xn < 0) return -1
    if (yn < 0) return -1
    if (xn >= my.bdSz) return -1
    if (yn >= my.bdSz) return -1
    return bd[xn][yn]
}

function bdFmt(bd) {
    let s = ''
    for (let yn = 0; yn < my.bdSz; yn++) {
        for (let xn = 0; xn < my.bdSz; xn++) {
            let playerN = bd[xn][yn]
            if (playerN == -1) {
                s += '~'
            } else {
                s += +playerN
            }
        }
        s += '\n'
    }
    return s
}

function bdSimple() {
    let bd = []
    for (let xn = 0; xn < my.bdSz; xn++) {
        bd[xn] = []
        for (let yn = 0; yn < my.bdSz; yn++) {
            bd[xn][yn] = my.bd[xn][yn].playerN
        }
    }
    return bd
}

function gameOverQ(bd) {
    for (let xn = 0; xn < my.bdSz; xn++) {
        for (let yn = 0; yn < my.bdSz; yn++) {
            if (bdPlayer(bd, xn, yn) == -1) return false
        }
    }
    return true
}

function AI() {}
AI.prototype.moveBest = function(bd, playerN) {
    this.choice = []
    this.aiplayer = playerN
    this.currPlayer = playerN
    this.stt = performance.now()
    this.alphaBetaMinimax(bd, 0, [0, 0], playerN, -Infinity, +Infinity)
    this.elapsed = performance.now() - this.stt
    console.log(my.players[this.aiplayer].name + ' elapsed: ' + this.elapsed / 1000)
    return this.choice
}
AI.prototype.alphaBetaMinimax = function(bd, depth, move, playerN, alpha, beta) {
    let playerPrev = 1 - playerN
    let line = winLine(bd, move[0], move[1], playerPrev)
    if (line.length > 0) {
        if (playerPrev == this.aiplayer) {
            return 20 - depth
        } else {
            return depth - 20
        }
    }
    if (depth > my.players[this.aiplayer].type.levelMax) return getRandomInt(-5, 5)
    let elapsed = performance.now() - this.stt
    if (depth > 3 && elapsed > my.players[this.aiplayer].type.timeMax) return 0
    depth += 1
    let availableMoves = this.getAvailableMoves(bd)
    if (availableMoves.length == 0) {
        return getRandomInt(-5, 5)
    }
    let result
    if (playerN === this.aiplayer) {
        for (let i = 0; i < availableMoves.length; i++) {
            move = availableMoves[i]
            bd[move[0]][move[1]] = playerN
            result = this.alphaBetaMinimax(bd, depth, move, 1 - playerN, alpha, beta)
            bd[move[0]][move[1]] = -1
            if (result > alpha) {
                alpha = result
                if (depth == 1) {
                    this.choice = move
                }
            } else if (alpha >= beta) {
                return alpha
            }
        }
        return alpha
    } else {
        for (let i = 0; i < availableMoves.length; i++) {
            move = availableMoves[i]
            bd[move[0]][move[1]] = playerN
            result = this.alphaBetaMinimax(bd, depth, move, 1 - playerN, alpha, beta)
            bd[move[0]][move[1]] = -1
            if (result < beta) {
                beta = result
                if (depth == 1) {
                    this.choice = move
                    console.log('this.choice = ', move)
                }
            } else if (beta <= alpha) {
                return beta
            }
        }
        return beta
    }
}
AI.prototype.getAvailableMoves = function(bd) {
    let moves = []
    if (my.bdSz <= 5) {
        for (let xn = 0; xn < my.bdSz; xn++) {
            for (let yn = 0; yn < my.bdSz; yn++) {
                if (bd[xn][yn] == -1) moves.push([xn, yn])
            }
        }
    } else {
        for (let xn = 0; xn < my.bdSz; xn++) {
            for (let yn = 0; yn < my.bdSz; yn++) {
                if (bd[xn][yn] == -1) {
                    if (bdNear(bd, xn, yn, 2)) {
                        moves.push([xn, yn])
                    }
                }
            }
        }
    }
    return moves
}

function bdNear(bd, xn, yn, n) {
    let dirs = [
        [0, -1],
        [1, -1],
        [1, 0],
        [1, 1],
        [0, 1],
        [-1, 1],
        [-1, 0],
        [-1, -1],
    ]
    for (let k = 0; k < dirs.length; k++) {
        let dir = dirs[k]
        for (let m = 1; m <= n; m++) {
            if (bdPlayer(bd, xn + dir[0] * m, yn + dir[1] * m) != -1) return true
        }
    }
    return false
}

function radioHTML(prompt, id, lbls, func) {
    let s = ''
    s += '<div style="display:inline-block; border: 1px solid white; border-radius:5px; padding:3px; margin:3px; background-xnor:rgba(255,255,255,0.5);">'
    s += prompt
    for (let i = 0; i < lbls.length; i++) {
        let lbl = lbls[i]
        let idi = id + i
        let chkStr = i == 0 ? ' checked ' : ''
        s += '<input id="' + idi + '" type="radio" name="' + id + '" value="' + lbl + '" onclick="' + func + '(' + i + ');" autocomplete="off" ' + chkStr + ' >'
        s += '<label for="' + idi + '">' + lbl + ' </label>'
    }
    s += '</div>'
    return s
}

function cutoffCallback() {}

function endGameCallback() {}
let seed = 1
seed = +new Date()

function random() {
    let x = Math.sin(seed++) * 10000
    return x - Math.floor(x)
}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

function optPopHTML() {
    let s = ''
    my.playerUIs = []
    let s1 = ''
    for (let i = 0; i < my.players.length; i++) {
        let p = my.players[i]
        s1 += '<div class="sect">'
        s1 += '<div  style="font: 20px Arial; color: #FFFFFF; padding:7px 0 6px 0;">' + p.name + ' player:</div>'
        my.playerUIs[i] = new UI({
            id: 'playerType' + i,
            tag: 'sel',
            sels: my.playerTypes,
            lbl: 'Type:'
        })
        s1 += my.playerUIs[i].html
        s1 += '</div>'
    }
    s += wrap({
        id: 'optInside',
        tag: 'div',
        style: 'margin: 5px auto 5px auto;'
    }, s1)
    my.bdSzUI = new UI({
        id: 'bdSzUI',
        tag: 'radio',
        sels: my.bdSzs,
        lbl: 'Board Size:'
    })
    my.winLenUI = new UI({
        id: 'winLenUI',
        tag: 'radio',
        sels: my.winLens,
        lbl: 'Winning Length:'
    })
    s += wrap({
        id: '',
        tag: 'div',
        style: 'margin: 5px auto 5px auto;'
    }, wrap({
        id: '',
        tag: 'div',
        cls: 'sect'
    }, my.bdSzUI.html), wrap({
        id: '',
        tag: 'div',
        cls: 'sect'
    }, my.winLenUI.html))
    return s
}

function optPop() {
    my.optPop.open()
}

function getDropdownHTML(opts, funcName, id, chkNo) {
    let s = ''
    s += '<select id="' + id + '" style="font: 14px Arial; color: #6600cc; background: white; padding: 1px;line-height:30px; border-radius: 5px;">'
    for (let i = 0; i < opts.length; i++) {
        let idStr = id + i
        let chkStr = i == chkNo ? 'selected' : ''
        s += '<option id="' + idStr + '" value="' + opts[i].name + '" style="height:21px;" ' + chkStr + ' >' + opts[i].name + '</option>'
    }
    s += '</select>'
    return s
}

function soundBtnHTML() {
    let onClr = 'blue'
    let offClr = '#bbb'
    let s = ''
    s += '<style> '
    s += ' .speaker { height: 30px; width: 30px; position: relative; overflow: hidden; display: inline-block; vertical-align:top; } '
    s += ' .speaker span { display: block; width: 9px; height: 9px; background-color:' + onClr + '; margin: 10px 0 0 1px; }'
    s += ' .speaker span:after { content: ""; position: absolute; width: 0; height: 0; border-style: solid; border-color: transparent ' + onClr + ' transparent transparent; border-width: 10px 16px 10px 15px; left: -13px; top: 5px; }'
    s += ' .speaker span:before { transform: rotate(45deg); border-radius: 0 60px 0 0; content: ""; position: absolute; width: 5px; height: 5px; border-style: double; border-color:' + onClr + '; border-width: 7px 7px 0 0; left: 18px; top: 9px; transition: all 0.2s ease-out; }'
    s += ' .speaker:hover span:before { transform: scale(.8) translate(-3px, 0) rotate(42deg); }'
    s += ' .speaker.mute span:before { transform: scale(.5) translate(-15px, 0) rotate(36deg); opacity: 0; }'
    s += ' .speaker.mute span { background-color:' + offClr + '; }'
    s += ' .speaker.mute span:after {border-color: transparent ' + offClr + ' transparent ' + offClr + ';}'
    s += ' </style>'
    s += '<div id="sound" onClick="soundToggle()" class="speaker"><span></span></div>'
    return s
}

function soundPlay(id, simulQ) {
    if (!my.soundQ) return
    simulQ = typeof simulQ !== 'undefined' ? simulQ : false
    if (simulQ) {
        if (id.length > 0) document.getElementById(id).play()
    } else {
        my.snds.push(id)
        soundPlayQueue(id)
    }
}

function soundPlayQueue(id) {
    let div = document.getElementById(my.snds[0])
    div.play()
    div.onended = function() {
        my.snds.shift()
        if (my.snds.length > 0) soundPlayQueue(my.snds[0])
    }
}

function soundToggle() {
    let btn = 'sound'
    if (my.soundQ) {
        my.soundQ = false
        document.getElementById(btn).classList.add('mute')
    } else {
        my.soundQ = true
        document.getElementById(btn).classList.remove('mute')
    }
}

function Timer(g, rad, secs, clr, funcEnd) {
    this.g = g
    this.rad = rad
    this.secs = secs
    this.clr = clr
    this.funcEnd = funcEnd
    this.x = rad
    this.y = rad
    this.stt = performance.now()
    this.stopQ = false
}
Timer.prototype.update = function() {}
Timer.prototype.restart = function(secs) {
    this.secs = secs
    this.stt = performance.now()
    this.stopQ = false
    requestAnimationFrame(this.draw.bind(this))
}
Timer.prototype.more = function(secs) {
    this.stt += secs * 1000
}
Timer.prototype.stop = function() {
    this.stopQ = true
}
Timer.prototype.draw = function() {
    if (this.stopQ) return
    let now = performance.now()
    let elapsed = now - this.stt
    let ratio = Math.min(1, elapsed / this.secs / 1000)
    let g = this.g
    g.beginPath()
    g.fillStyle = '#def'
    g.arc(this.x, this.y, this.rad, 0, 2 * Math.PI)
    g.fill()
    g.beginPath()
    g.moveTo(this.x, this.y)
    g.fillStyle = this.clr
    g.arc(this.x, this.y, this.rad, -Math.PI / 2, ratio * 2 * Math.PI - Math.PI / 2)
    g.fill()
    if (ratio < 1) {
        requestAnimationFrame(this.draw.bind(this))
    } else {
        this.funcEnd()
    }
}

function Tile(wd, ht, lt, tp) {
    this.wd = wd
    this.ht = ht
    this.bgClr = 'hsla(240,100%,90%,0.4)'
    this.fgClr = 'hsla(240,100%,90%,1)'
    this.strokeClr = 'hsla(240,100%,90%,1)'
    this.playerN = -1
    let div = document.createElement('div')
    div.style.width = wd + 'px'
    div.style.height = ht + 'px'
    div.style.position = 'absolute'
    div.style.top = tp + 'px'
    div.style.left = lt + 'px'
    this.div = div
    let me = this
    div.addEventListener('mouseover', function() {
        if (!my.interactQ) return
        if (my.replaceQ) {
            if (me.playerN != my.playerN) {}
        } else {
            if (me.playerN == -1) {
                me.drawPlayer(my.playerN, '#bcf')
            }
        }
    })
    div.addEventListener('mouseleave', function() {
        if (!my.interactQ) return
        if (my.replaceQ) {
            if (me.playerN != my.playerN) {}
        } else {
            if (me.playerN == -1) {
                me.drawPlayer(-1)
            }
        }
    })
    div.addEventListener('click', function() {
        if (!my.interactQ) return
        if (my.replaceQ) {
            if (me.playerN != my.playerN) {
                me.playerN = my.playerN
                me.draw()
                turnNext(me)
            }
        } else {
            if (me.playerN == -1) {
                me.playerN = my.playerN
                me.draw()
                turnNext(me)
            }
        }
    })
    let can = document.createElement('canvas')
    can.style.position = 'absolute'
    can.style.top = '0px'
    can.style.left = '0px'
    can.style.width = '100%'
    can.style.height = '100%'
    can.width = wd
    can.height = ht
    this.g = can.getContext('2d')
    div.appendChild(can)
    document.getElementById('board').appendChild(div)
    this.draw()
}
Tile.prototype.draw = function() {
    let fgClr = 'darkblue'
    if (this.playerN == 1) fgClr = 'darkred'
    this.drawPlayer(this.playerN, fgClr)
}
Tile.prototype.drawPlayer = function(playerN, fgClr) {
    fgClr = typeof fgClr !== 'undefined' ? fgClr : 'black'
    this.fgClr = fgClr
    let g = this.g
    g.clearRect(0, 0, this.wd, this.ht)
    g.strokeStyle = this.strokeClr
    g.lineWidth = 1
    g.fillStyle = this.bgClr
    g.beginPath()
    g.rect(2, 2, this.wd - 4, this.ht - 4)
    g.stroke()
    g.fill()
    if (playerN >= 0) {
        g.strokeStyle = this.fgClr
        switch (my.players[playerN].name) {
            case 'O':
                g.lineWidth = 2
                g.beginPath()
                g.arc(this.wd / 2, this.ht / 2, this.wd / 3, 0, 2 * Math.PI)
                g.stroke()
                break
            case 'X':
                g.lineWidth = 2
                let edge = this.wd * 0.2
                g.beginPath()
                g.moveTo(edge, edge)
                g.lineTo(this.wd - edge, this.wd - edge)
                g.stroke()
                g.beginPath()
                g.moveTo(edge, this.wd - edge)
                g.lineTo(this.wd - edge, edge)
                g.stroke()
                break
            default:
        }
    }
}
Tile.prototype.win = function() {
    this.bgClr = '#ffe'
    this.draw()
}
Tile.prototype.setxy = function(lt, tp) {
    this.div.style.left = lt + 'px'
    this.div.style.top = tp + 'px'
}
class Pop {
    constructor(id, btns = [{
        txt: '&#x2714;',
        fn: null
    }, {
        txt: '&#x2718;',
        fn: null
    }]) {
        this.id = id
        this.btns = btns
        this.div = document.getElementById(this.id)
        this.div.classList.add('pop')
        this.div.style = 'position:absolute; left:-450px; top:10px; width:auto; transition: all linear 0.3s; opacity:0; text-align: center; '
        this.bodyDiv = document.createElement('div')
        this.div.appendChild(this.bodyDiv)
        for (let i = 0; i < btns.length; i++) {
            let btn = btns[i]
            var btnDiv = document.createElement('button')
            this.div.appendChild(btnDiv)
            btnDiv.classList.add('btn')
            btnDiv.style = 'font: 22px Arial;'
            btnDiv.innerHTML = btn.txt
            btnDiv.onclick = this.btnClick.bind(this, i)
        }
        return this
    }
    open() {
        let div = this.div
        div.style.transitionDuration = '0.3s'
        div.style.opacity = 1
        div.style.zIndex = 12
        div.style.left = (my.wd - 380) / 2 + 'px'
    }
    close() {
        this.div.style.opacity = 0
        this.div.style.zIndex = 1
        this.div.style.left = '-999px'
    }
    btnClick(n) {
        let btn = this.btns[n]
        console.log('btnClick', n, this.btns, btn)
        this.close()
        if (typeof btn.fn === 'function') btn.fn()
    }
    htmlSet(s) {
        this.bodyDiv.innerHTML = s
        return s
    }
}
class Opt {
    constructor(item, txt = '') {
        this.app = 'tic-tac-toe'
        if (typeof item == 'string') {
            this.id = item
            this.txt = txt
        } else {
            this.id = item.id
            this.txt = item.val
            this.item = item
        }
        if (my.opts == undefined) my.opts = []
        my.opts[this.id] = this
    }
    get val() {
        let stored = localStorage.getItem(this.app + '.' + this.id)
        return stored == null ? this.txt : stored
    }
    set val(v) {
        localStorage.setItem(this.app + '.' + this.id, v)
    }
}
class UI {
    constructor({
        id = '',
        tag = 'sld',
        sels = [],
        lims = [0, 100, 1],
        val = '',
        style = '',
        valQ = true,
        lbl = '',
        fn = ''
    }, ...mores) {
        this.id = id
        this.tag = tag
        this.sels = sels
        this.lims = lims
        this.lbl = lbl
        this.style = style
        this.valShowQ = valQ
        if (tag == 'sel') this.valShowQ = false
        this.fn = fn
        this.opt = new Opt(this)
        let stored = this.opt.val
        this.value = stored == null ? val : stored
        this.sel = this.sels[this.n]
    }
    get n() {
        for (let i = 0; i < this.sels.length; i++) {
            let sel = this.sels[i]
            if (this.value == sel.name) return i
        }
        return 0
    }
    get html() {
        let s = ''
        switch (this.tag) {
            case 'radio':
                if (this.lbl.length > 0) s += '<label class="label">' + this.lbl + ' '
                for (let i = 0; i < this.sels.length; i++) {
                    let chk = ''
                    let idi = this.id + i
                    let sel = this.sels[i]
                    if (sel.name == this.value) chk = 'checked'
                    s += '<div style="display:inline-block; white-space: nowrap;">'
                    s += '<input id="' + idi + '" type="radio" name="' + this.id + '" value="' + sel.name + '" onclick="my.opts[\'' + this.id + '\'].item.onChg(this.value);" ' + chk + ' >'
                    s += '<label for="' + idi + '"  onclick="my.opts[\'' + this.id + '\'].item.onChg(this.value);">'
                    s += sel.name + '</label>&nbsp;'
                    s += '</div>'
                }
                break
            case 'sel':
                if (this.lbl.length > 0) s += '<label class="label">' + this.lbl + ' '
                s += '<select class="select" onchange="my.opts[\'' + this.id + '\'].item.onChg(this.value)";>'
                for (let i = 0; i < this.sels.length; i++) {
                    let sel = this.sels[i]
                    let idStr = this.id + i
                    let chkStr = sel.name == this.value ? ' selected ' : ''
                    let descr = sel.hasOwnProperty("descr") ? sel.descr : sel.name
                    s += '<option id="' + idStr + '" value="' + sel.name + '"' + chkStr + '>' + descr + '</option>\n'
                }
                s += '</select>'
                if (this.lbl.length > 0) s += '</label>'
                break
            case 'sld':
                let txt = 'min="' + this.lims[0] + '" max="' + this.lims[1] + '" step="' + this.lims[2] + '", value="' + this.value + '"'
                s += wrap({
                    id: this.id,
                    tag: 'sld',
                    style: '',
                    lbl: this.lbl,
                    txt: txt,
                    fn: "my.opts['" + this.id + "'].item.onChg(this.value)"
                })
                s += '<span id="' + this.id + '0" style="display: inline-block; width:40px;">' + this.value + '</span>'
                break
        }
        return s
    }
    get val() {
        return this.value
    }
    set val(v) {
        console.log('set val', this.id, v)
        this.value = v
        let div = document.getElementById(this.id)
        if (div == null) {} else {
            div.value = this.value
            if (this.valShowQ) document.getElementById(this.id + '0').innerHTML = this.value
        }
    }
    onChg(v) {
        console.log('onChg', v)
        this.value = v
        this.sel = this.sels[this.n]
        my.opts[this.id].val = this.value
        if (this.valShowQ) document.getElementById(this.id + '0').innerHTML = this.value
        if (this.fn) this.fn()
    }
    update() {
        document.getElementById(this.id).value = this.value
        if (this.valShowQ) document.getElementById(this.id + '0').innerHTML = this.value
        console.log('update', this)
    }
    save() {
        console.log('save', this.id, this.val)
    }
}

function docInsert(s) {
    let div = document.createElement('div')
    div.innerHTML = s
    let script = document.currentScript
    script.parentElement.insertBefore(div, script)
}

function wrap({
    id = '',
    cls = '',
    pos = 'rel',
    style = '',
    txt = '',
    tag = 'div',
    lbl = '',
    fn = '',
    opts = []
}, ...mores) {
    let s = ''
    s += '\n'
    txt += mores.join('')
    let noProp = 'event.stopPropagation(); '
    let tags = {
        btn: {
            stt: '<button ' + (fn.length > 0 ? ' onclick="' + noProp + fn + '" ' : ''),
            cls: 'btn',
            fin: '>' + txt + '</button>'
        },
        can: {
            stt: '<canvas ',
            cls: '',
            fin: '></canvas>'
        },
        div: {
            stt: '<div ' + (fn.length > 0 ? ' onclick="' + fn + '" ' : ''),
            cls: '',
            fin: ' >' + txt + '</div>'
        },
        edit: {
            stt: '<textarea onkeyup="' + fn + '" onchange="' + fn + '"',
            cls: '',
            fin: ' >' + txt + '</textarea>'
        },
        inp: {
            stt: '<input value="' + txt + '"' + (fn.length > 0 ? '  oninput="' + fn + '" onchange="' + fn + '"' : ''),
            cls: 'input',
            fin: '>' + (lbl.length > 0 ? '</label>' : '')
        },
        out: {
            stt: '<span ',
            cls: 'output',
            fin: ' >' + txt + '</span>' + (lbl.length > 0 ? '</label>' : '')
        },
        radio: {
            stt: '<div ',
            cls: 'radio',
            fin: '>\n'
        },
        sel: {
            stt: '<select ' + (fn.length > 0 ? ' onchange="' + fn + '"' : ''),
            cls: 'select',
            fin: '>\n'
        },
        sld: {
            stt: '<input type="range" ' + txt + ' oninput="' + noProp + fn + '" onchange="' + noProp + fn + '"',
            cls: 'select',
            fin: '>' + (lbl.length > 0 ? '</label>' : '')
        },
    }
    let type = tags[tag]
    if (lbl.length > 0) s += '<label class="label">' + lbl + ' '
    s += type.stt
    if (cls.length == 0) cls = type.cls
    if (tag == 'div') style += fn.length > 0 ? ' cursor:pointer;' : ''
    if (id.length > 0) s += ' id="' + id + '"'
    if (cls.length > 0) s += ' class="' + cls + '"'
    if (pos == 'dib') s += ' style="position:relative; display:inline-block;' + style + '"'
    if (pos == 'rel') s += ' style="position:relative; ' + style + '"'
    if (pos == 'abs') s += ' style="position:absolute; ' + style + '"'
    s += type.fin
    if (tag == 'radio') {
        for (let i = 0; i < opts.length; i++) {
            let chk = ''
            if (i == 0) chk = 'checked'
            let idi = id + i
            let lbl = opts[i]
            s += '<input id="' + idi + '" type="radio" name="' + id + '" value="' + lbl.name + '" onclick="' + fn + '(' + i + ');" ' + chk + ' >'
            s += '<label for="' + idi + '">' + lbl.name + ' </label>'
        }
        s += '</div>'
    }
    if (tag == 'sel') {
        for (let i = 0; i < opts.length; i++) {
            let opt = opts[i]
            let idStr = id + i
            let chkStr = opt.name == txt ? ' selected ' : ''
            let descr = opt.hasOwnProperty("descr") ? opt.descr : opt.name
            s += '<option id="' + idStr + '" value="' + opt.name + '"' + chkStr + '>' + descr + '</option>\n'
        }
        s += '</select>'
        if (lbl.length > 0) s += '</label>'
    }
    s += '\n'
    return s.trim()
}
init()
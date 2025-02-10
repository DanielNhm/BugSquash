import express, { json } from 'express'
import { loggerService } from './services/logger.service.js'
import { utilService } from './services/util.service.js'
import { bugService } from './services/bug.service.js'
import { pdfService } from './services/pdf.service.js'
import cookieParser from 'cookie-parser'
import { userService } from './services/user.service.js'
import cors from 'cors'

const app = express()

app.use(express.json())
app.use(express.static('public'))
app.use(cookieParser())
app.use(cors())

app.get('/', (req, res) => res.send('hi'))

// Download PDF Route
app.get('/api/download', (req, res) => {
    bugService.query()
        .then((bugs) => {
            loggerService.info('Downloaded Bugs')
            pdfService.buildBugsPDF(bugs)
            res.download('./data/bugs_report.pdf', 'bugs_report.pdf', (err) => {
                if (err) {
                    loggerService.error('Error during PDF download', err)
                    res.status(500).send('Error during PDF download')
                }
            })
        })
        .catch((err) => {
            loggerService.error('Cannot download bugs', err)
            res.status(400).send('Cannot download bugs')
        })
})

// Get All Bugs
app.get('/api/bug', (req, res) => {
    const filterBy = {
        title: req.query.title || '',
        minSeverity: +req.query.minSeverity || 1, 
        labels: req.query.labels || '',
        pageIdx: +req.query.pageIdx || 0
    }

    const sortBy = {
        sortBy: req.query.sortBy || '',
        direction: req.query.direction === 'true'
    }

    bugService.query({ ...filterBy, ...sortBy })
        .then(({ bugs, maxPage }) => {
            res.send({ bugs, maxPage }) 
        })
        .catch((err) => {
            loggerService.error('Cannot get bugs', err)
            res.status(400).send('Cannot get bugs')
        })
})


// Get Bug By ID
app.get('/api/bug/:bugId', (req, res) => {
    const bugId = req.params.bugId
    bugService.getById(bugId)
        .then(bug => {
            res.send(bug)
        })
        .catch((err) => {
            loggerService.error('Cannot get bug', err)
            res.status(400).send('Cannot get bug')
        })
})

// Update Bug
app.put('/api/bug/:bugId', (req, res) => {

    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Cannot update bug')

    const { _id, title, description, severity, createdAt } = req.body
    const bugToSave = { _id, title, description, severity, createdAt }
    bugService.save(bugToSave)
        .then(savedBug => {
            loggerService.info('Bug updated!', bugToSave)
            res.send(savedBug)
        })
        .catch((err) => {
            loggerService.error('Cannot update bug', err)
            res.status(400).send('Cannot update bug')
        })
})

// Create New Bug
app.post('/api/bug/', (req, res) => {

    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Cannot add bug')

    const { title, description, severity } = req.body
    const bugToSave = { title, description, severity }
    bugService.save(bugToSave, loggedinUser)
        .then(savedBug => {
            loggerService.info('Bug created!', bugToSave)
            res.send(savedBug)
        })
        .catch((err) => {
            loggerService.error('Cannot create bug', err)
            res.status(400).send('Cannot create bug')
        })
})

// Delete Bug
app.delete('/api/bug/:bugId', (req, res) => {

    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    console.log(loggedinUser,'hi')
    if (!loggedinUser) return res.status(401).send('Cannot remove bug')

    
    const bugId = req.params.bugId
    bugService.remove(bugId,loggedinUser)
        .then(() => {
            loggerService.info(`Bug ${bugId} removed`)
            res.send({ msg: `Bug ${bugId} removed` })
        })
        .catch((err) => {
            loggerService.error('Cannot remove bug', err)
            res.status(400).send('Cannot remove bug')
        })
})

// User server

app.get('/api/user', (req, res) => {
    userService.query()
        .then((users) => {
            res.send(users)
        })
        .catch((err) => {
            console.log('Cannot load users', err)
            res.status(400).send('Cannot load users')
        })
})
app.post('/api/auth/login', (req, res) => {
    const credentials = req.body
    console.log(req.body)
    userService.checkLogin(credentials)
        .then(user => {
            if (user) {
                const loginToken = userService.getLoginToken(user)
                res.cookie('loginToken', loginToken)
                res.send(user)
            } else {
                res.status(401).send('Invalid Credentials')
            }
        })
        .catch(err => {
            console.log('Cannot login', err)
            res.status(400).send('Cannot login')
        })
})

app.post('/api/auth/signup', (req, res) => {
    const credentials = req.body
    userService.save(credentials)
        .then(user => {
            const loginToken = userService.getLoginToken(user)
            res.cookie('loginToken', loginToken)
            res.send(user)
        })
        .catch(err => {
            console.log('Cannot signup', err)
            res.status(400).send('Cannot signup')
        })
})

app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('loginToken')
    res.end()
})


app.listen(3031, () => console.log('Server ready at port 3031'))

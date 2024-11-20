import express from 'express'
import sql from 'sqlite3'

const sqlite3 = sql.verbose()

// Create an in memory table to use
const db = new sqlite3.Database(':memory:')

// Create table(s) on startup
db.run(`CREATE TABLE student1Comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  comment TEXT NOT NULL)`)


const app = express()
app.use(express.static('public'))
app.set('views', 'views')
app.set('view engine', 'pug')
app.use(express.urlencoded({ extended: false }))

app.get('/', function (req, res) {
  console.log('GET called')
  res.render('index')
})

// Student1 section
app.get('/student1', function (req, res) {
  console.log('GET called')
  res.render('student1')
})

app.get('/student1/comments', function (req, res) {
  const local = { comments: [] }
  db.each('SELECT id, comment FROM student1Comments', function (err, row) {
      if (err) {
      console.log(err)
      } else {
      local.comments.push({ id: row.id, comment: row.comment })
      }
  }, function (err, numrows) {
      if (!err) {
      res.render('student1/comments', local)
      } else {
      console.log(err)
      }
  })
  console.log('Student1 get student1/comment called')
})

app.post('/student1/comments/add', function (req, res) {
  console.log('Student1 add comment called')
  const stmt = db.prepare('INSERT INTO student1Comments (comment) VALUES (?)')
  stmt.run(req.body.comment)
  stmt.finalize()
  res.redirect('/student1/comments') 
})

app.post('/student1/comments/delete', function (req, res) {
  console.log('Student1 delete comment called')
  const stmt = db.prepare('DELETE FROM student1Comments where id = (?)')
  stmt.run(req.body.id)
  stmt.finalize()
  res.redirect('/student1/comments')
})

app.get('/student1/comments/edit/:id', function (req, res) {
  const id = req.params.id;
  console.log('Student1 edit comment called with comment ID:' + id)
  db.get('SELECT * FROM student1Comments WHERE id = (?)', [id], function (err, row) {
    if (err) {
      console.log(err)
    } else {
    res.render('student1/editcomment', { comment: row })
    }
  })
})

app.post('/student1/editcomment/update/:id', function (req, res) {
  const id = req.params.id
  const updatedText = req.body.text;

  db.run('UPDATE student1Comments SET comment = (?) WHERE id = (?)', [updatedText, id], function (err, row) {
    if (err) {
      console.log(err)
    } else {
      res.redirect('/student1/comments')
    }
  })
})

// Student2 section
app.get('/student2', function (req, res) {
  console.log('GET called')
  res.render('student2')
})

// Student3 section
app.get('/student3', function (req, res) {
  console.log('GET called')
  res.render('student3')
})

// Start the web server
app.listen(3000, function () {
  console.log('Listening on port 3000...')
})

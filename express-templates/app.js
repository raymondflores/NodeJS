const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
// const expressHbs = require('express-handlebars');

const app = express();

app.set('view engine', 'ejs');
// app.engine('hbs', expressHbs({ layoutsDir: 'views/layouts/', defaultLayout: 'main-layout', extname: 'hbs' }));
// app.set('view engine', 'hbs');
// app.set('view engine', 'pug');
app.set('views', 'views');

const admin = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', admin.routes);
app.use(shopRoutes);

app.use((req, res) => {
  res.status(404).render('404', { title: 'Page Not Found', path: null });
});

app.listen(3000);

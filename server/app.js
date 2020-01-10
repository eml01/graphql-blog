const express = require('express'),
    app = express(),
    PORT = process.env.PORT || 5000,
    cors = require('cors'),
    mongoose = require('mongoose'),
    graphQLHTTP = require('express-graphql'),
    schema = require('./schema');

mongoose.connect('mongodb://localhost:27017/graphql_blog', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true
}, () => console.log('MongoDB Connected...'))

app.use(cors())
app.use(express.json())
app.use('/graphql', graphQLHTTP({
    schema,
    graphiql: true
}))

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
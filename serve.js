const express = require('express');
const app = express();
const port = process.env.PORT || 4000;
const www = process.env.WWW || './';

const graphqlHTTP = require('express-graphql')

const schema = require('./schema')

app.use('/graphql', graphqlHTTP ({
    schema,
    graphiql: true
}))










app.use(express.static(www));
console.log(`serving ${www}`);
app.get('*', (req, res) => {
    res.sendFile(`index.html`, { root: www });
});
app.listen(port, () => console.log(`listening on http://localhost:${port}`));

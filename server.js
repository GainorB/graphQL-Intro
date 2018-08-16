const express = require('express')
const expressGraphQL = require('express-graphql')
const schema = require('./Schema')
const app = express()
const port = process.env.PORT || 4000;

app.use('/graphql', expressGraphQL({
  schema: schema,
  graphiql: true
}))


app.listen(4000, () => {
  console.log(`Server is running on port ${port}`);
})
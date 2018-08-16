const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLSchema, GraphQLList, GraphQLNonNull } = require('graphql');
const axios = require('axios');

// CustomerType
const CustomerType = new GraphQLObjectType({
  name: 'Customer', // mandatory
  fields: () => ({
    id: { type: GraphQLInt },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    age: { type: GraphQLInt },
  }),
});

// root query
const rootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    customer: {
      type: CustomerType,
      args: {
        id: { type: GraphQLInt },
      },
      async resolve(parentValue, args) {
        // return customers.filter(c => c.id === args.id)[0];
        const { data } = await axios.get(`http://localhost:3000/customers/${args.id}`);
        return data;
      },
    },
    customers: {
      type: new GraphQLList(CustomerType),
      async resolve(parentValue, args) {
        // return customers;
        const { data } = await axios.get('http://localhost:3000/customers');
        return data;
      },
    },
  },
});

// mutate
const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addCustomer: {
      type: CustomerType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
      },
      async resolve(parentValue, args) {
        const { data } = await axios.post(`http://localhost:3000/customers`, {
          name: args.name,
          email: args.email,
          age: args.age,
        });
        return data;
      },
    },
    deleteCustomer: {
      type: CustomerType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve(parentValue, args) {
        return axios.delete(`http://localhost:3000/customers/${args.id}`);
      },
    },
    editCustomer: {
      type: CustomerType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLInt) },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        age: { type: GraphQLInt },
      },
      async resolve(parentValue, args) {
        const { data } = await axios.patch(`http://localhost:3000/customers/${args.id}`, {
          args,
        });
        return data;
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: rootQuery,
  mutation,
});

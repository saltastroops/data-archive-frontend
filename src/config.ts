export const gqlEndpoint =
    process.env.NODE_ENV === 'development'? "http://localhost:4001/graphql" : process.env.GQL_ENDPOINT;

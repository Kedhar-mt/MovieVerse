const { ApolloServer, gql } = require('apollo-server');
const axios = require('axios');
require('dotenv').config();

const API_KEY = process.env.API_KEY;

// GraphQL Schema
const typeDefs = gql`
  type Movie {
    id: ID
    title: String
    poster_path: String
    overview: String
    vote_average: Float
  }

  type Query {
    movies: [Movie]
  }
`;

// Resolvers
const resolvers = {
  Query: {
    movies: async () => {
      try {
        const response = await axios.get(
          'https://api.themoviedb.org/3/movie/popular',
          {
            params: { api_key: API_KEY },
          }
        );
        return response.data.results.map((movie) => ({
          id: movie.id,
          title: movie.title,
          poster_path: movie.poster_path,
          overview: movie.overview,
          vote_average: movie.vote_average,
        }));
      } catch (error) {
        console.error(error);
        return [];
      }
    },
  },
};

// Apollo Server Setup
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Start Server
server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});

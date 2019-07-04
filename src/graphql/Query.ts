import gql from "graphql-tag";

/**
 *
 */
const DATA_FILES_QUERY = gql`
  query DATA_FILES_QUERY(
    $columns: [String!]!
    $where: String!
    $startIndex: Int
    $limit: Int
  ) {
    dataFiles(
      columns: $columns
      where: $where
      startIndex: $startIndex
      limit: $limit
    ) {
      dataFiles {
        id
        ownedByUser
        metadata {
          name
          value
        }
      }
      pageInfo {
        itemsPerPage
        itemsTotal
        startIndex
      }
    }
  }
`;

// TODO UPDATE
/**
 * Retrieving the user information.
 */
const USER_QUERY = gql`
  query USER_QUERY {
    user {
      familyName
      givenName
      roles
    }
  }
`;

// TODO UPDATE INCLUDE MORE INFORMATION IN THE FRAGMENT AS REQUIRED
/**
 * Retrieving user data requests
 */
const USER_DATA_REQUESTS_QUERY = gql`
  query USER_DATA_REQUESTS_QUERY($limit: Int, $startIndex: Int!) {
    dataRequests(limit: $limit, startIndex: $startIndex) {
      id
      uri
      parts {
        id
        status
        uri
        dataFiles {
          id
          name
          observation {
            name
          }
        }
      }
    }
  }
`;

export { DATA_FILES_QUERY, USER_DATA_REQUESTS_QUERY, USER_QUERY };

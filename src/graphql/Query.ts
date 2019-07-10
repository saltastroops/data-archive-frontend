import gql from "graphql-tag";

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

/**
 * Retrieve data previews
 */
const DATA_PREVIEW_QUERY = gql`
  query DATA_PREVIEW_QUERY($dataFileId: Int!) {
    dataPreview(dataFileId: $dataFileId) {
      fitsHeader
      imageURIs
    }
  }
`;

export { USER_DATA_REQUESTS_QUERY, DATA_PREVIEW_QUERY, USER_QUERY };

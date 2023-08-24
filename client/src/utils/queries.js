import {gql} from "@apollo/client";

export const GET_ME = gql`
  query me {
    me {
      _id
      bookCount
      email
      savedBooks {
        authors
        bookId
        description
        image
        link
        title
      }
      username
    }
  }
`;

export const GET_BOOKS = gql`
  query books(
    $authors: [String]
    $description: String
    $title: String
    $bookId: ID!
    $image: String
    $link: String
  ) {
    books(
      authors: $authors
      description: $description
      title: $title
      bookId: $bookId
      image: $image
      link: $link
    ) {
      books {
        bookId
        title
        description
        image
        link
        authors
      }
    }
  }
`;

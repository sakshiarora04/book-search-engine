import { gql } from '@apollo/client';

export const QUERY_ME = gql`
   me {
    _id
    username
    email
    password
    bookCount
    savedBooks {
      _id
      authors
      description
      bookId
      image
      link
      title
    }
  }
`;




// query Query {
//     me {
//       _id
//       username
//       email
//       password
//       bookCount
//       savedBooks {
        
//       }
//     }
//   }
  
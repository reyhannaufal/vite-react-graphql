import { gql } from "@apollo/client";

export const DELETE_CONTACT = gql`
  mutation DeleteContact($id: Int!) {
    delete_contact_by_pk(id: $id) {
      first_name
      last_name
      id
    }
  }
`;

export const FETCH_CONTACTS_WITH_COUNT = gql`
  query GetContactListWithCount(
    $distinct_on: [contact_select_column!]
    $limit: Int
    $offset: Int
    $order_by: [contact_order_by!]
    $where: contact_bool_exp
  ) {
    contact(
      distinct_on: $distinct_on
      limit: $limit
      offset: $offset
      order_by: $order_by
      where: $where
    ) {
      created_at
      first_name
      id
      last_name
      phones {
        number
      }
    }
    contact_aggregate(where: $where) {
      aggregate {
        count
      }
    }
  }
`;

import { useState } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { Table, Button, Space, Input, notification, Breadcrumb } from "antd";
import { PlusOutlined } from "@ant-design/icons";

import styled from "@emotion/styled";
import Title from "antd/es/typography/Title";
import { WrappedSEO } from "../../component/WrappedSEO";

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

const itemsPerPage = 10;

const ActionButton = styled(Button)`
  margin-right: 8px;
  &:last-of-type {
    margin-right: 0;
  }
`;

const SearchBox = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const CotainerPage = styled.div`
  padding: 24px;
  height: 100vh;

  @media (min-width: 768px) {
    padding: 128px;
  }
`;

const SpacedStyle = styled(Space)`
  margin-bottom: 16px;
  margin-top: 16px;
  display: flex;
  justify-content: space-between;

  @media (max-width: 768px) {
    align-items: flex-start;
  }
`;

export const ContactList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentOffset, setCurrentOffset] = useState(0);
  const navigate = useNavigate();

  const { data, error, refetch } = useQuery(FETCH_CONTACTS_WITH_COUNT, {
    variables: {
      offset: currentOffset,
      limit: itemsPerPage,
      where: searchTerm
        ? {
            first_name: { _ilike: `%${searchTerm}%` },
          }
        : null,
    },
  });

  const [deleteContact] = useMutation(DELETE_CONTACT);

  interface Contact {
    id: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  }

  const totalCount = data?.contact_aggregate.aggregate?.count || 0;
  const dataSource: Contact[] =
    data?.contact.map((contact: Contact) => ({
      ...contact,
      key: contact.id,
    })) || [];

  const handleDelete = async (id: string) => {
    try {
      await deleteContact({ variables: { id } });
      notification.success({ message: "Contact deleted successfully" });
      refetch();
    } catch {
      notification.error({ message: "Error deleting contact" });
    }
  };

  const handleEdit = (id: string) => {
    navigate(`/contact/edit/${id}`);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleTableChange = (pagination: any) => {
    const newOffset = (pagination.current - 1) * pagination.pageSize;
    setCurrentOffset(newOffset);
  };

  const columns = [
    {
      title: "First Name",
      dataIndex: "first_name",
    },
    {
      title: "Last Name",
      dataIndex: "last_name",
    },
    {
      title: "Phone Numbers",
      dataIndex: "phones",
      render: (phones: { number: string }[]) =>
        phones.map((phone) => phone.number).join(", "),
    },
    {
      title: "Action",
      key: "action",
      render: (record: { id: string }) => (
        <Space size="middle">
          <ActionButton onClick={() => handleEdit(record.id)}>
            Edit
          </ActionButton>
          <ActionButton
            onClick={() => handleDelete(record.id)}
            danger
            type="primary"
          >
            Delete
          </ActionButton>
        </Space>
      ),
    },
  ];

  if (error) {
    return <div>Error loading contacts: {error.message}</div>;
  }

  return (
    <CotainerPage>
      <WrappedSEO title="Contact List" />
      <Title>Contact List</Title>
      <Breadcrumb>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>
          <a href="">Contact List</a>
        </Breadcrumb.Item>
      </Breadcrumb>
      <SpacedStyle>
        <SearchBox>
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for contacts"
          />
        </SearchBox>
        <Button
          icon={<PlusOutlined />}
          onClick={() => navigate("/contact/create")}
          type="primary"
        >
          Add More Contact
        </Button>
      </SpacedStyle>
      <Table
        columns={columns}
        dataSource={dataSource}
        rowKey="id"
        pagination={{
          pageSize: itemsPerPage,
          total: totalCount,
        }}
        onChange={handleTableChange}
      />
    </CotainerPage>
  );
};

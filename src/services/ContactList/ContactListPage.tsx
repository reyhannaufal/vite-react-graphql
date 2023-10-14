import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { Table, Button, Space, Input, notification, Breadcrumb } from "antd";
import { PlusOutlined } from "@ant-design/icons";

import styled from "@emotion/styled";
import Title from "antd/es/typography/Title";
import { WrappedSEO } from "../../component/WrappedSEO";
import { DELETE_CONTACT, FETCH_CONTACTS_WITH_COUNT } from "./graphql";

const ITEMS_PER_PAGE = 10;

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

interface Contact {
  id: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export const ContactList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentOffset, setCurrentOffset] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const localContacts = JSON.parse(localStorage.getItem("contacts") || "[]");
  const [dataSource, setDataSource] = useState<Contact[]>(localContacts);

  const { data, error, loading, refetch } = useQuery(
    FETCH_CONTACTS_WITH_COUNT,
    {
      variables: {
        offset: currentOffset,
        limit: ITEMS_PER_PAGE,
        where: searchTerm
          ? {
              first_name: { _ilike: `%${searchTerm}%` },
            }
          : null,
        order_by: {
          created_at: "desc",
        },
      },
      fetchPolicy: "network-only",
    }
  );
  const [deleteContact] = useMutation(DELETE_CONTACT);

  const totalCount = data?.contact_aggregate.aggregate?.count || 0;

  useEffect(() => {
    // When data is successfully fetched from the server, update the dataSource state and localStorage
    if (data && data.contact) {
      const contactsFromServer = data.contact.map((contact: Contact) => ({
        ...contact,
        key: contact.id,
      }));
      setDataSource(contactsFromServer);
      localStorage.setItem("contacts", JSON.stringify(contactsFromServer));
    }
  }, [data]);

  const handleDelete = async (id: string) => {
    try {
      await deleteContact({ variables: { id } });
      notification.success({ message: "Contact deleted successfully" });
      const updatedContacts = dataSource.filter((contact) => contact.id !== id);
      setDataSource(updatedContacts);
      localStorage.setItem("contacts", JSON.stringify(updatedContacts));
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
    setCurrentPage(pagination.current);
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
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {!loading && !error && (
        <Table
          columns={columns}
          dataSource={dataSource}
          rowKey="id"
          pagination={{
            current: currentPage,
            pageSize: ITEMS_PER_PAGE,
            total: totalCount,
          }}
          onChange={handleTableChange}
        />
      )}
    </CotainerPage>
  );
};

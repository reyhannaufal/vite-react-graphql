import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { useNavigate, useParams } from "react-router-dom";
import {
  Input,
  Button,
  Form,
  notification,
  Space,
  Typography,
  Breadcrumb,
} from "antd";
import {
  CotainerPage,
  StyledFormContainer,
  SpacedStyle,
  ImageContainer,
} from "../../component/styledComponent";
import { WrappedSEO } from "../../component/WrappedSEO";
import {
  FETCH_CONTACT_BY_ID,
  UPDATE_CONTACT,
  UPDATE_PHONE_NUMBER,
} from "./graphql";

type Phone = {
  number: string;
};

export const EditContactForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data } = useQuery(FETCH_CONTACT_BY_ID, {
    variables: { id: parseInt(id ?? "") },
    skip: !id,
  });

  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [phones, setPhones] = useState<string[]>([]);

  useEffect(() => {
    if (data) {
      setFirstName(data.contact_by_pk.first_name);
      setLastName(data.contact_by_pk.last_name);
      setPhones(data.contact_by_pk.phones.map((phone: Phone) => phone.number));
    }
  }, [data]);

  const [updateContact] = useMutation(UPDATE_CONTACT, {
    onCompleted: () => {
      notification.success({ message: "Contact updated successfully" });
      navigate("/contact/list");
    },
    onError: (error) => {
      notification.error({
        message: "Error updating contact",
        description: error.message,
      });
    },
  });
  const [updatePhoneNumber] = useMutation(UPDATE_PHONE_NUMBER);

  const handleUpdate = () => {
    // First, update the contact's basic details
    updateContact({
      variables: {
        id: parseInt(id ?? ""),
        _set: {
          first_name: firstName,
          last_name: lastName,
        },
      },
    }).then(() => {
      // Then, update each phone number
      phones.forEach((newPhoneNumber, index) => {
        const originalPhoneNumber = data.contact_by_pk.phones[index].number;
        updatePhoneNumber({
          variables: {
            pk_columns: {
              number: originalPhoneNumber,
              contact_id: parseInt(id ?? ""),
            },
            new_phone_number: newPhoneNumber,
          },
        });
      });
    });
  };

  return (
    <CotainerPage>
      <WrappedSEO title="Edit Contact" />
      <StyledFormContainer>
        <div>
          <Typography.Title>Edit Contact</Typography.Title>
          <Breadcrumb>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>
              <a href="/contact/list">Contact List</a>
            </Breadcrumb.Item>
            <Breadcrumb.Item>Edit Contact</Breadcrumb.Item>
          </Breadcrumb>

          <SpacedStyle>
            <Form layout="vertical">
              <Form.Item label="First Name">
                <Input
                  value={firstName}
                  data-testid="firstNameInput"
                  id="firstNameInput"
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First Name"
                />
              </Form.Item>
              <Form.Item label="Last Name">
                <Input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last Name"
                />
              </Form.Item>

              {phones.map((phone, index) => (
                <Form.Item key={index} label={`Phone ${index + 1}`}>
                  <Input
                    value={phone}
                    onChange={(e) =>
                      setPhones([
                        ...phones.slice(0, index),
                        e.target.value,
                        ...phones.slice(index + 1),
                      ])
                    }
                    placeholder="Phone Number"
                  />
                </Form.Item>
              ))}

              <Form.Item>
                <Space>
                  <Button type="primary" onClick={handleUpdate}>
                    Update Contact
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </SpacedStyle>
        </div>
        <ImageContainer>
          <img
            src="https://images.unsplash.com/photo-1517842645767-c639042777db?ixlib=rb-1.2.1&auto=format&fit=crop&w=700&q=60"
            alt="Description of the image"
          />
        </ImageContainer>
      </StyledFormContainer>
    </CotainerPage>
  );
};

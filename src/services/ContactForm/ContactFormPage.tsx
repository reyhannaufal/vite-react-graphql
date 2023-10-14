import { useState } from "react";
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Input,
  Form,
  Space,
  Breadcrumb,
  Typography,
  notification,
} from "antd";
import {
  CotainerPage,
  StyledFormContainer,
  SpacedStyle,
  ImageContainer,
} from "../../component/styledComponent";
import { WrappedSEO } from "../../component/WrappedSEO";
import { ADD_CONTACT_WITH_PHONES } from "./graphql";

export const ContactForm = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phones, setPhones] = useState([{ number: "" }]);
  const [addContact] = useMutation(ADD_CONTACT_WITH_PHONES);
  const navigate = useNavigate();

  const handleAddPhone = () => {
    setPhones((prev) => [...prev, { number: "" }]);
  };

  const handlePhoneChange = (index: number, value: string) => {
    const updatedPhones = [...phones];
    updatedPhones[index].number = value;
    setPhones(updatedPhones);
  };

  const handleDeletePhone = (indexToDelete: number) => {
    setPhones((prevPhones) =>
      prevPhones.filter((_, index) => index !== indexToDelete)
    );
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    const specialCharPattern = /[^a-zA-Z0-9 ]/;
    if (
      specialCharPattern.test(firstName) ||
      specialCharPattern.test(lastName)
    ) {
      alert("Names shouldn't have special characters.");
      return;
    }

    try {
      const { data, errors } = await addContact({
        variables: { first_name: firstName, last_name: lastName, phones },
      });

      if (errors) {
        alert("Error adding contact: " + errors[0].message);
        return;
      }

      if (data && data.insert_contact && data.insert_contact.returning) {
        notification.success({
          message: "Contact added successfully",
        });
        setFirstName("");
        setLastName("");
        setPhones([{ number: "" }]);

        navigate("/contact/list");
      } else {
        notification.error({
          message: "Error adding contact",
        });
      }
    } catch (error) {
      notification.error({
        message: "Error adding contact",
        description: (error as Error).message,
      });
    }
  };

  return (
    <CotainerPage>
      <WrappedSEO title={"Create Contact"} />
      <StyledFormContainer>
        <div>
          <Typography.Title>Create Contact</Typography.Title>
          <Breadcrumb>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>
              <a href="/contact/list">Contact List</a>
            </Breadcrumb.Item>
            <Breadcrumb.Item>Create Contact</Breadcrumb.Item>
          </Breadcrumb>

          <SpacedStyle>
            <Form layout="vertical" onSubmitCapture={handleSubmit}>
              <Form.Item label="First Name" required>
                <Input
                  data-testid="firstNameInput"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </Form.Item>
              <Form.Item label="Last Name" required>
                <Input
                  value={lastName}
                  data-testid="lastNameInput"
                  onChange={(e) => setLastName(e.target.value)}
                />
              </Form.Item>
              {phones.map((phone, index) => (
                <Form.Item label={`Phone ${index + 1}`} key={index} required>
                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                    }}
                  >
                    <Input
                      value={phone.number}
                      data-testid="phoneInput"
                      onChange={(e) => handlePhoneChange(index, e.target.value)}
                    />
                    <Button danger onClick={() => handleDeletePhone(index)}>
                      Delete
                    </Button>
                  </div>
                </Form.Item>
              ))}
              <Space>
                <Button
                  type="dashed"
                  onClick={handleAddPhone}
                  data-testid="addButton"
                >
                  Add Another Phone
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  data-testid="submitButton"
                >
                  Add Contact
                </Button>
              </Space>
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

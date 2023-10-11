import { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Space } from "antd";

const ADD_CONTACT_WITH_PHONES = gql`
  mutation AddContactWithPhones(
    $first_name: String!
    $last_name: String!
    $phones: [phone_insert_input!]!
  ) {
    insert_contact(
      objects: {
        first_name: $first_name
        last_name: $last_name
        phones: { data: $phones }
      }
    ) {
      returning {
        first_name
        last_name
        id
        phones {
          number
        }
      }
    }
  }
`;

function ContactForm() {
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
        alert("Contact added successfully!");
        setFirstName("");
        setLastName("");
        setPhones([{ number: "" }]);

        navigate("/contact/list");
      } else {
        alert("Unknown error occurred while adding contact.");
      }
    } catch (error) {
      alert("Error adding contact: " + (error as Error).message);
    }
  };

  return (
    <Form layout="vertical" onSubmitCapture={handleSubmit}>
      <Form.Item label="First Name" required>
        <Input
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
      </Form.Item>
      <Form.Item label="Last Name" required>
        <Input value={lastName} onChange={(e) => setLastName(e.target.value)} />
      </Form.Item>
      {phones.map((phone, index) => (
        <Form.Item label={`Phone ${index + 1}`} key={index} required>
          <Input
            value={phone.number}
            onChange={(e) => handlePhoneChange(index, e.target.value)}
          />
        </Form.Item>
      ))}
      <Space>
        <Button type="dashed" onClick={handleAddPhone}>
          Add Another Phone
        </Button>
        <Button type="primary" htmlType="submit">
          Add Contact
        </Button>
      </Space>
    </Form>
  );
}

export default ContactForm;

import { useEffect, useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useNavigate, useParams } from "react-router-dom";
import { Input, Button, Form, notification } from "antd";

type Phone = {
  number: string;
};

const FETCH_CONTACT_BY_ID = gql`
  query GetContactById($id: Int!) {
    contact_by_pk(id: $id) {
      id
      first_name
      last_name
      phones {
        number
      }
    }
  }
`;

const UPDATE_CONTACT = gql`
  mutation EditContactById($id: Int!, $_set: contact_set_input) {
    update_contact_by_pk(pk_columns: { id: $id }, _set: $_set) {
      id
      first_name
      last_name
      phones {
        number
      }
    }
  }
`;

const UPDATE_PHONE_NUMBER = gql`
  mutation EditPhoneNumber(
    $pk_columns: phone_pk_columns_input!
    $new_phone_number: String!
  ) {
    update_phone_by_pk(
      pk_columns: $pk_columns
      _set: { number: $new_phone_number }
    ) {
      contact {
        id
        last_name
        first_name
        created_at
        phones {
          number
        }
      }
    }
  }
`;

const EditContactForm: React.FC = () => {
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
    <Form layout="vertical">
      <Form.Item label="First Name">
        <Input
          value={firstName}
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
        <Button type="primary" onClick={handleUpdate}>
          Update Contact
        </Button>
      </Form.Item>
    </Form>
  );
};

export default EditContactForm;

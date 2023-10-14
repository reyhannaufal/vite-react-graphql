import { render, fireEvent, waitFor } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";
import {
  EditContactForm,
  FETCH_CONTACT_BY_ID,
  UPDATE_CONTACT,
} from "../EditContactForm";

const mocks = [
  {
    request: {
      query: FETCH_CONTACT_BY_ID,
      variables: {
        id: 1,
      },
    },
    result: {
      data: {
        contact_by_pk: {
          id: 1,
          first_name: "John",
          last_name: "Doe",
          phones: [
            {
              number: "1234567890",
            },
          ],
        },
      },
    },
  },
  {
    request: {
      query: UPDATE_CONTACT,
      variables: {
        id: 1,
        _set: {
          first_name: "Jane",
          last_name: "Doe",
          phones: [
            {
              number: "0987654321",
            },
          ],
        },
      },
    },
    result: {
      data: {
        update_contact_by_pk: {
          id: 1,
          first_name: "Jane",
          last_name: "Doe",
          phones: [
            {
              number: "0987654321",
            },
          ],
        },
      },
    },
  },
];

describe("EditContactForm", () => {
  it.skip("should render the form with initial values", async () => {
    const { getByLabelText, getByText } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <EditContactForm />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(getByLabelText("First Name")).toHaveValue("John");
      expect(getByLabelText("Last Name")).toHaveValue("Doe");
      expect(getByLabelText("Phone Number")).toHaveValue("1234567890");
    });

    fireEvent.change(getByLabelText("First Name"), {
      target: { value: "Jane" },
    });
    fireEvent.change(getByLabelText("Last Name"), {
      target: { value: "Doe" },
    });
    fireEvent.change(getByLabelText("Phone Number"), {
      target: { value: "0987654321" },
    });

    fireEvent.click(getByText("Save"));

    await waitFor(() => {
      expect(getByText("Contact updated successfully")).toBeInTheDocument();
    });
  });
});

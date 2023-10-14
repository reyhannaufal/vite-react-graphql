import { render, fireEvent, waitFor } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";
import { MemoryRouter, MemoryRouter as Router } from "react-router-dom";
import { ContactForm } from "../ContactFormPage";
import { describe, it, vi, expect } from "vitest";
import { ADD_CONTACT_WITH_PHONES } from "../graphql";

const mocks = [
  {
    request: {
      query: ADD_CONTACT_WITH_PHONES,
      variables: {
        first_name: "John",
        last_name: "Doe",
        phones: [{ number: "1234567890" }],
      },
    },
    result: {
      data: {
        insert_contact: {
          returning: [
            {
              first_name: "John",
              last_name: "Doe",
              id: "some-id",
              phones: [{ number: "1234567890" }],
            },
          ],
        },
      },
    },
  },
];

const ADD_CONTACT_MOCK = {
  request: {
    query: ADD_CONTACT_WITH_PHONES,
    variables: {
      firstName: "John",
      lastName: "Doe",
      // ... any other fields ...
    },
  },
  result: {
    data: {
      addContact: {
        success: true,
        message: "Contact added successfully",
        // ... any other return fields ...
      },
    },
  },
};

window.matchMedia = vi.fn().mockImplementation(() => ({
  matches: false,
  addListener: vi.fn(),
  removeListener: vi.fn(),
}));

describe("Unit Test - ContactForm", () => {
  it("renders correctly with initial state", () => {
    const { getByTestId } = render(
      <MockedProvider mocks={mocks}>
        <Router>
          <ContactForm />
        </Router>
      </MockedProvider>
    );

    const firstNameInput = getByTestId("firstNameInput");
    expect(firstNameInput).toBeInTheDocument();
    expect(firstNameInput).toHaveValue("");

    const lastNameInput = getByTestId("lastNameInput");
    expect(lastNameInput).toBeInTheDocument();
    expect(lastNameInput).toHaveValue("");

    const phoneInput = getByTestId("phoneInput");
    expect(phoneInput).toBeInTheDocument();
    expect(phoneInput).toHaveValue("");

    const addButton = getByTestId("addButton");
    expect(addButton).toBeInTheDocument();
    expect(addButton).toHaveTextContent("Add Another Phone");
  });

  it("allows adding phone fields", () => {
    const { getAllByText } = render(
      <MockedProvider mocks={mocks}>
        <Router>
          <ContactForm />
        </Router>
      </MockedProvider>
    );

    const initialAddButtons = getAllByText("Add Another Phone");

    fireEvent.click(initialAddButtons[0]);

    const allAddButtonsAfterClick = getAllByText("Add Another Phone");
    expect(allAddButtonsAfterClick).toHaveLength(2);
  });
});

describe("ContactFormPage Integration Test", () => {
  it.skip("submits the form and adds a contact", async () => {
    const { findByText, getAllByTestId } = render(
      <MockedProvider mocks={[ADD_CONTACT_MOCK]} addTypename={false}>
        <MemoryRouter>
          <ContactForm />
        </MemoryRouter>
      </MockedProvider>
    );

    const firstNameInput = getAllByTestId("firstNameInput")[0];

    fireEvent.change(firstNameInput, { target: { value: "John" } });

    const lastNameInput = getAllByTestId("lastNameInput")[0];

    fireEvent.change(lastNameInput, { target: { value: "Doe" } });

    const submitButton = getAllByTestId("submitButton")[0];
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(findByText("Contact added successfully")).toBeInTheDocument();
    });

    const notificationElement = await findByText("Contact added successfully");
    expect(notificationElement).toBeInTheDocument();
  });
});

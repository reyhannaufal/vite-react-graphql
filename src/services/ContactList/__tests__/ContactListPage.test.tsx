import { fireEvent, render, screen } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";
import { ContactList, FETCH_CONTACTS_WITH_COUNT } from "../contactListPage";
import { describe, it, vi, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { waitFor } from "@testing-library/react";

const mocks = [
  {
    request: {
      query: FETCH_CONTACTS_WITH_COUNT,
      variables: {
        offset: 0,
        limit: 10,
        where: null,
      },
    },
    result: {
      data: {
        contact: [
          {
            created_at: "2021-08-01T00:00:00.000000+00:00",
            first_name: "John",
            id: 1,
            last_name: "Doe",
            phones: [{ number: "123456789" }],
          },
        ],
        contact_aggregate: {
          aggregate: {
            count: 1,
          },
        },
      },
    },
  },
];

const errorMock = [
  {
    request: {
      query: FETCH_CONTACTS_WITH_COUNT,
      variables: {
        offset: 0,
        limit: 10,
        where: null,
      },
    },
    error: new Error("Failed to fetch contacts"),
  },
];

window.matchMedia = vi.fn().mockImplementation(() => ({
  matches: false,
  addListener: vi.fn(),
  removeListener: vi.fn(),
}));

describe("Unit Test - ContactList", () => {
  it("renders the contact list page", async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <MemoryRouter>
          <ContactList />
        </MemoryRouter>
      </MockedProvider>
    );

    await waitFor(() => {
      const contactName = screen.getByText("John");
      expect(contactName).toBeInTheDocument();
    });
  });

  it("renders a loading message while the query is in progress", () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <MemoryRouter>
          <ContactList />
        </MemoryRouter>
      </MockedProvider>
    );

    const loadingMessage = screen.queryAllByText("Loading...");
    expect(loadingMessage).toHaveLength(1);
  });

  it("displays an error message when the query fails", async () => {
    render(
      <MockedProvider mocks={errorMock} addTypename={false}>
        <MemoryRouter>
          <ContactList />
        </MemoryRouter>
      </MockedProvider>
    );

    // Depending on how your component handles errors, this is a generic way
    // to check for an error message. Update the text if your component displays a specific error message.
    await waitFor(() => {
      const errorMessage = screen.getByText(/error/i);
      expect(errorMessage).toBeInTheDocument();
    });
  });
});

describe("ContactList Integration Test", () => {
  it("should render contact list and allow for search functionality", async () => {
    const { getByText, getAllByPlaceholderText } = render(
      <MockedProvider mocks={mocks}>
        <MemoryRouter>
          <ContactList />
        </MemoryRouter>
      </MockedProvider>
    );

    // Wait for data to be loaded
    await waitFor(() => getByText("John"));

    // Search functionality
    const searchBoxes = getAllByPlaceholderText("Search for contacts");
    const searchBox = searchBoxes[0];
    fireEvent.change(searchBox, { target: { value: "John" } });

    await waitFor(() => getByText("John"));
  });
});

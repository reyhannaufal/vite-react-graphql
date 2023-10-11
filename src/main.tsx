import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ReactDOM from "react-dom/client";

import { ApolloWrapper } from "./lib/apolloProvider";

import { ContactList } from "./services/ContactList/contactListPage";
import ContactForm from "./services/ContactForm/contactFormPage";
import EditContactForm from "./services/EditContactForm/editContactForm";
// set default route

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ApolloWrapper>
    <React.StrictMode>
      <Router>
        <Routes>
          <Route path="/contact/list" element={<ContactList />} />
          <Route path="/contact/create" element={<ContactForm />} />
          <Route path="/contact/edit/:id" element={<EditContactForm />} />
          <Route path="*" element={<ContactList />} />
        </Routes>
      </Router>
    </React.StrictMode>
  </ApolloWrapper>
);

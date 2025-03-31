import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "./themes/chakra-theme";

import App from "./App.jsx";
import { RequestProvider } from "../src/contexts/RequestContext";
import { Column1Provider } from "./contexts/Column1Context";
import { AuthProvider } from "./contexts/AuthContext";
import { GroupMembershipProvider } from "./contexts/GroupMembershipContext";
import { GroupProvider } from "./contexts/GroupContext";
import { SearchUsersProvider } from "./contexts/SearchUsersContext";
import { ComplianceProvider } from "./contexts/ComplianceContext";
import { UserGroupsProvider } from "./contexts/UserGroupsContext";

// Render the app without StrictMode to avoid double effect execution
// This can help reduce connection attempts and performance issues
const rootElement = document.getElementById("root");
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <GroupProvider>
          <GroupMembershipProvider>
            <RequestProvider>
              <Column1Provider>
                <UserGroupsProvider>
                  <SearchUsersProvider>
                    <ComplianceProvider>
                      <App />
                    </ComplianceProvider>
                  </SearchUsersProvider>
                </UserGroupsProvider>
              </Column1Provider>
            </RequestProvider>
          </GroupMembershipProvider>
        </GroupProvider>
      </AuthProvider>
    </ChakraProvider>
  );
}
import React from "react";
import UserGroupsModal from "../../Overlays/Modals/UserGroupsModal/UserGroupsModal";
import UserGroupsComparisonModal from "../../Overlays/Modals/UserGroupsComparisonModal/UserGroupsComparisonModal";

const LookupModals = ({
  isUserGroupsModalOpen,
  setIsUserGroupsModalOpen,
  selectedUserForGroups,
  isComparisonModalOpen,
  setIsComparisonModalOpen,
  selectedUsersForComparison
}) => {
  return (
    <>
      {/* User Groups Modal */}
      <UserGroupsModal
        isOpen={isUserGroupsModalOpen}
        onClose={() => setIsUserGroupsModalOpen(false)}
        user={selectedUserForGroups}
      />

      {/* User Groups Comparison Modal */}
      <UserGroupsComparisonModal
        isOpen={isComparisonModalOpen}
        onClose={() => setIsComparisonModalOpen(false)}
        users={selectedUsersForComparison}
      />
    </>
  );
};

export default LookupModals;

import React, { memo, useMemo } from "react";
import {
  Box,
  Flex,
  Heading,
  Button,
  Card,
  CardBody,
  useColorModeValue,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription
} from "@chakra-ui/react";
import { FiPlus } from "react-icons/fi";
import TemplateForm from "./TemplateForm";
import TemplateGrid from "./TemplateGrid";
import EmptyTemplateState from "./EmptyTemplateState";

/**
 * Templates panel component for the Requests2 feature
 * Manages the display of template creation form and existing templates
 * Uses React.memo to prevent unnecessary re-renders
 */
const TemplatesPanel = ({
  showTemplateForm,
  setShowTemplateForm,
  templateName,
  setTemplateName,
  templateFormState,
  handleTemplateFormChange,
  templateAccesses,
  setTemplateAccesses,
  handleAddAccess,
  handleSaveTemplate,
  templates,
  setTemplateFormState,
  setTabIndex,
  onEditTemplate,
  editingTemplateId,
  onCancelEdit
}) => {
  const borderColor = useColorModeValue("gray.200", "gray.700");

  // Find the template being edited based on the ID
  const templateToEdit = useMemo(() =>
    editingTemplateId ? templates.find(t => t.id === editingTemplateId) : null,
    [editingTemplateId, templates]
  );

  return (
    <Box p={6}>
      <Card 
        variant="outline" 
        borderColor={borderColor}
        mb={6}
      >
        <CardBody>
          <Flex justify="space-between" align="center" mb={4}>
            <Heading size="md" textAlign="left">Access Templates</Heading>
            {!showTemplateForm && (
              <Button 
                leftIcon={<FiPlus />} 
                colorScheme="blue" 
                size="sm"
                onClick={() => setShowTemplateForm(true)}
              >
                Create Template
              </Button>
            )}
          </Flex>

          {/* Informational Alert about Templates */}
          <Alert status="info" variant="subtle" borderRadius="md" mb={4}>
            <AlertIcon />
            <AlertDescription fontSize="sm">
              Templates allow you to save frequently requested bundles of access (System/Area/Role combinations) 
              to speed up future requests.
            </AlertDescription>
          </Alert>
          
          {showTemplateForm && (
            <TemplateForm
              templateName={templateName}
              setTemplateName={setTemplateName}
              templateFormState={templateFormState}
              handleTemplateFormChange={handleTemplateFormChange}
              templateAccesses={templateAccesses}
              setTemplateAccesses={setTemplateAccesses}
              handleAddAccess={handleAddAccess}
              handleSaveTemplate={handleSaveTemplate}
              setTemplateFormState={setTemplateFormState}
              isEditing={!!editingTemplateId} // Pass isEditing flag
              initialName={templateToEdit?.name} // Pass initial data
              initialAccesses={templateToEdit?.accesses} // Pass initial data
              onCancel={onCancelEdit} // Pass cancel handler
            />
          )}
          
          {(!showTemplateForm || (showTemplateForm && !editingTemplateId)) && templates && templates.length > 0 && (
            <Box mt={showTemplateForm ? 6 : 0}> {/* Add margin if form is also shown */} 
              <Heading size="md" mb={4}>Available Templates</Heading>
              <TemplateGrid 
                templates={templates} 
                borderColor={borderColor}
                onEditTemplate={onEditTemplate} // Pass edit handler down
              />
            </Box>
          )}
          
          {!showTemplateForm && !templates && templates.length === 0 && (
            <EmptyTemplateState borderColor={borderColor} />
          )}
        </CardBody>
      </Card>
    </Box>
  );
};

export default memo(TemplatesPanel);

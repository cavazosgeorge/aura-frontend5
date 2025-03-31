import React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Card,
  CardHeader,
  CardBody,
  Heading,
  Text,
  Flex,
  HStack,
  VStack,
  Circle,
  Divider,
  Badge,
  Tooltip,
  useColorModeValue
} from '@chakra-ui/react';
import { 
  FiClock, 
  FiCheckCircle, 
  FiXCircle, 
  FiFileText,
  FiUserCheck
} from 'react-icons/fi';

/**
 * Component to visualize the status of a request through its approval workflow
 * Shows a timeline of the request's progress through various stages
 * 
 * @param {Object} request - The request object to display
 * @returns {JSX.Element} Rendered RequestStatusTracker component
 */
const RequestStatusTracker = ({ request }) => {
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.800", "white");
  const mutedColor = useColorModeValue("gray.600", "gray.400");
  
  // Define the stages of the approval workflow
  const stages = [
    { 
      id: 'submitted', 
      label: 'Submitted', 
      icon: FiFileText,
      date: request.submittedDate || 'N/A',
      completed: true, // Submission is always completed if we have a request
      active: request.status === 'submitted'
    },
    { 
      id: 'review', 
      label: 'In Review', 
      icon: FiClock,
      date: request.reviewDate || 'Pending',
      // Mark as completed for in-review, approved, rejected, or completed status
      completed: ['in-review', 'approved', 'rejected', 'completed'].includes(request.status),
      active: request.status === 'in-review'
    },
    { 
      id: 'approval', 
      label: 'Approval', 
      icon: FiUserCheck,
      date: request.approvalDate || 'Pending',
      // Mark as completed for approved, rejected, or completed status
      completed: ['approved', 'rejected', 'completed'].includes(request.status),
      active: request.status === 'approved' || request.status === 'rejected'
    },
    { 
      id: 'implementation', 
      label: 'Implementation', 
      icon: FiCheckCircle,
      date: request.implementationDate || 'Pending',
      completed: request.status === 'completed',
      active: request.status === 'completed'
    }
  ];

  // Get status badge properties
  const getStatusBadge = (status) => {
    switch(status) {
      case 'submitted':
        return { colorScheme: 'blue', label: 'Submitted' };
      case 'in-review':
        return { colorScheme: 'yellow', label: 'In Review' };
      case 'approved':
        return { colorScheme: 'green', label: 'Approved' };
      case 'rejected':
        return { colorScheme: 'red', label: 'Rejected' };
      case 'completed':
        return { colorScheme: 'green', label: 'Completed' };
      default:
        return { colorScheme: 'gray', label: status || 'Unknown' };
    }
  };

  const statusBadge = getStatusBadge(request.status);

  return (
    <Card bg={cardBg} variant="outline" borderColor={borderColor} mb={4}>
      <CardHeader pb={2}>
        <Flex justify="space-between" align="center">
          <Heading size="md" color={textColor}>
            Request Status
          </Heading>
          <Badge colorScheme={statusBadge.colorScheme} fontSize="sm">
            {statusBadge.label}
          </Badge>
        </Flex>
      </CardHeader>
      
      <CardBody>
        <VStack spacing={4} align="stretch">
          {/* Request Summary */}
          <Box>
            <Text fontWeight="medium" mb={1}>
              {request.system} - {request.role}
            </Text>
            <Text fontSize="sm" color={mutedColor}>
              Requested for: {request.user}
            </Text>
            <Text fontSize="sm" mt={2}>
              <Text as="span" fontWeight="medium">Submitted:</Text> {request.submittedDate}
            </Text>
            {request.estimatedCompletion && (
              <Text fontSize="sm">
                <Text as="span" fontWeight="medium">Estimated completion:</Text> {request.estimatedCompletion}
              </Text>
            )}
          </Box>
          
          <Divider />
          
          {/* Status Timeline */}
          <Box pt={2}>
            <HStack spacing={0} align="flex-start" position="relative">
              {stages.map((stage, index) => (
                <React.Fragment key={stage.id}>
                  {/* Status Circle */}
                  <Tooltip label={`${stage.label}: ${stage.date}`}>
                    <VStack spacing={1} flex="1" position="relative" zIndex="1">
                      <Circle 
                        size="40px"
                        bg={stage.completed 
                          ? (stage.active ? useColorModeValue('blue.500', 'blue.300') : useColorModeValue('green.500', 'green.300'))
                          : useColorModeValue('gray.200', 'gray.600')
                        }
                        color={stage.completed ? 'white' : useColorModeValue('gray.500', 'gray.400')}
                      >
                        <Box as={stage.icon} size="20px" />
                      </Circle>
                      <Text 
                        fontSize="xs" 
                        fontWeight={stage.active ? "bold" : "medium"}
                        color={stage.active ? textColor : mutedColor}
                      >
                        {stage.label}
                      </Text>
                      <Text fontSize="xs" color={mutedColor}>
                        {stage.date}
                      </Text>
                    </VStack>
                  </Tooltip>
                  
                  {/* Connecting Line (except for last item) */}
                  {index < stages.length - 1 && (
                    <Box 
                      flex="1"
                      height="2px" 
                      bg={stages[index].completed && stages[index + 1].completed 
                        ? useColorModeValue('green.500', 'green.300')
                        : useColorModeValue('gray.200', 'gray.600')
                      }
                      mt="20px" // Align with the middle of the circles
                    />
                  )}
                </React.Fragment>
              ))}
            </HStack>
          </Box>
          
          {/* Status Notes */}
          {request.notes && (
            <Box mt={2} p={3} bg={useColorModeValue('gray.50', 'gray.700')} borderRadius="md">
              <Text fontSize="sm" fontWeight="medium" mb={1}>Notes:</Text>
              <Text fontSize="sm">{request.notes}</Text>
            </Box>
          )}
        </VStack>
      </CardBody>
    </Card>
  );
};

RequestStatusTracker.propTypes = {
  request: PropTypes.shape({
    id: PropTypes.string,
    user: PropTypes.string.isRequired,
    userId: PropTypes.string,
    system: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    submittedDate: PropTypes.string,
    reviewDate: PropTypes.string,
    approvalDate: PropTypes.string,
    implementationDate: PropTypes.string,
    estimatedCompletion: PropTypes.string,
    notes: PropTypes.string
  }).isRequired
};

export default RequestStatusTracker;
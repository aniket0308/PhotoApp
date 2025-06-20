import React, { RefObject } from 'react';
import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Button,
  Text
} from '@gluestack-ui/themed';

interface ConfirmDialogProps {
  isOpen: boolean;
  cancelRef: RefObject<any>;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  cancelRef,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel
}) => {
  return (
    <AlertDialog leastDestructiveRef={cancelRef} isOpen={isOpen} onClose={onCancel}>
      <AlertDialogBackdrop />
      <AlertDialogContent>
        <AlertDialogHeader>
          <Text
            color="$black"
            fontWeight="bold"
            fontSize="$xl"
            textAlign="center"
          >
            {title}
          </Text>
        </AlertDialogHeader>
        <AlertDialogBody>
          <Text color="$black">{description}</Text>
        </AlertDialogBody>
        <AlertDialogFooter>
          <Button
            variant="outline"
            mr="$3"
            onPress={onCancel}
            ref={cancelRef}
            borderColor="$black"
          >
            <Text color="$black">{cancelText}</Text>
          </Button>
          <Button bg="$red600" onPress={onConfirm}>
            <Text color="$white">{confirmText}</Text>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmDialog;

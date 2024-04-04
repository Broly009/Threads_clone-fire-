import { useToast } from "@chakra-ui/react";
import React, { useCallback } from "react";

export const useShowToast = () => {
  const toast = useToast();
  const showToast = useCallback(
    (title, description, status) => {
      toast({
        title,
        description,
        status,
        isClosable: true,
        duration: 3000,
      })},[toast]);

  return showToast;
};

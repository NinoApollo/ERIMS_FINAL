import { useCallback, useState } from "react";

export const useModal = (initialState: boolean) => {
  const [isOpen, setIsOpen] = useState(initialState);
  const [selectedUser, setSelectedUser] = useState<unknown | null>(null);

  const openModal = useCallback((user?: unknown | null) => {
    setSelectedUser(user || null);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setSelectedUser(null);
    setIsOpen(false);
  }, []);

  const toggleModal = useCallback(() => setIsOpen((prev) => !prev), []);

  return { isOpen, selectedUser, openModal, closeModal, toggleModal };
};

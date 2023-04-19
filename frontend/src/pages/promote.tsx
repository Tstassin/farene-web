import { Box, Button, Container, FormControl, FormLabel, Input, Table, TableContainer, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { User } from "../../../backend/src/services/users/users.schema";
import { useMakeUserAdminMutation, useUsers } from "../queries/users";

export const PromoteUserPage = () => {
  const useMakeUserAdmin = useMakeUserAdminMutation()
  const useAdminsQuery = useUsers({ admin: 1 })
  const { register, formState: { errors }, handleSubmit } = useForm<User>();

  const onSubmit = async (values: User) => {
    const { id: userId } = values
    useMakeUserAdmin.mutate(userId)
  };

  return (
    <Container>
      <form onSubmit={handleSubmit(onSubmit)}>
        <>
          <FormControl mb={5} isInvalid={Boolean(errors)}>
            <FormLabel>Id utilisateur à promouvoir admin</FormLabel>
            <Input
              type='number'
              {...register('id', {
                required: 'Ce champ est obligatoire',
                valueAsNumber: true
              })}
            />
          </FormControl>
          <Box>
            <Button type="submit">Ajouter</Button>
          </Box>
        </>
      </form>
      <TableContainer mt={10}>
        <Table>
          <Thead><Tr><Th>Admins</Th></Tr></Thead>
          <Tbody>
            {useAdminsQuery.data?.data?.map(admin => <Tr><Td>{admin.email}</Td></Tr>)}
            <Tr></Tr>
          </Tbody>
        </Table>
      </TableContainer>
    </Container>
  )
}

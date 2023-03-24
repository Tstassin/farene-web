import { Box, Button, Container, FormControl, FormErrorMessage, FormLabel, Heading, Input, Link, Text } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router-dom";
import { client } from "../../../api/api";

export const Register = () => {
  const navigate = useNavigate()

  const { handleSubmit, register, formState: { errors } } = useForm();
  const onSubmit = async (values: { email: string, password: string }) => {
    await client.service('users').create(values)
    await client.authenticate({
      strategy: 'local',
      ...values
    })
    navigate('/')
  };

  return (
    <>
        <Heading>Créez un compte</Heading>
        <Text fontSize={'xl'} mb={10}>Ou <Link as={NavLink} to='/login' textDecoration={'underline'}>connectez-vous</Link> si vous en avez déjà un</Text>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl mb={5} isInvalid={!!errors.email}>
            <FormLabel>Adresse email</FormLabel>
            <Input
              type='email'
              {...register("email", {
                required: "Required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "invalid email address"
                }
              })}
            />
            <FormErrorMessage>{errors.email && errors.email.message?.toString()}</FormErrorMessage>
          </FormControl>
          <FormControl mb={5} isInvalid={!!errors.password}>
            <FormLabel>Mot de passe</FormLabel>
            <Input
              type='password'
              {...register("password", {
                required: "Required",
              })}
            />
            <FormErrorMessage>{errors.password && errors.password.message?.toString()}</FormErrorMessage>
          </FormControl>
          <Box>
            <Button type="submit">Créer un compte</Button>
          </Box>
        </form>
    </>
  );
}